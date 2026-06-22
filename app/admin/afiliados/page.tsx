'use client'

import { useEffect, useState } from 'react'

interface ProductStat {
  product: string
  total: number
}

interface DayData {
  date: string
  clicks: number
}

interface TodayStat {
  product: string
  count: number
}

interface StatsResponse {
  ranking: ProductStat[]
  daily: DayData[]
  today: TodayStat[]
  updatedAt: string
}

const API_KEY = 'performance-running-internal-2026'

export default function AfiliadosDashboard() {
  const [data, setData] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/affiliate-stats?key=${API_KEY}`)
      if (!res.ok) throw new Error('Acesso negado')
      const json = await res.json()
      setData(json)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const totalAll = data?.ranking.reduce((s, r) => s + r.total, 0) ?? 0
  const totalToday = data?.today.reduce((s, r) => s + r.count, 0) ?? 0
  const maxDay = Math.max(...(data?.daily.map((d) => d.clicks) ?? [1]), 1)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#0a0a0a', minHeight: '100vh', color: '#fff', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            📊 TRACKING AFILIADOS
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#666' }}>
            Performance Running — Admin Dashboard
          </p>
        </div>
        <button
          onClick={load}
          style={{
            background: '#00ff87', color: '#000', border: 'none', borderRadius: '6px',
            padding: '0.5rem 1.2rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
          }}
        >
          ↻ Atualizar
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>A carregar dados...</div>
      )}
      {error && (
        <div style={{ background: '#ff000020', border: '1px solid #ff4444', borderRadius: '8px', padding: '1rem', color: '#ff4444' }}>
          ⚠ {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Histórico', value: totalAll, color: '#00ff87' },
              { label: 'Hoje', value: totalToday, color: '#4af' },
              { label: 'Produtos Ativos', value: data.ranking.length, color: '#f4a' },
              { label: 'Dias com Dados', value: data.daily.filter((d) => d.clicks > 0).length, color: '#fa4' },
            ].map((kpi) => (
              <div key={kpi.label} style={{
                background: '#111', borderRadius: '10px', padding: '1.2rem',
                border: `1px solid ${kpi.color}30`,
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.25rem' }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Gráfico de barras — últimos 7 dias */}
          <div style={{ background: '#111', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #222' }}>
            <h2 style={{ margin: '0 0 1.2rem', fontSize: '0.9rem', fontWeight: 700, color: '#aaa', letterSpacing: '0.08em' }}>
              CLICKS — ÚLTIMOS 7 DIAS
            </h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '120px' }}>
              {data.daily.map((d) => {
                const height = maxDay === 0 ? 0 : Math.round((d.clicks / maxDay) * 100)
                const isToday = d.date === new Date().toISOString().slice(0, 10)
                return (
                  <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>{d.clicks}</div>
                    <div style={{
                      width: '100%', height: `${Math.max(height, d.clicks > 0 ? 4 : 2)}%`,
                      background: isToday ? '#00ff87' : '#2a6',
                      borderRadius: '4px 4px 0 0', minHeight: d.clicks > 0 ? '6px' : '2px',
                      transition: 'height 0.3s',
                    }} />
                    <div style={{ fontSize: '0.65rem', color: isToday ? '#00ff87' : '#555', fontWeight: isToday ? 700 : 400 }}>
                      {d.date.slice(5)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Ranking total */}
            <div style={{ background: '#111', borderRadius: '10px', padding: '1.5rem', border: '1px solid #222' }}>
              <h2 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#aaa', letterSpacing: '0.08em' }}>
                RANKING TOTAL
              </h2>
              {data.ranking.length === 0 && (
                <div style={{ color: '#555', fontSize: '0.85rem' }}>Sem dados ainda.</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.ranking.slice(0, 15).map((r, i) => {
                  const pct = totalAll === 0 ? 0 : Math.round((r.total / totalAll) * 100)
                  return (
                    <div key={r.product}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#ddd' }}>
                          <span style={{ color: '#555', marginRight: '0.4rem' }}>#{i + 1}</span>
                          {r.product}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00ff87' }}>
                          {r.total} <span style={{ color: '#555', fontWeight: 400 }}>({pct}%)</span>
                        </span>
                      </div>
                      <div style={{ height: '3px', background: '#222', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#00ff87', borderRadius: '2px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Hoje */}
            <div style={{ background: '#111', borderRadius: '10px', padding: '1.5rem', border: '1px solid #222' }}>
              <h2 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#aaa', letterSpacing: '0.08em' }}>
                HOJE — {new Date().toISOString().slice(0, 10)}
              </h2>
              {data.today.length === 0 && (
                <div style={{ color: '#555', fontSize: '0.85rem' }}>Sem clicks hoje ainda.</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {data.today.slice(0, 15).map((r, i) => (
                  <div key={r.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#ddd' }}>
                      <span style={{ color: '#555', marginRight: '0.4rem' }}>#{i + 1}</span>
                      {r.product}
                    </span>
                    <span style={{
                      background: '#4af20', border: '1px solid #4af',
                      color: '#4af', padding: '2px 8px', borderRadius: '4px',
                      fontSize: '0.78rem', fontWeight: 700,
                    }}>
                      {r.count} clicks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.72rem', color: '#444', textAlign: 'right' }}>
            Atualizado: {new Date(data.updatedAt).toLocaleString('pt-PT')}
          </div>
        </>
      )}
    </div>
  )
}
