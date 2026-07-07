import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

// Assinaturas de User-Agent de bots/crawlers/scanners conhecidos. Isto NAO
// bloqueia o redirect (esse continua a acontecer sempre, para nao partir
// previews de links em Slack/Discord/WhatsApp/etc.) -- so evita que o clique
// seja contado como um clique real no Redis, para os numeros do relatorio
// diario refletirem visitantes humanos.
const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|discordbot|linkedinbot|pinterest(?:bot)?|curl|wget|python-requests|scrapy|headlesschrome|phantomjs|node-fetch|ahrefs|semrush|mj12|dotbot|petalbot|bytespider|gptbot|ccbot|claudebot|applebot|seznambot|duckduckbot|baiduspider|yandex/i

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false // UA em falta nao e, por si so, sinal fiavel de bot
  return BOT_UA_PATTERN.test(userAgent)
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const product = searchParams.get('product') || 'unknown'
  const url = searchParams.get('url') || '/'
  const userAgent = req.headers.get('user-agent')

  if (!isBot(userAgent)) {
    const today = new Date().toISOString().slice(0, 10) // "2026-06-22"

    try {
      // Incrementa contador: clicks:{date}:{product}
      await redis.hincrby(`clicks:${today}`, product, 1)
      // Total historico
      await redis.hincrby('clicks:total', product, 1)
    } catch {
      // Nao bloqueia o redirect se Redis falhar
    }
  }

  // Redireciona para o link de afiliado -- sempre, mesmo para bots
  return NextResponse.redirect(url, { status: 302 })
}
