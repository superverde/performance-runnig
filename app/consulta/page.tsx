'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowUp, Zap, Shield, Clock } from 'lucide-react'

interface Message {
  role: 'user' | 'model'
  content: string
}

const WELCOME: Message = {
  role: 'model',
  content:
    'Olá! Sou especialista em corrida, atletismo e trail. Podes perguntar-me sobre treino, nutrição, lesões, preparação para maratona, técnica de corrida — qualquer dúvida.\n\nÉ gratuito e a resposta é imediata.\n\nPor onde queres começar?',
}

const SUGGESTIONS = [
  'Como melhorar o meu VO2max?',
  'Plano para primeira maratona',
  'Como evitar lesões no joelho?',
  'Treino de velocidade para 10km',
]

export default function ConsultaPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text?: string) {
    const msg = (text || input).trim()
    if (!msg || loading) return

    if (!started) setStarted(true)

    const userMsg: Message = { role: 'user', content: msg }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const res = await fetch('/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setMessages(prev => [
          ...prev,
          { role: 'model', content: `⚠️ ${data.error || 'Erro. Tenta novamente.'}` },
        ])
      } else {
        setMessages(prev => [...prev, { role: 'model', content: data.reply }])
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'model', content: '⚠️ Erro de ligação. Tenta novamente.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const t = e.currentTarget
    t.style.height = 'auto'
    t.style.height = Math.min(t.scrollHeight, 120) + 'px'
  }

  return (
    <>

      {/* ── Hero ── */}
      <div
        className="relative pt-28 pb-16 overflow-hidden bg-black"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-green/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-green mb-4 font-mono">
            Consulta Gratuita · IA Especializada
          </p>
          <h1
            className="font-display text-white leading-none mb-5"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
          >
            ESPECIALISTA<br />
            <span className="text-brand-green">EM CORRIDA.</span>
          </h1>
          <p className="text-white/70 max-w-lg mx-auto text-lg leading-relaxed mb-10">
            Treino, nutrição, lesões, periodização — resposta imediata e baseada em ciência.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-0">
            {[
              { icon: Zap, label: 'Resposta imediata' },
              { icon: Shield, label: '100% gratuito' },
              { icon: Clock, label: 'Disponível 24/7' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs">
                <Icon size={12} className="text-brand-green" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chat ── */}
      <main className="bg-black min-h-screen pb-36">
        <div className="max-w-3xl mx-auto px-4 pt-10">

          {/* Sugestões — só antes de começar */}
          {!started && messages.length === 1 && (
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55 font-mono mb-4 text-center">
                Perguntas frequentes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-4 py-3 rounded-xl border border-white/8 bg-white/[0.02] text-white/55 text-sm hover:border-brand-green/40 hover:text-white/80 hover:bg-brand-green/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mensagens */}
          <div className="space-y-5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                    msg.role === 'model'
                      ? 'bg-brand-green text-black'
                      : 'bg-white/10 text-white/60 border border-white/10'
                  }`}
                >
                  {msg.role === 'model' ? 'PR' : '🏃'}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-white/8 border border-white/10 text-white/80 rounded-tr-sm'
                      : 'bg-[#0a1f18] border border-brand-green/20 text-white/85 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-xs font-black text-black shrink-0">
                  PR
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#0a1f18] border border-brand-green/20">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      </main>

      {/* ── Input fixo ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/8 px-4 py-3 z-50">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Faz a tua pergunta... (Enter para enviar)"
            rows={1}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl text-white/85 placeholder-white/25 px-4 py-3 text-sm resize-none outline-none transition-colors focus:border-brand-green/40 font-sans leading-relaxed"
            style={{ maxHeight: '120px', overflowY: 'auto' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-brand-green hover:bg-white text-black"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-center text-white/55 text-xs mt-2">
          IA pode cometer erros · Para questões médicas consulta um profissional de saúde
        </p>
      </div>

    </>
  )
}
