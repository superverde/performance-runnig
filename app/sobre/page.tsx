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
      <section
        className="relative pt-32 pb-24 border-b border-white/5 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/97 via-black/88 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-5">
              Sobre o Projeto
            </p>
            <h1
              className="font-display text-white leading-none mb-8"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
            >
              CIÊNCIA DA CORRIDA<br />
              <span className="text-brand-green">PARA TODOS.</span>
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
      <section
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll',
        }}
      >
        <div className="absolute inset-0 bg-black/94" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-3">
              Os Nossos Princípios
            </p>
            <h2
              className="font-display text-white leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              COMO TRABALHAMOS
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
      <section
        className="relative py-24 border-y border-white/5 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/93" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-3">
              Temas Abordados
            </p>
            <h2
              className="font-display text-white leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              ÁREAS DE CONHECIMENTO
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
      <section
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/97 via-black/90 to-black/85" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-b