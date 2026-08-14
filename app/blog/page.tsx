import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { BlogClient } from '@/components/BlogClient'

// Sem isto, o Next.js pre-renderiza esta pagina como estatica no build e ela
// fica presa com a contagem de artigos de quando foi gerada pela ultima vez --
// foi o que aconteceu: /blog ficou parado em 35 artigos (21 jun) enquanto a
// homepage (que ja tem `dynamic = 'force-dynamic'`) continuava a mostrar a
// contagem real (93+). Ver memoria "Arquivo /blog Desatualizado".
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Arquivo de Artigos',
  description:
    'Base de conhecimento cientifico sobre corrida, trail running e atletismo. Fisiologia, treino, nutricao, biomecanica e recuperacao. 3 novos artigos publicados todos os dias.',
}

export default function BlogPage() {
  const articles = getAllArticles()
  return <BlogClient articles={articles} />
}
