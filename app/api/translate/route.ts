import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// MyMemory API — gratuita até 5000 chars/req e 1000 req/dia, sem chave
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'

// Mapeamento locale → código MyMemory
const LANG_CODES: Record<string, string> = {
  en: 'en-GB',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
}

let redis: Redis | null = null
try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
} catch {}

export async function POST(req: NextRequest) {
  try {
    const { text, targetLocale, slug } = await req.json()

    if (!text || !targetLocale || targetLocale === 'pt') {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }

    const langCode = LANG_CODES[targetLocale]
    if (!langCode) {
      return NextResponse.json({ error: 'Idioma não suportado' }, { status: 400 })
    }

    // Verifica cache Redis
    const cacheKey = `translate:${targetLocale}:${slug || 'text'}`
    if (redis && slug) {
      const cached = await redis.get<string>(cacheKey)
      if (cached) {
        return NextResponse.json({ translated: cached, cached: true })
      }
    }

    // Divide o texto em blocos de 500 chars para respeitar limites da API
    const chunks = splitText(text, 500)
    const translated: string[] = []

    for (const chunk of chunks) {
      const url = new URL(MYMEMORY_URL)
      url.searchParams.set('q', chunk)
      url.searchParams.set('langpair', `pt-PT|${langCode}`)
      url.searchParams.set('de', 'performance.running0224@gmail.com') // aumenta limite diário

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('MyMemory API error')

      const data = await res.json()
      if (data.responseStatus !== 200) throw new Error(data.responseDetails || 'Translation failed')

      translated.push(data.responseData.translatedText)
    }

    const result = translated.join(' ')

    // Guarda no Redis por 30 dias
    if (redis && slug) {
      await redis.set(cacheKey, result, { ex: 60 * 60 * 24 * 30 })
    }

    return NextResponse.json({ translated: result })
  } catch (err) {
    console.error('Translation error:', err)
    return NextResponse.json({ error: 'Erro na tradução. Tenta novamente.' }, { status: 500 })
  }
}

// Divide texto em blocos respeitando frases completas
function splitText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text]

  const chunks: string[] = []
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  let current = ''

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLen) {
      if (current) chunks.push(current.trim())
      current = sentence
    } else {
      current += sentence
    }
  }
  if (current) chunks.push(current.trim())

  return chunks
}
