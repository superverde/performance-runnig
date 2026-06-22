// SERVER ONLY — não importar em client components ('use client')
import { cookies, headers } from 'next/headers'
import { LOCALES, DEFAULT_LOCALE } from './locale'
import type { Locale } from './locale'

export { getMessages } from './locale'

/**
 * Lê o locale em Server Components.
 * Ordem de prioridade:
 *   1. Cookie NEXT_LOCALE (visitas seguintes — preferência guardada)
 *   2. Header x-locale (injetado pelo middleware na primeira visita)
 *   3. Fallback para 'pt'
 */
export function getLocaleFromCookie(): Locale {
  // 1. Cookie (preferência guardada)
  try {
    const cookieStore = cookies()
    const fromCookie = cookieStore.get('NEXT_LOCALE')?.value
    if (fromCookie && (LOCALES as readonly string[]).includes(fromCookie)) {
      return fromCookie as Locale
    }
  } catch {
    // ignora — ambiente sem cookies (ex: build)
  }

  // 2. Header x-locale injetado pelo middleware (primeira visita)
  try {
    const headersList = headers()
    const fromHeader = headersList.get('x-locale')
    if (fromHeader && (LOCALES as readonly string[]).includes(fromHeader)) {
      return fromHeader as Locale
    }
  } catch {
    // ignora
  }

  return DEFAULT_LOCALE
}
