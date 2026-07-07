import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { BlogClient } from '@/components/BlogClient'

// Sem isto, o Next.js pré-renderiza esta página como estática no build e ela
// fica presa com a contagem de artigos de quando foi gerada pela última vez —
// foi o que aconteceu: /blog ficou parado em 35 artigos (21 jun) enquanto a
// homepage (que já tem `dynamic = 'force-dynamic'`) continuava a mostrar a
// contagem real (93+). Ver memória "Arquivo /blog Desatualizado".
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Arquivo de Artigos',
  description:
    'Base de conhecimento científico sobre corrida, trail running e atletismo. Fisiologia, treino, nutrição, biomecânica e recuperação. 3 novos artigos publicados todos os dias.',
}

export default function BlogPage() {
  const articles = getAllArticles()
  return <BlogClient articles={articles} />
}
