import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Planos de Treino',
  description:
    'Planos de treino personalizados para corrida de estrada, trail running e atletismo. Coaching online com acompanhamento semanal, análise de dados e ajustes contínuos.',
}

const plans = [
  {
    id: 'base',
    name: 'Plano Base',
    price: '59€',
    period: '/mês',
    tag: 'MAIS POPULAR',
    highlight: true,
    desc: 'Para corredores que querem estrutura e progressão consistente.',
    features: [
      'Plano de treino semanal personalizado',
      'Zonas de intensidade calculadas (FC ou pace)',
      'Revisão semanal do plano',
      'Acesso a biblioteca de treinos',
      'Suporte via mensagem (48h)',
    ],
    ideal: 'Corredores amadores, primeiros objetivos de prova',
    cta: 'Começar Agora',
  },
  {
    id: 'performance',
    name: 'Plano Performance',
    price: '99€',
    period: '/mês',
    tag: 'RECOMENDADO',
    highlight: false,
    desc: 'Para atletas que querem alcançar o seu potencial máximo.',
    features: [
      'Tudo do Plano Base',
      'Análise de dados Garmin/Strava semanal',
      'Chamada de vídeo mensal (30min)',
      'Ajustes de plano em tempo real',
      'Plano de nutrição básico para treino',
      'Suporte prioritário (24h)',
    ],
    ideal: 'Atletas com objetivos de tempo, qualificações para provas',
    cta: 'Escolher Performance',
  },
  {
    id: 'elite',
    name: 'Plano Elite',
    price: '179€',
    period: '/mês',
    tag: 'PREMIUM',
    highlight: false,
    desc: 'Acompanhamento máximo para resultados máximos.',
    features: [
      'Tudo do Plano Performance',
      'Análise biomecânica por vídeo',
      'Chamadas ilimitadas de suporte',
      'Plano de pico e tapering detalhado',
      'Estratégia completa de prova',
      'Revisão diária de métricas',
      'Plano de força complementar',
    ],
    ideal: 'Atletas de competição, recordes pessoais ambiciosos',
    cta: 'Candidatar-se',
  },
]

const faqs = [
  {
    q: 'O plano adapta-se ao meu nível atual?',
    a: 'Sim. Antes de começar, faço uma avaliação inicial: histórico de corrida, provas realizadas, disponibilidade semanal e objetivos. O plano é construído à medida.',
  },
  {
    q: 'Preciso de equipamento específico?',
    a: 'Um cardiofrequencímetro é recomendado mas não obrigatório. Um GPS (Garmin, Apple Watch, etc.) facilita muito a análise. O mínimo necessário é um smartphone com app de corrida.',
  },
  {
    q: 'E se não conseguir cumprir um treino?',
    a: 'Acontece — vida real é assim. Entras em contacto e ajustamos o plano. A consistência a longo prazo é mais importante do que não falhar nenhuma sessão.',
  },
  {
    q: 'Posso mudar de plano mais tarde?',
    a: 'Sim, sem custos de alteração. Podes fazer upgrade ou downgrade a qualquer momento.',
  },
  {
    q: 'Há um período mínimo de compromisso?',
    a: 'O mínimo recomendado é 3 meses — é o tempo mínimo para ver resultados fisiológicos reais. Mas podes cancelar a qualquer momento.',
  },
]

export default function PlanosPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-brand-gray to-brand-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-4">
            COACHING ONLINE
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-5">
            Planos para <span className="text-brand-green">Cada Atleta</span>
          </h1>
          <p className="text-brand-text text-base max-w-xl mx-auto">
            Desde a estrutura base até ao acompanhamento de elite — escolhe o nível
            que se adapta aos teus objetivos e disponibilidade.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-xl border p-7 ${
                  p.highlight
                    ? 'border-brand-green bg-brand-green/5'
                    : 'border-brand-border bg-brand-muted'
                }`}
              >
                {/* Tag */}
                <div className="mb-5">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wider ${
                    p.highlight
                      ? 'bg-brand-green text-black'
                      : 'border border-brand-border text-brand-text'
                  }`}>
                    {p.tag}
                  </span>
                </div>

                <h2 className="text-xl font-black mb-1">{p.name}</h2>
                <p className="text-brand-text text-xs mb-5">{p.desc}</p>

                {/* Price */}
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black text-brand-green">{p.price}</span>
                  <span className="text-brand-text text-sm mb-1">{p.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-brand-text">
                      <Check size={14} className="text-brand-green mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mb-5 p-3 rounded-md bg-brand-dark border border-brand-border">
                  <p className="text-xs text-brand-text">
                    <span className="text-white font-semibold">Ideal para: </span>
                    {p.ideal}
                  </p>
                </div>

                <Link
                  href="/contacto"
                  className={`w-full text-center py-3 rounded-md font-bold text-sm transition-all ${
                    p.highlight
                      ? 'bg-brand-green text-black hover:bg-brand-green/90'
                      : 'border border-brand-border text-white hover:border-brand-green hover:text-brand-green'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-brand-text">
            Todos os planos incluem período de avaliação inicial gratuita (15 min de chamada).{' '}
            <Link href="/contacto" className="text-brand-green hover:underline">Agendar agora</Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-brand-gray">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-2xl font-black mb-8">
            Perguntas <span className="text-brand-green">Frequentes</span>
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="p-5 rounded-lg border border-brand-border bg-brand-muted">
                <p className="font-bold text-white text-sm mb-2">{f.q}</p>
                <p className="text-brand-text text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black mb-4">Tens Dúvidas? Fala Comigo.</h2>
          <p className="text-brand-text mb-8">
            Uma conversa inicial de 15 minutos é gratuita e sem compromisso.
            Explica-me os teus objetivos e sugiro o plano mais adequado.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-black font-bold rounded-md hover:bg-brand-green/90 transition-all hover:gap-3"
          >
            Agendar Chamada Gratuita <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
