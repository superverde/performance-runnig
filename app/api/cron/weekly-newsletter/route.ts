import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { getAllArticles, ArticleMeta } from '@/lib/articles'

const FROM = 'Performance Running <newsletter@performancerunning.pt>'
const SITE_URL = 'https://www.performancerunning.pt'
const BATCH_SIZE = 50 // Resend free: 100/dia → enviamos em lotes de 50

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

function articleCard(article: ArticleMeta): string {
  return `
    <tr>
      <td style="padding:0 0 16px 0;">
        <a href="${SITE_URL}/blog/${article.slug}" style="display:block;background:#111;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;text-decoration:none;">
          <span style="color:#22c55e;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${article.category}</span>
          <h3 style="color:#fff;font-size:17px;font-weight:800;margin:8px 0;letter-spacing:-0.5px;line-height:1.3;">${article.title}</h3>
          <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:0 0 12px 0;">${article.excerpt}</p>
          <span style="color:#22c55e;font-size:12px;font-weight:700;">LER ARTIGO →</span>
        </a>
      </td>
    </tr>`
}

function buildEmailHtml(articles: ArticleMeta[], edition: number, email: string): string {
  const articleCards = articles.map(articleCard).join('')
  const today = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })

  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Performance Running — Edição #${edition}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:0 0 24px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:#22c55e;width:26px;height:26px;border-radius:5px;text-align:center;vertical-align:middle;">
                      <span style="color:#000;font-weight:900;font-size:10px;">PR</span>
                    </td>
                    <td style="padding-left:8px;">
                      <span style="color:#fff;font-weight:900;font-size:13px;letter-spacing:-0.5px;">PERFORMANCE<span style="color:#22c55e;">RUNNING</span></span>
                    </td>
                  </tr>
                </table>
              </td>
              <td align="right">
                <span style="color:rgba(255,255,255,0.25);font-size:11px;">Edição #${edition} · ${today}</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Hero -->
        <tr><td style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:36px 32px;margin-bottom:24px;">
          <p style="color:#22c55e;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px 0;">Esta semana</p>
          <h1 style="color:#fff;font-size:28px;font-weight:900;letter-spacing:-1px;margin:0 0 12px 0;line-height:1.1;">
            OS MELHORES ARTIGOS<br>DA SEMANA.
          </h1>
          <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:0;">
            Ciência do treino, fisiologia e performance — selecionados para correres melhor.
          </p>
        </td></tr>

        <!-- Spacer -->
        <tr><td style="height:20px;"></td></tr>

        <!-- Artigos -->
        <tr><td>
          <p style="color:rgba(255,255,255,0.3);font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px 0;">Artigos desta semana</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${articleCards}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#111;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:28px 32px;text-align:center;">
          <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 16px 0;">
            Há centenas de artigos no arquivo. Tudo gratuito.
          </p>
          <a href="${SITE_URL}/blog" style="display:inline-block;background:#22c55e;color:#000;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:13px 26px;border-radius:8px;text-decoration:none;">
            VER ARQUIVO COMPLETO →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:28px 0 0 0;">
          <p style="color:rgba(255,255,255,0.15);font-size:11px;line-height:1.7;margin:0;text-align:center;">
            © ${new Date().getFullYear()} Performance Running · <a href="${SITE_URL}" style="color:rgba(255,255,255,0.25);text-decoration:none;">performancerunning.pt</a><br>
            <a href="${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color:rgba(255,255,255,0.2);text-decoration:underline;">Cancelar subscrição</a>
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
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY não configurada' }, { status: 500 })
  }

  // Obter subscritores do Redis
  const subscribers = await redis.smembers('newsletter:subscribers') as string[]
  if (subscribers.length === 0) {
    return NextResponse.json({ message: 'Sem subscritores', sent: 0 })
  }

  // Obter os 5 artigos mais recentes
  const articles = getAllArticles().slice(0, 5)
  if (articles.length === 0) {
    return NextResponse.json({ error: 'Sem artigos' }, { status: 500 })
  }

  // Número de edição (semanas desde o início do projeto)
  const startDate = new Date('2026-01-01')
  const edition = Math.floor((Date.now() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1

  let sent = 0
  let failed = 0
  const errors: string[] = []

  // Enviar em lotes para não exceder 100/dia do Resend free
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)

    await Promise.allSettled(
      batch.map(async (email) => {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            from: FROM,
            to: [email],
            subject: `📬 Performance Running #${edition} — Os melhores artigos desta semana`,
            html: buildEmailHtml(articles, edition, email),
          }),
        })
        if (res.ok) {
          sent++
        } else {
          failed++
          const err = await res.json().catch(() => ({}))
          errors.push(`${email}: ${err.message ?? res.status}`)
        }
      })
    )

    // Pausa entre lotes (respeitar rate limits)
    if (i + BATCH_SIZE < subscribers.length) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  console.log(`[weekly-newsletter] Enviado: ${sent} | Falhou: ${failed} | Total subscritores: ${subscribers.length}`)

  return NextResponse.json({
    edition,
    subscribers: subscribers.length,
    articlesIncluded: articles.length,
    sent,
    failed,
    ...(errors.length > 0 && { errors: errors.slice(0, 10) }),
  })
}
