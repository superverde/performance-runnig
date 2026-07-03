import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const REPORT_TO = 'pedronunes5556@gmail.com'
const SITE_URL  = 'https://www.performancerunning.pt'

// ── Redis ─────────────────────────────────────────────────────────────────────
interface ClickStats {
  yesterday: Record<string, number>
  total: Record<string, number>
  today: Record<string, number>
}

async function getClickStats(yesterday: string, todayStr: string): Promise<ClickStats> {
  try {
    const redis = Redis.fromEnv()
    const [yd, tot, td] = await Promise.all([
      redis.hgetall(`clicks:${yesterday}`) as Promise<Record<string, string> | null>,
      redis.hgetall('clicks:total')        as Promise<Record<string, string> | null>,
      redis.hgetall(`clicks:${todayStr}`)  as Promise<Record<string, string> | null>,
    ])
    const toNumbers = (obj: Record<string, string> | null) =>
      Object.fromEntries(Object.entries(obj ?? {}).map(([k, v]) => [k, parseInt(v as string) || 0]))
    return { yesterday: toNumbers(yd), total: toNumbers(tot), today: toNumbers(td) }
  } catch {
    return { yesterday: {}, total: {}, today: {} }
  }
}

// ── Email HTML ────────────────────────────────────────────────────────────────
function buildEmailHtml(params: {
  date: string
  clicks: ClickStats
  isTest: boolean
}): string {
  const { date, clicks, isTest } = params

  const fmtDate = new Date(date + 'T00:00:00Z').toLocaleDateString('pt-PT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const totalClicksYd  = Object.values(clicks.yesterday).reduce((a, b) => a + b, 0)
  const totalClicksTot = Object.values(clicks.total).reduce((a, b) => a + b, 0)
  const totalClicksTd  = Object.values(clicks.today).reduce((a, b) => a + b, 0)

  const clickRowsYd = Object.entries(clicks.yesterday)
    .sort(([, a], [, b]) => b - a)
    .map(([product, count]) => `
      <tr>
        <td style="padding:10px 12px;font-size:13px;color:#ccc;border-bottom:1px solid #1a1a1a;">${product}</td>
        <td style="padding:10px 12px;font-size:13px;font-weight:700;color:#00ff87;text-align:right;border-bottom:1px solid #1a1a1a;">${count}</td>
        <td style="padding:10px 12px;font-size:13px;color:#555;text-align:right;border-bottom:1px solid #1a1a1a;">${clicks.total[product] ?? 0} total</td>
      </tr>`)
    .join('')

  const clickRowsTd = Object.entries(clicks.today)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([product, count]) => `
      <tr>
        <td style="padding:8px 12px;font-size:13px;color:#ccc;border-bottom:1px solid #1a1a1a;">${product}</td>
        <td style="padding:8px 12px;font-size:13px;font-weight:700;color:#4af;text-align:right;border-bottom:1px solid #1a1a1a;">${count}</td>
      </tr>`)
    .join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    ${isTest ? `<div style="background:#ff880020;border:1px solid #f80;border-radius:8px;padding:12px 16px;margin-bottom:24px;font-size:13px;color:#f80;">
      ⚠️ EMAIL DE TESTE — o cron automático usa os mesmos dados
    </div>` : ''}

    <!-- Header -->
    <div style="margin-bottom:32px;display:flex;align-items:center;gap:10px;">
      <span style="background:#00ff87;color:#000;font-weight:900;font-size:11px;padding:4px 10px;border-radius:4px;letter-spacing:0.05em;">PR</span>
      <span style="color:#fff;font-weight:900;font-size:14px;letter-spacing:-0.5px;">PERFORMANCE<span style="color:#00ff87;">RUNNING</span></span>
    </div>

    <!-- Title -->
    <div style="margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid #1a1a1a;">
      <p style="margin:0 0 4px;font-size:11px;color:#00ff87;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;">Relatório Diário</p>
      <h1 style="margin:0;font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.5px;">${fmtDate}</h1>
      <p style="margin:8px 0 0;font-size:13px;color:#555;">Referência: ${date}</p>
    </div>

    <!-- KPI Row -->
    <div style="display:flex;gap:12px;margin-bottom:32px;">
      <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#00ff87;">${totalClicksYd}</div>
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Cliques ontem</div>
      </div>
      <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#4af;">${totalClicksTd}</div>
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Cliques hoje</div>
      </div>
      <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#fff;">${totalClicksTot}</div>
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Total acumulado</div>
      </div>
    </div>

    <!-- Cliques de ontem -->
    <div style="margin-bottom:32px;">
      <h2 style="font-size:14px;font-weight:900;letter-spacing:0.2em;color:#00ff87;text-transform:uppercase;margin:0 0 16px;">🔗 Afiliados — Ontem</h2>
      ${clickRowsYd ? `
      <table style="width:100%;border-collapse:collapse;border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#111;">
            <th style="padding:10px 12px;font-size:11px;color:#555;text-align:left;text-transform:uppercase;letter-spacing:0.1em;">Produto</th>
            <th style="padding:10px 12px;font-size:11px;color:#555;text-align:right;text-transform:uppercase;letter-spacing:0.1em;">Ontem</th>
            <th style="padding:10px 12px;font-size:11px;color:#555;text-align:right;text-transform:uppercase;letter-spacing:0.1em;">Total</th>
          </tr>
        </thead>
        <tbody>${clickRowsYd}</tbody>
      </table>` : `<p style="color:#555;font-size:13px;margin:0;">Nenhum clique registado ontem.</p>`}
    </div>

    <!-- Cliques de hoje -->
    ${totalClicksTd > 0 ? `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:14px;font-weight:900;letter-spacing:0.2em;color:#4af;text-transform:uppercase;margin:0 0 16px;">⚡ Afiliados — Hoje (parcial)</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#111;">
            <th style="padding:8px 12px;font-size:11px;color:#555;text-align:left;text-transform:uppercase;letter-spacing:0.1em;">Produto</th>
            <th style="padding:8px 12px;font-size:11px;color:#555;text-align:right;text-transform:uppercase;letter-spacing:0.1em;">Hoje</th>
          </tr>
        </thead>
        <tbody>${clickRowsTd}</tbody>
      </table>
    </div>` : ''}

    <!-- Note Vercel Analytics -->
    <div style="margin-bottom:32px;padding:16px;background:#111;border:1px solid #1e1e1e;border-radius:8px;">
      <p style="margin:0;color:#555;font-size:13px;">
        📊 Para dados de tráfego no relatório automático, configura <code style="color:#aaa;">VERCEL_ANALYTICS_TOKEN</code> e <code style="color:#aaa;">VERCEL_PROJECT_ID</code> no Vercel.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding-top:24px;border-top:1px solid #1a1a1a;">
      <a href="${SITE_URL}/equipamento"
         style="display:inline-block;background:#00ff87;color:#000;font-weight:900;font-size:12px;padding:10px 20px;border-radius:6px;text-decoration:none;letter-spacing:0.05em;margin-right:8px;">
        VER EQUIPAMENTO →
      </a>
      <a href="${SITE_URL}/admin/afiliados"
         style="display:inline-block;background:#111;color:#00ff87;font-weight:900;font-size:12px;padding:10px 20px;border-radius:6px;text-decoration:none;letter-spacing:0.05em;border:1px solid #00ff87;">
        DASHBOARD →
      </a>
      <p style="margin:16px 0 0;font-size:11px;color:#333;">
        Performance Running · ${SITE_URL} · Relatório automático às 7h UTC
      </p>
    </div>

  </div>
</body>
</html>`
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY não configurada no Vercel' }, { status: 500 })
  }

  const now       = new Date()
  const todayStr  = now.toISOString().slice(0, 10)
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10)

  const clicks = await getClickStats(yesterday, todayStr)
  const html   = buildEmailHtml({ date: yesterday, clicks, isTest: true })

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: 'Performance Running <newsletter@performancerunning.pt>',
      to: [REPORT_TO],
      subject: `📊 [TESTE] Relatório ${todayStr} — Performance Running`,
      html,
    }),
  })

  const resBody = await res.json() as { id?: string; message?: string; name?: string; statusCode?: number; error?: { message: string } }

  if (!res.ok) {
    return NextResponse.json({
      ok: false,
      resendStatus: res.status,
      error: resBody.message ?? resBody.error?.message ?? 'Erro desconhecido do Resend',
      resendError: resBody.name,
      hint: 'Verifica se o domínio performancerunning.pt está verificado no Resend',
      rawResend: resBody,
    }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    emailId: resBody.id,
    sentTo: REPORT_TO,
    date: yesterday,
    totalClicksYesterday: Object.values(clicks.yesterday).reduce((a, b) => a + b, 0),
    totalClicksToday: Object.values(clicks.today).reduce((a, b) => a + b, 0),
    totalAccumulated: Object