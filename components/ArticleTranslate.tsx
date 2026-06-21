'use client'

import { useState } from 'react'
import { Globe, RotateCcw, Loader2 } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import { LOCALE_LABELS } from '@/lib/locale'

interface Props {
  slug: string
  originalContent: string
  originalTitle: string
  originalExcerpt: string
  onTranslated: (content: string, title: string, excerpt: string) => void
  onReset: () => void
  isTranslated: boolean
}

export function ArticleTranslate({
  slug,
  originalContent,
  originalTitle,
  originalExcerpt,
  onTranslated,
  onReset,
  isTranslated,
}: Props) {
  const { locale, t } = useLocale()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Só mostra o botão se o locale não for PT
  if (locale === 'pt') return null

  const localeInfo = LOCALE_LABELS[locale]

  async function handleTranslate() {
    if (isTranslated) {
      onReset()
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Traduz título, excerpt e conteúdo em paralelo
      const [titleRes, excerptRes, contentRes] = await Promise.all([
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: originalTitle, targetLocale: locale, slug: `title-${slug}` }),
        }),
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: originalExcerpt, targetLocale: locale, slug: `excerpt-${slug}` }),
        }),
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Remove HTML tags para tradução, depois re-injeta
          body: JSON.stringify({
            text: originalContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
            targetLocale: locale,
            slug: `content-${slug}`,
          }),
        }),
      ])

      const [titleData, excerptData, contentData] = await Promise.all([
        titleRes.json(),
        excerptRes.json(),
        contentRes.json(),
      ])

      if (titleData.error || excerptData.error || contentData.error) {
        throw new Error('Erro na tradução')
      }

      // Converte texto traduzido em HTML simples com parágrafos
      const translatedHtml = contentData.translated
        .split(/\n\n+/)
        .filter((p: string) => p.trim())
        .map((p: string) => `<p>${p.trim()}</p>`)
        .join('\n')

      onTranslated(translatedHtml, titleData.translated, excerptData.translated)
    } catch {
      setError('Erro na tradução. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 mt-6 mb-2">
      <button
        onClick={handleTranslate}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
          isTranslated
            ? 'border-brand-green/40 text-brand-green bg-brand-green/5 hover:bg-brand-green/10'
            : 'border-white/15 text-white/50 hover:border-brand-green/40 hover:text-brand-green hover:bg-brand-green/5'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            {t('blog', 'translating')}
          </>
        ) : isTranslated ? (
          <>
            <RotateCcw size={12} />
            {t('blog', 'show_original')}
          </>
        ) : (
          <>
            <Globe size={12} />
            {localeInfo.flag} {t('blog', 'translate_btn')} → {localeInfo.label}
          </>
        )}
      </button>

      {error && (
        <p className="text-red-400/70 text-[11px]">{error}</p>
      )}

      {isTranslated && (
        <p className="text-[10px] text-white/25 font-mono">
          Traduzido automaticamente · Pode conter imprecisões
        </p>
      )}
    </div>
  )
}
