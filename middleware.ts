import { NextRequest, NextResponse } from 'next/server'

// Estas constantes são duplicadas de lib/locale.ts para evitar import circular no middleware
const LOCALES = ['pt', 'en', 'es', 'fr', 'de', 'zh'] as const
type Locale = (typeof LOCALES)[number]
const DEFAULT_LOCALE: Locale = 'pt'

// Re-export para outros módulos
export { LOCALES, DEFAULT_LOCALE }
export type { Locale }

// Mapeamento de prefixos Accept-Language → locale suportado
const LANG_MAP: Record<string, Locale> = {
  pt: 'pt', 'pt-pt': 'pt', 'pt-br': 'pt',
  en: 'en', 'en-us': 'en', 'en-gb': 'en', 'en-au': 'en',
  es: 'es', 'es-es': 'es', 'es-mx': 'es', 'es-ar': 'es',
  fr: 'fr', 'fr-fr': 'fr', 'fr-be': 'fr', 'fr-ch': 'fr',
  de: 'de', 'de-de': 'de', 'de-at': 'de', 'de-ch': 'de',
  zh: 'zh', 'zh-cn': 'zh', 'zh-tw': 'zh', 'zh-hk': 'zh',
}

function detectLocale(request: NextRequest): Locale {
  // 1. Preferência guardada em cookie
  const cookie = request.cookies.get('NEXT_LOCALE')?.value
  if (cookie && LOCALES.includes(cookie as Locale)) {
    return cookie as Locale
  }

  // 2. Accept-Language do browser
  const acceptLang = request.headers.get('accept-language') || ''
  const langs = acceptLang
    .split(',')
    .map((l) => l.split(';')[0].trim().toLowerCase())

  for (const lang of langs) {
    if (LANG_MAP[lang]) return LANG_MAP[lang]
    // Tenta só o prefixo (ex: "fr-CA" → "fr")
    const prefix = lang.split('-')[0]
    if (LANG_MAP[prefix]) return LANG_MAP[prefix]
  }

  return DEFAULT_LOCALE
}

export function middleware(request: NextRequest) {
  // Ignora assets estáticos e API routes
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // ficheiros com extensão
  ) {
    return NextResponse.next()
  }

  // Redirect 301: URLs de artigos com acentos no slug (partilhados/indexados
  // antes da normalização ASCII de 2026-07-14) → slug ASCII canónico.
  // O Google tinha estes URLs antigos marcados como Soft 404 na Search
  // Console: o slug chega percent-encoded (ex: eletr%C3%B3litos-...) e a
  // página respondia "não encontrado". O 301 consolida o sinal SEO no
  // artigo real em vez de deixar o URL antigo morrer.
  if (pathname.startsWith('/blog/')) {
    let decoded = pathname
    try {
      decoded = decodeURIComponent(pathname)
    } catch {
      // percent-encoding inválido — segue sem redirect
    }
    const ascii = decoded.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (ascii !== decoded) {
      const url = request.nextUrl.clone()
      url.pathname = ascii
      return NextResponse.redirect(url, 301)
    }
  }

  const locale = detectLocale(request)

  // Passa locale como REQUEST header — lido por headers() em Server Components na primeira visita
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // Guarda em cookie por 1 ano (usado em visitas seguintes)
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
