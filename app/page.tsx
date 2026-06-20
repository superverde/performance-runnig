import Link from 'next/link'
import { getLatestArticles, getAllArticles, getTodayArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/ArticleCard'
import { ArrowRight, ArrowUpRight, Zap } from 'lucide-react'

const marqueeItems = [
  'BIOMECÂNICA', '·', 'VO2MAX', '·', 'PERIODIZAÇÃO', '·', 'NUTRIÇÃO', '·',
  'TRAIL RUNNING', '·', 'FISIOLOGIA', '·', 'MARATONA', '·', 'RECUPERAÇÃO', '·',
  'BIOMECÂNICA', '·', 'VO2MAX', '·', 'PERIODIZAÇÃO', '·', 'NUTRIÇÃO', '·',
  'TRAIL RUNNING', '·', 'FISIOLOGIA', '·', 'MARATONA', '·', 'RECUPERAÇÃO', '·',
]

const topics = [
  { name: '5 km', tag: 'Velocidade', num: '01', img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=70' },
  { name: '10 km', tag: 'Resistência', num: '02', img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=70' },
  { name: 'Meia Maratona', tag: '21 km', num: '03', img: 'https://images.unsplash.com/photo-1530137073521-1b3f5d2e8aef?w=600&q=70' },
  { name: 'Maratona', tag: '42 km', num: '04', img: 'https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?w=600&q=70' },
  { name: 'Trail Running', tag: 'Montanha', num: '05', img: 'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=600&q=70' },
  { name: 'Ultra Trail', tag: '> 60 km', num: '06', img: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&q=70' },
  { name: 'Corrida Montanha', tag: 'Vertical', num: '07', img: 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=600&q=70' },
  { name: 'Meio Fundo', tag: 'Pista', num: '08', img: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=600&q=70' },
]

const categoryNames = ['Treino', 'Fisiologia', 'Nutrição', 'Biomecânica', 'Recuperação', 'Psicologia', 'Trail Running', 'Lesões']

export default async function HomePage() {
  const articles = await getLatestArticles(4)
  const allArticles = getAllArticles()
  const totalArticles = allArticles.length
  const todayArticles = getTodayArticles()

  const [featured, ...rest] = articles
  const sideArticles = rest.slice(0, 2)

  const categories = categoryNames.map((name) => ({
    name,
    count: allArticles.filter((a) => a.category === name).length,
  }))

  // Format today's date in Portuguese
  const todayLabel = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <>
      {/* ─────────────────────────────────── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Green ambient glow */}
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Vertical line accent */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-green/25 to-transparent hidden lg:block" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-24 w-full">

          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-brand-green/20 bg-brand-green/8 mb-10 animate-fade-up"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-dot" />
            <span className="text-brand-green text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
              3 novos artigos publicados hoje
            </span>
          </div>

          {/* Display headline — Barlow Condensed Italic */}
          <h1 className="font-display text-white mb-8 animate-fade-up delay-100" style={{ opacity: 0 }}>
            <span className="block text-[clamp(3.5rem,10vw,8.5rem)] leading-none">
              O CONHECIMENTO
            </span>
            <span
              className="block text-[clamp(3.5rem,10vw,8.5rem)] leading-none"
              style={{ WebkitTextStroke: '1px #00C896', color: 'transparent' }}
            >
              QUE TE FAZ
            </span>
            <span className="block text-[clamp(3.5rem,10vw,8.5rem)] leading-none text-brand-green">
              CORRER MELHOR.
            </span>
          </h1>

          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-md mb-10 animate-fade-up delay-200" style={{ opacity: 0 }}>
            A maior base de conhecimento científico sobre corrida em português.
            Fisiologia, treino, nutrição e biomecânica.
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-300" style={{ opacity: 0 }}>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all hover:gap-3"
            >
              Explorar Artigos
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/metodologias"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white/60 text-sm font-semibold rounded-full hover:border-white/30 hover:text-white transition-all"
            >
              Metodologias
            </Link>
          </div>

          {/* Stats — large Barlow Condensed numbers */}
          <div className="mt-20 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-8 animate-fade-up delay-400" style={{ opacity: 0 }}>
            {[
              { value: `${totalArticles}`, label: 'Artigos' },
              { value: '3/dia', label: 'Publicação' },
              { value: '9', label: 'Categorias' },
              { value: '100%', label: 'Gratuito' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-brand-green leading-none mb-1"
                     style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  {s.value}
                </div>
                <div className="text-[10px] text-white/35 uppercase tracking-[0.15em] font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── MARQUEE ── */}
      <div className="relative py-3 bg-brand-green overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {marqueeItems.map((item, i) => (
            <span key={i} className="inline-flex items-center mx-5 text-black text-[11px] font-black tracking-[0.2em] uppercase">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─────────────────────── PUBLICADOS HOJE ── */}
      {todayArticles.length > 0 && (
        <section
          className="relative py-16 sm:py-20 border-t border-white/5 overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/97 via-black/90 to-black/80" />
          <div className="absolute inset-0 bg-brand-green/[0.025]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-10" data-reveal>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-dot" />
                  <Zap size={10} className="text-brand-green" />
                  <span className="text-brand-green text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
                    Hoje
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-white leading-none"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                    PUBLICADOS HOJE
                  </h2>
                  <p className="text-white/30 text-[11px] font-mono mt-0.5 capitalize">{todayLabel}</p>
                </div>
              </div>
              <span className="hidden sm:block text-[10px] font-mono text-white/20 uppercase tracking-widest">
                {todayArticles.length} {todayArticles.length === 1 ? 'artigo' : 'artigos'}
              </span>
            </div>

            {/* Articles list */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {todayArticles.map((article, i) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  data-reveal
                  data-delay={String(i * 80)}
                  className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:border-brand-green/25 hover:bg-brand-green/[0.04] transition-all"
                >
                  {/* Category + read time */}
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-brand-green border border-brand-green/20 bg-brand-green/8">
                      {article.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/20">
                      {article.readTime} min
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-black text-white/85 group-hover:text-white transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[12px] text-white/35 leading-relaxed line-clamp-2 flex-1">
                    {article.excerpt}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-[10px] font-bold text-white/25 group-hover:text-brand-green transition-colors uppercase tracking-widest mt-1">
                    Ler artigo <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────── ÚLTIMOS ARTIGOS ── */}
      {articles.length > 0 && (
        <section
          className="relative py-24 sm:py-32 overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/98 via-black/93 to-black/98" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Section header */}
            <div className="flex items-end justify-between mb-12" data-reveal>
              <div>
                <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">
                  Publicados Recentemente
                </p>
                <h2 className="font-display text-white leading-none"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                  ÚLTIMOS ARTIGOS
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-white/35 hover:text-brand-green transition-colors uppercase tracking-widest"
              >
                Ver arquivo <ArrowUpRight size={12} />
              </Link>
            </div>

            {/* Editorial layout: featured left + 2 stacked right */}
            {featured && (
              <div className="grid lg:grid-cols-[3fr_2fr] gap-4 mb-4">
                {/* Featured card */}
                <div data-reveal>
                  <ArticleCard article={featured} featured />
                </div>

                {/* 2 smaller cards */}
                <div className="flex flex-col gap-4">
                  {sideArticles.map((a, i) => (
                    <div key={a.slug} data-reveal data-delay={String((i + 1) * 100)}>
                      <ArticleCard article={a} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4th article if exists */}
            {articles[3] && (
              <div className="mt-4" data-reveal>
                <ArticleCard article={articles[3]} />
              </div>
            )}

            <div className="mt-10 text-center" data-reveal>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/10 text-white/55 text-sm font-bold rounded-full hover:border-brand-green/40 hover:text-white transition-all"
              >
                Ver todos os {totalArticles} artigos <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────── CATEGORIAS GRID ── */}
      <section
        className="relative py-20 border-t border-white/5 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/96 via-black/90 to-black/95" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10" data-reveal>
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">Temas</p>
            <h2 className="font-display text-white leading-none"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              EXPLORA POR CATEGORIA
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categories.map((c, i) => (
              <Link
                key={c.name}
                href={`/blog?category=${encodeURIComponent(c.name)}`}
                data-reveal
                data-delay={String(Math.min(i * 50, 400))}
                className="group relative flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-brand-green/25 bg-white/[0.015] hover:bg-brand-green/5 transition-all"
              >
                <span className="text-sm font-bold text-white/65 group-hover:text-white transition-colors">{c.name}</span>
                <span className="text-xs font-mono text-white/20 group-hover:text-brand-green transition-colors">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── MODALIDADES ── */}
      <section className="py-24 sm:py-32 bg-[#0a0a0a] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-12" data-reveal>
            <div>
              <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">Metodologias</p>
              <h2 className="font-display text-white leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                CADA DISTÂNCIA.<br />
                <span className="text-white/25">CADA SEGREDO.</span>
              </h2>
            </div>
            <Link href="/metodologias" className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-white/35 hover:text-brand-green transition-colors uppercase tracking-widest">
              Ver todas <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topics.map((m, i) => (
              <Link
                key={m.name}
                href="/metodologias"
                data-reveal
                data-delay={String(Math.min(i * 50, 400))}
                className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all card-hover"
                style={{ aspectRatio: '3/4' }}
              >
                {/* Photo */}
                <div
                  className="absolute inset-0 photo-card-img"
                  style={{
                    backgroundImage: `url(${m.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/8 transition-colors duration-500" />

                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-mono text-white/30">{m.num}</span>
                    <ArrowUpRight
                      size={14}
                      className="text-white/0 group-hover:text-brand-green transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-brand-green/70 group-hover:text-brand-green transition-colors">
                      {m.tag}
                    </span>
                    <h3 className="text-sm font-black text-white leading-tight mt-1">{m.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── CTA ── */}
      <section className="py-24 sm:py-32 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden border border-white/5 p-10 sm:p-16 lg:p-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            data-reveal
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/88 to-black/85" />
            {/* Green glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-green/8 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative text-center">
              <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-6">
                Arquivo Completo
              </p>
              <h2
                className="font-display text-white leading-none mb-6"
                style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
              >
                {totalArticles} ARTIGOS.<br />
                <span className="text-brand-green">TODOS GRÁTIS.</span>
              </h2>
              <p className="text-white/40 max-w-md mx-auto mb-10 text-sm leading-relaxed">
                Treino, fisiologia, nutrição, biomecânica, recuperação e psicologia desportiva.
                Tudo baseado em ciência. Tudo gratuito.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-9 py-4 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all hover:gap-3"
              >
                Aceder ao Arquivo <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
