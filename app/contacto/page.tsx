'use client'

import { useState } from 'react'
import { ArrowRight, Mail, MessageSquare } from 'lucide-react'

const goals = [
  '5 km — melhorar tempo',
  '10 km — primeira prova',
  'Meia Maratona',
  'Maratona',
  'Trail Running',
  'Ultra Trail',
  'Atletismo / Pista',
  'Outro',
]

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    goal: '',
    level: '',
    message: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In production: send to API route or email service
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-brand-gray to-brand-dark">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-green text-xs font-mono font-semibold tracking-widest uppercase mb-4">
            CONTACTO
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Vamos <span className="text-brand-green">Começar</span>?
          </h1>
          <p className="text-brand-text text-base max-w-lg mx-auto">
            Preenche o formulário abaixo. Respondo em menos de 24 horas com uma proposta adaptada ao teu perfil.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {submitted ? (
          <div className="text-center py-16 rounded-xl border border-brand-green/30 bg-brand-green/5">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-black mb-2">Mensagem Recebida!</h2>
            <p className="text-brand-text text-sm">
              Obrigado, {form.name}. Entrarei em contacto em menos de 24 horas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Nome */}
              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="O teu nome"
                  className="w-full px-4 py-3 rounded-md bg-brand-muted border border-brand-border text-white placeholder-brand-text/40 text-sm focus:outline-none focus:border-brand-green transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                  className="w-full px-4 py-3 rounded-md bg-brand-muted border border-brand-border text-white placeholder-brand-text/40 text-sm focus:outline-none focus:border-brand-green transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Objetivo */}
              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Objetivo Principal *
                </label>
                <select
                  name="goal"
                  required
                  value={form.goal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md bg-brand-muted border border-brand-border text-white text-sm focus:outline-none focus:border-brand-green transition-colors"
                >
                  <option value="">Selecionar...</option>
                  {goals.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Nível */}
              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  Nível Atual
                </label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md bg-brand-muted border border-brand-border text-white text-sm focus:outline-none focus:border-brand-green transition-colors"
                >
                  <option value="">Selecionar...</option>
                  <option value="iniciante">Iniciante (menos de 1 ano)</option>
                  <option value="intermedio">Intermédio (1-3 anos)</option>
                  <option value="avancado">Avançado (3+ anos)</option>
                  <option value="competicao">Competição regular</option>
                </select>
              </div>
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                Conta-me mais sobre ti
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Historial de corrida, lesões anteriores, disponibilidade semanal, prova-alvo com data..."
                className="w-full px-4 py-3 rounded-md bg-brand-muted border border-brand-border text-white placeholder-brand-text/40 text-sm focus:outline-none focus:border-brand-green transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-green text-black font-bold rounded-md hover:bg-brand-green/90 transition-all hover:gap-3 text-sm"
            >
              Enviar Mensagem <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Alternative contact */}
        <div className="mt-12 pt-8 border-t border-brand-border flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:coaching@performancerunning.pt"
            className="flex items-center gap-3 p-4 rounded-lg border border-brand-border bg-brand-muted hover:border-brand-green/40 transition-colors flex-1"
          >
            <Mail size={18} className="text-brand-green" />
            <div>
              <p className="text-xs text-brand-text">Email direto</p>
              <p className="text-sm font-semibold text-white">coaching@performancerunning.pt</p>
            </div>
          </a>
          <a
            href="https://wa.me/351900000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border border-brand-border bg-brand-muted hover:border-brand-green/40 transition-colors flex-1"
          >
            <MessageSquare size={18} className="text-brand-green" />
            <div>
              <p className="text-xs text-brand-text">WhatsApp</p>
              <p className="text-sm font-semibold text-white">Mensagem rápida</p>
            </div>
          </a>
        </div>
      </div>
    </>
  )
}
