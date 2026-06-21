import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'

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

/* ── DADOS DE REVIEWS ─────────────────────────────────────────────── */
const sapatos = [
  {
    name: 'HOKA Clifton 9',
    categoria: 'Estrada',
    rating: 5,
    preco: '~€140',
    badge: 'Editor\'s Choice',
    badgeColor: '#00ff87',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    desc: 'O sapato de estrada mais confortável do mercado. Stack height máxima com controlo surpreendente. Ideal para corredores de longa distância e recuperação ativa.',
    pros: ['Amortecimento excepcional', 'Durável (800+ km)', 'Bom para lesionados'],
    contras: ['Pesado para velocidade', 'Preço elevado'],
    link: 'https://www.amazon.es/s?k=hoka+clifton+9&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'On Cloudmonster 2',
    categoria: 'Estrada',
    rating: 4,
    preco: '~€170',
    badge: 'Premium Pick',
    badgeColor: '#3b82f6',
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    desc: 'Tecnologia CloudTec de nova geração. Transição suave com retorno energético elevado. Perfeito para treinos longos e semi-maratona.',
    pros: ['Retorno energético elevado', 'Design premium', 'Respirabilidade'],
    contras: ['Adaptação necessária', 'Caro'],
    link: 'https://www.amazon.es/s?k=on+cloudmonster+2&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Salomon Speedcross 6',
    categoria: 'Trail',
    rating: 5,
    preco: '~€130',
    badge: 'Trail Best',
    badgeColor: '#f59e0b',
    img: 'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=600&q=80',
    desc: 'O rei do trail técnico. Grip agressivo para terrenos enlameados e pedregosos. Proteção superior com leveza competitiva.',
    pros: ['Grip imbatível em lama', 'Proteção da sola', 'Cabedal resistente'],
    contras: ['Firme em alcatrão', 'Stack baixa'],
    link: 'https://www.amazon.es/s?k=salomon+speedcross+6&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Nike Vaporfly 3',
    categoria: 'Competição',
    rating: 5,
    preco: '~€260',
    badge: 'Mais Rápido',
    badgeColor: '#ef4444',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    desc: 'A placa de carbono mais eficiente do mercado. Sub-4:00/km com conforto. O sapato dos recordes mundiais de maratona.',
    pros: ['Velocidade máxima', 'Placa de carbono ZoomX', 'Leve (238g)'],
    contras: ['Exclusivo para competição', 'Durabilidade limitada (300 km)', 'Preço proibitivo'],
    link: 'https://www.amazon.es/s?k=nike+vaporfly+3&tag=performancerun-21',
    loja: 'Amazon ES',
  },
]

const relogios = [
  {
    name: 'Garmin Forerunner 265',
    rating: 5,
    preco: '~€450',
    badge: 'Melhor Custo/Benefício',
    badgeColor: '#00ff87',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    desc: 'O melhor relógio para corredores sérios sem gastar €700+. AMOLED, GPS dual-frequency, HRV avançado, planos de treino Garmin Coach.',
    pros: ['AMOLED vibrante', 'GPS preciso (L1+L5)', 'Autonomia 13h GPS', 'Dados HRV completos'],
    contras: ['Sem mapas topográficos', 'Sem música integrada'],
    link: 'https://www.amazon.es/s?k=garmin+forerunner+265&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Garmin Forerunner 955',
    rating: 5,
    preco: '~€550',
    badge: 'Para Triatletas',
    badgeColor: '#3b82f6',
    img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    desc: 'Mapas topográficos, 20h autonomia GPS, métricas de trail, HeatSync e AltitudeAcclim. O relógio definitivo para ultra trail e triathlon.',
    pros: ['Mapas offline', 'Autonomia 20h GPS', 'Métricas de trail avançadas', 'Modo expedição 48h'],
    contras: ['Ecrã MIP (não AMOLED)', 'Pesado (52g)'],
    link: 'https://www.amazon.es/s?k=garmin+forerunner+955&tag=performancerun-21',
    loja: 'Amazon ES',
  },
]

const acessorios = [
  {
    name: 'Coros Pace 3',
    tipo: 'Relógio',
    preco: '~€230',
    img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80',
    desc: 'Melhor entrada no mundo dos GPS de performance. Levíssimo (30g), 38h autonomia GPS.',
    link: 'https://www.amazon.es/s?k=coros+pace+3&tag=performancerun-21',
  },
  {
    name: 'Craft ADV Endurance',
    tipo: 'Meias técnicas',
    preco: '~€18',
    img: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80',
    desc: 'Meias de compressão com anti-bolhas. Essenciais para maratona e ultra.',
    link: 'https://www.amazon.es/s?k=craft+running+socks&tag=performancerun-21',
  },
  {
    name: 'Nathan SpeedDraw Plus',
    tipo: 'Garrafa de mão',
    preco: '~€25',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    desc: '530ml com bolso para gel e telemóvel. Indispensável para trail curto e treinos >1h.',
    link: 'https://www.amazon.es/s?k=nathan+speeddraw+handheld&tag=performancerun-21',
  },
  {
    name: 'Salomon Active Skin 8',
    tipo: 'Mochila hidratação',
    preco: '~€110',
    img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
    desc: '8L com 1.5L de hidratação. Ajuste perfeito sem movimento. A escolha dos pros no trail.',
    link: 'https://www.amazon.es/s?k=salomon+active+skin+8&tag=performancerun-21',
  },
]

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

export default function EquipamentoPage() {
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

        {/* ── Sapatos ── */}
        <section>
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-1">01</p>
            <h2 className="text-3xl font-black tracking-tight">Sapatos de Corrida</h2>
            <p className="text-white/40 text-sm mt-1">Testados em estrada, pista e trilho. Avaliação independente.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sapatos.map((s) => (
              <article
                key={s.name}
                className="group border border-white/6 rounded-2xl overflow-hidden bg-white/[0.01] hover:border-white/15 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
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
                    href={s.link}
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
        <section>
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-1">02</p>
            <h2 className="text-3xl font-black tracking-tight">Relógios GPS</h2>
            <p className="text-white/40 text-sm mt-1">A ferramenta mais importante de um corredor sério.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {relogios.map((r) => (
              <article
                key={r.name}
                className="group border border-white/6 rounded-2xl overflow-hidden bg-white/[0.01] hover:border-white/15 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
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
                    href={r.link}
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

        {/* ── Acessórios ── */}
        <section>
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-1">03</p>
            <h2 className="text-3xl font-black tracking-tight">Acessórios Essenciais</h2>
            <p className="text-white/40 text-sm mt-1">O equipamento complementar que faz diferença.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {acessorios.map((a) => (
              <article
                key={a.name}
                className="group border border-white/6 rounded-xl overflow-hidden bg-white/[0.01] hover:border-white/15 transition-all"
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-green/70">{a.tipo}</span>
                  <h3 className="font-bold text-sm mt-1 mb-1">{a.name}</h3>
                  <p className="text-white/35 text-xs leading-relaxed mb-3">{a.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-green text-xs font-bold">{a.preco}</span>
                    <a
                      href={a.link}
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
