import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Patrocínios e Parcerias — Performance Running',
  description:
    'Parceria com o maior site científico de corrida em Portugal. Alcança corredores comprometidos com a performance. Media kit disponível para marcas de desporto.',
  alternates: { canonical: 'https://www.performancerunning.pt/patrocinios' },
  robots: { index: true, follow: true },
}

const SITE_URL = 'https://www.performancerunning.pt'

const metricas = [
  { valor: '3', label: 'Artigos científicos', sub: 'publicados por dia' },
  { valor: '100%', label: 'Corredores', sub: 'audiência altamente segmentada' },
  { valor: 'PT', label: 'Portugal', sub: 'audiência nacional' },
  { valor: '↑', label: 'Crescimento', sub: 'orgânico via SEO' },
]

const opcoes = [
  {
    num: '01',
    titulo: 'Review de Produto',
    desc: 'Artigo de review aprofundado com teste real do produto. Indexado permanentemente no Google, com imagens, prós, contras e link de afiliado/compra.',
    inclui: ['Artigo dedicado (1000+ palavras)', 'SEO otimizado para keywords de produto', 'Link permanente follow', 'Partilha nas redes sociais', 'Relatório de visualizações'],
    ideal: 'Marcas de calçado, relógios GPS, nutrição desportiva',
  },
  {
    num: '02',
    titulo: 'Conteúdo Patrocinado',
    desc: 'Artigo científico de alta qualidade com menção da marca. Integrado naturalmente no arquivo do blog — não parece publicidade, parece conhecimento.',
    inclui: ['Artigo educativo (800-1500 palavras)', 'Menção natural da marca/produto', 'Publicação permanente no arquivo', 'SEO completo + sitemap', 'Transparência: marcado como "parceria"'],
    ideal: 'Suplementos, equipamento técnico, aplicações de treino',
  },
  {
    num: '03',
    titulo: 'Destaque na Newsletter',
    desc: 'Menção exclusiva na newsletter semanal para subscritores ativos — corredores comprometidos com a performance.',
    inclui: ['Destaque no topo da newsletter', 'Texto e imagem fornecidos pela marca', 'Link direto para produto/landing page', 'Relatório de cliques pós-envio'],
    ideal: 'Lançamentos de produto, promoções, eventos de corrida',
  },
  {
    num: '04',
    titulo: 'Parceria de Afiliado',
    desc: 'Programa de afiliado de longo prazo. Os teus produtos aparecem nas páginas de equipamento e reviews com links tracked. Pagamento por comissão.',
    inclui: ['Presença permanente em /equipamento', 'Links de afiliado tracked', 'Menção em artigos relevantes', 'Sem custo inicial — comissão por venda'],
    ideal: 'Amazon, Decathlon, lojas de desporto, plataformas SaaS',
  },
]

const marcas = [
  { name: 'Nike', emoji: '👟' },
  { name: 'Garmin', emoji: '⌚' },
  { name: 'Salomon', emoji: '🏔️' },
  { name: 'HOKA', emoji: '🏃' },
  { name: 'On Running', emoji: '⚡' },
  { name: 'Decathlon', emoji: '🎽' },
  { name: 'GU Energy', emoji: '🍌' },
  { name: 'Maurten', emoji: '💧' },
]

export default function PatrociniosPage() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div
        className="relative pt-28 pb-20 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/92 via-black/88 to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-green/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-green mb-4 font-mono">
            Media Kit · Parcerias
          </p>
          <h1 className="font-display text-white leading-none mb-5" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            ALCANÇA<br />
            <span className="text-brand-green">CORREDORES.</span>
          </h1>
          <p className="text-white/70 max-w-xl text-lg leading-relaxed mb-8">
            Performance Running é o maior arquivo científico de corrida em Portugal.
            Audiência segmentada, conteúdo de alta qualidade, crescimento orgânico.
          </p>
          <a
            href="mailto:performance.running0224@gmail.com?subject=Parceria Performance Running"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black font-black text-sm rounded-full hover:bg-white transition-colors"
          >
            <Mail size={15} /> Falar connosco
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── Métricas ── */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metricas.map((m) => (
              <div key={m.label} className="border border-white/6 rounded-xl p-6 text-center bg-white/[0.01]">
                <p className="font-display text-brand-green leading-none mb-2" style={{ fontSize: '3rem' }}>
                  {m.valor}
                </p>
                <p className="font-bold text-sm text-white/80">{m.label}</p>
                <p className="text-xs text-white/50 mt-1">{m.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/60 text-center mt-3">
            *Métricas atualizadas mensalmente. Relatório detalhado disponível a pedido.
          </p>
        </section>

        {/* ── Quem somos ── */}
        <section className="border-t border-white/5 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-3">O Projeto</p>
              <h2 className="text-3xl font-black tracking-tight mb-4">A maior base de conhecimento científico de corrida em Portugal.</h2>
              <p className="text-white/65 text-sm leading-relaxed mb-4">
                Publicamos 3 artigos científicos por dia sobre fisiologia do exercício, periodização, nutrição, biomecânica e trail running.
                Todo o conteúdo é gratuito, sem paywall, em português europeu.
              </p>
              <p className="text-white/65 text-sm leading-relaxed">
                O nosso leitor típico é um corredor entre 25-45 anos, comprometido com a melhoria da performance, com poder de compra acima da média.
                Investe em equipamento de qualidade — o cliente certo para as marcas certas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Artigos publicados', val: '100+' },
                { label: 'Categorias de conteúdo', val: '9' },
                { label: 'Páginas indexadas', val: '50+' },
                { label: 'Modalidades cobertas', val: '8' },
              ].map((s) => (
                <div key={s.label} className="border border-white/6 rounded-xl p-5 bg-white/[0.01]">
                  <p className="text-2xl font-black text-brand-green">{s.val}</p>
                  <p className="text-xs text-white/55 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Opções de Parceria ── */}
        <section className="border-t border-white/5 pt-16">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-2">Oportunidades</p>
            <h2 className="text-3xl font-black tracking-tight">Formatos de Parceria</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opcoes.map((o) => (
              <div key={o.num} className="border border-white/6 rounded-2xl p-6 bg-white/[0.01] hover:border-white/12 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-brand-green/50 uppercase tracking-widest">{o.num}</span>
                </div>
                <h3 className="font-black text-xl tracking-tight mb-2">{o.titulo}</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-4">{o.desc}</p>
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-widest text-brand-green font-bold mb-2">Inclui</p>
                  <ul className="space-y-1.5">
                    {o.inclui.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-white/60">
                        <ArrowRight size={10} className="text-brand-green mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-white/65 border-t border-white/5 pt-3 mt-3">
                  <span className="text-white/60 font-bold">Ideal para: </span>{o.ideal}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Marcas ideais ── */}
        <section className="border-t border-white/5 pt-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-green font-mono mb-6">Marcas com fit perfeito</p>
          <div className="flex flex-wrap gap-3">
            {marcas.map((m) => (
              <div key={m.name} className="flex items-center gap-2 border border-white/8 rounded-full px-4 py-2 text-sm text-white/50">
                <span>{m.emoji}</span>
                <span>{m.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 border border-white/8 rounded-full px-4 py-2 text-sm text-white/55 border-dashed">
              + a tua marca
            </div>
          </div>
        </section>

        {/* ── CTA Contacto ── */}
        <section className="border-t border-white/5 pt-16">
          <div
            className="relative rounded-2xl overflow-hidden border border-white/5 p-10 sm:p-14 text-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/97 to-black/93" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-brand-green/8 rounded-full blur-[60px]" />
            <div className="relative">
              <h2 className="font-display text-white leading-none mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                VAMOS TRABALHAR JUNTOS?
              </h2>
              <p className="text-white/60 max-w-md mx-auto text-sm mb-8">
                Envia-nos um email com a tua proposta. Respondemos em 48h com disponibilidade e condições.
              </p>
              <a
                href="mailto:performance.running0224@gmail.com?subject=Parceria Performance Running&body=Olá, tenho interesse em uma parceria com o Performance Running. Gostaria de discutir as opções disponíveis."
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-black font-black text-sm rounded-full hover:bg-white transition-colors"
              >
                <Mail size={15} />
                performance.running0224@gmail.com
                <ArrowUpRight size={13} />
              </a>
              <p className="text-xs text-white/60 mt-5">
                Resposta garantida em 48h · Media kit detalhado disponível a pedido
              </p>
            </div>
          </div>
        </section>

        {/* ── Links internos ── */}
        <div className="border-t border-white/5 pt-8 flex gap-4 flex-wrap">
          <Link href="/blog" className="text-xs text-white/55 hover:text-brand-green transition-colors">← Arquivo de Artigos</Link>
          <Link href="/equipamento" className="text-xs text-white/55 hover:text-brand-green transition-colors">Equipamento · Reviews</Link>
          <Link href="/consulta" className="text-xs text-white/55 hover:text-brand-green transition-colors">Consulta Gratuita com IA</Link>
          <Link href="/sobre" className="text-xs text-white/55 hover:text-brand-green transition-colors">Sobre o Projeto</Link>
        </div>
      </div>
    </div>
  )
}
