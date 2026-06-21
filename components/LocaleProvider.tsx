'use client'

import { createContext, useContext, useState, useCallback, useTransition } from 'react'
import type { Locale } from '@/lib/locale'

interface LocaleContextValue {
  locale: Locale
  messages: Record<string, Record<string, string>>
  t: (section: string, key: string) => string
  changeLocale: (locale: Locale) => void
  isPending: boolean
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'pt',
  messages: {},
  t: (_, key) => key,
  changeLocale: () => {},
  isPending: false,
})

export function useLocale() {
  return useContext(LocaleContext)
}

interface Props {
  locale: Locale
  messages: Record<string, Record<string, string>>
  children: React.ReactNode
}

export function LocaleProvider({ locale: initialLocale, messages: initialMessages, children }: Props) {
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const [messages, setMessages] = useState(initialMessages)
  const [isPending, startTransition] = useTransition()

  const t = useCallback(
    (section: string, key: string): string => {
      return messages?.[section]?.[key] ?? key
    },
    [messages]
  )

  const changeLocale = useCallback(async (newLocale: Locale) => {
    // Guarda preferência em cookie
    document.cookie = `NEXT_LOCALE=${newLocale};max-age=${60 * 60 * 24 * 365};path=/;samesite=lax`

    startTransition(async () => {
      try {
        const res = await fetch(`/api/messages?locale=${newLocale}`)
        const data = await res.json()
        setMessages(data)
        setLocale(newLocale)
      } catch {
        // fallback silencioso
      }
    })
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, messages, t, changeLocale, isPending }}>
      {children}
    </LocaleContext.Provider>
  )
}
