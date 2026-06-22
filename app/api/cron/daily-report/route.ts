import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// ── Constantes ────────────────────────────────────────────────────────────────
const GA4_PROPERTY_ID = '542465280'
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

// ── GA4 REST API (service account JWT) ───────────────────────────────────────
/**
 * Cria um JWT assinado RS256 para autenticar no Google API.
 * Usa Web Crypto nativo — funciona no Edge Runtime e no Node.
 */
async function getGoogleAccessToken(): Promise<string | null> {
  const keyJson = process.env.GA4_SERVICE_ACCOUNT_KEY
  if (!keyJson) return null

  try {
    const sa = JSON.parse(keyJson)
    const now = Math.floor(Date.now() / 1000)

    const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    const payload = btoa(JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

    const signing = `${header}.${payload}`

    // Importa a chave privada PEM
    const pemBody = sa.private_key
      .replace(/-----BEGIN PRIVATE KEY-----/g, '')
      .replace(/-----END PRIVATE KEY-----/g, '')
      .replace(/\n/g, '')

    const keyDer = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0))
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      keyDer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign'],
    )

    const sigBuffer = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signing))
    const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

    const jwt = `${signing}.${sig}`

    // Troca o JWT por um access token
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })
    const data = await res.json() as { access_token?: string }
    return data.access_token ?? null
  } catch (err) {
    console.error('[daily-report] Erro JWT GA4:', err)
    return null
  }
}

interface GA4Stats {
  sessions: number
  activeUsers: number
  pageviews: number
  topPages: { path: string; views: number }[]
}

async function getGA4Stats(yesterday: string): Promise<GA4Stats | null> {
  const token = await getGoogleAccessToken()
  if (!token) return null

  try {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: yesterday, endDate: yesterday }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
          ],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10,
        }),
      },
    )
    const data = await res.json() as {
      rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[]
      totals?: { metricValues: { value: string }[] }[]
    }

    if (!data.rows) return null

    // Totais da propriedade (soma de todas as linhas)
    let totalSessions  = 0
    let totalUsers     = 0
    let totalPageviews = 0
    const topPages: { path: string; views: number }[] = []

    for (const row of data.rows) {
      const sessions  = parseInt(row.metricValues[0].value)
      const users     = parseInt(row.metricValues[1].value)
      const views     = parseInt(row.metricValues[2].value)
      totalSessions  += sessions
      totalUsers     += users
      totalPageviews += views
      topPages.push({ path: row.dimensionValues[0].value, views })
    }

    return { sessions: totalSessions, activeUsers: totalUsers, pageviews: totalPageviews, topPages }
  } catch (err) {
    console.error('[daily-report] Erro GA4 runReport:', err)
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
  ga4: GA4Stats | null
  clicks: ClickStats
}): string {
  const { date, ga4, clicks } = params

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

  const topPageRows = (ga4?.topPages ?? []).slice(0, 5).map(p => `
    <tr>
      <td style="padding:10px 12px;font-size:13px;color:#ccc;border-bottom:1px solid #1a1a1a;">${p.path}</td>
      <td style="padding:10px 12px;font-size:13px;font-weight:700;color:#fff;text-align:right;border-bottom:1px solid #1a1a1a;">${p.views.toLocaleString('pt-PT')}</td>
    </tr>`).join('')

  const gaSection = ga4 ? `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:14px;font-weight:900;letter-spacing:0.2em;color:#00ff87;text-transform:uppercase;margin:0 0 16px;">📊 Google Analytics</h2>
      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">${ga4.sessions.toLocaleString('pt-PT')}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Sessões</div>
        </div>
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">${ga4.activeUsers.toLocaleString('pt-PT')}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Utilizadores</div>
        </div>
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">${ga4.pageviews.toLocaleString('pt-PT')}</div>
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
      <p style="margin:0;color:#555;font-size:13px;">⚠️ GA4 não disponível — configura <code>GA4_SERVICE_ACCOUNT_KEY</code> no Vercel para ativar.</p>
    </div>`

  const clicksSection = `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:14px;font-weight:900;letter-spacing:0.2em;color:#00ff87;text-transform:uppercase;margin:0 0 16px;">🔗 Cliques em Afiliados</h2>
      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">${totalClicksYd}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Cliques ontem</div>
        </div>
        <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#fff;">${totalClicksTot}</div>
          <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Total acumulado</div>
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

  const [ga4, clicks] = await Promise.all([
    getGA4Stats(yesterday),
    getClickStats(yesterday),
  ])

  const html = buildEmailHtml({ date: yesterday, ga4, clicks })
  const sent = await sendReport(yesterday, html)

  return NextResponse.json({
    ok: true,
    date: yesterday,
    sent,
    ga4: ga4 ? { sessions: ga4.sessions, users: ga4.activeUsers, pageviews: ga4.pageviews } : null,
    totalClicksYesterday: Object.values(clicks.yesterday).reduce((a, b) => a + b, 0),
  })
}
