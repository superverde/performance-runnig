'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Zonas (percentagens amplamente usadas na literatura de treino) ──────────
// %FCmáx: modelo simples de 5 zonas; Karvonen usa FC de reserva (FCmáx − FCrep),
// que ajusta as zonas ao nível de condição física individual — é o método
// recomendado quando se conhece a FC de repouso.
const ZONES = [
  { z: 'Z1', nome: 'Recuperação',     pctLo: 0.50, pctHi: 0.60, desc: 'Regeneração ativa, aquecimento e retorno à calma. Esforço quase imperceptível.' },
  { z: 'Z2', nome: 'Base Aeróbia',    pctLo: 0.60, pctHi: 0.70, desc: 'A zona onde deve viver ~80% do teu volume. Conversa completa possível.' },
  { z: 'Z3', nome: 'Aeróbio Intenso', pctLo: 0.70, pctHi: 0.80, desc: 'Ritmo de maratona/corrida "moderada". Frases curtas.' },
  { z: 'Z4', nome: 'Limiar',          pctLo: 0.80, pctHi: 0.90, desc: 'Tempo runs e ritmo de 10k-21k. Confortavelmente difícil.' },
  { z: 'Z5', nome: 'VO2max',          pctLo: 0.90, pctHi: 1.00, desc: 'Intervalos curtos e intensos. Insustentável por mais de alguns minutos.' },
]

function tanakaMax(age: number): number {
  return Math.round(208 - 0.7 * age) // Tanaka et al. (2001), mais preciso que 220-idade
}

export function ZonasFcClient() {
  const [idade, setIdade] = useState('40')
  const [fcMax, setFcMax] = useState('')     // opcional: FCmáx real medida
  const [fcRep, setFcRep] = useState('')     // opcional: FC repouso p/ Karvonen
  const [result, setResult] = useState<null | { max: number; rep: number | null; estimada: boolean }>(null)

  function calcular() {
    const a = parseInt(idade, 10)
    const maxIn = parseInt(fcMax, 10)
    const repIn = parseInt(fcRep, 10)
    const max = !isNaN(maxIn) && maxIn >= 120 && maxIn <= 230 ? maxIn : (!isNaN(a) && a >= 10 && a <= 100 ? tanakaMax(a) : null)
    if (!max) return
    const rep = !isNaN(repIn) && repIn >= 30 && repIn <= 100 ? repIn : null
    setResult({ max, rep, estimada: isNaN(maxIn) || maxIn < 120 })
  }

  return (
    <section className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <Link href="/ferramentas" className="text-[11px] uppercase tracking-[0.25em] text-brand-green font-bold mb-3 inline-block hover:text-white transition-colors">
            ← Ferramentas
          </Link>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight mb-4" style={{ fontStyle: 'italic' }}>
            ZONAS DE FREQUÊNCIA CARDÍACA
          </h1>
          <p className="text-white/50 text-base max-w-xl">
            Calcula as tuas 5 zonas de treino por percentagem da FC máxima e — se souberes a tua FC de repouso — pelo método de Karvonen (FC de reserva), mais individualizado.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Idade</label>
              <input type="number" value={idade} onChange={e => setIdade(e.target.value)} min={10} max={100}
                className="w-20 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-brand-green transition-colors" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">FC máx real <span className="text-white/20 normal-case">(opcional)</span></label>
              <input type="number" value={fcMax} onChange={e => setFcMax(e.target.value)} placeholder="ex: 188" min={120} max={230}
                className="w-24 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-brand-green transition-colors" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">FC repouso <span className="text-white/20 normal-case">(opcional)</span></label>
              <input type="number" value={fcRep} onChange={e => setFcRep(e.target.value)} placeholder="ex: 55" min={30} max={100}
                className="w-24 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-brand-green transition-colors" />
            </div>
            <button onClick={calcular}
              className="px-6 py-2.5 bg-brand-green text-black text-sm font-black rounded-lg hover:bg-white transition-colors">
              CALCULAR
            </button>
          </div>

          {result && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-wrap gap-6 p-5 rounded-xl border border-brand-green/20 bg-brand-green/5">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-brand-green/70 font-bold mb-1">FC Máxima {result.estimada ? '(estimada — Tanaka)' : '(medida)'}</div>
                  <div className="font-display text-4xl text-brand-green leading-none">{result.max} <span className="text-sm text-white/40">bpm</span></div>
                </div>
                {result.rep && (
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-brand-green/70 font-bold mb-1">FC de Reserva</div>
                    <div className="font-display text-4xl text-white leading-none">{result.max - result.rep} <span className="text-sm text-white/40">bpm</span></div>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-white/60 border-b border-white/10">
                      <th className="text-left py-3 pr-4">Zona</th>
                      <th className="text-left py-3 pr-4">% FCmáx</th>
                      {result.rep && <th className="text-left py-3 pr-4">Karvonen (FCR)</th>}
                      <th className="text-left py-3 hidden sm:table-cell">Para que serve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ZONES.map((zn) => {
                      const lo = Math.round(zn.pctLo * result.max)
                      const hi = Math.round(zn.pctHi * result.max)
                      const kLo = result.rep ? Math.round(result.rep + zn.pctLo * (result.max - result.rep)) : null
                      const kHi = result.rep ? Math.round(result.rep + zn.pctHi * (result.max - result.rep)) : null
                      return (
                        <tr key={zn.z} className="border-b border-white/5">
                          <td className="py-3 pr-4">
                            <span className="font-black text-brand-green">{zn.z}</span>
                            <span className="text-white/60 ml-2">{zn.nome}</span>
                          </td>
                          <td className="py-3 pr-4 font-mono text-white/80">{lo}–{hi} bpm</td>
                          {result.rep && <td className="py-3 pr-4 font-mono text-brand-green">{kLo}–{kHi} bpm</td>}
                          <td className="py-3 text-white/40 text-xs hidden sm:table-cell">{zn.desc}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-white/55 text-sm leading-relaxed">
                A FC máxima estimada usa a fórmula de Tanaka (208 − 0,7 × idade), mais precisa que a clássica 220 − idade. O método de Karvonen calcula cada zona sobre a FC de reserva (FCmáx − FC repouso), refletindo melhor a tua condição física atual. Para valores exatos, mede a FCmáx num teste de terreno ou de laboratório.
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <Link href="/ferramentas" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-brand-green/40 hover:text-brand-green transition-all">Calculadora VDOT</Link>
          <Link href="/ferramentas/splits" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-brand-green/40 hover:text-brand-green transition-all">Tabela de Passagens</Link>
          <Link href="/blog/frequencia-cardiaca-maxima-calcular" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-brand-green/40 hover:text-brand-green transition-all">Artigo: FC Máxima</Link>
          <Link href="/blog/treino-base-aerobia-importancia" className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-brand-green/40 hover:text-brand-green transition-all">Artigo: Base Aeróbia</Link>
        </div>
      </div>
    </section>
  )
}
