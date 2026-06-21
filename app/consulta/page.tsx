'use client'

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Message {
  role: 'user' | 'model'
  content: string
}

const WELCOME: Message = {
  role: 'model',
  content:
    'Olá! Sou especialista em corrida, atletismo e trail. Podes perguntar-me sobre treino, nutrição, lesões, preparação para maratona, técnica de corrida — qualquer dúvida. É gratuito e a resposta é imediata.\n\nPor onde queres começar?',
}

export default function ConsultaPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
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
      <Navbar />

      {/* Page header */}
      <div
        style={{
          paddingTop: '90px',
          paddingBottom: '20px',
          textAlign: 'center',
          borderBottom: '1px solid #1a1a1a',
          background: '#0a0a0a',
        }}
      >
        <p
          style={{
            color: '#00c896',
            fontSize: '10px',
            letterSpacing: '3px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          CONSULTA GRATUITA
        </p>
        <h1
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            color: '#fff',
            letterSpacing: '2px',
            margin: '0 0 6px',
          }}
        >
          ESPECIALISTA EM CORRIDA
        </h1>
        <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>
          Resposta imediata · 100% gratuito · Powered by Gemini AI
        </p>
      </div>

      {/* Chat container */}
      <main
        style={{
          background: '#0a0a0a',
          minHeight: 'calc(100vh - 160px)',
          paddingBottom: '110px',
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '24px 16px 8px',
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '20px',
                gap: '10px',
                alignItems: 'flex-start',
              }}
            >
              {msg.role === 'model' && (
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#00c896',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#000',
                    flexShrink: 0,
                    marginTop: '2px',
                    letterSpacing: '0.5px',
                  }}
                >
                  PR
                </div>
              )}

              <div
                style={{
                  maxWidth: '78%',
                  padding: '12px 16px',
                  borderRadius:
                    msg.role === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#1c1c1c' : '#0f1f1a',
                  border:
                    msg.role === 'user'
                      ? '1px solid #2a2a2a'
                      : '1px solid rgba(0,200,150,0.25)',
                  color: msg.role === 'user' ? '#ccc' : '#ddd',
                  fontSize: '15px',
                  lineHeight: '1.65',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#1c1c1c',
                    border: '1px solid #2a2a2a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  🏃
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: '#00c896',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#000',
                  flexShrink: 0,
                }}
              >
                PR
              </div>
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '16px 16px 16px 4px',
                  background: '#0f1f1a',
                  border: '1px solid rgba(0,200,150,0.25)',
                  color: '#555',
                  fontSize: '14px',
                  fontStyle: 'italic',
                }}
              >
                A analisar...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Fixed input bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #1a1a1a',
          padding: '12px 16px',
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Faz a tua pergunta... (Enter para enviar)"
            rows={1}
            style={{
              flex: 1,
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              color: '#e0e0e0',
              padding: '11px 14px',
              fontSize: '15px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              maxHeight: '120px',
              overflowY: 'auto',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(0,200,150,0.4)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#2a2a2a'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? '#111' : '#00c896',
              color: loading || !input.trim() ? '#333' : '#000',
              border:
                '1px solid ' +
                (loading || !input.trim() ? '#222' : '#00c896'),
              borderRadius: '12px',
              padding: '11px 18px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            {loading ? '···' : 'ENVIAR'}
          </button>
        </div>
        <p
          style={{
            textAlign: 'center',
            color: '#2a2a2a',
            fontSize: '11px',
            margin: '6px 0 0',
          }}
        >
          IA pode cometer erros · Para questões médicas consulta um profissional de saúde
        </p>
      </div>

      <Footer />
    </>
  )
}
