import Link from 'next/link'
import { getLatestArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/ArticleCard'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

const modalities = [
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
  'CORRIDA DE ESTRADA', 'TRAIL RUNNING', 'ATLETISMO', 'COACHING ONLINE',
  'PERIODIZAÇÃO', 'VO2MAX', 'CORRIDA DE MONTANHA', 'ULTRA TRAIL',
  'CORRIDA DE ESTRADA', 'TRAIL RUNNING', 'ATLETISMO', 'COACHING ONLINE',
  'PERIODIZAÇÃO', 'VO2MAX', 'CORRIDA DE MONTANHA', 'ULTRA TRAIL',
]

const stats = [
  { value: '10+', label: 'Anos de experiência' },
  { value: '8', label: 'Modalidades' },
  { value: '200+', label: 'Atletas acompanhados' },
  { value: '100%', label: 'Baseado em ciência' },
]

const pillars = [
  {
    num: '01',
    title: 'Fisiologia Aplicada',
    desc: 'Cada plano é construído sobre zonas de intensidade precisas, VO2max, limiar anaeróbio e economia de corrida. Treina com dados, não com intuição.',
  },
  {
    num: '02',
    title: 'Periodização Inteligente',
    desc: 'Ciclos de carga e recuperação estruturados para pico de forma no momento certo. Da base geral à especificidade competitiva.',
  },
  {
    num: '03',
    title: 'Individualização Total',
    desc: 'Não existem dois atletas iguais. O plano adapta-se ao teu histórico, disponibilidade, dados de GPS e objetivos específicos.',
  },
  {
    num: '04',
    title: 'Prevenção de Lesões',
    desc: 'Monitorização da carga de treino, fortalecimento muscular integrado e gestão da fadiga para garantir continuidade e progressão.',
  },
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-dark to-transparent" />
        {/* Green accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />
        {/* Vertical line accent */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-green/30 to-transparent hidden lg:block" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
          <div className="max-w-4xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-green/25 bg-brand-green/8 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-brand-green text-xs font-mono font-bold tracking-widest uppercase">
                Vagas Abertas — Coaching Online 2025
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-7xl lg:text-[6rem] font-black leading-[0.9] tracking-tighter mb-8">
              <span className="block text-white">CORRE MAIS</span>
              <span className="block text-brand-green">RÁPIDO.</span>
              <span className="block text-white/30 text-5xl sm:text-6xl lg:text-7xl mt-2">VAI MAIS LONGE.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-lg mb-12">
              Metodologias científicas de treino para corredores de todos os níveis.
              Da pista ao ultra trail — cada quilómetro com propósito e dados.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/planos"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-brand-green/90 transition-all hover:gap-3 hover:scale-105 active:scale-95"
              >
                Ver Planos de Treino
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/metodologias"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/10 text-white/70 text-sm font-semibold rounded-full hover:border-brand-green/40 hover:text-white transition-all"
              >
                Explorar Metodologias
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-20 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s) => (
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
            <span
              key={i}
              className="inline-flex items-center gap-6 mx-6 text-black text-xs font-black tracking-widest uppercase"
            >
              {item}
              <span className="w-1 h-1 rounded-full bg-black/30 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ── MODALITIES ── */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">
                Metodologias
              </p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                Treino Específico<br />
                <span className="text-white/30">para Cada Distância</span>
              </h2>
            </div>
            <Link
              href="/metodologias"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-brand-green transition-colors uppercase tracking-widest"
            >
              Ver todas <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modalities.map((m) => (
              <Link
                key={m.name}
                href="/metodologias"
                className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-brand-green/30 transition-all card-hover aspect-[3/4]"
                style={{
                  backgroundImage: `url(${m.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/10 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono text-white/40">{m.num}</span>
                    <ArrowUpRight
                      size={14}
                      className="text-white/0 group-hover:text-brand-green transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  {/* Bottom */}
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-brand-green/70 group-hover:text-brand-green transition-colors">
                      {m.tag}
                    </span>
                    <h3 className="text-sm font-black text-white leading-tight mt-1 mb-1.5">
                      {m.name}
                    </h3>
                    <p className="text-[10px] text-white/40 leading-relaxed group-hover:text-white/70 transition-colors">
                      {m.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="py-28 bg-[#0D0D0D] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">
              A Nossa Abordagem
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
              Treino que Funciona.<br />
              <span className="text-white/30">Resultados Reais.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="group relative p-6 rounded-xl border border-white/5 hover:border-brand-green/20 bg-white/[0.02] hover:bg-brand-green/3 transition-all card-hover"
              >
                <div className="text-4xl font-black text-white/5 group-hover:text-brand-green/10 transition-colors mb-4 font-mono">
                  {p.num}
                </div>
                <h3 className="font-black text-white mb-3 text-sm leading-snug">{p.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ── */}
      {articles.length > 0 && (
        <section className="py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">
                  Blog
                </p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                  Conhecimento de<br />
                  <span className="text-white/30">Alta Performance</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white/40 hover:text-brand-green transition-colors uppercase tracking-widest"
              >
                Ver todos <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-28 bg-[#0D0D0D] border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl overflow-hidden border border-brand-green/15 p-12 sm:p-16 text-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1400&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/92 via-black/85 to-black/90" />
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-brand-green/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative">
              <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-5">
                Coaching Online
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6">
                Pronto para o Teu<br />
                <span className="text-brand-green">Máximo Potencial?</span>
              </h2>
              <p className="text-white/45 max-w-lg mx-auto mb-10 leading-relaxed">
                Plano personalizado, acompanhamento semanal, análise de dados de GPS
                e ajustes contínuos. Tudo o que precisas para evoluir de forma consistente.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-black text-sm font-black rounded-full hover:bg-brand-green/90 transition-all hover:scale-105 active:scale-95"
                >
                  Iniciar Coaching Online
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/planos"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-white/60 text-sm font-semibold rounded-full hover:border-white/20 hover:text-white transition-all"
                >
                  Ver Planos e Preços
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
