import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

// Envia email de boas-vindas via Resend
async function sendWelcomeEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Performance Running <newsletter@performancerunning.pt>',
      to: [email],
      subject: 'Bem-vindo ao Performance Running',
      html: buildWelcomeHtml(email),
    }),
  })
}

function buildWelcomeHtml(email: string): string {
  const unsubUrl = `https://www.performancerunning.pt/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
  return `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:0 0 32px 0;">
          <span style="background:#22c55e;color:#000;font-weight:900;font-size:11px;padding:4px 8px;border-radius:4px;">PR</span>
          <span style="color:#fff;font-weight:900;font-size:13px;margin-left:8px;">PERFORMANCE<span style="color:#22c55e;">RUNNING</span></span>
        </td></tr>
        <tr><td style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:40px 36px;">
          <p style="color:#22c55e;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px 0;">Bem-vindo</p>
          <h1 style="color:#fff;font-size:30px;font-weight:900;letter-spacing:-1px;margin:0 0 16px 0;line-height:1.1;">ESTAES DENTRO.</h1>
          <p style="color:rgba(255,255,255,0.55);font-size:15px;line-height:1.7;margin:0 0 24px 0;">
            A partir de agora recebes os melhores artigos sobre corrida, trail e atletismo. Ciencia aplicada. Sem spam.
          </p>
          <a href="https://www.performancerunning.pt/blog"
             style="display:inline-block;background:#22c55e;color:#000;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:13px 26px;border-radius:8px;text-decoration:none;">
            VER ARQUIVO
          </a>
        </td></tr>
        <tr><td style="padding:24px 0 0 0;">
          <p style="color:rgba(255,255,255,0.2);font-size:11px;line-height:1.6;margin:0;text-align:center;">
            Recebeste este email porque subscreveste em performancerunning.pt<br>
            <a href="${unsubUrl}" style="color:rgba(255,255,255,0.3);text-decoration:underline;">Cancelar subscricao</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email invalido.' }, { status: 400 })
    }
    const normalized = email.toLowerCase().trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return NextResponse.json({ error: 'Email invalido.' }, { status: 400 })
    }

    const exists = await redis.sismember('newsletter:subscribers', normalized)
    if (exists) {
      return NextResponse.json({ message: 'already_subscribed' })
    }

    await redis.sadd('newsletter:subscribers', normalized)
    await redis.lpush('newsletter:log', JSON.stringify({
      email: normalized,
      date: new Date().toISOString(),
    }))

    await sendWelcomeEmail(normalized).catch(() => {})

    return NextResponse.json({ message: 'subscribed' })
  } catch (err) {
    console.error('Newsletter route error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const count = await redis.scard('newsletter:subscribers')
  const log = await redis.lrange('newsletter:log', 0, 49)
  return NextResponse.json({ count, recent: log })
}
