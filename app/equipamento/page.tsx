import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'
import { Redis } from '@upstash/redis'

// Regenera a cada 6 horas — garante que a ordenação por clicks fica atualizada
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

/* ── DADOS DE REVIEWS ─────────────────────────────────────────────── */
const sapatos = [
  {
    name: 'HOKA Clifton 9',
    categoria: 'Estrada',
    rating: 5,
    preco: '~€140',
    badge: 'Editor\'s Choice',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51M3xzUi6qL._AC_UL600_.jpg',
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
    img: 'https://m.media-amazon.com/images/I/71BIO86CufL._AC_UL600_.jpg',
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
    img: 'https://m.media-amazon.com/images/I/71vRj0oHa1L._AC_UL600_.jpg',
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
    img: 'https://m.media-amazon.com/images/I/714NpSlEF-L._AC_UL600_.jpg',
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
    img: 'https://m.media-amazon.com/images/I/71rp-pRCpRL._AC_UL600_.jpg',
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
    img: 'https://m.media-amazon.com/images/I/51UPjlUVQBL._AC_UL600_.jpg',
    desc: 'Mapas topográficos, 20h autonomia GPS, métricas de trail, HeatSync e AltitudeAcclim. O relógio definitivo para ultra trail e triathlon.',
    pros: ['Mapas offline', 'Autonomia 20h GPS', 'Métricas de trail avançadas', 'Modo expedição 48h'],
    contras: ['Ecrã MIP (não AMOLED)', 'Pesado (52g)'],
    link: 'https://www.amazon.es/s?k=garmin+forerunner+955&tag=performancerun-21',
    loja: 'Amazon ES',
  },
]

const sensoresFc = [
  {
    name: 'Polar H10',
    tipo: 'Cinta peitoral',
    rating: 5,
    preco: '~€90',
    badge: 'Padrão Ouro',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/71BEqJ5XfKL._AC_UL600_.jpg',
    desc: 'O monitor de FC mais preciso do mercado. Recomendado por laboratórios de fisiologia e usado em estudos científicos. Conectividade Bluetooth + ANT+. Compatível com Garmin, Wahoo, Suunto e todos os relógios GPS.',
    pros: ['Precisão clínica (±1 bpm)', 'Bluetooth + ANT+ dual', 'Bateria 400h', 'Compatível com todos os relógios'],
    contras: ['Cinta peitoral (menos confortável que pulso)', 'Requer gel de condução no início'],
    link: 'https://www.amazon.es/s?k=polar+h10+monitor+cardiaco&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Se treinas por zonas de FC ou fazes testes de VO2max, o H10 é insubstituível. Os sensores de pulso têm erro de ±5-10% — o H10 tem ±1 bpm.',
  },
  {
    name: 'Polar Verity Sense',
    tipo: 'Sensor de braço',
    rating: 4,
    preco: '~€65',
    badge: 'Melhor Sensor Ótico',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/81Fh813r3vL._AC_UL600_.jpg',
    desc: 'Sensor ótico de braço com precisão muito superior aos sensores de pulso. Ideal para natação (IPX7), ciclismo e treino funcional. Usa luz verde de 6 LEDs para máxima precisão.',
    pros: ['Sem cinta peitoral', 'Impermeável (natação)', 'Confortável em qualquer posição', 'Memória interna 600h'],
    contras: ['Menos preciso que H10 em intervalados', 'Precisa de posicionamento correto no braço'],
    link: 'https://www.amazon.es/s?k=polar+verity+sense&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'A alternativa ao H10 para quem não quer cinta peitoral. Excelente para trail (movimento irregular) e natação.',
  },
  {
    name: 'Polar Pacer Pro',
    tipo: 'Relógio GPS',
    rating: 4,
    preco: '~€300',
    badge: 'Melhor Polar Corrida',
    badgeColor: '#f59e0b',
    img: 'https://m.media-amazon.com/images/I/71rBm1eXWKL._AC_UL600_.jpg',
    desc: 'O melhor relógio Polar para corredores. Leve (45g), GPS preciso, Running Power sem acessórios externos, análise de recuperação Nightly Recharge e estimativa de VO2max. Ecrã MIP excelente em pleno sol.',
    pros: ['Levíssimo (45g)', 'Running Power integrado', 'Nightly Recharge (HRV nocturno)', 'Excelente autonomia 35h GPS'],
    contras: ['Sem mapas', 'Ecrã não AMOLED', 'App menos rica que Garmin Connect'],
    link: 'https://www.amazon.es/s?k=polar+pacer+pro&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para quem prefere o ecossistema Polar e quer Running Power + HRV num relógio leve e acessível.',
  },
]

const nutricao = [
  {
    name: 'SiS Beta Fuel Gel',
    tipo: 'Gel de energia',
    rating: 5,
    preco: '~€3,5',
    badge: 'Editor\'s Choice',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51Fm2ion7tL._AC_UL600_.jpg',
    desc: 'O gel mais avançado do mercado. 40g de carboidratos com tecnologia de duplo transportador (glicose + frutose 2:1). Absorção máxima sem desconforto gastrointestinal. Usado pela elite mundial de trail e maratona.',
    pros: ['40g CHO por gel', 'Sem problemas GI', 'Sabor neutro', 'Testado em laboratório'],
    contras: ['Preço elevado por gel', 'Textura espessa para alguns'],
    link: 'https://www.amazon.es/s?k=sis+beta+fuel+gel&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para corridas >90 min, o Beta Fuel é o gel com maior density de carbos e menor risco de problemas de estômago. Indispensável para maratona e ultra.',
  },
  {
    name: 'Maurten Gel 100',
    tipo: 'Gel de energia',
    rating: 5,
    preco: '~€4,5',
    badge: 'Preferido da Elite',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/71ZvBEbsK2L._AC_UL600_.jpg',
    desc: 'Tecnologia Hydrogel — forma um gel no estômago que liberta energia de forma constante. Sem cor, sem sabor artificial, sem adoçantes. O gel de Kipchoge e Eliud. 25g de CHO em formato ultra-digerível.',
    pros: ['Tecnologia Hydrogel patenteada', 'Zero problemas digestivos', 'Limpo (sem aditivos)', 'Absorção contínua'],
    contras: ['O mais caro do mercado', 'Só 25g CHO por gel'],
    link: 'https://www.amazon.es/s?k=maurten+gel+100&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para quem tem estômago sensível ou quer o que a elite mundial usa. A tecnologia Hydrogel elimina o risco de mal-estar mesmo no calor.',
  },
  {
    name: 'SiS Go Electrolyte',
    tipo: 'Isotónico em pó',
    rating: 5,
    preco: '~€25 (500g)',
    badge: 'Melhor Valor',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51MbTHkesML._AC_UL600_.jpg',
    desc: 'Bebida isotónica científica com 36g CHO por 500ml + eletrólitos completos (sódio, potássio, cálcio, magnésio). Fórmula isotónica real — não apenas "sais". O favorito dos triatletas e corredores de fundo.',
    pros: ['Fórmula isotónica equilibrada', 'Eletrólitos completos', '~50 doses por embalagem', 'Vários sabores'],
    contras: ['Precisa de misturar em pó', 'Volume a transportar'],
    link: 'https://www.amazon.es/s?k=sis+go+electrolyte+powder&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'A melhor relação qualidade/preço em isotónicos. Cobre hidratação + energia + eletrólitos numa só bebida para treinos >1h ou no calor.',
  },
  {
    name: 'GU Energy Gel',
    tipo: 'Gel de energia',
    rating: 4,
    preco: '~€2,5',
    badge: 'Melhor Entrada',
    badgeColor: '#f59e0b',
    img: 'https://m.media-amazon.com/images/I/61vYkvVMeTL._AC_UL600_.jpg',
    desc: 'O gel mais popular do mundo com 20+ anos de história. 21g CHO, aminoácidos de cadeia ramificada (BCAAs) e opções com cafeína. Textura suave, fácil de ingerir. Disponível em 30+ sabores.',
    pros: ['Preço acessível', '30+ sabores', 'BCAAs incluídos', 'Com/sem cafeína'],
    contras: ['21g CHO apenas', 'Pode causar GI em alguns'],
    link: 'https://www.amazon.es/s?k=gu+energy+gel+running&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'O gel ideal para começar a usar nutrição em corrida. Acessível, eficaz e amplamente disponível em todas as lojas de desporto.',
  },
  {
    name: 'High5 Zero Electrolyte',
    tipo: 'Comprimidos eletrólitos',
    rating: 4,
    preco: '~€8 (20 comprimidos)',
    badge: 'Hidratação Trail',
    badgeColor: '#8b5cf6',
    img: 'https://m.media-amazon.com/images/I/61lN5jQVlHL._AC_UL600_.jpg',
    desc: 'Comprimidos efervescentes de eletrólitos sem carboidratos. Perfeitos para treinos de baixa intensidade, recuperação hidratante e calor. Sódio, magnésio, potássio e vitamina C num formato ultra-portátil.',
    pros: ['Ultra-portátil', 'Sem açúcar', 'Dissolve em segundos', 'Cobre cãibras musculares'],
    contras: ['Sem energia (só sais)', 'Sabor artificial'],
    link: 'https://www.amazon.es/s?k=high5+zero+electrolyte+tablets&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para trail no verão ou após treinos longos. Os comprimidos de eletrólitos previnem cãibras e fadiga prematura causada pela desidratação mineral.',
  },
  {
    name: 'Whey Proteína Isolada',
    tipo: 'Recuperação muscular',
    rating: 5,
    preco: '~€45 (1kg)',
    badge: 'Essencial Pós-Treino',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51uTOGVMqaL._AC_UL600_.jpg',
    desc: 'Proteína isolada de soro de leite com 90%+ proteína, absorção rápida e aminoácidos completos. Fundamental para reparação muscular após sessões longas ou intensivas. A janela de recuperação: 30-60 min após o treino.',
    pros: ['Absorção rápida (30 min)', 'BCAA e EAA completos', 'Alto teor proteico (25g/dose)', 'Previne catabolismo muscular'],
    contras: ['Origem animal (não vegan)', 'Lactose residual na whey concentrada'],
    link: 'https://www.amazon.es/s?k=whey+protein+isolate+running+recovery&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Corredores ignoram a proteína pós-treino e pagam em lesões e falta de progressão. 25g de whey nas primeiras horas pós-treino acelera a recuperação muscular em 30-40%.',
  },
]

const acessorios = [
  {
    name: 'Coros Pace 3',
    tipo: 'Relógio',
    preco: '~€230',
    img: 'https://m.media-amazon.com/images/I/61HE8zhwT7L._AC_UL600_.jpg',
    desc: 'Melhor entrada no mundo dos GPS de performance. Levíssimo (30g), 38h autonomia GPS.',
    link: 'https://www.amazon.es/s?k=coros+pace+3&tag=performancerun-21',
  },
  {
    name: 'Craft ADV Endurance',
    tipo: 'Meias técnicas',
    preco: '~€18',
    img: 'https://m.media-amazon.com/images/I/81o+haiyiLL._AC_UL600_.jpg',
    desc: 'Meias de compressão com anti-bolhas. Essenciais para maratona e ultra.',
    link: 'https://www.amazon.es/s?k=craft+running+socks&tag=performancerun-21',
  },
  {
    name: 'Nathan SpeedDraw Plus',
    tipo: 'Garrafa de mão',
    preco: '~€25',
    img: 'https://m.media-amazon.com/images/I/61VtZS9Jw0L._AC_UL600_.jpg',
    desc: '530ml com bolso para gel e telemóvel. Indispensável para trail curto e treinos >1h.',
    link: 'https://www.amazon.es/s?k=nathan+speeddraw+handheld&tag=performancerun-21',
  },
  {
    name: 'Salomon Active Skin 8',
    tipo: 'Mochila hidratação',
    preco: '~€110',
    img: 'https://m.media-amazon.com/images/I/81+6ITtBijL._AC_UL600_.jpg',
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

export default async function EquipamentoPage() {
  // Lê clicks totais do Redis — ordena produtos pelo que os utilizadores mais clicam
  let clicks: Record<string, number> = {}
  try {
    const redis = Redis.fromEnv()
    const raw = await redis.hgetall('clicks:total')
    if (raw) clicks = raw as Record<string, number>
  } catch {
    // Redis indisponível → mantém ordem original sem quebrar a página
  }

  const sapatos_r = sortByClicks(sapatos, clicks)
  const relogios_r = sortByClicks(relogios, clicks)
  const sensoresFc_r = sortByClicks(sensoresFc, clicks)
  const nutricao_r = sortByClicks(nutricao, clicks)
  const acessorios_r = sortByClicks(acessorios, clicks)

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
            {sapatos_r.map((s) => (
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
        <section>
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

        {/* ── Monitores FC Polar ── */}
        <section className="border-t border-white/5 pt-16">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-1">03</p>
            <h2 className="text-3xl font-black tracking-tight">Bracelets e Sensores de Frequência Cardíaca</h2>
            <p className="text-white/50 text-sm mt-2 max-w-2xl">
              Treinar por zonas de FC exige precisão. Os sensores de pulso dos relógios GPS têm erros de ±5-10% em intensidades elevadas — os monitores dedicados Polar são a solução usada em laboratórios de fisiologia.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {sensoresFc_r.map((s) => (
              <article
                key={s.name}
                className="group border border-white/6 rounded-2xl overflow-hidden bg-white/[0.01] hover:border-white/15 transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
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
        <section className="border-t border-white/5 pt-16">
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={n.img}
                    alt={n.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
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
        <section>
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
