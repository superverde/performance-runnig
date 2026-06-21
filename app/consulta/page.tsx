'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, Clock, Mail, MessageSquare, Target, Zap } from 'lucide-react'

const MODALIDADES = ['5km', '10km', 'Meia Maratona', 'Maratona', 'Trail 25–50km', 'Ultra Trail +50km', 'Outra']

const TOPICS = [
  { icon: Target, label: 'Planeamento de treino', desc: 'Estrutura semanal, periodização, volume e intensidade' },
  { icon: Zap, label: 'Estratégia de prova', desc: 'Pacing, nutrição em corrida, gestão do esforço' },
  { icon: MessageSquare, label: 'Prevenção de lesões', desc: 'Carga progressiva, fortalecimento, biomecânica' },
  { icon: Clock, label: 'Preparação para objetivos', desc: 'PB, primeira maratona, primeiro trail, volta ao ativo' },
]

const STEPS = [
  { n: '01', title: 'Preenche o formulário', desc: 'Conta-nos a tua situação atual, objetivos e dúvidas principais. Leva menos de 3 minutos.' },
  { n: '02', title: 'Análise em 24–48h', desc: 'Analisamos o teu perfil, historial de treino e questão. Preparamos uma resposta personalizada.' },
  { n: '03', title: 'Sessão personalizada', desc: 'Podes receber a resposta por email detalhado ou agendar uma videochamada de 30 minutos.' },
]

export default function ConsultaPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    email: '',
    modalidade: '',
    kmSemana: '',
    objetivo: '',
    questao: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative pt-32 pb-24 border-b border-white/5 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/97 via-black/88 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-brand-green" />
              <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase">
                Gratuito · Sem compromisso
              </p>
            </div>
            <h1
              className="font-display text-white leading-none mb-6"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              PEDE UMA<br />
              <span className="text-brand-green">CONSULTA.</span>
            </h1>
            <p className="text-white/45 text-base leading-relaxed max-w-lg mb-8">
              Tens uma dúvida sobre treino, lesão ou estratégia de prova? Descreve a tua situação
              e recebemos uma análise personalizada — completamente gratuita.
            </p>
            <a
              href="#formulario"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all hover:scale-105 active:scale-95"
            >
              Começar agora <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── O QUE ABORDAMOS ── */}
      <section className="py-20 border-b border-white/5" style={{ background: '#080808' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-4">
            Áreas de consulta
          </p>
          <h2 className="font-display text-white text-4xl leading-none mb-12">
            O QUE PODEMOS<br /><span className="text-brand-green">ANALISAR.</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TOPICS.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-brand-green/30 transition-all group"
              >
                <Icon size={22} className="text-brand-green mb-4" />
                <h3 className="text-white font-black text-sm mb-2 group-hover:text-brand-green transition-colors">
                  {label}
                </h3>
                <p className="text-white/35 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="py-20 border-b border-white/5" style={{ background: '#050505' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-4">
            Processo
          </p>
          <h2 className="font-display text-white text-4xl leading-none mb-12">
            COMO<br /><span className="text-brand-green">FUNCIONA.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col gap-4">
                <span className="font-display text-brand-green/30 text-6xl leading-none">{n}</span>
                <div>
                  <h3 className="text-white font-black text-base mb-2">{title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section
        id="formulario"
        className="py-20"
        style={{ background: '#080808' }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-4">
            Formulário
          </p>
          <h2 className="font-display text-white text-4xl leading-none mb-10">
            CONTA-NOS A<br /><span className="text-brand-green">TUA SITUAÇÃO.</span>
          </h2>

          {submitted ? (
            <div className="text-center py-20 rounded-2xl border border-brand-green/20 bg-brand-green/5">
              <CheckCircle size={48} className="text-brand-green mx-auto mb-5" />
              <h3 className="text-white font-black text-xl mb-3">Consulta Recebida!</h3>
              <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
                Vamos analisar a tua situação e responder em 24–48 horas com uma análise personalizada.
              </p>
              <a
                href="/blog"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all"
              >
                Ler artigos enquanto esperas <ArrowRight size={14} />
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row: Nome + Email */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                    Nome *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.nome}
                    onChange={set('nome')}
                    placeholder="O teu nome"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-green/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="para@onde.enviamos"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-green/50 transition-all"
                  />
                </div>
              </div>

              {/* Row: Modalidade + Km/semana */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                    Modalidade principal *
                  </label>
                  <select
                    required
                    value={form.modalidade}
                    onChange={set('modalidade')}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-green/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-black">Selecionar...</option>
                    {MODALIDADES.map((m) => (
                      <option key={m} value={m} className="bg-black">{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                    Km por semana (aproximado)
                  </label>
                  <input
                    type="text"
                    value={form.kmSemana}
                    onChange={set('kmSemana')}
                    placeholder="Ex: 40–50 km"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-green/50 transition-all"
                  />
                </div>
              </div>

              {/* Objetivo */}
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                  Objetivo principal *
                </label>
                <input
                  required
                  type="text"
                  value={form.objetivo}
                  onChange={set('objetivo')}
                  placeholder="Ex: Baixar o PB na maratona para sub-3:30, Terminar o meu primeiro ultra trail 50km..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-green/50 transition-all"
                />
              </div>

              {/* Questão */}
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                  A tua questão ou situação *
                </label>
                <textarea
                  required
                  value={form.questao}
                  onChange={set('questao')}
                  rows={5}
                  placeholder="Descreve a tua situação atual, o que já tentaste, e qual é a dúvida principal. Quanto mais detalhe, melhor a análise que conseguimos dar."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-green/50 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-white/25 text-xs max-w-xs leading-relaxed">
                  100% gratuito. Respondemos por email em 24–48 horas.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all hover:scale-105 active:scale-95"
                >
                  Enviar <ArrowRight size={15} />
                </button>
              </div>
            </form>
          )}

          {/* Email directo */}
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-3">
            <Mail size={14} className="text-white/25" />
            <p className="text-white/25 text-xs">
              Preferes email direto?{' '}
              <a
                href="mailto:performance.running0224@gmail.com"
                className="text-brand-green/70 hover:text-brand-green transition-colors underline"
              >
                performance.running0224@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
