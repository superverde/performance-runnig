'use client'

import { useState } from 'react'
import { ArrowRight, Mail, Lightbulb } from 'lucide-react'

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false)
  const [topic, setTopic] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <section className="pt-28 pb-16 border-b border-white/5 bg-[#0D0D0D]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-green text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4">
            Sugestões
          </p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none mb-6">
            Sugere um<br />
            <span className="text-brand-green">Tema</span>
          </h1>
          <p className="text-white/45 text-base leading-relaxed max-w-lg">
            Há algum tópico sobre corrida, fisiologia ou treino que gostarias de ver abordado?
            Envia a tua sugestão — os temas mais pedidos entram na fila de publicação.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        {submitted ? (
          <div className="text-center py-16 rounded-xl border border-brand-green/20 bg-brand-green/5">
            <Lightbulb size={40} className="text-brand-green mx-auto mb-4" />
            <h2 className="text-xl font-black mb-2 text-white">Sugestão Recebida!</h2>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              Obrigado. Vamos analisar o tema e incluí-lo na programação de artigos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                Que tema queres ver abordado? *
              </label>
              <textarea
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                placeholder="Ex: Como melhorar a economia de corrida, Nutrição antes de um ultra trail, Diferenças entre treino de 5km e maratona..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-green/50 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-brand-green/90 transition-all hover:scale-105 active:scale-95"
            >
              Enviar Sugestão <ArrowRight size={15} />
            </button>
          </form>
        )}

        <div className="mt-14 pt-8 border-t border-white/5">
          <p className="text-white/25 text-xs font-mono uppercase tracking-widest mb-4">Contacto</p>
          <a
            href="mailto:info@performancerunning.pt"
            className="inline-flex items-center gap-3 text-white/40 hover:text-brand-green transition-colors text-sm"
          >
            <Mail size={15} />
            info@performancerunning.pt
          </a>
        </div>
      </div>
    </>
  )
}
