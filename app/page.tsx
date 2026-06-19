import Link from 'next/link'
import { getLatestArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/ArticleCard'
import { ArrowRight, ArrowUpRight, BookOpen, FlaskConical, Layers, RefreshCw } from 'lucide-react'

const topics = [
  { name: '5 km', tag: 'Velocidade', desc: 'Potência anaeróbia e resistência láctica', num: '01', img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=70' },
  { name: '10 km', tag: 'Resistência', desc: 'Equilíbrio entre potência e capacidade aeróbia', num: '02', img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=70' },
  { name: 'Meia Maratona', tag: '21 km', desc: 'Limiar aeróbio, eficiência e pacing', num: '03', img: 'https://images.unsplash.com/photo-1530137073521-1b3f5d2e8aef?w=600&q=70' },
  { name: 'Maratona', tag: '42 km', desc: 'Gestão de energia, periodização e nutrição', num: '04', img: 'https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?w=600&q=70' },
  { name: 'Trail Running', tag: 'Montanha', desc: 'Técnica, força específica e nutrição em trail', num: '05', img: 'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=600&q=70' },
  { name: 'Ultra Trail', tag: '> 60 km', desc: 'Preparação mental, logística e gestão de esforço', num: '06', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=70' },
  { name: 'Corrida de Montanha', tag: 'Vertical', desc: 'Força máxima de subida e técnica de descida', num: '07', img: 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=600&q=70' },
  { name: 'Meio Fundo', tag: 'Pista', desc: 'VO2max, potência anaeróbia e capacidade láctica', num: '08', img: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=600&q=70' },
]

const marqueeItems = [
  'BIOMECÂNICA', 'VO2MAX', 'PERIODIZAÇÃO', 'NUTRIÇÃO DESPORTIVA',
  'PREVENÇÃO DE LESÕES', 'FISIOLOGIA DO EXERCÍCIO', 'TRAIL RUNNING', 'MARATONA',
  'BIOMECÂNICA', 'VO2MAX', 'PERIODIZAÇÃO', 'NUTRIÇÃO DESPORTIVA',
  'PREVENÇÃO DE LESÕES', 'FISIOLOGIA DO EXERCÍCIO', 'TRAIL RUNNING', 'MARATONA',
]

const pillars = [
  {
    icon: <FlaskConical className="w-5 h-5 text-brand-green" />,
    title: 'Ciência Aplicada',
    desc: 'Cada artigo é fundamentado em investigação científica publicada. Fisiologia do exercício, biomecânica e metabolismo energético explicados de forma clara.',
  },
  {
    icon: <Layers className="w-5 h-5 text-brand-green" />,
    title: 'Todas as Distâncias',
    desc: 'Do 5 km ao ultra trail, do meio fundo à corrida de montanha. Conteúdo específico para cada modalidade e nível de experiência.',
  },
  {
    icon: <RefreshCw className="w-5 h-5 text-brand-green" />,
    title: '3 Artigos por Dia',
    desc: 'Publicação diária de novos conteúdos. Treino, nutrição, recuperação, psicologia desportiva e muito mais — sempre atualizado.',
  },
  {
    icon: <BookOpen className="w-5 h-5 text-brand-green" />,
    title: 'Arquivo Completo',
    desc: 'Acesso a todo o historial de artigos. Pesquisa por categoria, tema ou palavra-chave para encontrar exatamente o que precisas.',
  },
]

const categories = [
  { name: 'Treino', count: '120+' },
  { name: 'Fisiologia', count: '80+' },
  { name: 'Nutrição', count: '60+' },
  { name: 'Biomecânica', count: '45+' },
  { name: 'Recuperação', count: '50+' },
  { name: 'Psicologia', count: '30+' },
  { name: 'Trail Running', count: '70+' },
  { name: 'Lesões', count: '40+' },
]

export default async function HomePage() {
  const articles = await getLatestArticles(3)

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-dark to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-green/30 to-transparent hidden lg:block" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-green/25 bg-brand-green/8 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-brand-green text-xs font-mono font-bold tracking-widest uppercase">
                3 novos artigos publicados hoje
              </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[6rem] font-black leading-[0.9] tracking-tighter mb-8">
              <span className="block text-white">O CONHECIMENTO</span>
              <span className="block text-brand-green">QUE TE FAZ</span>
              <span className="block text-white/30 text-5xl sm:text-6xl lg:text-7xl mt-2">CORRER MELHOR.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-lg mb-12">
              A maior base de conhecimento científico sobre corrida em português.
              Fisiologia, treino, nutrição, biomecânica e recuperação — 3 artigos novos todos os dias.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-brand-green/90 transition-all hover:gap-3 hover:scale-105 active:scale-95"
              >
                Explorar Artigos
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/metodologias"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/10 text-white/70 text-sm font-semibold rounded-full hover:border-brand-green/40 hover:text-white transition-all"
              >
                Ver Metodologias
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Artigos publicados' },
              { value: '3/dia', label: 'Novos artigos' },
              { value: '8', label: 'Modalidades' },
              { value: '100%', label: 'Baseado em ciência' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-black text-brand-green tabular-nums">{s.value}</div>
                <div className="text-xs text-white/40 mt-1.5 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="relative py-4 bg-brand-green overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {marqueeItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 mx-6 text-black text-xs font-black tracking-widest uppercase">
              {item}
              <span className="w-1 h-1 rounded-full bg-black/30 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ── ÚLTIMOS ARTIGOS ── */}
      {articles.length > 0 && (
        <section className="py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">Publicados Hoje</p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                  Últimos Artigos<br />
                  <span className="text-white/30">Científicos</span>
                </h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-brand-green transition-colors uppercase tracking-widest">
                Ver arquivo completo <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/10 text-white/60 text-sm font-semibold rounded-full hover:border-brand-green/40 hover:text-white transition-all"
              >
                Ver todos os artigos <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── PORQUÊ ── */}
      <section className="py-28 bg-[#0D0D0D] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">A nossa missão</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
              Informação Científica.<br />
              <span className="text-white/30">Para Todo o Corredor.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="group p-6 rounded-xl border border-white/5 hover:border-brand-green/20 bg-white/[0.02] hover:bg-brand-green/3 transition-all card-hover">
                <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center mb-5">
                  {p.icon}
                </div>
                <h3 className="font-black text-white mb-3 text-sm leading-snug">{p.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS ── */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">Categorias</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                Explora por<br />
                <span className="text-white/30">Tema</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/blog?category=${encodeURIComponent(c.name)}`}
                className="group flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-brand-green/30 bg-white/[0.02] hover:bg-brand-green/5 transition-all"
              >
                <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">{c.name}</span>
                <span className="text-xs font-mono text-white/25 group-hover:text-brand-green transition-colors">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODALIDADES ── */}
      <section className="py-28 bg-[#0D0D0D] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">Metodologias</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                Aprende Cada<br />
                <span className="text-white/30">Modalidade</span>
              </h2>
            </div>
            <Link href="/metodologias" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-brand-green transition-colors uppercase tracking-widest">
              Ver todas <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((m) => (
              <Link
                key={m.name}
                href="/metodologias"
                className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-brand-green/30 transition-all card-hover aspect-[3/4]"
                style={{ backgroundImage: `url(${m.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/10 transition-colors duration-300" />
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono text-white/40">{m.num}</span>
                    <ArrowUpRight size={14} className="text-white/0 group-hover:text-brand-green transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-brand-green/70 group-hover:text-brand-green transition-colors">{m.tag}</span>
                    <h3 className="text-sm font-black text-white leading-tight mt-1 mb-1.5">{m.name}</h3>
                    <p className="text-[10px] text-white/40 leading-relaxed group-hover:text-white/70 transition-colors">{m.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA NEWSLETTER / ARQUIVO ── */}
      <section className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl overflow-hidden border border-brand-green/15 p-12 sm:p-16 text-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1400&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/92 via-black/85 to-black/90" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-brand-green/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative">
              <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-5">Arquivo Completo</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6">
                Centenas de Artigos.<br />
                <span className="text-brand-green">Todos Gratuitos.</span>
              </h2>
              <p className="text-white/45 max-w-lg mx-auto mb-10 leading-relaxed">
                Pesquisa por categoria, tema ou palavra-chave. Todo o historial de artigos
                científicos sobre corrida disponível para consulta a qualquer momento.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-black text-sm font-black rounded-full hover:bg-brand-green/90 transition-all hover:scale-105 active:scale-95"
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
