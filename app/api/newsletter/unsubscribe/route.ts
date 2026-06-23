import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Erro</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px;background:#0a0a0a;color:#fff;">
        <h2>Email inválido</h2>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  await redis.srem('newsletter:subscribers', email)

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subscrição cancelada — Performance Running</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:500px;margin:80px auto;padding:0 24px;text-align:center;">
    <div style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:48px 32px;">
      <p style="color:#22c55e;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px 0;">OK</p>
      <h1 style="color:#fff;font-size:24px;font-weight:900;margin:0 0 12px 0;">Subscrição cancelada.</h1>
      <p style="color:rgba(255,255,255,0.45);font-size:14px;line-height:1.6;margin:0 0 32px 0;">
        O email <strong style="color:rgba(255,255,255,0.7);">${email}</strong> foi removido da lista. Não receberás mais emails.
      </p>
      <a href="https://www.performancerunning.pt" style="display:inline-block;background:#22c55e;color:#000;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;border-radius:8px;text-decoration:none;">
        VOLTAR AO SITE
      </a>
    </div>
    <p style="color:rgba(255,255,255,0.15);font-size:11px;margin-top:24px;">
      Mudaste de ideias? <a href="https://www.performancerunning.pt" style="color:rgba(255,255,255,0.3);text-decoration:underline;">Podes voltar a subscrever.</a>
    </p>
  </div>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
