import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { BlogClient } from '@/components/BlogClient'

export const metadata: Metadata = {
  title: 'Arquivo de Artigos',
  description:
    'Base de conhecimento científico sobre corrida, trail running e atletismo. Fisiologia, treino, nutrição, biomecânica e recuperação. 3 novos artigos publicados todos os dias.',
}

export default function BlogPage() {
  const articles = getAllArticles()
  return <BlogClient articles={articles} />
}
