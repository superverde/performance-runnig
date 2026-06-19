'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

interface Props {
  slug: string
  initialViews?: number
}

export function ViewCounter({ slug, initialViews = 0 }: Props) {
  const [views, setViews] = useState(initialViews)

  useEffect(() => {
    // Incrementa a contagem ao abrir o artigo
    fetch(`/api/views/${slug}`, { method: 'POST' })
      .then((r) => r.json())
      .then((data) => setViews(data.views))
      .catch(() => {}) // falha silenciosa
  }, [slug])

  return (
    <span className="flex items-center gap-1.5">
      <Eye size={12} />
      {views.toLocaleString('pt-PT')} visualizações
    </span>
  )
}
