import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')

  if (!email) {
    return new NextResponse('Email em falta.', { status: 400, headers: { 'Content-Type': 'text/html' } })
  }

  const normalized = decodeURIComponent(email).toLowerCase().trim()
  await redis.srem('newsletter:subscribers', normalized).catch(() => {})

  const html = `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subscri&#231;&#227;o cancelada</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:480px;margin:80px auto;padding:40px 20px;text-align:center;">
    <span style="background:#22c55e;color:#000;font-weight:900;font-size:11px;padding:4px 8px;border-radius:4px;">PR</span>
    <h1 style="color:#fff;font-size:22px;font-weight:900;margin:32px 0 12px;">Subscri&#231;&#227;o cancelada.</h1>
    <p style="color:rgba(255,255,255,0.45);font-size:14px;line-height:1.6;">
      O teu email foi removido da newsletter do Performance Running.
    </p>
    <a href="https://www.performancerunning.pt"
       style="display:inline-block;margin-top:28px;background:#22c55e;color:#000;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;border-radius:8px;text-decoration:none;">
      VOLTAR AO SITE
    </a>
  </div>
</body>
</html>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
