'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Standards (recordes do mundo em pista/estrada, usados como "Open Standard")
// Verificados em 2026-07-13. Atualizar sempre que um recorde do mundo cair
// nestas distâncias — ver fonte em cada constante.
//
// Maratona M: Sabastian Sawe, 1:59:30, Londres, 26-04-2026
// Maratona F: Ruth Chepng'etich, 2:09:56, Chicago, 13-10-2024 (recorde misto/geral)
// Meia M: Jacob Kiplimo, 57:20, Lisboa, 08-03-2026
// Meia F: Letesenbet Gidey, 1:02:52, Valência, 24-10-2021
// 10km M: Yomif Kejelcha, 26:31
// 10km F: Agnes Ngetich, 28:46, Valência, 14-01-2024
// 5km M: Berihu Aregawi, 12:49 (estrada), 2021
// 5km F: Beatrice Chebet, 14:13 (estrada), 12-2023

type Gender = 'M' | 'F'
type DistKey = '5km' | '10km' | 'meia' | 'maratona'

const STANDARDS: Record<DistKey, { label: string; dist: number; M: number; F: number }> = {
  '5km':      { label: '5 km',           dist: 5000,  M: 769,  F: 853 },
  '10km':     { label: '10 km',          dist: 10000, M: 1591, F: 1726 },
  'meia':     { label: 'Meia Maratona',  dist: 21097, M: 3440, F: 3772 },
  'maratona': { label: 'Maratona',       dist: 42195, M: 7170, F: 7796 },
}

// ─── Curva de fatores de idade ────────────────────────────────────────────────
// Estimativa baseada em padrões de declínio de performance de resistência
// amplamente documentados na literatura de fisiologia do exercício (não são os
// valores exatos e oficiais da tabela da World Masters Athletics, que tabula
// mais de 10.000 valores distintos por idade/prova/sexo). Serve para dar uma
// classificação aproximada e comparável entre idades — para competição oficial
// de masters, consultar sempre a tabela WMA publicada.
const AGE_FACTOR_ANCHORS: [number, number][] = [
  [18, 1.000], [30, 1.000], [35, 0.985], [40, 0.955], [45, 0.915],
  [50, 0.865], [55, 0.820], [60, 0.770], [65, 0.710], [70, 0.650],
  [75, 0.585], [80, 0.500], [85, 0.420], [90, 0.340], [95, 0.270], [100, 0.200],
]

function ageFactor(age: number): number {
  const a = Math.min(100, Math.max(18, age))
  for (let i = 0; i < AGE_FACTOR_ANCHORS.length - 1; i++) {
    const [a1, f1] = AGE_FACTOR_ANCHORS[i]
    const [a2, f2] = AGE_FACTOR_ANCHORS[i + 1]
    if (a >= a1 && a <= a2) {
      const t = (a - a1) / (a2 - a1)
      return f1 + t * (f2 - f1)
    }
  }
  return AGE_FACTOR_ANCHORS[AGE_FACTOR_ANCHORS.length - 1][1]
}

const TIERS = [
  { min: 100, label: 'Nível de Recorde Mundial', color: '#ef4444' },
  { min: 90,  label: 'Classe Mundial',            color: '#00ff87' },
  { min: 80,  label: 'Classe Nacional',           color: '#3b82f6' },
  { min: 70,  label: 'Classe Regional',           color: '#f59e0b' },
  { min: 60,  label: 'Classe Local',              color: '#a855f7' },
  { min: 0,   label: 'Recreativo',                color: '#94a3b8' },
]

function tierFor(grade: number) {
  return TIERS.find(t => grade >= t.min) ?? TIERS[TIERS.length - 1]
}

function fmtTime(totalSec: number): string {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = Math.round(totalSec % 60)
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`
}

function NumInput({ value, onChange, max = 99, placeholder = '00' }: {
  value: string; onChange: (v: string) => void; max?: number; placeholder?: string
}) {
  return (
    <input
      type="number"
      min={0}
      max={max}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-16 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-brand-green transition-colors"
    />
  )
}

export function AgeGradingClient() {
  const [dist, setDist] = useState<DistKey>('10km')
  const [gender, setGender] = useState<Gender>('M')
  const [age, setAge] = useState('40')
  const [h, setH] = useState(''), [m, setM] = useState(''), [s, setS] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<null | {
    grade: number
    tier: { label: string; color: string }
    factor: number
    effectiveStandard: number
    targets: { pct: number; label: string; time: string }[]
  }>(null)

  function calculate() {
    const ageNum = Number(age)
    const totalSec = (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0)

    if (!ageNum || ageNum < 5 || ageNum > 100) {
      setError('Insere uma idade entre 5 e 100 anos.')
      setResult(null)
      return
    }
    if (totalSec < 30) {
      setError('Insere um tempo de prova válido.')
      setResult(null)
      return
    }

    setError('')
    const standard = STANDARDS[dist][gender]
    const factor = ageFactor(ageNum)
    const effectiveStandard = standard / factor
    const grade = (effectiveStandard / totalSec) * 100

    const targets = [100, 90, 80, 70].map(pct => ({
      pct,
      label: tierFor(pct).label,
      time: fmtTime(effectiveStandard / (pct / 100)),
    }))

    setResult({
      grade: Math.round(grade * 10) / 10,
      tier: tierFor(grade),
      factor: Math.round(factor * 1000) / 1000,
      effectiveStandard,
      targets,
    })
  }

  return (
    <section className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <Link href="/ferramentas" className="text-[11px] uppercase tracking-[0.25em] text-brand-green font-bold mb-3 inline-block hover:text-white transition-colors">
            ← Ferramentas
          </Link>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight mb-4" style={{ fontStyle: 'italic' }}>
            CLASSIFICAÇÃO POR IDADE
          </h1>
          <p className="text-white/50 text-base max-w-xl">
            Compara a tua performance com corredores de qualquer idade e sexo através do age grading — a percentagem da tua prestação face ao nível de recorde do mundo ajustado à tua idade.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Distância</label>
              <select
                value={dist}
                onChange={e => setDist(e.target.value as DistKey)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors cursor-pointer"
              >
                {(Object.keys(STANDARDS) as DistKey[]).map(k => (
                  <option key={k} value={k} className="bg-black">{STANDARDS[k].label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Sexo</label>
              <div className="flex gap-2">
                {(['M', 'F'] as Gender[]).map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      gender === g ? 'bg-brand-green text-black' : 'bg-white/5 text-white/55 border border-white/10 hover:text-white'
                    }`}
                  >
                    {g === 'M' ? 'Masculino' : 'Feminino'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Idade</label>
              <input
                type="number"
                min={5}
                max={100}
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-20 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Tempo (h : mm : ss)</label>
              <div className="flex items-center gap-2">
                <NumInput value={h} onChange={setH} max={9} placeholder="h" />
                <span className="text-white/30 font-bold">:</span>
                <NumInput value={m} onChange={setM} max={59} placeholder="mm" />
                <span className="text-white/30 font-bold">:</span>
                <NumInput value={s} onChange={setS} max={59} placeholder="ss" />
              </div>
            </div>

            <button
              onClick={calculate}
              className="px-6 py-2.5 bg-brand-green text-black font-black text-sm rounded-lg hover:bg-white transition-all"
            >
              CALCULAR
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {result && (
            <div className="space-y-5 animate-fade-in pt-2">
              {/* Grade badge */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border" style={{ background: `${result.tier.color}14`, borderColor: `${result.tier.color}33` }}>
                <div className="text-center sm:text-left">
                  <div className="text-5xl font-black font-mono" style={{ color: result.tier.color }}>{result.grade}%</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold mt-1" style={{ color: result.tier.color }}>Age Grade</div>
                </div>
                <div className="sm:border-l sm:border-white/10 sm:pl-4">
                  <div className="text-lg font-bold text-white">{result.tier.label}</div>
                  <div className="text-white/50 text-xs mt-1">Fator de idade: {result.factor} — equivalente a {fmtTime(result.effectiveStandard)} ao nível de recorde do mundo aberto para a tua idade.</div>
                </div>
              </div>

              {/* Tabela de metas */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold">Classe</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold">Age Grade</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold">Tempo necessário (à tua idade)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.targets.map((t, i) => (
                      <tr key={t.pct} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
                        <td className="px-4 py-3 font-bold text-white">{t.label}</td>
                        <td className="px-4 py-3 font-mono text-white/60">{t.pct}%+</td>
                        <td className="px-4 py-3 font-mono font-bold text-brand-green">{t.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">O que é o Age Grading?</h3>
            <p className="text-white/65 text-sm leading-relaxed">
              O age grading traduz o teu tempo de prova numa percentagem face ao nível de recorde do mundo ajustado à tua idade e sexo, permitindo comparar performances entre atletas de idades diferentes de forma justa.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Nota sobre a precisão</h3>
            <p className="text-white/65 text-sm leading-relaxed">
              Esta calculadora usa uma curva de declínio aproximada, não a tabela oficial exata da World Masters Athletics (WMA), que tabula milhares de valores por idade e prova. Para competição oficial de masters, consulta sempre a tabela publicada pela WMA.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
