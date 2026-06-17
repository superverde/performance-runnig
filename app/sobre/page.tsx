import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre',
  description:
    'Treinador de corrida especializado em atletismo, trail running e corrida de estrada. Metodologias científicas de treino aplicadas a atletas amadores e de elite.',
}

const credentials = [
  'Licenciatura em Ciências do Desporto',
  'Treinador certificado — Grau II Federação Portuguesa de Atletismo',
  'Especialização em Fisiologia do Exercício',
  'Experiência em corrida de pista, estrada e trail',
  'Formação contínua em Periodização e Biomecânica da Corrida',
]

const values = [
  {
    title: 'Ciência Aplicada',
    desc: 'O treino baseado em dados e evidência científica tem melhores resultados do que o treino por instinto. Cada sessão tem um propósito fisiológico claro.',
  },
  {
    title: 'Individualização',
    desc: 'Não existe um plano universal. O teu histórico, capacidade de recuperação, disponibilidade e objetivos determinam o plano ideal.',
  },
  {
    title: 'Progressão Sustentada',
    desc: 'Rápido demais leva à lesão. Lento demais leva à frustração. O equilíbrio entre carga e recuperação é a chave do desenvolvimento a longo prazo.',
  },
  {
    title: 'Transparência',
    desc: 'Explico sempre o porquê de cada treino. Entender o processo torna-te um atleta mais autónomo e consciente.',
  },
]

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-brand-gray to-brand-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-4">
                SOBRE
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-tight">
                Treino com{' '}
                <span className="text-brand-green">Propósito</span> e Ciência
              </h1>
              <p className="text-brand-text leading-relaxed mb-6">
                Sou treinador de corrida especializado em atletismo, corrida de estrada e trail running.
                A minha abordagem combina fisiologia do exercício com experiência prática — porque
                o melhor treino é aquele que respeita a tua biologia.
              </p>
              <p className="text-brand-text leading-relaxed">
                Trabalho com atletas de todos os níveis: desde o corredor que quer terminar o primeiro
                10km até ao atleta que ambiciona qualificar-se para grandes provas internacionais.
                O denominador comum é sempre o mesmo — metodologia, consistência e progressão inteligente.
              </p>
            </div>

            {/* Avatar placeholder */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-muted to-brand-gray border border-brand-border flex items-center justify-center">
                <div className="text-center text-brand-text">
                  <div className="text-7xl mb-4">🏃</div>
                  <p className="text-sm font-semibold text-white">Treinador</p>
                  <p className="text-xs">Performance Running</p>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 px-4 py-3 rounded-xl bg-brand-green text-black font-bold text-sm">
                10+ Anos de Experiência
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credenciais */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-6">
            FORMAÇÃO E CREDENCIAIS
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {credentials.map((c) => (
              <div key={c} className="flex items-start gap-3 p-4 rounded-lg border border-brand-border bg-brand-muted">
                <CheckCircle size={16} className="text-brand-green mt-0.5 shrink-0" />
                <span className="text-sm text-brand-text">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filosofia */}
      <section className="py-16 bg-brand-gray">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-3">
            FILOSOFIA DE TREINO
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-10">
            O que me guia como <span className="text-brand-green">Treinador</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-lg border border-brand-border bg-brand-muted">
                <h3 className="font-bold text-brand-green mb-2">{v.title}</h3>
                <p className="text-sm text-brand-text leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black mb-4">Pronto para Começar?</h2>
          <p className="text-brand-text mb-8">
            Entra em contacto para uma conversa inicial sem compromisso.
            Juntos definimos objetivos e o plano mais adequado à tua realidade.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-7 py-3 bg-brand-green text-black font-bold rounded-md hover:bg-brand-green/90 transition-all hover:gap-3"
            >
              Iniciar Conversa <ArrowRight size={15} />
            </Link>
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 px-7 py-3 border border-brand-border text-white font-semibold rounded-md hover:border-brand-green hover:text-brand-green transition-colors"
            >
              Ver Planos
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
