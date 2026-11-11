'use client'

import { useState, type ReactNode } from 'react'
import { ArticleTranslate } from '@/components/ArticleTranslate'

interface Props {
  slug: string
  originalContent: string
  originalTitle: string
  originalExcerpt: string
  /** Bloco inserido a meio do artigo (ex.: parceiro i-Run). */
  midSlot?: ReactNode
}

/**
 * Divide o HTML do artigo num <h2> perto do meio (nunca o primeiro nem o
 * último, que costuma ser Referências), para inserir um bloco entre as partes.
 */
function dividirAMeio(html: string): [string, string] | null {
  const pos: number[] = []
  const re = /<h2[\s>]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) pos.push(m.index)
  const candidatos = pos.slice(1, -1)
  if (candidatos.length === 0) return null
  const meio = html.length / 2
  const corte = candidatos.reduce((a, b) => (Math.abs(b - meio) < Math.abs(a - meio) ? b : a))
  return [html.slice(0, corte), html.slice(corte)]
}

export function ArticleContent({ slug, originalContent, originalTitle, originalExcerpt, midSlot }: Props) {
  const [content, setContent] = useState(originalContent)
  const [title, setTitle] = useState(originalTitle)
  const [excerpt, setExcerpt] = useState(originalExcerpt)
  const [isTranslated, setIsTranslated] = useState(false)

  function handleTranslated(newContent: string, newTitle: string, newExcerpt: string) {
    setContent(newContent)
    setTitle(newTitle)
    setExcerpt(newExcerpt)
    setIsTranslated(true)
  }

  function handleReset() {
    setContent(originalContent)
    setTitle(originalTitle)
    setExcerpt(originalExcerpt)
    setIsTranslated(false)
  }

  return (
    <>
      {/* Botão de tradução — aparece antes do conteúdo */}
      <ArticleTranslate
        slug={slug}
        originalContent={originalContent}
        originalTitle={originalTitle}
        originalExcerpt={originalExcerpt}
        onTranslated={handleTranslated}
        onReset={handleReset}
        isTranslated={isTranslated}
      />

      {/* Título e excerpt traduzíveis */}
      {isTranslated && (
        <div className="mb-8 p-4 rounded-xl border border-brand-green/15 bg-brand-green/3">
          <h2 className="text-xl font-black text-white mb-2">{title}</h2>
          <p className="text-white/55 text-sm leading-relaxed">{excerpt}</p>
        </div>
      )}

      {/* Conteúdo do artigo */}
      {(() => {
        const partes = midSlot ? dividirAMeio(content) : null
        if (!partes) {
          return (
            <>
              <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
              {midSlot}
            </>
          )
        }
        return (
          <>
            <div className="prose" dangerouslySetInnerHTML={{ __html: partes[0] }} />
            {midSlot}
            <div className="prose" dangerouslySetInnerHTML={{ __html: partes[1] }} />
          </>
        )
      })()}
    </>
  )
}
