import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Modalidades de Corrida — Guias Científicos | Performance Running',
  description: 'Guias científicos completos para todas as modalidades: maratona, meia maratona, 10km, 5km, trail running, ultra trail e corrida de montanha. Fisiologia, treino e periodização.',
  alternates: { canonical: 'https://www.performancerunning.pt/modalidades' },
}

const MODALIDADES = [
  {
    slug: 'maratona',
    name: 'Maratona',
    dist: '42.195 km',
    tag: 'Resistência',
    desc: 'Gestão de energia, periodização e nutrição em prova para os 42 km.',
    img: 'https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?w=800&q=75',
    color: 'from-orange-500/20 to-red-500/5',
  },
  {
    slug: 'meia-maratona',
    name: 'Meia Maratona',
    dist: '21.097 km',
    tag: 'Limiar',
    desc: 'Economia de corrida e resistência de limiar para os 21 km perfeitos.',
    img: 'https://images.unsplash.com/photo-1613936360976-8f35cf0e5461?w=800&q=75',
    color: 'from-blue-500/20 to-indigo-500/5',
  },
  {
    slug: '10km',
    name: '10 km',
    dist: '10 km',
    tag: 'Velocidade-Resistência',
    desc: 'O equilíbrio perfeito entre potência aeróbia e resistência de limiar.',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=75',
    color: 'from-green-500/20 to-teal-500/5',
  },
  {
    slug: '5km',
    name: '5 km',
    dist: '5 km',
    tag: 'VO2max',
    desc: 'Máxima potência aeróbia e capacidade láctica para a prova mais popular.',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=75',
    color: 'from-yellow-500/20 to-amber-500/5',
  },
  {
    slug: 'trail-running',
    name: 'Trail Running',
    dist: '15–80 km',
    tag: 'Técnica',
    desc: 'Técnica de montanha, força específica e adaptação ao terreno natural.',
    img: 'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=800&q=75',
    color: 'from-emerald-500/20 to-green-500/5',
  },
  {
    slug: 'ultra-trail',
    name: 'Ultra Trail',
    dist: '42 km+',
    tag: 'Mental',
    desc: 'Preparação física, mental, nutricional e logística para ultramaratonas.',
    img: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&q=75',
    color: 'from-purple-500/20 to-violet-500/5',
  },
  {
    slug: 'corrida-montanha',
    name: 'Corrida de Montanha',
    dist: 'VK / Sky',
    tag: 'Força',
    desc: 'Explosividade, relação peso/potência e técnica de subida para sky races.',
    img: 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=800&q=75',
    color: 'from-stone-500/20 to-gray-500/5',
  },
  {
    slug: 'meio-fundo',
    name: 'Meio Fundo',
    dist: '800m–3000m',
    tag: 'Velocidade',
    desc: 'VO2max, capacidade láctica e velocidade para as provas de pista.',
    img: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&q=75',
    color: 'from-red-500/20 to-rose-500/5',
  },
]

export default function ModalidadesPage() {
  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/97 via-black/90 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-4">
            Ciência da Performance
          </p>
          <h1
            className="font-display text-white leading-none mb-5"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            MODALIDADES
          </h1>
          <p className="text-white/45 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
            Cada distância tem a sua fisiologia, as suas zonas de treino, os seus erros específicos.
            Escolhe a tua modalidade e descobre o que a ciência diz sobre como treinar para ela.
          </p>
          <div className="flex items-center gap-3 text-xs text-white/25 font-mono">
            <span>{MODALIDADES.length} modalidades</span>
            <span>·</span>
            <span>Do 800m ao Ultra Trail</span>
          </div>
        </div>
      </section>

      {/* ── GRID DE MODALIDADES ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODALIDADES.map((m) => (
            <Link
              key={m.slug}
              href={`/modalidades/${m.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-brand-green/25 transition-all"
              style={{ minHeight: '280px' }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${m.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 group-hover:from-black/90 transition-all" />
              <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-100 transition-all`} />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-5">
                <div className="flex items-start justify-between">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest text-brand-green border border-brand-green/20 bg-brand-green/10">
                    {m.tag}
                  </span>
                  <span className="text-[10px] font-mono text-white/25">{m.dist}</span>
                </div>

                <div>
                  <h2 className="font-display text-white text-3xl leading-none mb-2 group-hover:text-brand-green transition-colors">
                    {m.name.toUpperCase()}
                  </h2>
                  <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2">{m.desc}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-white/25 group-hover:text-brand-green transition-colors uppercase tracking-widest">
                    Ver guia <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/97 via-black/92 to-black/70" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-4">
            Base de Conhecimento
          </p>
          <h2
            className="font-display text-white leading-none mb-5"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
          >
            APROFUNDA O<br />
            <span className="text-brand-green">CONHECIMENTO</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xl mx-auto mb-8">
            3 novos artigos publicados todos os dias — fisiologia, treino, nutrição,
            biomecânica e psicologia desportiva aplicados à corrida.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-green text-black font-black rounded-full hover:bg-white transition-all text-sm"
          >
            Explorar artigos científicos <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
