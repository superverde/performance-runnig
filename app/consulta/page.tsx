'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, Clock, Loader2, Mail, MessageSquare, Target, Zap, AlertCircle } from 'lucide-react'

const MODALIDADES = ['5km', '10km', 'Meia Maratona', 'Maratona', 'Trail 25–50km', 'Ultra Trail +50km', 'Outra']

const TOPICS = [
  { icon: Target, label: 'Planeamento de treino', desc: 'Estrutura semanal, periodização, volume e intensidade' },
  { icon: Zap, label: 'Estratégia de prova', desc: 'Pacing, nutrição em corrida, gestão do esforço' },
  { icon: MessageSquare, label: 'Prevenção de lesões', desc: 'Carga progressiva, fortalecimento, biomecânica' },
  { icon: Clock, label: 'Preparação para objetivos', desc: 'PB, primeira maratona, primeiro trail, volta ao ativo' },
]

const STEPS = [
  { n: '01', title: 'Preenche o formulário', desc: 'Conta-nos a tua situação atual, objetivos e dúvidas principais. Leva menos de 3 minutos.' },
  { n: '02', title: 'IA analisa o teu perfil', desc: 'O nosso sistema analisa o teu perfil de corredor e gera uma resposta personalizada.' },
  { n: '03', title: 'Recebe a análise imediatamente', desc: 'Em segundos tens uma análise técnica completa, baseada na tua situação real.' },
]

/** Converte markdown simples em JSX */
function renderMarkdown(text: string) {
  const blocks = text.split(/\n{2,}/).filter(Boolean)
  return blocks.map((block, i) => {
    // Título ## Texto
    if (block.startsWith('## ')) {
      return (
        <h3 key={i} className="font-display text-brand-green text-lg mt-8 mb-3 first:mt-0">
          {block.slice(3).trim()}
        </h3>
      )
    }
    // Lista com bullet - ou *
    if (/^[-*•]\s/.test(block.trim())) {
      const items = block.split('\n').filter((l) => /^[-*•]\s/.test(l.trim()))
      return (
        <ul key={i} className="space-y-2 my-3">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-white/70 text-sm leading-relaxed">
              <span className="text-brand-green mt-0.5 flex-shrink-0">→</span>
              <span dangerouslySetInnerHTML={{ __html: boldify(item.replace(/^[-*•]\s/, '')) }} />
            </li>
          ))}
        </ul>
      )
    }
    // Lista numerada
    if (/^\d+\.\s/.test(block.trim())) {
      const items = block.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()))
      return (
        <ol key={i} className="space-y-2 my-3 list-none">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 text-white/70 text-sm leading-relaxed">
              <span className="text-brand-green font-black text-xs mt-0.5 flex-shrink-0 w-4">
                {j + 1}.
              </span>
              <span dangerouslySetInnerHTML={{ __html: boldify(item.replace(/^\d+\.\s/, '')) }} />
            </li>
          ))}
        </ol>
      )
    }
    // Parágrafo normal
    return (
      <p
        key={i}
        className="text-white/65 text-sm leading-relaxed my-3"
        dangerouslySetInnerHTML={{ __html: boldify(block) }}
      />
    )
  })
}

/** Substitui **bold** por <strong> */
function boldify(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
}

type FormState = {
  nome: string
  email: string
  modalidade: string
  kmSemana: string
  objetivo: string
  questao: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ConsultaPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [analysis, setAnalysis] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState<FormState>({
    nome: '',
    email: '',
    modalidade: '',
    kmSemana: '',
    objetivo: '',
    questao: '',
  })

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Erro desconhecido. Tenta novamente.')
        setStatus('error')
        return
      }
      setAnalysis(data.analysis)
      setStatus('success')
    } catch {
      setErrorMsg('Sem conexão. Verifica a internet e tenta novamente.')
      setStatus('error')
    }
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
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase">
                Gratuito · Resposta imediata por IA
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
              Descreve a tua situação e em segundos recebes uma análise técnica personalizada —
              gerada por IA especializada em fisiologia do exercício e treino de corrida.
              Completamente gratuita.
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
      <section id="formulario" className="py-20" style={{ background: '#080808' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-4">
            Formulário
          </p>
          <h2 className="font-display text-white text-4xl leading-none mb-10">
            CONTA-NOS A<br /><span className="text-brand-green">TUA SITUAÇÃO.</span>
          </h2>

          {/* ── LOADING ── */}
          {status === 'loading' && (
            <div className="text-center py-24 rounded-2xl border border-white/5 bg-white/[0.015]">
              <Loader2 size={36} className="text-brand-green mx-auto mb-5 animate-spin" />
              <h3 className="text-white font-black text-base mb-2">A analisar o teu perfil…</h3>
              <p className="text-white/35 text-xs font-mono">
                IA a processar os teus dados de corrida
              </p>
            </div>
          )}

          {/* ── RESULTADO DA IA ── */}
          {status === 'success' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-5 border-b border-white/5">
                <CheckCircle size={20} className="text-brand-green flex-shrink-0" />
                <div>
                  <p className="text-white font-black text-sm">Análise gerada para {form.nome}</p>
                  <p className="text-white/30 text-xs font-mono mt-0.5">
                    Baseada nos dados que forneceste · {form.modalidade} · {form.kmSemana && `${form.kmSemana} km/sem`}
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-2xl border border-brand-green/15 bg-brand-green/[0.03]">
                {renderMarkdown(analysis)}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => { setStatus('idle'); setAnalysis('') }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white/50 text-sm font-bold rounded-full hover:border-white/20 hover:text-white transition-all"
                >
                  Fazer nova consulta
                </button>
                <a
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all"
                >
                  Aprofundar no arquivo <ArrowRight size={14} />
                </a>
              </div>
            </div>
          )}

          {/* ── ERRO ── */}
          {status === 'error' && (
            <div className="mb-6 flex items-start gap-3 p-5 rounded-xl border border-red-500/20 bg-red-500/5">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 text-sm font-bold">Erro</p>
                <p className="text-red-400/70 text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* ── FORMULÁRIO ── */}
          {(status === 'idle' || status === 'error') && (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="Opcional — para receber uma cópia"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-green/50 transition-all"
                  />
                </div>
              </div>

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

              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                  A tua questão ou situação *
                </label>
                <textarea
                  required
                  value={form.questao}
                  onChange={set('questao')}
                  rows={5}
                  placeholder="Descreve a tua situação atual, o que já tentaste, e qual é a dúvida principal. Quanto mais detalhe, melhor a análise."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-green/50 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-white/25 text-xs max-w-xs leading-relaxed">
                  Análise gerada por IA em segundos. 100% gratuito.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all hover:scale-105 active:scale-95"
                >
                  Obter análise <ArrowRight size={15} />
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-3">
            <Mail size={14} className="text-white/25" />
            <p className="text-white/25 text-xs">
              Preferes contacto direto?{' '}
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
