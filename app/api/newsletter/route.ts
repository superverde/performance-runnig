import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export const runtime = 'edge'

// Envia email de boas-vindas via Resend (se API key configurada)
async function sendWelcomeEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // sem key → só guarda, não envia

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Performance Running <newsletter@performancerunning.pt>',
      to: [email],
      subject: 'Bem-vindo ao Performance Running 🏃',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
          <div style="margin-bottom: 32px;">
            <span style="background: #00ff87; color: #000; font-weight: 900; font-size: 12px; padding: 4px 10px; border-radius: 4px;">PR</span>
            <span style="font-weight: 900; font-size: 14px; margin-left: 8px; letter-spacing: -0.5px;">PERFORMANCE<span style="color: #00ff87;">RUNNING</span></span>
          </div>
          <h1 style="font-size: 28px; font-weight: 900; margin: 0 0 16px; letter-spacing: -1px;">
            Estás dentro. 🎯
          </h1>
          <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            A partir de agora recebes os melhores artigos sobre corrida, trail e atletismo — baseados em ciência, escritos para atletas a sério.
          </p>
          <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
            VO2máx, periodização, nutrição de precisão, prevenção de lesões. Sem ruído, só o que importa.
          </p>
          <a href="https://performancerunning.pt/blog"
             style="display: inline-block; background: #00ff87; color: #000; font-weight: 900; font-size: 14px; padding: 14px 28px; border-radius: 6px; text-decoration: none; letter-spacing: 0.5px;">
            VER ARQUIVO →
          </a>
          <p style="color: #444; font-size: 12px; margin-top: 40px;">
            Podes cancelar a qualquer momento. Performance Running · performancerunning.pt
          </p>
        </div>
      `,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    // Validação básica
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }
    const normalized = email.toLowerCase().trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    // Verificar duplicado
    const exists = await redis.sismember('newsletter:subscribers', normalized)
    if (exists) {
      return NextResponse.json({ message: 'already_subscribed' })
    }

    // Guardar no Redis
    await redis.sadd('newsletter:subscribers', normalized)
    await redis.lpush('newsletter:log', JSON.stringify({
      email: normalized,
      date: new Date().toISOString(),
    }))

    // Enviar email de boas-vindas (silencioso se falhar — não bloqueia)
    await sendWelcomeEmail(normalized).catch(() => {})

    return NextResponse.json({ message: 'subscribed' })
  } catch (err) {
    console.error('Newsletter route error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

// Admin: ver total de subscritores (protegido por secret)
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const count = await redis.scard('newsletter:subscribers')
  const log = await redis.lrange('newsletter:log', 0, 49)
  return NextResponse.json({ count, recent: log })
}
