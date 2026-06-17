import Link from 'next/link'
import { getLatestArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/ArticleCard'
import { ArrowRight, Zap, Target, TrendingUp, Shield } from 'lucide-react'

const modalities = [
  { name: '5km', desc: 'Velocidade e resistência láctica', icon: '⚡' },
  { name: '10km', desc: 'Equilíbrio entre potência e aeróbio', icon: '🎯' },
  { name: 'Meia Maratona', desc: 'Limiar aeróbio e eficiência', icon: '📈' },
  { name: 'Maratona', desc: 'Gestão de energia e periodização', icon: '🏆' },
  { name: 'Trail Running', desc: 'Técnica de montanha e nutrição', icon: '🏔️' },
  { name: 'Ultra Trail', desc: 'Preparação mental e logística', icon: '🌙' },
  { name: 'Corrida de Montanha', desc: 'Força específica e técnica', icon: '⛰️' },
  { name: 'Meio Fundo', desc: 'VO2max e potência anaeróbia', icon: '🔥' },
]

const features = [
  {
    icon: <Zap className="w-5 h-5 text-brand-green" />,
    title: 'Metodologia Científica',
    desc: 'Treino baseado em fisiologia do exercício, zonas de intensidade e periodização comprovada.',
  },
  {
    icon: <Target className="w-5 h-5 text-brand-green" />,
    title: 'Planos Personalizados',
    desc: 'Cada atleta é único. Os planos adaptam-se ao teu nível, disponibilidade e objetivos.',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-brand-green" />,
    title: 'Evolução Contínua',
    desc: 'Monitorização regular, ajustes ao plano e feedback constante para garantir progressão.',
  },
  {
    icon: <Shield className="w-5 h-5 text-brand-green" />,
    title: 'Prevenção de Lesões',
    desc: 'Equilíbrio entre carga e recuperação. Fortalecimento muscular integrado no plano de treino.',
  },
]

export default async function HomePage() {
  const articles = await getLatestArticles(3)

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-gray to-brand-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,200,150,0.12)_0%,_transparent_60%)]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-green/30 bg-brand-green/10 text-brand-green text-xs font-mono font-semibold tracking-wider mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              COACHING ONLINE — VAGAS ABERTAS
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6">
              CORRE MAIS{' '}
              <span className="text-brand-green">RÁPIDO.</span>
              <br />
              VAI MAIS{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-blue-400">
                LONGE.
              </span>
            </h1>

            <p className="text-lg text-brand-text leading-relaxed max-w-xl mb-10">
              Metodologias científicas de treino para corredores de todos os níveis.
              Da pista ao trail, do 5km ao ultra — cada quilómetro com propósito.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/metodologias"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-black font-bold rounded-md hover:bg-brand-green/90 transition-all hover:gap-3 text-sm"
              >
                Explorar Metodologias
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/planos"
                className="inline-flex items-center gap-2 px-6 py-3 border border-brand-border text-white font-semibold rounded-md hover:border-brand-green hover:text-brand-green transition-colors text-sm"
              >
                Ver Planos de Treino
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 flex flex-wrap gap-8">
              {[
                { value: '10+', label: 'Anos de experiência' },
                { value: '8', label: 'Modalidades de treino' },
                { value: '100%', label: 'Baseado em ciência' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-black text-brand-green">{s.value}</div>
                  <div className="text-xs text-brand-text mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MODALITIES GRID ── */}
      <section className="py-24 bg-brand-gray">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-3">
              METODOLOGIAS
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Treino Específico para{' '}
              <span className="text-brand-green">Cada Distância</span>
            </h2>
            <p className="mt-3 text-brand-text max-w-xl">
              Cada modalidade tem a sua fisiologia, intensidades e estratégia. Aprende a treinar de forma inteligente.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {modalities.map((m) => (
              <Link
                key={m.name}
                href="/metodologias"
                className="group p-5 rounded-lg border border-brand-border bg-brand-muted hover:border-brand-green/50 hover:bg-brand-green/5 transition-all"
              >
                <div className="text-2xl mb-3">{m.icon}</div>
                <div className="text-sm font-bold text-white mb-1">{m.name}</div>
                <div className="text-xs text-brand-text leading-relaxed">{m.desc}</div>
                <div className="mt-3 text-brand-green text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Ver metodologia <ArrowRight size={10} />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/metodologias"
              className="inline-flex items-center gap-2 text-brand-green text-sm font-semibold hover:gap-3 transition-all"
            >
              Ver todas as metodologias <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-3">
              PORQUÊ PERFORMANCE RUNNING
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Treino que Funciona.{' '}
              <span className="text-brand-green">Resultados Reais.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-lg border border-brand-border bg-brand-muted"
              >
                <div className="w-10 h-10 rounded-md bg-brand-green/10 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-brand-text text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ── */}
      {articles.length > 0 && (
        <section className="py-24 bg-brand-gray">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-3">
                  BLOG
                </p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Artigos de <span className="text-brand-green">Alta Performance</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:flex items-center gap-2 text-sm text-brand-text hover:text-brand-green transition-colors"
              >
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/blog" className="text-brand-green text-sm font-semibold">
                Ver todos os artigos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-2xl border border-brand-green/20 bg-gradient-to-br from-brand-green/5 to-transparent">
            <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-4">
              COACHING ONLINE
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Pronto para Atingir o Teu{' '}
              <span className="text-brand-green">Máximo Potencial?</span>
            </h2>
            <p className="text-brand-text max-w-xl mx-auto mb-8 leading-relaxed">
              Plano de treino personalizado, acompanhamento semanal, análise de dados
              e ajustes contínuos. Tudo o que precisas para evoluir de forma consistente.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-black font-bold rounded-md hover:bg-brand-green/90 transition-all hover:gap-3"
            >
              Iniciar Coaching Online
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
