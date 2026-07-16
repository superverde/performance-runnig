'use client'

import { useEffect, useState } from 'react'
import { Mail, Zap, ShieldCheck, TrendingUp, Gift, Download } from 'lucide-react'

interface Props {
  variant?: 'hero' | 'inline' | 'footer'
}

const benefits = [
  { icon: Gift, text: 'Oferta: Plano de Treino 10 km em 8 Semanas (PDF)' },
  { icon: Zap, text: '3 artigos científicos por semana, em resumo' },
  { icon: TrendingUp, text: 'Estudos e novidades antes de saírem no site' },
  { icon: ShieldCheck, text: 'Zero spam — cancela com um clique' },
]

export function NewsletterSignup({ variant = 'inline' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)

  useEffect(() => {
    if (variant !== 'hero') return
    fetch('/api/newsletter/count')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        // só mostra a prova social a partir de um número que reforça
        // confiança — com poucos subscritores o efeito é o oposto
        if (data?.count && data.count >= 50) setSubscriberCount(data.count)
      })
      .catch(() => {})
  }, [variant])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
      } else if (data.message === 'already_subscribed') {
        setStatus('duplicate')
      } else {
        setStatus('success')
        setEmail('')
      }
    } catch {
      setStatus('error')
    }
  }

  // ─── HERO variant (homepage, secção grande) ───────────────────────────────
  if (variant === 'hero') {
    return (
      <div className="relative w-full max-w-2xl mx-auto">
        {/* glow decorativo atrás do cartão */}
        <div className="absolute -inset-x-10 -inset-y-6 bg-brand-green/8 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-10 sm:p-16 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-brand-green/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-green/10 border border-brand-green/20 mb-6">
            <Mail size={26} className="text-brand-green" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-green mb-4">
            Newsletter Gratuita
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-4 leading-none">
            TREINA COM CIÊNCIA.
          </h2>
          <p className="text-white/50 text-base sm:text-lg mb-10 max-w-md mx-auto">
            Os melhores artigos sobre fisiologia, periodização e performance — direto para o teu email. Sem spam, para sempre grátis.
          </p>

          {/* Benefícios */}
          <ul className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-white/65 text-sm font-medium">
                <Icon size={18} className="text-brand-green shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {status === 'success' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-brand-green font-bold text-sm">
                <span>✓</span> Subscrito! Verifica o teu email.
              </div>
              <a href="/plano-10km-performance-running.pdf" download
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all">
                <Download size={15} /> Descarregar o Plano de 10 km (PDF)
              </a>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="o.teu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-5 py-4 text-base text-white placeholder-white/25 focus:outline-none focus:border-brand-green/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-brand-green text-black font-black text-sm tracking-widest px-7 py-4 rounded-lg hover:bg-white transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {status === 'loading' ? '...' : 'QUERO RECEBER'}
                </button>
              </form>
              <p className="text-white/60 text-sm mt-4">
                Grátis para sempre. Cancela quando quiseres, num clique.
              </p>
            </>
          )}

          {status === 'duplicate' && (
            <p className="text-white/60 text-xs mt-3">Já estás na lista. Obrigado!</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-xs mt-3">Erro. Tenta novamente.</p>
          )}

          {subscriberCount !== null && status !== 'success' && (
            <p className="text-white/50 text-xs mt-5 font-mono">
              Junta-te a {subscriberCount.toLocaleString('pt-PT')}+ corredores que já treinam com ciência
            </p>
          )}
        </div>
      </div>
    )
  }

  // ─── INLINE variant (fim de artigos) ─────────────────────────────────────
  if (variant === 'inline') {
    return (
      <div className="border border-white/8 rounded-xl p-6 sm:p-8 bg-white/2">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green mb-2">
          Newsletter
        </p>
        <h3 className="text-xl font-black tracking-tight mb-1">
          Mais artigos como este.
        </h3>
        <p className="text-white/60 text-sm mb-4">
          Ciência do treino direto no teu email — grátis, sem spam, cancela quando quiseres.
        </p>

        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 mb-5">
          {benefits.map(({ text }) => (
            <li key={text} className="flex items-center gap-1.5 text-white/65 text-xs">
              <span className="text-brand-green">✓</span> {text}
            </li>
          ))}
        </ul>

        {status === 'success' ? (
          <div className="space-y-3">
            <p className="text-brand-green font-bold text-sm">✓ Subscrito! Verifica o teu email.</p>
            <a href="/plano-10km-performance-running.pdf" download
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-black text-xs font-black rounded-full hover:bg-white transition-all">
              <Download size={13} /> O teu Plano de 10 km (PDF)
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="o.teu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-green/50 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-brand-green text-black font-black text-xs tracking-widest px-5 py-2.5 rounded-lg hover:bg-white transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? '...' : 'SUBSCREVER →'}
            </button>
          </form>
        )}

        {status === 'duplicate' && (
          <p className="text-white/60 text-xs mt-2">Já estás na lista!</p>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2">Erro. Tenta novamente.</p>
        )}
      </div>
    )
  }

  // ─── FOOTER variant (rodapé compacto) ─────────────────────────────────────
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Newsletter</p>
      <p className="text-white/60 text-xs mb-3">3x/semana. Grátis. Zero spam.</p>
      {status === 'success' ? (
        <div>
          <p className="text-brand-green text-sm font-bold">✓ Subscrito!</p>
          <a href="/plano-10km-performance-running.pdf" download className="text-brand-green text-xs underline hover:text-white transition-colors">Plano de 10 km grátis (PDF)</a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-green/40 transition-colors min-w-0"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-brand-green text-black font-black text-[10px] tracking-wider px-3 py-2 rounded-md hover:bg-white transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? '…' : 'OK'}
          </button>
        </form>
      )}
      {status === 'duplicate' && <p className="text-white/55 text-xs mt-1.5">Já estás na lista!</p>}
      {status === 'error' && <p className="text-red-400 text-xs mt-1.5">Erro. Tenta novamente.</p>}
    </div>
  )
}
