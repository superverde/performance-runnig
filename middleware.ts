import { NextRequest, NextResponse } from 'next/server'

/**
 * Remove acentos/diacríticos (NFD + remove combining marks). Usado para
 * redirecionar URLs de artigos com acentos (ex. /blog/coração-atleta) para
 * o slug ASCII canónico (/blog/coracao-atleta) — ver
 * [[project_slugs_acentos_404]]. Esta lógica já existiu no middleware
 * (commit a220f2c/3c4f538, jul/2026) mas foi perdida numa reescrita
 * posterior (provavelmente ao adicionar a deteção de idioma); repor aqui
 * corrige tanto URLs antigos indexados no Google como duplicados
 * acidentais que a automação de artigos ainda pode gerar.
 */
function deaccent(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

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

  // Redirect 301 de URLs com acentos para o slug ASCII canónico (ex.
  // /blog/coração-atleta -> /blog/coracao-atleta). O Next entrega o
  // pathname já decoded aqui, por isso comparar com deaccent() é seguro.
  const deaccented = deaccent(pathname)
  if (deaccented !== pathname) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = deaccented
    return NextResponse.redirect(redirectUrl, 301)
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
