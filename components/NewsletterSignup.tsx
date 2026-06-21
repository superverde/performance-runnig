'use client'

import { useState } from 'react'

interface Props {
  variant?: 'hero' | 'inline' | 'footer'
}

export function NewsletterSignup({ variant = 'inline' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')

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
      <div className="w-full max-w-xl mx-auto text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green mb-3">
          Newsletter Gratuita
        </p>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-3 leading-none">
          TREINA COM CIÊNCIA.
        </h2>
        <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
          Artigos sobre fisiologia, periodização e performance — direto para o teu email, sem spam.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 text-brand-green font-bold text-sm">
            <span>✓</span> Subscrito! Verifica o teu email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="o.teu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-green/50 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-brand-green text-black font-black text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? '...' : 'SUBSCREVER'}
            </button>
          </form>
        )}

        {status === 'duplicate' && (
          <p className="text-white/40 text-xs mt-3">Já estás na lista. Obrigado!</p>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-xs mt-3">Erro. Tenta novamente.</p>
        )}
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
        <p className="text-white/40 text-sm mb-5">
          Ciência do treino direto no teu email. Grátis, sem spam.
        </p>

        {status === 'success' ? (
          <p className="text-brand-green font-bold text-sm">✓ Subscrito! Verifica o teu email.</p>
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
              className="bg-brand-green text-black font-black text-xs tracking-widest px-5 py-2.5 rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? '...' : 'SUBSCREVER →'}
            </button>
          </form>
        )}

        {status === 'duplicate' && (
          <p className="text-white/40 text-xs mt-2">Já estás na lista!</p>
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
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mb-4">Newsletter</p>
      {status === 'success' ? (
        <p className="text-brand-green text-sm font-bold">✓ Subscrito!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white/5 border border-white/8 rounded-md px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-green/40 transition-colors min-w-0"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-brand-green text-black font-black text-[10px] tracking-wider px-3 py-2 rounded-md hover:bg-brand-green/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? '…' : 'OK'}
          </button>
        </form>
      )}
      {status === 'duplicate' && <p className="text-white/30 text-xs mt-1.5">Já estás na lista!</p>}
      {status === 'error' && <p className="text-red-400 text-xs mt-1.5">Erro. Tenta novamente.</p>}
    </div>
  )
}
