import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, FlaskConical, RefreshCw, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre o Projeto',
  description:
    'Performance Running é uma base de conhecimento científico gratuita sobre corrida, trail running e atletismo. Artigos fundamentados em investigação científica publicada.',
}

const pillars = [
  {
    icon: <FlaskConical className="w-5 h-5 text-brand-green" />,
    title: 'Rigor Científico',
    desc: 'Todos os artigos são fundamentados em investigação científica publicada em revistas peer-reviewed. Cada afirmação tem suporte em evidência — nunca em opinião.',
  },
  {
    icon: <BookOpen className="w-5 h-5 text-brand-green" />,
    title: 'Acesso Livre',
    desc: 'Todo o conteúdo é gratuito e de acesso livre. Acreditamos que o conhecimento científico sobre saúde e performance deve estar disponível para todos.',
  },
  {
    icon: <RefreshCw className="w-5 h-5 text-brand-green" />,
    title: 'Atualização Diária',
    desc: '3 novos artigos publicados todos os dias. Tópicos rotativos que cobrem todas as áreas da corrida — do 5km ao ultra trail, da biomecânica à psicologia desportiva.',
  },
  {
    icon: <Globe className="w-5 h-5 text-brand-green" />,
    title: 'Em Português',
    desc: 'A maioria da literatura científica sobre corrida existe em inglês. Traduzimos e adaptamos esse conhecimento para português europeu, tornando-o acessível a todos.',
  },
]

const areas = [
  'Fisiologia do Exercício', 'Biomecânica da Corrida', 'Nutrição Desportiva',
  'Metodologias de Treino', 'Periodização', 'Recuperação e Sono',
  'Psicologia Desportiva', 'Prevenção de Lesões', 'Trail Running',
  'Ultra Endurance', 'Corrida de Montanha', 'Atletismo e Pista',
]

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-20 border-b border-white/5 bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-5">
              Sobre o Projeto
            </p>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none mb-8">
              Ciência da Corrida<br />
              <span className="text-brand-green">Para Todos.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-2xl mb-6">
              O <strong className="text-white">Performance Running</strong> é uma base de conhecimento científico gratuita
              dedicada à corrida, trail running e atletismo. O nosso objetivo é simples:
              tornar a investigação científica sobre corrida acessível a qualquer atleta,
              em português, de forma clara e rigorosa.
            </p>
            <p className="text-white/40 leading-relaxed max-w-2xl">
              Cada artigo é fundamentado em estudos publicados em revistas científicas internacionais.
              As referências estão sempre incluídas — para que possas verificar, aprofundar
              e desenvolver o teu próprio pensamento crítico sobre treino e performance.
            </p>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">
              Os Nossos Princípios
            </p>
            <h2 className="text-4xl font-black tracking-tight leading-none">
              Como Trabalhamos
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="group p-6 rounded-xl border border-white/5 hover:border-brand-green/20 bg-white/[0.02] transition-all card-hover">
                <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center mb-5">
                  {p.icon}
                </div>
                <h3 className="font-black text-white mb-3 text-sm">{p.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Áreas */}
      <section className="py-24 bg-[#0D0D0D] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">
              Temas Abordados
            </p>
            <h2 className="text-4xl font-black tracking-tight leading-none">
              Áreas de Conhecimento
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {areas.map((a) => (
              <span
                key={a}
                className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm font-medium hover:border-brand-green/30 hover:text-white transition-all"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre as referências */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3">
              Transparência
            </p>
            <h2 className="text-4xl font-black tracking-tight leading-none mb-8">
              Referências em<br />
              <span className="text-white/30">Cada Artigo</span>
            </h2>
            <div className="space-y-5 text-white/50 leading-relaxed">
              <p>
                Todos os artigos publicados no Performance Running incluem uma secção de referências
                bibliográficas no final. As referências seguem o formato APA e incluem sempre
                o DOI (Digital Object Identifier) quando disponível, permitindo o acesso direto ao estudo original.
              </p>
              <p>
                As fontes incluem revistas científicas de referência como o <em className="text-white/70">Journal of Applied Physiology</em>,
                o <em className="text-white/70">Medicine & Science in Sports & Exercise</em>,
                o <em className="text-white/70">International Journal of Sports Physiology and Performance</em>,
                entre muitas outras publicações indexadas.
              </p>
              <p>
                Este projeto não tem fins comerciais. É uma iniciativa dedicada à partilha livre
                e responsável de conhecimento científico sobre corrida e performance desportiva.
              </p>
            </div>

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-brand-green/90 transition-all hover:scale-105"
              >
                Explorar Artigos <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
