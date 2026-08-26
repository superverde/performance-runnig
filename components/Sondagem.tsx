'use client'

import { useEffect, useState } from 'react'
import type { Sondagem as SondagemDef } from '@/lib/sondagens'

/**
 * Sondagem de uma pergunta no fim do artigo.
 *
 * Os resultados só aparecem depois de votar — é o que faz as pessoas votarem.
 * Enquanto houver menos de 20 votos não mostramos percentagens: uma sondagem
 * com "100% (1 voto)" parece morta e tira credibilidade em vez de a dar.
 */
export function Sondagem({ sondagem }: { sondagem: SondagemDef }) {
  const [votou, setVotou] = useState<string | null>(null)
  const [contagens, setContagens] = useState<Record<string, number> | null>(null)
  const [aEnviar, setAEnviar] = useState(false)
  const [erro, setErro] = useState(false)

  const chaveLocal = `sondagem:${sondagem.id}`

  useEffect(() => {
    try {
      const anterior = window.localStorage.getItem(chaveLocal)
      if (anterior) {
        setVotou(anterior)
        fetch(`/api/sondagem?id=${sondagem.id}`)
          .then((r) => r.json())
          .then((d) => setContagens(d.contagens ?? {}))
          .catch(() => {})
      }
    } catch {
      // localStorage bloqueado (modo privado, etc.) — a sondagem continua a funcionar.
    }
  }, [chaveLocal, sondagem.id])

  async function votar(opcao: string) {
    setAEnviar(true)
    setErro(false)
    try {
      const res = await fetch('/api/sondagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sondagem.id, opcao }),
      })
      if (!res.ok) throw new Error('falhou')
      const data = await res.json()
      setContagens(data.contagens ?? {})
      setVotou(opcao)
      try { window.localStorage.setItem(chaveLocal, opcao) } catch {}
    } catch {
      setErro(true)
    } finally {
      setAEnviar(false)
    }
  }

  const total = contagens ? Object.values(contagens).reduce((a, b) => a + b, 0) : 0
  const mostrarPercentagens = total >= 20

  return (
    <section className="mt-14 pt-8 border-t border-white/5">
      <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-4">
        Responde em 1 segundo
      </p>

      <div className="p-6 rounded-xl border border-white/8 bg-white/[0.015]">
        <h3 className="text-white font-bold text-base mb-5">{sondagem.pergunta}</h3>

        <div className="flex flex-col gap-2.5">
          {sondagem.opcoes.map((opcao) => {
            const n = contagens?.[opcao] ?? 0
            const pct = total > 0 ? Math.round((n / total) * 100) : 0
            const escolhida = votou === opcao

            if (votou) {
              return (
                <div key={opcao} className="relative overflow-hidden rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3">
                  {mostrarPercentagens && (
                    <div
                      className="absolute inset-y-0 left-0 bg-brand-green/12"
                      style={{ width: `${pct}%` }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex items-center justify-between gap-3">
                    <span className={`text-sm ${escolhida ? 'text-brand-green font-bold' : 'text-white/60'}`}>
                      {opcao}{escolhida && ' ·  a tua resposta'}
                    </span>
                    <span className="text-xs font-mono text-white/40 tabular-nums shrink-0">
                      {mostrarPercentagens ? `${pct}%` : `${n}`}
                    </span>
                  </div>
                </div>
              )
            }

            return (
              <button
                key={opcao}
                onClick={() => votar(opcao)}
                disabled={aEnviar}
                className="text-left px-4 py-3 rounded-lg border border-white/10 text-white/70 text-sm hover:border-brand-green/50 hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green transition-all disabled:opacity-40"
              >
                {opcao}
              </button>
            )
          })}
        </div>

        {votou && (
          <p className="mt-4 text-[11px] text-white/25">
            {mostrarPercentagens
              ? `${total} respostas até agora.`
              : `${total} ${total === 1 ? 'resposta' : 'respostas'} até agora — as percentagens aparecem a partir das 20.`}
            {' '}Sem registo, sem dados pessoais.
          </p>
        )}

        {erro && (
          <p className="mt-4 text-[11px] text-red-400/70">
            Não foi possível registar o voto. Tenta outra vez daqui a pouco.
          </p>
        )}
      </div>
    </section>
  )
}
