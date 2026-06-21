// SERVER ONLY — não importar em client components ('use client')
import { cookies } from 'next/headers'
import { LOCALES, DEFAULT_LOCALE } from './locale'
import type { Locale } from './locale'

export { getMessages } from './locale'

// Lê o locale atual do cookie (só funciona em Server Components)
export function getLocaleFromCookie(): Locale {
  try {
    const cookieStore = cookies()
    const locale = cookieStore.get('NEXT_LOCALE')?.value
    if (locale && (LOCALES as readonly string[]).includes(locale)) {
      return locale as Locale
    }
  } catch {
    // fallback silencioso
  }
  return DEFAULT_LOCALE
}
