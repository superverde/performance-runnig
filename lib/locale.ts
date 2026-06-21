import { cookies } from 'next/headers'

export const LOCALES = ['pt', 'en', 'es', 'fr', 'de', 'zh'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'pt'

// Nomes dos idiomas para exibição
export const LOCALE_LABELS: Record<Locale, { flag: string; label: string }> = {
  pt: { flag: '🇵🇹', label: 'PT' },
  en: { flag: '🇬🇧', label: 'EN' },
  es: { flag: '🇪🇸', label: 'ES' },
  fr: { flag: '🇫🇷', label: 'FR' },
  de: { flag: '🇩🇪', label: 'DE' },
  zh: { flag: '🇨🇳', label: '中文' },
}

// Carrega mensagens para o locale pedido
export async function getMessages(locale: Locale): Promise<Record<string, Record<string, string>>> {
  try {
    const messages = await import(`../messages/${locale}.json`)
    return messages.default as Record<string, Record<string, string>>
  } catch {
    const messages = await import('../messages/pt.json')
    return messages.default as Record<string, Record<string, string>>
  }
}

// Lê o locale atual do cookie (server component)
export function getLocaleFromCookie(): Locale {
  try {
    const cookieStore = cookies()
    const locale = cookieStore.get('NEXT_LOCALE')?.value
    if (locale && (LOCALES as readonly string[]).includes(locale)) {
      return locale as Locale
    }
  } catch {
    // Em contextos sem cookies (middleware, etc.)
  }
  return DEFAULT_LOCALE
}
