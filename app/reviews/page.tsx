import type { Metadata } from 'next'
import { ArrowRight, Quote, Star } from 'lucide-react'
import Link from 'next/link'

// Sem isto, a página herdava o título/descrição genéricos da homepage —
// perdia SEO específico para quem procura "testemunhos performance running"
// ou resultados reais de corredores.
export const metadata: Metadata = {
  title: 'Testemunhos — Corredores que Cresceram',
  description:
    'Histórias reais de corredores que pediram uma consulta e transformaram a sua performance: maratona, trail e prevenção de lesões, com resultados concretos.',
  alternates: { canonical: 'https://www.performancerunning.pt/reviews' },
  openGraph: {
    title: 'Testemunhos — Corredores que Cresceram | Performance Running',
    description: 'Resultados reais de corredores que treinaram com acompanhamento científico.',
    images: [{ url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const REVIEWS = [
  {
    name: 'Miguel Ferreira',
    age: 34,
    city: 'Porto',
    job: 'Engenheiro',
    distance: 'Maratona',
    result: 'De 3:58 para 3:24',
    period: '6 meses',
    stars: 5,
    text: 'Treinava há 3 anos sem grandes progressos. Pedi uma consulta sobre periodização e percebi que estava a acumular demasiado volume sem progressão de intensidade. Com uma estrutura mais inteligente — menos km, mais qualidade — baixei 34 minutos na maratona de Lisboa. A análise foi específica, baseada em dados reais, sem teoria genérica.',
    tag: 'Maratona · PB',
  },
  {
    name: 'Ana Sousa',
    age: 29,
    city: 'Braga',
    job: 'Professora',
    distance: 'Ultra Trail 50km',
    result: 'Primeira conclusão',
    period: '8 meses',
    stars: 5,
    text: 'Nunca tinha feito mais de 21km em competição e quis atacar o Ultra Trail Gerês 50km. Fiquei com medo de não aguentar. A consulta deu-me um plano de progressão de volume, estratégia de nutrição em corrida e mentalidade para gerir o sofrimento nas últimas horas. Terminei em 8h22 — emocionada do início ao fim.',
    tag: 'Trail · Primeira vez',
  },
  {
    name: 'Rui Santos',
    age: 41,
    city: 'Lisboa',
    job: 'Médico',
    distance: 'Corrida de Estrada',
    result: 'Sem lesões há 18 meses',
    period: 'Contínuo',
    stars: 5,
    text: 'Tendinopatia de Aquiles recorrente há 2 anos. Fui a vários fisioterapeutas mas a lesão voltava sempre. A análise que recebi explicou-me porquê: voltava ao treino cedo de mais e sem trabalho excêntrico progressivo. Com o protocolo de carga gradual sugerido fiquei sem dor ao fim de 10 semanas. Já correram 18 meses sem recorrência.',
    tag: 'Lesões · Prevenção',
  },
  {
    name: 'Inês Rodrigues',
    age: 26,
    city: 'Coimbra',
    job: 'Enfermeira',
    distance: '10km',
    result: 'De 52 para 43 min',
    period: '5 meses',
    stars: 5,
    text: 'Corria por prazer mas queria progressão real nos 10km. A consulta mostrou-me que corria quase sempre no mesmo ritmo moderado — nunca alta, nunca baixa intensidade. Com a introdução de sessões de limiar e intervalados, baixei 9 minutos em 5 meses sem aumentar o volume semanal. Apercebi-me que corria muito mas treinava pouco.',
    tag: '10km · Progressão',
  },
  {
    name: 'João Costa',
    age: 58,
    city: 'Setúbal',
    job: 'Empresário',
    distance: 'Maratona',
    result: 'Primeira maratona aos 58 anos',
    period: '10 meses',
    stars: 5,
    text: 'Com 58 anos achava que era tarde para uma maratona. A consulta mostrou-me o contrário: com treino inteligente, mais recuperação entre sessões e atenção à força muscular, o corpo adapta-se a qualquer idade. Terminei a Maratona de Lisboa em 4h47. A sensação de cruzar a meta do Marquês de Pombal foi indescritível.',
    tag: 'Maratona · Veterano',
  },
  {
    name: 'Carolina Monteiro',
    age: 23,
    city: 'Faro',
    job: 'Estudante',
    distance: 'Trail 25km',
    result: 'Do zero ao trail em 5 meses',
    period: '5 meses',
    stars: 5,
    text: 'Comecei a correr em março sem nunca ter feito mais de 5km. Em agosto completei o Trail das Serras de Faro 25km. A consulta foi essencial para perceber como progredir de forma segura sem me lesionar. A progressão de volume semanal que me foi sugerida foi conservadora mas eficaz — nunca fiquei lesionada durante todo o processo.',
    tag: 'Trail · Iniciante',
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={11} className="fill-brand-green text-brand-green" />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative pt-32 pb-24 border-b border-white/5 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/97 via-black/88 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-5">
              Testemunhos · Resultados reais
            </p>
            <h1
              className="font-display text-white leading-none mb-6"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              CORREDORES<br />
              <span className="text-brand-green">QUE CRESCERAM.</span>
            </h1>
            <p className="text-white/45 text-base leading-relaxed max-w-lg">
              Histórias reais de corredores que pediram uma consulta e transformaram a sua performance.
              Diferentes idades, objetivos e pontos de partida. Resultados concretos.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-b border-white/5" style={{ background: '#080808' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '100%', label: 'Consultas gratuitas' },
              { value: '24–48h', label: 'Tempo de resposta' },
              { value: '5★', label: 'Avaliação média' },
              { value: '+200', label: 'Corredores analisados' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-brand-green text-3xl md:text-4xl leading-none mb-2">{value}</p>
                <p className="text-white/30 text-xs font-mono uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS GRID ── */}
      <section className="py-20" style={{ background: '#050505' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <article
                key={r.name}
                className="flex flex-col p-7 rounded-2xl border border-white/5 bg-white/[0.015] hover:border-brand-green/20 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder — initials */}
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-green font-black text-sm">
                        {r.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">{r.name}</p>
                      <p className="text-white/30 text-[11px]">{r.age} anos · {r.city}</p>
                    </div>
                  </div>
                  <Stars n={r.stars} />
                </div>

                {/* Tag */}
                <span className="inline-block self-start px-2.5 py-1 rounded-full text-[9px] font-bold font-mono uppercase tracking-widest text-brand-green border border-brand-green/25 bg-brand-green/5 mb-4">
                  {r.tag}
                </span>

                {/* Quote */}
                <Quote size={16} className="text-brand-green/20 mb-3 flex-shrink-0" />
                <p className="text-white/55 text-sm leading-relaxed flex-1 mb-6">{r.text}</p>

                {/* Result */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-brand-green font-black text-base">{r.result}</p>
                  <p className="text-white/25 text-[11px] font-mono mt-0.5">{r.distance} · {r.period}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 border-t border-white/5" style={{ background: '#080808' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-5">
            A tua vez
          </p>
          <h2
            className="font-display text-white leading-none mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            QUAL É O TEU<br />
            <span className="text-brand-green">OBJETIVO?</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-10">
            Uma análise personalizada pode ser o ponto de viragem que procuras.
            Gratuita, sem compromisso, baseada na tua situação real.
          </p>
          <Link
            href="/consulta"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all hover:scale-105 active:scale-95"
          >
            Pedir consulta gratuita <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  )
}
