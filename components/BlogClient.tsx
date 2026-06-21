'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { ArticleCard } from '@/components/ArticleCard'
import type { ArticleMeta } from '@/lib/articles'

const ARTICLES_PER_PAGE = 12

const ALL_CATEGORIES = [
  'Todos', 'Treino', 'Fisiologia', 'Nutrição', 'Biomecânica',
  'Recuperação', 'VO2max', 'Trail Running', 'Psicologia', 'Lesões',
]

/** ISO date string for today: "2026-06-21" */
function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

/** Format ISO date to Portuguese: "21 de junho de 2026" */
function formatDatePT(iso: string) {
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
  const [y, m, d] = iso.split('-')
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`
}

interface Props {
  articles: ArticleMeta[]
  initialCategory?: string
  heroTitle?: string
  heroDescription?: string
  heroBg?: string
}

export function BlogClient({ articles, initialCategory = 'Todos', heroTitle, heroDescription, heroBg }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [page, setPage] = useState(1)

  const isHoje = category === 'Hoje'

  const filtered = useMemo(() => {
    let result = articles
    if (isHoje) {
      const today = todayISO()
      result = result.filter((a) => a.rawDate === today)
    } else if (category !== 'Todos') {
      result = result.filter((a) => a.category === category)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [articles, category, search, isHoje])

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE)

  const handleCategory = (c: string) => { setCategory(c); setPage(1) }
  const handleSearch = (v: string) => { setSearch(v); setPage(1) }
  const clearAll = () => { setSearch(''); setCategory('Todos'); setPage(1) }

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative pt-28 pb-16 border-b border-white/5 overflow-hidden"
        style={heroBg ? {
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : { background: '#080808' }}
      >
        {heroBg && <div className="absolute inset-0 bg-gradient-to-r from-black/96 via-black/88 to-black/60" />}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {isHoje ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase">
                    Publicados hoje · {formatDatePT(todayISO())}
                  </p>
                </div>
                <h1
                  className="font-display text-white leading-none mb-5"
                  style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
                >
                  ARTIGOS<br /><span className="text-brand-green">DE HOJE.</span>
                </h1>
                <p className="text-white/40 text-sm leading-relaxed max-w-lg mb-8">
                  {filtered.length > 0
                    ? `${filtered.length} artigo${filtered.length !== 1 ? 's' : ''} publicado${filtered.length !== 1 ? 's' : ''} hoje. Novos artigos todos os dias.`
                    : 'Ainda não foram publicados artigos hoje. Volta mais tarde — publicamos 3 artigos por dia.'}
                </p>
              </>
            ) : (
              <>
                <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-4">
                  {heroTitle ? `Categoria · ${heroTitle}` : `Arquivo · ${articles.length} artigos científicos`}
                </p>
                <h1
                  className="font-display text-white leading-none mb-5"
                  style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
                >
                  {heroTitle ? (
                    <><span className="text-brand-green">{heroTitle.toUpperCase()}</span><br />NA CORRIDA.</>
                  ) : (
                    <>BASE DE<br /><span className="text-brand-green">CONHECIMENTO.</span></>
                  )}
                </h1>
                <p className="text-white/40 text-sm leading-relaxed max-w-lg mb-8">
                  {heroDescription || 'Fisiologia, treino, nutrição, biomecânica, recuperação e psicologia desportiva. 3 novos artigos publicados todos os dias.'}
                </p>
              </>
            )}

            {/* Search */}
            <div className="relative max-w-md">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Pesquisar artigos, temas, categorias..."
                className="w-full pl-10 pr-10 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-green/50 transition-all"
              />
              {search && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS + HOJE ── */}
      <div className="border-b border-white/5 overflow-x-auto bg-[#0A0A0A] sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1.5 py-3">
            {/* Separador HOJE — destaque com pulso */}
            <button
              onClick={() => handleCategory('Hoje')}
              className={`whitespace-nowrap px-4 py-1.5 text-xs rounded-full transition-all font-bold flex items-center gap-1.5 ${
                isHoje
                  ? 'bg-brand-green text-black'
                  : 'text-brand-green border border-brand-green/40 hover:border-brand-green hover:bg-brand-green/10'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-current ${!isHoje ? 'animate-pulse' : ''}`} />
              Hoje
            </button>

            {/* Divisor visual */}
            <div className="w-px bg-white/10 my-1 mx-0.5" />

            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => handleCategory(c)}
                className={`whitespace-nowrap px-4 py-1.5 text-xs rounded-full transition-all font-bold ${
                  category === c
                    ? 'bg-brand-green text-black'
                    : 'text-white/40 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── ARTIGOS ── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Info / limpar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-white/30 text-xs font-mono">
            {filtered.length === 0
              ? isHoje ? 'Nenhum artigo publicado hoje ainda' : 'Nenhum artigo encontrado'
              : `${filtered.length} artigo${filtered.length !== 1 ? 's' : ''}`}
            {!isHoje && category !== 'Todos' && ` · ${category}`}
            {isHoje && filtered.length > 0 && ` · ${formatDatePT(todayISO())}`}
            {search && ` · "${search}"`}
          </p>
          {(search || category !== 'Todos') && (
            <button onClick={clearAll} className="text-xs text-brand-green hover:underline">
              Limpar filtros
            </button>
          )}
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-5xl mb-4">{isHoje ? '⏰' : '🔍'}</div>
            <p className="text-white font-bold mb-2">
              {isHoje ? 'Ainda sem artigos hoje' : 'Nenhum artigo encontrado'}
            </p>
            <p className="text-white/40 text-sm mb-6">
              {isHoje
                ? 'Os artigos de hoje ainda não foram publicados. Volta mais tarde!'
                : 'Tenta pesquisar com outras palavras.'}
            </p>
            <button onClick={clearAll} className="text-brand-green text-sm font-bold hover:underline">
              Ver todos os artigos
            </button>
          </div>
        ) : (
          <>
            {/* Header "Hoje" com data destacada */}
            {isHoje && (
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
                <div className="w-1 h-10 bg-brand-green rounded-full" />
                <div>
                  <p className="text-brand-green text-[10px] font-mono font-bold tracking-widest uppercase">
                    Publicados hoje
                  </p>
                  <p className="text-white/60 text-sm font-medium">{formatDatePT(todayISO())}</p>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full text-xs font-bold border border-white/10 text-white/40 hover:border-white/20 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  ← Anterior
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 7) pageNum = i + 1
                    else if (page <= 4) pageNum = i + 1
                    else if (page >= totalPages - 3) pageNum = totalPages - 6 + i
                    else pageNum = page - 3 + i
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                          pageNum === page
                            ? 'bg-brand-green text-black'
                            : 'text-white/40 hover:text-white border border-white/5 hover:border-white/20'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-full text-xs font-bold border border-white/10 text-white/40 hover:border-white/20 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  Próxima →
                </button>
              </div>
            )}

            <p className="text-center text-white/20 text-xs font-mono mt-6">
              Página {page} de {totalPages} · {articles.length} artigos no total
            </p>
          </>
        )}
      </main>
    </>
  )
}
