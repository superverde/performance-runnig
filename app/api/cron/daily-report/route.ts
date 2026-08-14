import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// ── Constantes ────────────────────────────────────────────────────────────────
const REPORT_TO       = 'pedronunes5556@gmail.com'
const SITE_URL        = 'https://www.performancerunning.pt'

// ── Redis ─────────────────────────────────────────────────────────────────────
const redis = Redis.fromEnv()

// ── Auth ──────────────────────────────────────────────────────────────────────
function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

// ── Vercel Web Analytics API ─────────────────────────────────────────────────
// Substitui o GA4 — não precisa de Google Cloud/service account, só de um
// Access Token da própria Vercel. Docs: https://vercel.com/docs/analytics/web-analytics-api
interface AnalyticsStats {
  pageviews: number
  visitors: number
  topPages: { path: string; views: number }[]
}

async function vercelAnalyticsQuery(endpoint: string, params: Record<string, string>) {
  const token = process.env.VERCEL_ANALYTICS_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM_ID
  if (!token || !projectId) return null

  const search = new URLSearchParams({ projectId, ...params })
  if (teamId) search.set('teamId', teamId)

  const res = await fetch(`https://api.vercel.com/v1/query/web-analytics/${endpoint}?${search.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    console.error(`[daily-report] Erro Vercel Analytics (${endpoint}):`, await res.text())
    return null
  }
  return res.json()
}

async function getVercelAnalyticsStats(yesterday: string): Promise<AnalyticsStats | null> {
  if (!process.env.VERCEL_ANALYTICS_TOKEN || !process.env.VERCEL_PROJECT_ID) return null

  try {
    // Janela alargada (3 dias) em vez de since=until=ontem: a API de Web
    // Analytics da Vercel por vezes ainda não tem o dia mais recente
    // totalmente agregado no momento em que o cron corre (07h UTC) e devolve
    // `data: []` mesmo havendo tráfego real nesse dia — foi o que aconteceu
    // no relatório de 22/07 (dashboard mostrava ~35 visitantes, API devolveu 0).
    // Pedimos um intervalo maior por dia e escolhemos a linha certa, com
    // fallback para a mais recente disponível.
    const since = new Date(new Date(yesterday + 'T00:00:00Z').getTime() - 2 * 86400000)
      .toISOString().slice(0, 10)

    const totals = await vercelAnalyticsQuery('visits/aggregate', {
      since,
      until: yesterday,
      by: 'day',
    })

    const rows: { timestamp?: string; pageviews?: number; visitors?: number }[] = totals?.data ?? []
    const dayRow =
      rows.find(r => (r.timestamp ?? '').slice(0, 10) === yesterday) ??
      rows[rows.length - 1]

    if (!dayRow) {
      console.error(
        `[daily-report] Sem dados de Vercel Analytics para ${since}..${yesterday}. Resposta bruta:`,
        JSON.stringify(totals),
      )
    }

    const pageviews = dayRow?.pageviews ?? 0
    const visitors = dayRow?.visitors ?? 0

    // Páginas mais vistas do dia
    const top = await vercelAnalyticsQuery('visits/aggregate', {
      since: yesterday,
      until: yesterday,
      by: 'requestPath',
      limit: '5',
    })
    const topPages: { path: string; views: number }[] = (top?.data ?? []).map((row: { requestPath?: string; pageviews?: number }) => ({
      path: row.requestPath ?? '',
      views: row.pageviews ?? 0,
    }))

    return { pageviews, visitors, topPages }
  } catch (err) {
    console.error('[daily-report] Erro Vercel Analytics:', err)
    return null
  }
}

// ── Redis: cliques de afiliado ────────────────────────────────────────────────
interface ClickStats {
  yesterday: Record<string, number>
  total: Record<string, number>
}

async function getClickStats(yesterday: string): Promise<ClickStats> {
  try {
    const [yd, tot] = await Promise.all([
      redis.hgetall(`clicks:${yesterday}`) as Promise<Record<string, string> | null>,
      redis.hgetall('clicks:total')        as Promise<Record<string, string> | null>,
    ])

    const toNumbers = (obj: Record<string, string> | null) =>
      Object.fromEntries(Object.entries(obj ?? {}).map(([k, v]) => [k, parseInt(v as string) || 0]))

    return { yesterday: toNumbers(yd), total: toNumbers(tot) }
  } catch {
    return { yesterday: {}, total: {} }
  }
}

// ── Email HTML ────────────────────────────────────────────────────────────────
function buildEmailHtml(params: {
  date: string
  analytics: AnalyticsStats | null
  clicks: ClickStats
  subscribers: number
}): string {
  const { date, analytics, clicks, subscribers } = params

  const fmtDate = new Date(date + 'T00:00:00Z').toLocaleDateString('pt-PT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const totalClicksYd = Object.values(clicks.yesterday).reduce((a, b) => a + b, 0)
  const totalClicksTot = Object.values(clicks.total).reduce((a, b) => a + b, 0)

  const clickRows = Object.entries(clicks.yesterday)
    .sort(([, a], [, b]) => b - a)
    .map(([product, count]) => `
      <tr>
        <td style="padding:10px 12px;font-size:13px;color:#ccc;border-bottom:1px solid #1a1a1a;">${product}</td>
        <td style="padding:10px 12px;font-size:13px;font-weight:700;color:#00ff87;text-align:right;border-bottom:1px solid #1a1a1a;">${count}</td>
        <td style="padding:10px 12px;font-size:13px;color:#555;text-align:right;border-bottom:1px solid #1a1a1a;">${clicks.total[product] ?? 0} total</td>
      </tr>`)
    .join('')

  const topPageRows = (analytics?.topPages ?? []).slice(0, 5).map(p => `
    <tr>
      <td style="padding:10px 12px;font-size:13px;color:#ccc;border-bottom:1px solid #1a1a1a;">${p.path}</td>
      <td style="padding:10px 12px;font-size:13px;font-weight:700;color:#fff;text-align:right;border-bottom:1px solid #1a1a1a;">${p.views.toLocaleString('pt-PT')}</td>
    </tr>`).join('')

  const gaSection = analytics ? `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:14px;font-weight:900;letter-spacing:0.2em;color:#00ff87;text-transform:uppercase;margin:0 0 16px;">📊 Vercel Analytics</h2>
      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">${analytics.visitors.toLocaleString('pt-PT')}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Visitantes</div>
        </div>
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">${analytics.pageviews.toLocaleString('pt-PT')}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Pageviews</div>
        </div>
      </div>
      ${topPageRows ? `
      <table style="width:100%;border-collapse:collapse;border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#111;">
            <th style="padding:10px 12px;font-size:11px;color:#555;text-align:left;text-transform:uppercase;letter-spacing:0.1em;">Página</th>
            <th style="padding:10px 12px;font-size:11px;color:#555;text-align:right;text-transform:uppercase;letter-spacing:0.1em;">Vistas</th>
          </tr>
        </thead>
        <tbody>${topPageRows}</tbody>
      </table>` : ''}
    </div>` : `
    <div style="margin-bottom:32px;padding:16px;background:#111;border:1px solid #1e1e1e;border-radius:8px;">
      <p style="margin:0;color:#555;font-size:13px;">⚠️ Vercel Analytics não disponível — configura <code>VERCEL_ANALYTICS_TOKEN</code> e <code>VERCEL_PROJECT_ID</code> no Vercel para ativar.</p>
    </div>`

  const clicksSection = `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:14px;font-weight:900;letter-spacing:0.2em;color:#00ff87;text-transform:uppercase;margin:0 0 16px;">📊 Resumo do Dia</h2>
      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">${totalClicksYd}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Cliques afiliados ontem</div>
        </div>
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">${totalClicksTot}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Total acumulado</div>
        </div>
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#00ff87;">${subscribers}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Subscritores newsletter</div>
        </div>
      </div>
      ${clickRows ? `
      <table style="width:100%;border-collapse:collapse;border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#111;">
            <th style="padding:10px 12px;font-size:11px;color:#555;text-align:left;text-transform:uppercase;letter-spacing:0.1em;">Produto</th>
            <th style="padding:10px 12px;font-size:11px;color:#555;text-align:right;text-transform:uppercase;letter-spacing:0.1em;">Ontem</th>
            <th style="padding:10px 12px;font-size:11px;color:#555;text-align:right;text-transform:uppercase;letter-spacing:0.1em;">Acumulado</th>
          </tr>
        </thead>
        <tbody>${clickRows}</tbody>
      </table>` : `<p style="color:#555;font-size:13px;">Nenhum clique registado ontem.</p>`}
    </div>`

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="margin-bottom:32px;display:flex;align-items:center;gap:10px;">
      <span style="background:#00ff87;color:#000;font-weight:900;font-size:11px;padding:4px 10px;border-radius:4px;letter-spacing:0.05em;">PR</span>
      <span style="color:#fff;font-weight:900;font-size:14px;letter-spacing:-0.5px;">PERFORMANCE<span style="color:#00ff87;">RUNNING</span></span>
    </div>

    <!-- Title -->
    <div style="margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid #1a1a1a;">
      <p style="margin:0 0 4px;font-size:11px;color:#00ff87;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Relatório Diário</p>
      <h1 style="margin:0;font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.5px;">${fmtDate}</h1>
      <p style="margin:8px 0 0;font-size:13px;color:#555;">Resumo de ontem — ${date}</p>
    </div>

    <!-- GA4 -->
    ${gaSection}

    <!-- Cliques -->
    ${clicksSection}

    <!-- Footer -->
    <div style="padding-top:24px;border-top:1px solid #1a1a1a;">
      <a href="${SITE_URL}/equipamento"
         style="display:inline-block;background:#00ff87;color:#000;font-weight:900;font-size:12px;padding:10px 20px;border-radius:6px;text-decoration:none;letter-spacing:0.05em;">
        VER EQUIPAMENTO →
      </a>
      <p style="margin:16px 0 0;font-size:11px;color:#333;">
        Performance Running · ${SITE_URL} · Relatório automático
      </p>
    </div>

  </div>
</body>
</html>`
}

// ── Enviar email via Resend ───────────────────────────────────────────────────
async function sendReport(date: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[daily-report] RESEND_API_KEY não configurada')
    return false
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: 'Performance Running <newsletter@performancerunning.pt>',
      to: [REPORT_TO],
      subject: `📊 Relatório ${date} — Performance Running`,
      html,
    }),
  })

  return res.ok
}

// ── Handler principal ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Data de ontem
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  const [analytics, clicks, subscribers] = await Promise.all([
    getVercelAnalyticsStats(yesterday),
    getClickStats(yesterday),
    redis.scard('newsletter:subscribers'),
  ])

  const html = buildEmailHtml({ date: yesterday, analytics, clicks, subscribers: subscribers as number })
  const sent = await sendReport(yesterday, html)

  return NextResponse.json({
    date: yesterday,
    analytics: analytics ? { visitors: analytics.visitors, pageviews: analytics.pageviews } : null,
    affiliateClicksYesterday: Object.values(clicks.yesterday).reduce((a, b) => a + b, 0),
    affiliateClicksTotal: Object.values(clicks.total).reduce((a, b) => a + b, 0),
    newsletterSubscribers: subscribers,
    emailSent: sent,
  })
}
