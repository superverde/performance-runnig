'use client'

import { useState } from 'react'
import { ArticleTranslate } from '@/components/ArticleTranslate'

interface Props {
  slug: string
  originalContent: string
  originalTitle: string
  originalExcerpt: string
}

export function ArticleContent({ slug, originalContent, originalTitle, originalExcerpt }: Props) {
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
      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
    </>
  )
}
