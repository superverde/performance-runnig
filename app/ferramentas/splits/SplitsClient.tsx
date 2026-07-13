'use client'

import { useState } from 'react'
import Link from 'next/link'

type DistKey = '5km' | '10km' | 'meia' | 'maratona'

const DISTS: Record<DistKey, { label: string; km: number }> = {
  '5km':      { label: '5 km',          km: 5 },
  '10km':     { label: '10 km',         km: 10 },
  'meia':     { label: 'Meia Maratona', km: 21.0975 },
  'maratona': { label: 'Maratona',      km: 42.195 },
}

type Estrategia = 'uniforme' | 'negativo'

function fmt(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.round(sec % 60)
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

export function SplitsClient() {
  const [dist, setDist] = useState<DistKey>('10km')
  const [hh, setHh] = useState('0')
  const [mm, setMm] = useState('50')
  const [ss, setSs] = useState('0')
  const [estrategia, setEstrategia] = useState<Estrategia>('uniforme')
  const [rows, setRows] = useState<null | { km: string; split: string; acumulado: string }[]>(null)

  function calcular() {
    const total = (parseInt(hh, 10) || 0) * 3600 + (parseInt(mm, 10) || 0) * 60 + (parseInt(ss, 10) || 0)
    if (total < 600) return
    const { km } = DISTS[dist]
    const nFull = Math.floor(km)
    const resto = km - nFull

    // Negative split: 1ª metade ~2% mais lenta, 2ª metade ~2% mais rápida —
    // a estratégia com melhor suporte empírico para provas de fundo.
    const paceMedio = total / km
    const out: { km: string; split: string; acumulado: string }[] = []
    let acc = 0
    for (let i = 1; i <= nFull; i++) {
      const frac = (i - 0.5) / km
      const fator = estrategia === 'negativo' ? 1.02 - 0.04 * frac : 1
      const split = paceMedio * fator
      acc += split
      out.push({ km: String(i), split: fmt(split), acumulado: fmt(acc) })
    }
    if (resto > 0.001) {
      const split = (total - acc)
      out.push({ km: DISTS[dist].label.includes('Meia') ? '21,1' : '42,2', split: fmt(split), acumulado: fmt(total) })
    }
    setRows(out)
  }

  return (
    <section className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <Link href="/ferramentas" className="text-[11px] uppercase tracking-[0.25em] text-brand-green font-bold mb-3 inline-block hover:text-white transition-colors">
            ← Ferramentas
          </Link>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight mb-4" style={{ fontStyle: 'italic' }}>
            TABELA DE PASSAGENS
          </h1>
          <p className="text-white/50 text-base max-w-xl">
            Define o teu tempo alvo e recebe os tempos de passagem km a km — com ritmo uniforme ou negative split (segunda metade mais rápida). Ideal para escrever no braço ou memorizar antes da prova.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">Distância</label>
              <select value={dist} onChange={e => setDist(e.target.value as DistKey)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors cursor-pointer">
                {(Object.keys(DISTS) as DistKey[]).map(k => (
                  <option key={k} value={k} className="bg-black">{DISTS[k].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">Tempo alvo (h : min : s)</label>
              <div className="flex gap-1.5 items-center">
                <input type="number" value={hh} onChange={e => setHh(e.target.value)} min={0} max={9}
                  className="w-14 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-brand-green transition-colors" />
                <span className="text-white/30">:</span>
                <input type="number" value={mm} onChange={e => setMm(e.target.value)} min={0} max={59}
                  className="w-14 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-brand-green transition-colors" />
                <span className="text-white/30">:</span>
                <input type="number" value={ss} onChange={e => setSs(e.target.value)} min={0} max={59}
                  className="w-14 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-brand-green transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">Estratégia</label>
              <div className="flex gap-2">
                {([['uniforme', 'Uniforme'], ['negativo', 'Negative Split']] as [Estrategia, string][]).map(([v, l]) => (
                  <button key={v} onClick={() => setEstrategia(v)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      estrategia === v ? 'bg-brand-green text-black' : 'bg-white/5 text-white/50 border border-white/10 hover:text-white'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={calcular}
              className="px-6 py-2.5 bg-brand-green text-black text-sm font-black rounded-lg hover:bg-white transition-colors">
              GERAR TABELA
            </button>
          </div>

          {rows && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {rows.map((r) => (
                  <div key={r.km} className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="text-[10px] font-mono text-brand-green/70 uppercase tracking-wider mb-1">Km {r.km}</div>
                    <div className="font-mono text-white text-lg leading-none">{r.acumulado}</div>
                    <div className="text-[10px] font-mono text-white/30 mt-1">parcial {r.split}</div>
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-xs leading-relaxed">
                {estrategia === 'negativo'
                  ? 'Negative split: começa ~2% mais lento que o ritmo médio e acaba ~2% mais rápido — a estratégia usada na maioria dos recordes do mundo de fundo.'
                  : 'Ritmo uniforme: o mesmo parcial em todos os quilómetros. Em provas com desnível, ajusta mentalmente ±5-10 s/km nas subidas e descidas.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <Link href="/ferramentas" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-brand-green/40 hover:text-brand-green transition-all">Calculadora VDOT</Link>
          <Link href="/ferramentas/zonas-fc" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-brand-green/40 hover:text-brand-green transition-all">Zonas de FC</Link>
          <Link href="/calendario" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-brand-green/40 hover:text-brand-green transition-all">Calendário de Provas</Link>
        </div>
      </div>
    </section>
  )
}
