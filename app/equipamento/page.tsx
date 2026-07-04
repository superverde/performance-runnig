import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Star, Footprints, Watch, HeartPulse, Zap, Package, type LucideIcon } from 'lucide-react'
import { Redis } from '@upstash/redis'
import { sapatos, relogios, sensoresFc, nutricao, acessorios } from '@/lib/products'
import { selectRotatingProducts, getCurrentRotationBucket } from '@/lib/rotation'

// Regenera a cada 6 horas — garante que a ordenação por clicks e a rotação de produtos ficam atualizadas
export const revalidate = 21600

export const metadata: Metadata = {
  title: 'Equipamento de Corrida — Reviews e Recomendações',
  description:
    'Reviews honestas de equipamento de corrida: sapatos, relógios GPS, meias técnicas e acessórios. Testado e recomendado pela equipa Performance Running.',
  keywords: [
    'melhores sapatos corrida 2025', 'review sapatos trail', 'relógio GPS corrida',
    'equipamento corrida portugal', 'garmin forerunner review', 'hoka review',
    'on running review', 'meias corrida', 'equipamento trail running',
  ],
  alternates: { canonical: 'https://www.performancerunning.pt/equipamento' },
  openGraph: {
    title: 'Equipamento de Corrida — Reviews Performance Running',
    description: 'Reviews honestas de sapatos, relógios GPS e equipamento técnico de corrida.',
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const SITE_URL = 'https://www.performancerunning.pt'

/**
 * Quantos produtos mostrar por categoria em cada ciclo de rotação (múltiplo
 * das colunas da grid, para não deixar filas incompletas) e quantos dos
 * mais clicados ficam sempre fixos ("pinned") independentemente da rotação.
 */
const ROTATION_CONFIG = {
  sapatos: { visibleCount: 6, pinnedCount: 2 },
  relogios: { visibleCount: 4, pinnedCount: 2 },
  sensoresFc: { visibleCount: 3, pinnedCount: 1 },
  nutricao: { visibleCount: 6, pinnedCount: 2 },
  acessorios: { visibleCount: 8, pinnedCount: 2 },
} as const

/** Slug idêntico ao usado no track-click — tem de ser consistente */
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/** Converte um link de afiliado num URL de tracking interno */
function trackedLink(productName: string, affiliateUrl: string): string {
  return `/api/track-click?product=${encodeURIComponent(toSlug(productName))}&url=${encodeURIComponent(affiliateUrl)}`
}

/**
 * Ordena os produtos pelo número de clicks reais (mais clicado primeiro).
 * Produtos sem clicks mantêm a ordem original entre si (sort estável).
 */
function sortByClicks<T extends { name: string }>(
  arr: T[],
  clicks: Record<string, number>
): T[] {
  return [...arr].sort((a, b) => {
    const ca = clicks[toSlug(a.name)] ?? 0
    const cb = clicks[toSlug(b.name)] ?? 0
    return cb - ca // decrescente; empate → ordem original (sort estável)
  })
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < n ? 'text-brand-green fill-brand-green' : 'text-white/15'}
        />
      ))}
    </span>
  )
}

/**
 * Imagem de produto com fallback estilizado.
 * Produtos novos ainda sem imagem Amazon confirmada (`img: ''`) mostram um
 * placeholder consistente com o tema do site em vez de uma imagem partida
 * ou incorreta — ver nota em lib/products.ts sobre o processo de confirmação.
 */
function ProductImage({
  src,
  alt,
  icon: Icon,
}: {
  src: string
  alt: string
  icon: LucideIcon
}) {
  if (!src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/[0.06] to-white/[0.01] text-white/20">
        <Icon size={30} strokeWidth={1.5} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Imagem em breve</span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  )
}

// Rotação semanal: cada semana destaca uma categoria diferente
const ROTACAO_SEMANAL = [
  { semana: 0, titulo: 'Sapatos de Estrada', subtitulo: 'Esta semana em destaque', ancora: '#sapatos', emoji: '👟', cor: '#00ff87' },
  { semana: 1, titulo: 'Relógios GPS', subtitulo: 'Esta semana em destaque', ancora: '#relogios', emoji: '⌚', cor: '#3b82f6' },
  { semana: 2, titulo: 'Nutrição Desportiva', subtitulo: 'Esta semana em destaque', ancora: '#nutricao', emoji: '⚡', cor: '#f59e0b' },
  { semana: 3, titulo: 'Acessórios Essenciais', subtitulo: 'Esta semana em destaque', ancora: '#acessorios', emoji: '🎽', cor: '#8b5cf6' },
]

function getDestaqueSemanul() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const weekNumber = Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 86_400_000))
  return ROTACAO_SEMANAL[weekNumber % ROTACAO_SEMANAL.length]
}

export default async function EquipamentoPage() {
  const destaque = getDestaqueSemanul()
  const bucket = getCurrentRotationBucket()

  // Lê clicks totais do Redis — ordena produtos pelo que os utilizadores mais clicam
  let clicks: Record<string, number> = {}
  try {
    const redis = Redis.fromEnv()
    const raw = await redis.hgetall('clicks:total')
    if (raw) clicks = raw as Record<string, number>
  } catch {
    // Redis indisponível → mantém ordem original sem quebrar a página
  }

  // 1) ordena por clicks reais, 2) seleciona o subconjunto do ciclo de rotação atual
  const sapatos_r = selectRotatingProducts(
    sortByClicks(sapatos, clicks), clicks, toSlug,
    ROTATION_CONFIG.sapatos.visibleCount, ROTATION_CONFIG.sapatos.pinnedCount, 'sapatos', bucket
  )
  const relogios_r = selectRotatingProducts(
    sortByClicks(relogios, clicks), clicks, toSlug,
    ROTATION_CONFIG.relogios.visibleCount, ROTATION_CONFIG.relogios.pinnedCount, 'relogios', bucket
  )
  const sensoresFc_r = selectRotatingProducts(
    sortByClicks(sensoresFc, clicks), clicks, toSlug,
    ROTATION_CONFIG.sensoresFc.visibleCount, ROTATION_CONFIG.sensoresFc.pinnedCount, 'sensoresFc', bucket
  )
  const nutricao_r = selectRotatingProducts(
    sortByClicks(nutricao, clicks), clicks, toSlug,
    ROTATION_CONFIG.nutricao.visibleCount, ROTATION_CONFIG.nutricao.pinnedCount, 'nutricao', bucket
  )
  const acessorios_r = selectRotatingProducts(
    sortByClicks(acessorios, clicks), clicks, toSlug,
    ROTATION_CONFIG.acessorios.visibleCount, ROTATION_CONFIG.acessorios.pinnedCount, 'acessorios', bucket
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Equipamento de Corrida — Reviews Performance Running',
    description: 'Reviews honestas de sapatos, relógios GPS e equipamento técnico de corrida.',
    url: `${SITE_URL}/equipamento`,
    inLanguage: 'pt-PT',
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Equipamento', item: `${SITE_URL}/equipamento` },
    ],
  }

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* ── Hero ── */}
      <div
        className="relative pt-28 pb-16 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-green mb-4 font-mono">
            Reviews Honestas
          </p>
          <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            EQUIPAMENTO
          </h1>
          <p className="text-white/50 max-w-xl text-sm leading-relaxed">
            Testamos e avaliamos o equipamento mais relevante para corredores portugueses.
            Sem patrocínios que influenciem as notas. Links de afiliado ajudam a manter o site gratuito.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── Destaque da Semana ── */}
        <a href={destaque.ancora} className="block group">
          <div
            className="rounded-2xl p-6 sm:p-8 border flex items-center justify-between gap-4 transition-all hover:scale-[1.01]"
            style={{ borderColor: destaque.cor + '30', background: destaque.cor + '08' }}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1 font-mono" style={{ color: destaque.cor }}>
                {destaque.subtitulo}
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {destaque.emoji} {destaque.titulo}
              </h2>
              <p className="text-white/40 text-sm mt-1">Ver produtos em destaque esta semana →</p>
            </div>
            <ArrowUpRight size={32} className="shrink-0 opacity-30 group-hover:opacity-80 transition-opacity" style={{ color: destaque.cor }} />
          </div>
        </a>

        {/* ── Sapatos ── */}
        <section id="sapatos">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-1">01</p>
            <h2 className="text-3xl font-black tracking-tight">Sapatos de Corrida</h2>
            <p className="text-white/40 text-sm mt-1">Testados em estrada, pista e trilho. Avaliação independente.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sapatos_r.map((s) => (
              <article
                key={s.name}
                className="group border border-white/6 rounded-2xl overflow-hidden bg-white/[0.01] hover:border-white/15 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <ProductImage src={s.img} alt={s.name} icon={Footprints} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: s.badgeColor, color: '#000' }}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] text-white/50 font-mono uppercase tracking-wider border border-white/20 px-2 py-0.5 rounded">
                      {s.categoria}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-lg tracking-tight">{s.name}</h3>
                    <span className="text-brand-green font-bold text-sm whitespace-nowrap">{s.preco}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Stars n={s.rating} />
                    <span className="text-[11px] text-white/30">{s.rating}/5</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-brand-green font-bold mb-1.5">Pontos fortes</p>
                      <ul className="space-y-1">
                        {s.pros.map((p) => (
                          <li key={p} className="text-[11px] text-white/40 flex items-start gap-1.5">
                            <span className="text-brand-green mt-px">+</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-red-400/60 font-bold mb-1.5">Limitações</p>
                      <ul className="space-y-1">
                        {s.contras.map((c) => (
                          <li key={c} className="text-[11px] text-white/40 flex items-start gap-1.5">
                            <span className="text-red-400/60 mt-px">−</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <a
                    href={trackedLink(s.name, s.link)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-brand-green px-4 py-2 rounded-lg hover:bg-white transition-colors"
                  >
                    Ver preço em {s.loja} <ArrowUpRight size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Relógios GPS ── */}
        <section id="relogios">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-1">02</p>
            <h2 className="text-3xl font-black tracking-tight">Relógios GPS</h2>
            <p className="text-white/40 text-sm mt-1">A ferramenta mais importante de um corredor sério.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {relogios_r.map((r) => (
              <article
                key={r.name}
                className="group border border-white/6 rounded-2xl overflow-hidden bg-white/[0.01] hover:border-white/15 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <ProductImage src={r.img} alt={r.name} icon={Watch} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: r.badgeColor, color: '#000' }}
                    >
                      {r.badge}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-lg tracking-tight">{r.name}</h3>
                    <span className="text-brand-green font-bold text-sm whitespace-nowrap">{r.preco}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Stars n={r.rating} />
                    <span className="text-[11px] text-white/30">{r.rating}/5</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-3">{r.desc}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-brand-green font-bold mb-1.5">Pontos fortes</p>
                      <ul className="space-y-1">
                        {r.pros.map((p) => (
                          <li key={p} className="text-[11px] text-white/40 flex items-start gap-1.5">
                            <span className="text-brand-green mt-px">+</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-red-400/60 font-bold mb-1.5">Limitações</p>
                      <ul className="space-y-1">
                        {r.contras.map((c) => (
                          <li key={c} className="text-[11px] text-white/40 flex items-start gap-1.5">
                            <span className="text-red-400/60 mt-px">−</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <a
                    href={trackedLink(r.name, r.link)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-brand-green px-4 py-2 rounded-lg hover:bg-white transition-colors"
                  >
                    Ver preço em {r.loja} <ArrowUpRight size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Monitores FC ── */}
        <section className="border-t border-white/5 pt-16">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-1">03</p>
            <h2 className="text-3xl font-black tracking-tight">Bracelets e Sensores de Frequência Cardíaca</h2>
            <p className="text-white/50 text-sm mt-2 max-w-2xl">
              Treinar por zonas de FC exige precisão. Os sensores de pulso dos relógios GPS têm erros de ±5-10% em intensidades elevadas — os monitores dedicados são a solução usada em laboratórios de fisiologia.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {sensoresFc_r.map((s) => (
              <article
                key={s.name}
                className="group border border-white/6 rounded-2xl overflow-hidden bg-white/[0.01] hover:border-white/15 transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <ProductImage src={s.img} alt={s.name} icon={HeartPulse} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <span
                      className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-black"
                      style={{ background: s.badgeColor }}
                    >
                      {s.badge}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/10 text-white/70 border border-white/10">
                      {s.tipo}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Stars n={s.rating} />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-black text-lg tracking-tight">{s.name}</h3>
                    <span className="text-brand-green font-black text-sm shrink-0 ml-2">{s.preco}</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed mb-4">{s.desc}</p>

                  {/* Porque escolher */}
                  <div className="bg-brand-green/5 border border-brand-green/15 rounded-lg p-3 mb-4">
                    <p className="text-[9px] uppercase tracking-widest text-brand-green font-bold mb-1">Porque escolher</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">{s.porque}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-brand-green/70 font-bold mb-1.5">Pontos fortes</p>
                      <ul className="space-y-1">
                        {s.pros.map((p) => (
                          <li key={p} className="text-[11px] text-white/50 flex items-start gap-1.5">
                            <span className="text-brand-green mt-px">+</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-red-400/60 font-bold mb-1.5">Limitações</p>
                      <ul className="space-y-1">
                        {s.contras.map((c) => (
                          <li key={c} className="text-[11px] text-white/40 flex items-start gap-1.5">
                            <span className="text-red-400/60 mt-px">−</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={trackedLink(s.name, s.link)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-auto inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-brand-green px-4 py-2.5 rounded-lg hover:bg-white transition-colors justify-center"
                  >
                    Ver preço em {s.loja} <ArrowUpRight size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Nutrição ── */}
        <section id="nutricao" className="border-t border-white/5 pt-16">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-1">04</p>
            <h2 className="text-3xl font-black tracking-tight">Nutrição para Corredores</h2>
            <p className="text-white/50 text-sm mt-2 max-w-2xl">
              A nutrição é o fator mais negligenciado no treino de corrida. Gels, isotónicos e proteína de recuperação fazem a diferença entre bater um recorde pessoal e morrer ao km 30 de maratona.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {nutricao_r.map((n) => (
              <article
                key={n.name}
                className="group border border-white/6 rounded-2xl overflow-hidden bg-white/[0.01] hover:border-white/15 transition-all flex flex-col"
              >
                <div className="relative h-40 overflow-hidden">
                  <ProductImage src={n.img} alt={n.name} icon={Zap} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <span
                      className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-black"
                      style={{ background: n.badgeColor }}
                    >
                      {n.badge}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/10 text-white/70 border border-white/10">
                      {n.tipo}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Stars n={n.rating} />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-black text-base tracking-tight">{n.name}</h3>
                    <span className="text-brand-green font-black text-sm shrink-0 ml-2">{n.preco}</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed mb-4">{n.desc}</p>

                  {/* Porque escolher */}
                  <div className="bg-brand-green/5 border border-brand-green/15 rounded-lg p-3 mb-4">
                    <p className="text-[9px] uppercase tracking-widest text-brand-green font-bold mb-1">Porque usar</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">{n.porque}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-brand-green/70 font-bold mb-1.5">Pontos fortes</p>
                      <ul className="space-y-1">
                        {n.pros.map((p) => (
                          <li key={p} className="text-[11px] text-white/50 flex items-start gap-1.5">
                            <span className="text-brand-green mt-px">+</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-red-400/60 font-bold mb-1.5">Limitações</p>
                      <ul className="space-y-1">
                        {n.contras.map((c) => (
                          <li key={c} className="text-[11px] text-white/40 flex items-start gap-1.5">
                            <span className="text-red-400/60 mt-px">−</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={trackedLink(n.name, n.link)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-auto inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-brand-green px-4 py-2.5 rounded-lg hover:bg-white transition-colors justify-center"
                  >
                    Ver preço em {n.loja} <ArrowUpRight size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Acessórios ── */}
        <section id="acessorios">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-1">05</p>
            <h2 className="text-3xl font-black tracking-tight">Acessórios Essenciais</h2>
            <p className="text-white/40 text-sm mt-1">O equipamento complementar que faz diferença.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {acessorios_r.map((a) => (
              <article
                key={a.name}
                className="group border border-white/6 rounded-xl overflow-hidden bg-white/[0.01] hover:border-white/15 transition-all"
              >
                <div className="h-36 overflow-hidden">
                  <ProductImage src={a.img} alt={a.name} icon={Package} />
                </div>
                <div className="p-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-green/70">{a.tipo}</span>
                  <h3 className="font-bold text-sm mt-1 mb-1">{a.name}</h3>
                  <p className="text-white/35 text-xs leading-relaxed mb-3">{a.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-green text-xs font-bold">{a.preco}</span>
                    <a
                      href={trackedLink(a.name, a.link)}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-brand-green transition-colors"
                    >
                      Amazon <ArrowUpRight size={10} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <div className="border-t border-white/5 pt-8">
          <p className="text-[11px] text-white/20 leading-relaxed max-w-2xl">
            <strong className="text-white/30">Transparência:</strong> Esta página contém links de afiliado Amazon.
            Quando compras através destes links, recebemos uma pequena comissão sem custo adicional para ti.
            As avaliações são independentes e baseadas em testes reais — nenhuma marca paga para aparecer aqui.
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <Link href="/blog" className="text-xs text-white/30 hover:text-brand-green transition-colors">← Arquivo de Artigos</Link>
            <Link href="/metodologias" className="text-xs text-white/30 hover:text-brand-green transition-colors">Metodologias de Treino</Link>
            <Link href="/consulta" className="text-xs text-white/30 hover:text-brand-green transition-colors">Consulta Gratuita com IA</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
