import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { getAllArticles } from '@/lib/articles'

const SITE_URL   = 'https://www.performancerunning.pt'
const FROM_EMAIL = 'Performance Running <newsletter@performancerunning.pt>'
const BATCH_SIZE = 50

function isAuthorized(req: NextRequest): boolean {
  const auth   = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  const internalKey = process.env.INTERNAL_API_KEY
  if (auth && internalKey && auth === `Bearer ${internalKey}`) return true
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

function buildNewsletterHtml(articles: { slug: string; title: string; excerpt?: string; category?: string }[], edition: number): string {
  const articleCards = articles.slice(0, 5).map(a => `
    <tr>
      <td style="padding:0 0 20px 0;">
        <a href="${SITE_URL}/blog/${a.slug}" style="text-decoration:none;display:block;background:#111;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 22px;">
          ${a.category ? `<p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#22c55e;">${a.category}</p>` : ''}
          <p style="margin:0 0 8px;font-size:16px;font-weight:800;color:#fff;line-height:1.3;">${a.title}</p>
          ${a.excerpt ? `<p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">${a.excerpt.slice(0, 120)}...</p>` : ''}
        </a>
      </td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:0 0 28px 0;">
          <span style="background:#22c55e;color:#000;font-weight:900;font-size:11px;padding:4px 8px;border-radius:4px;">PR</span>
          <span style="color:#fff;font-weight:900;font-size:13px;margin-left:8px;">PERFORMANCE<span style="color:#22c55e;">RUNNING</span></span>
          <span style="float:right;color:#333;font-size:11px;margin-top:4px;">Edi&#231;&#227;o #${edition}</span>
        </td></tr>
        <tr><td style="padding:0 0 28px 0;border-bottom:1px solid #1a1a1a;">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Os melhores artigos desta semana</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.35);font-size:13px;">Ci&#234;ncia aplicada. Treino inteligente. Sem spam.</p>
        </td></tr>
        <tr><td style="padding:28px 0 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${articleCards}
          </table>
        </td></tr>
        <tr><td style="padding:16px 0 0 0;text-align:center;">
          <a href="${SITE_URL}/blog"
             style="display:inline-block;background:#22c55e;color:#000;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:13px 28px;border-radius:8px;text-decoration:none;">
            VER TODOS OS ARTIGOS
          </a>
        </td></tr>
        <tr><td style="padding:28px 0 0 0;text-align:center;">
          <p style="color:rgba(255,255,255,0.15);font-size:11px;line-height:1.6;margin:0;">
            Recebeste este email porque subscreveste em performancerunning.pt
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'N&#227;o autorizado' }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY em falta' }, { status: 500 })
  }

  const subscribers = await redis.smembers('newsletter:subscribers') as string[]
  if (!subscribers.length) {
    return NextResponse.json({ sent: 0, message: 'Sem subscritores' })
  }

  const articles = getAllArticles().slice(0, 5)
  const weeksSince2026 = Math.floor((Date.now() - new Date('2026-01-01').getTime()) / (7 * 24 * 3600 * 1000))
  const edition = weeksSince2026 + 1
  const html = buildNewsletterHtml(articles, edition)

  let sent = 0
  const errors: string[] = []

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)
    for (const email of batch) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject: `#${edition} — Os melhores artigos desta semana | Performance Running`,
          html,
        }),
      })
      if (res.ok) { sent++ } else { errors.push(email) }
    }
    if (i + BATCH_SIZE < subscribers.length) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  return NextResponse.json({ edition, total: subscribers.length, sent, errors: errors.length })
}
