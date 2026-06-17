import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/ArticleCard'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artigos técnicos sobre corrida, trail running, atletismo, nutrição desportiva e metodologias de treino. Publicado regularmente por treinadores de alta performance.',
}

const categories = [
  'Todos', 'Treino', 'Nutrição', 'Biomecânica', 'Recuperação',
  'Psicologia Desportiva', 'VO2max', 'Trail Running', 'Lesões',
]

export default function BlogPage() {
  const articles = getAllArticles()

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-brand-gray to-brand-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-4">
            BLOG
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Artigos de <span className="text-brand-green">Alta Performance</span>
          </h1>
          <p className="text-brand-text text-base max-w-xl mx-auto">
            Fisiologia, metodologia e técnica — escritos como treinador, lidos como atleta.
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="border-b border-brand-border overflow-x-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3">
            {categories.map((c) => (
              <button
                key={c}
                className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-md transition-colors font-medium ${
                  c === 'Todos'
                    ? 'bg-brand-green text-black'
                    : 'text-brand-text hover:text-white hover:bg-brand-muted'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-24 text-brand-text">
            <p className="text-lg font-semibold text-white mb-2">Artigos em breve</p>
            <p className="text-sm">O blog é atualizado diariamente com conteúdo novo.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
