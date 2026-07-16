'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Footprints, ArrowRight } from 'lucide-react'

// ─── Matemática VDOT (Jack Daniels) ──────────────────────────────────────────

function calcVDOT(distM: number, timeMin: number): number {
  const v = distM / timeMin
  const vo2 = -4.60 + 0.182258 * v + 0.000104 * v * v
  const pct = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMin)
            + 0.2989558 * Math.exp(-0.1932605 * timeMin)
  return vo2 / pct
}

function secPerKmFromIntensity(vdot: number, intensity: number): number {
  const vo2 = vdot * intensity
  const a = 0.000104, b = 0.182258, c = -(4.60 + vo2)
  const v = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
  return (1000 / v) * 60
}

function fmtPace(sPerKm: number): string {
  const m = Math.floor(sPerKm / 60)
  const s = Math.round(sPerKm % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function fmtTime(totalSec: number): string {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = Math.round(totalSec % 60)
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`
}

function timeToSec(h: number, m: number, s: number) { return h * 3600 + m * 60 + s }

// ─── Riegel ──────────────────────────────────────────────────────────────────

function riegel(knownDist: number, knownSec: number, targetDist: number): number {
  return knownSec * Math.pow(targetDist / knownDist, 1.06)
}

// ─── Dados ───────────────────────────────────────────────────────────────────

const DISTANCES = [
  { label: '1500 m',        value: 1500 },
  { label: '1 milha',       value: 1609 },
  { label: '3000 m',        value: 3000 },
  { label: '5 km',          value: 5000 },
  { label: '8 km',          value: 8000 },
  { label: '10 km',         value: 10000 },
  { label: '15 km',         value: 15000 },
  { label: 'Meia Maratona', value: 21097 },
  { label: 'Maratona',      value: 42195 },
]

const RACES = [
  { label: '5 km',          value: 5000 },
  { label: '10 km',         value: 10000 },
  { label: '15 km',         value: 15000 },
  { label: 'Meia Maratona', value: 21097 },
  { label: 'Maratona',      value: 42195 },
]

const ZONES = [
  { key: 'E', label: 'Fácil',       color: '#22c55e', lo: 0.65, hi: 0.75, desc: 'Corridas base e recuperação',   ex: '60–90 min contínuo' },
  { key: 'M', label: 'Maratona',    color: '#3b82f6', lo: 0.79, hi: 0.84, desc: 'Ritmo alvo de maratona',        ex: 'Treinos longos, MP runs' },
  { key: 'T', label: 'Limiar',      color: '#f59e0b', lo: 0.83, hi: 0.88, desc: 'Confortavelmente difícil',      ex: 'Tempo runs, Fartlek' },
  { key: 'I', label: 'Intervalos',  color: '#ef4444', lo: 0.95, hi: 1.00, desc: 'Muito intenso, ~6 min esforço', ex: '800 m, 1000 m, 1200 m' },
  { key: 'R', label: 'Repetições',  color: '#a855f7', lo: 1.05, hi: 1.12, desc: 'Máximo, sprints curtos',        ex: '200 m, 400 m' },
]

// ─── Input helpers ────────────────────────────────────────────────────────────

function NumInput({ value, onChange, min = 0, max = 99, placeholder = '00' }: {
  value: string; onChange: (v: string) => void; min?: number; max?: number; placeholder?: string
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-16 text-center bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-brand-green transition-colors"
    />
  )
}

// ─── VDOT Calculator ─────────────────────────────────────────────────────────

function VDOTCalc() {
  const [dist, setDist] = useState(10000)
  const [h, setH] = useState('')
  const [m, setM] = useState('')
  const [s, setS] = useState('')
  const [result, setResult] = useState<null | { vdot: number; zones: { key: string; label: string; color: string; lo: string; hi: string; desc: string; ex: string }[] }>(null)
  const [error, setError] = useState('')

  function calculate() {
    const totalSec = timeToSec(Number(h) || 0, Number(m) || 0, Number(s) || 0)
    if (totalSec < 60) { setError('Insere um tempo válido.'); setResult(null); return }
    const vdot = calcVDOT(dist, totalSec / 60)
    if (vdot < 20 || vdot > 90) { setError('Tempo improvável para esta distância.'); setResult(null); return }
    setError('')
    setResult({
      vdot: Math.round(vdot * 10) / 10,
      zones: ZONES.map(z => ({
        key: z.key,
        label: z.label,
        color: z.color,
        lo: fmtPace(secPerKmFromIntensity(vdot, z.lo)),
        hi: fmtPace(secPerKmFromIntensity(vdot, z.hi)),
        desc: z.desc,
        ex: z.ex,
      })),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-white/70 text-base leading-relaxed mb-6">
          Insere um resultado recente de prova para calcular o teu VDOT e obter os ritmos ideais para cada zona de treino, com base na metodologia de Jack Daniels.
        </p>

        {/* Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Distância</label>
            <select
              value={dist}
              onChange={e => setDist(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors cursor-pointer"
            >
              {DISTANCES.map(d => <option key={d.value} value={d.value} className="bg-black">{d.label}</option>)}
            </select>
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

        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>

      {/* Resultado */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* VDOT badge */}
          <div className="flex items-center gap-4 p-4 bg-brand-green/10 border border-brand-green/20 rounded-xl">
            <div className="text-center">
              <div className="text-4xl font-black text-brand-green font-mono">{result.vdot}</div>
              <div className="text-xs uppercase tracking-widest text-brand-green/70 font-bold">VDOT</div>
            </div>
            <div className="text-sm text-white/60 leading-relaxed">
              O teu VDOT estima o teu VO₂máx funcional e define os ritmos de treino ideais para cada zona de esforço.
            </div>
          </div>

          {/* Tabela de zonas */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold">Zona</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold">Ritmo /km</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold hidden sm:table-cell">Tipo de treino</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold hidden md:table-cell">Exemplo</th>
                </tr>
              </thead>
              <tbody>
                {result.zones.map((z, i) => (
                  <tr key={z.key} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: z.color }} />
                        <span className="font-bold text-white">{z.label}</span>
                        <span className="text-xs font-mono text-white/30 ml-1">{z.key}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-white">{z.lo}</span>
                      <span className="text-white/40 mx-1">–</span>
                      <span className="font-mono font-bold text-white">{z.hi}</span>
                    </td>
                    <td className="px-4 py-3 text-white/55 hidden sm:table-cell">{z.desc}</td>
                    <td className="px-4 py-3 text-white/60 text-xs hidden md:table-cell">{z.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-white/55">
            Fórmula de Jack Daniels (Running Formula, 3ª ed.). Os ritmos são orientações — ajusta sempre ao teu estado de forma e condições do dia.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Pace Calculator ─────────────────────────────────────────────────────────

type PaceMode = 'tempo-pace' | 'pace-tempo' | 'previsao'

function PaceCalc() {
  const [mode, setMode] = useState<PaceMode>('tempo-pace')

  // Tempo → Pace
  const [tpDist, setTpDist] = useState(10000)
  const [tpH, setTpH] = useState(''), [tpM, setTpM] = useState(''), [tpS, setTpS] = useState('')
  const [tpResult, setTpResult] = useState<null | { paceKm: string; paceMi: string; totalSec: number }>(null)

  // Pace → Tempo
  const [ptDist, setPtDist] = useState(10000)
  const [ptPaceM, setPtPaceM] = useState(''), [ptPaceS, setPtPaceS] = useState('')
  const [ptResult, setPtResult] = useState<null | { total: string; paceKm: string }>(null)

  // Previsão
  const [prDist, setPrDist] = useState(10000)
  const [prH, setPrH] = useState(''), [prM, setPrM] = useState(''), [prS, setPrS] = useState('')
  const [prResult, setPrResult] = useState<null | { dist: string; time: string; pace: string }[]>(null)

  const [error, setError] = useState('')

  function calcTempoToPace() {
    const sec = timeToSec(Number(tpH) || 0, Number(tpM) || 0, Number(tpS) || 0)
    if (sec < 30) { setError('Insere um tempo válido.'); setTpResult(null); return }
    setError('')
    const sPerKm = (sec / tpDist) * 1000
    const sPerMi = (sec / tpDist) * 1609.34
    setTpResult({ paceKm: fmtPace(sPerKm), paceMi: fmtPace(sPerMi), totalSec: sec })
  }

  function calcPaceToTempo() {
    const paceS = (Number(ptPaceM) || 0) * 60 + (Number(ptPaceS) || 0)
    if (paceS < 60) { setError('Insere um pace válido.'); setPtResult(null); return }
    setError('')
    const totalSec = (paceS / 1000) * ptDist
    setPtResult({ total: fmtTime(totalSec), paceKm: `${ptPaceM || '0'}:${(ptPaceS || '00').toString().padStart(2, '0')}` })
  }

  function calcPrevisao() {
    const sec = timeToSec(Number(prH) || 0, Number(prM) || 0, Number(prS) || 0)
    if (sec < 30) { setError('Insere um tempo válido.'); setPrResult(null); return }
    setError('')
    const predictions = RACES
      .filter(r => r.value !== prDist)
      .map(r => {
        const predicted = riegel(prDist, sec, r.value)
        const paceS = (predicted / r.value) * 1000
        return { dist: r.label, time: fmtTime(predicted), pace: fmtPace(paceS) }
      })
    setPrResult(predictions)
  }

  const tabs: { key: PaceMode; label: string }[] = [
    { key: 'tempo-pace', label: 'Tempo → Pace' },
    { key: 'pace-tempo', label: 'Pace → Tempo' },
    { key: 'previsao',   label: 'Previsão de Prova' },
  ]

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setMode(t.key); setError('') }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === t.key
                ? 'bg-brand-green text-black'
                : 'bg-white/5 text-white/55 hover:text-white border border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tempo → Pace */}
      {mode === 'tempo-pace' && (
        <div className="space-y-5">
          <p className="text-white/50 text-sm">Insere a distância e o tempo de prova para calcular o ritmo médio por km.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Distância</label>
              <select value={tpDist} onChange={e => setTpDist(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors cursor-pointer">
                {DISTANCES.map(d => <option key={d.value} value={d.value} className="bg-black">{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Tempo (h : mm : ss)</label>
              <div className="flex items-center gap-2">
                <NumInput value={tpH} onChange={setTpH} max={9} placeholder="h" />
                <span className="text-white/30 font-bold">:</span>
                <NumInput value={tpM} onChange={setTpM} max={59} placeholder="mm" />
                <span className="text-white/30 font-bold">:</span>
                <NumInput value={tpS} onChange={setTpS} max={59} placeholder="ss" />
              </div>
            </div>
            <button onClick={calcTempoToPace} className="px-6 py-2.5 bg-brand-green text-black font-black text-sm rounded-lg hover:bg-white transition-all">CALCULAR</button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {tpResult && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-black font-mono text-brand-green">{tpResult.paceKm}</div>
                <div className="text-xs uppercase tracking-widest text-white/60 mt-1">min/km</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-black font-mono text-white">{tpResult.paceMi}</div>
                <div className="text-xs uppercase tracking-widest text-white/60 mt-1">min/milha</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                <div className="text-2xl font-black font-mono text-white/70">{fmtTime(tpResult.totalSec)}</div>
                <div className="text-xs uppercase tracking-widest text-white/60 mt-1">tempo total</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pace → Tempo */}
      {mode === 'pace-tempo' && (
        <div className="space-y-5">
          <p className="text-white/50 text-sm">Insere o pace objetivo (min/km) e a distância para calcular o tempo de chegada.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Distância</label>
              <select value={ptDist} onChange={e => setPtDist(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors cursor-pointer">
                {DISTANCES.map(d => <option key={d.value} value={d.value} className="bg-black">{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Pace (mm : ss /km)</label>
              <div className="flex items-center gap-2">
                <NumInput value={ptPaceM} onChange={setPtPaceM} max={59} placeholder="mm" />
                <span className="text-white/30 font-bold">:</span>
                <NumInput value={ptPaceS} onChange={setPtPaceS} max={59} placeholder="ss" />
              </div>
            </div>
            <button onClick={calcPaceToTempo} className="px-6 py-2.5 bg-brand-green text-black font-black text-sm rounded-lg hover:bg-white transition-all">CALCULAR</button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {ptResult && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-black font-mono text-brand-green">{ptResult.total}</div>
                <div className="text-xs uppercase tracking-widest text-white/60 mt-1">tempo de chegada</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-black font-mono text-white">{ptResult.paceKm}</div>
                <div className="text-xs uppercase tracking-widest text-white/60 mt-1">min/km</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Previsão de Prova */}
      {mode === 'previsao' && (
        <div className="space-y-5">
          <p className="text-white/50 text-sm">Com base num resultado recente, prevê os teus tempos para outras distâncias (fórmula de Riegel).</p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Distância conhecida</label>
              <select value={prDist} onChange={e => setPrDist(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors cursor-pointer">
                {RACES.map(d => <option key={d.value} value={d.value} className="bg-black">{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">Tempo (h : mm : ss)</label>
              <div className="flex items-center gap-2">
                <NumInput value={prH} onChange={setPrH} max={9} placeholder="h" />
                <span className="text-white/30 font-bold">:</span>
                <NumInput value={prM} onChange={setPrM} max={59} placeholder="mm" />
                <span className="text-white/30 font-bold">:</span>
                <NumInput value={prS} onChange={setPrS} max={59} placeholder="ss" />
              </div>
            </div>
            <button onClick={calcPrevisao} className="px-6 py-2.5 bg-brand-green text-black font-black text-sm rounded-lg hover:bg-white transition-all">PREVER</button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {prResult && (
            <div className="space-y-3 animate-fade-in">
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold">Distância</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold">Tempo previsto</th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-white/60 font-bold">Pace /km</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prResult.map((r, i) => (
                      <tr key={r.dist} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
                        <td className="px-4 py-3 font-bold text-white">{r.dist}</td>
                        <td className="px-4 py-3 font-mono font-bold text-brand-green">{r.time}</td>
                        <td className="px-4 py-3 font-mono text-white/60">{r.pace} /km</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-white/55">
                Baseado na fórmula de Riegel (expoente 1.06). Previsões para distâncias muito diferentes do resultado base têm menor precisão.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

type Tool = 'vdot' | 'pace'

export function CalculadorasClient() {
  const [tool, setTool] = useState<Tool>('vdot')

  return (
    <section className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-green font-bold mb-3">Ferramentas</p>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight mb-4" style={{ fontStyle: 'italic' }}>
            CALCULADORAS
          </h1>
          <p className="text-white/50 text-base max-w-xl">
            Ferramentas científicas para corredores. Calcula os teus ritmos de treino, prevê tempos de prova e otimiza cada sessão.
          </p>
        </div>

        {/* Mais ferramentas — banners grandes */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/ferramentas/idade"
            className="group relative overflow-hidden bg-gradient-to-br from-brand-green/15 via-white/[0.03] to-transparent border-2 border-brand-green/30 hover:border-brand-green rounded-2xl p-7 transition-all hover:scale-[1.02]"
          >
            <span className="absolute top-4 right-4 px-2.5 py-1 bg-brand-green text-black text-xs font-black uppercase tracking-widest rounded-full">
              Novo
            </span>
            <div className="w-14 h-14 rounded-xl bg-brand-green/15 flex items-center justify-center mb-5 group-hover:bg-brand-green/25 transition-colors">
              <Users size={28} className="text-brand-green" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tight" style={{ fontStyle: 'italic' }}>
              CLASSIFICAÇÃO POR IDADE
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Compara a tua performance com corredores de qualquer idade e sexo através do age grading.
            </p>
            <span className="inline-flex items-center gap-1.5 text-brand-green font-black text-sm uppercase tracking-wide">
              Calcular agora <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/ferramentas/comparador-sapatilhas"
            className="group relative overflow-hidden bg-gradient-to-br from-brand-green/15 via-white/[0.03] to-transparent border-2 border-brand-green/30 hover:border-brand-green rounded-2xl p-7 transition-all hover:scale-[1.02]"
          >
            <span className="absolute top-4 right-4 px-2.5 py-1 bg-brand-green text-black text-xs font-black uppercase tracking-widest rounded-full">
              Novo
            </span>
            <div className="w-14 h-14 rounded-xl bg-brand-green/15 flex items-center justify-center mb-5 group-hover:bg-brand-green/25 transition-colors">
              <Footprints size={28} className="text-brand-green" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tight" style={{ fontStyle: 'italic' }}>
              COMPARADOR DE SAPATILHAS
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Compara até 3 sapatilhas lado a lado — preço, prós, contras e para que tipo de corredor é cada uma.
            </p>
            <span className="inline-flex items-center gap-1.5 text-brand-green font-black text-sm uppercase tracking-wide">
              Comparar agora <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Tab selector */}
        <div className="flex gap-3 mb-8 border-b border-white/10 pb-0">
          {([
            { key: 'vdot' as Tool, label: 'VDOT + Zonas de Treino' },
            { key: 'pace' as Tool, label: 'Pace & Previsão de Prova' },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setTool(t.key)}
              className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all -mb-px ${
                tool === t.key
                  ? 'border-brand-green text-white'
                  : 'border-transparent text-white/55 hover:text-white/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
          {tool === 'vdot' ? <VDOTCalc /> : <PaceCalc />}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">O que é o VDOT?</h3>
            <p className="text-white/65 text-sm leading-relaxed">
              O VDOT é uma estimativa do VO₂máx funcional desenvolvida por Jack Daniels. Não mede diretamente o consumo de oxigénio — reflete a tua capacidade de corrida em prova. Dois atletas com o mesmo VDOT devem correr a ritmos semelhantes, independentemente do peso ou altura.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Fórmula de Riegel</h3>
            <p className="text-white/65 text-sm leading-relaxed">
              A previsão de prova usa a fórmula T₂ = T₁ × (D₂/D₁)^1.06, onde o expoente 1.06 reflete o aumento de fadiga com a distância. É mais precisa entre distâncias próximas — prever uma maratona a partir de um 5km tem margem de erro maior.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
