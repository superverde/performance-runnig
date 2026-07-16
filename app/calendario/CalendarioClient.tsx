'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, ArrowUpRight, Mountain, Footprints } from 'lucide-react'
import { PROVAS, REGIOES, TIPOS_PROVA, type Prova, type TipoProva } from '@/lib/provas'

const TIPO_COR: Record<TipoProva, string> = {
  'Estrada': '#00ff87',
  'Trail': '#3b82f6',
  'Ultra Trail': '#f59e0b',
}

const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

/** Separador de procura por distância — pedido explícito do Pedro. */
const DISTANCIA_FILTROS = ['Todas', '10km', 'Meia Maratona', 'Maratona'] as const
type DistanciaFiltro = (typeof DISTANCIA_FILTROS)[number]

/**
 * Verifica se alguma das distâncias de uma prova corresponde ao filtro
 * escolhido. Usa regex sobre o texto livre de `distancias` (ex: "21km",
 * "42.195km", "6km (mini-maratona)") em vez de um campo estruturado,
 * porque o array de distâncias é texto livre por design (ver lib/provas.ts).
 */
function distanciaCorresponde(distancias: string[], filtro: DistanciaFiltro): boolean {
  if (filtro === 'Todas') return true
  return distancias.some((d) => {
    if (filtro === '10km') return /\b10\s?km\b/i.test(d)
    if (filtro === 'Meia Maratona') return /\b21(\.\d+)?\s?km\b/i.test(d) || /meia[\s-]?maratona/i.test(d)
    if (filtro === 'Maratona') return /\b42(\.\d+)?\s?km\b/i.test(d) || (/\bmaratona\b/i.test(d) && !/meia/i.test(d))
    return false
  })
}

function formatarData(prova: Prova): string {
  const d = new Date(prova.dataInicio + 'T00:00:00')
  const dia = d.getDate()
  const mes = MESES_PT[d.getMonth()]
  if (prova.dataFim) {
    const f = new Date(prova.dataFim + 'T00:00:00')
    if (f.getMonth() === d.getMonth()) {
      return `${dia}–${f.getDate()} ${mes}`
    }
    return `${dia} ${mes} – ${f.getDate()} ${MESES_PT[f.getMonth()]}`
  }
  return `${dia} ${mes}`
}

function TipoIcon({ tipo }: { tipo: TipoProva }) {
  if (tipo === 'Estrada') return <Footprints size={13} />
  return <Mountain size={13} />
}

function ProvaCard({ prova, passada }: { prova: Prova; passada: boolean }) {
  const cor = TIPO_COR[prova.tipo]
  const d = new Date(prova.dataInicio + 'T00:00:00')

  return (
    <article
      className={`group border rounded-2xl overflow-hidden bg-white/[0.01] hover:border-white/20 transition-all ${
        prova.destaque ? 'border-white/15' : 'border-white/6'
      } ${passada ? 'opacity-45' : ''}`}
    >
      <div className="p-5 flex gap-4">
        {/* Bloco de data */}
        <div
          className="shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center border"
          style={{ borderColor: cor + '30', background: cor + '0a' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: cor }}>
            {MESES_PT[d.getMonth()].slice(0, 3)}
          </span>
          <span className="text-xl font-black text-white leading-none mt-0.5">{d.getDate()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-black text-base tracking-tight leading-snug">{prova.nome}</h3>
            {prova.destaque && (
              <span className="shrink-0 text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-green text-black">
                Destaque
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-white/60 mb-2 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {prova.local}
            </span>
            <span className="flex items-center gap-1" style={{ color: cor }}>
              <TipoIcon tipo={prova.tipo} /> {prova.tipo}
            </span>
          </div>

          <p className="text-white/65 text-sm leading-relaxed mb-3">{prova.desc}</p>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1.5 flex-wrap">
              {prova.distancias.map((dist) => (
                <span
                  key={dist}
                  className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10"
                >
                  {dist}
                </span>
              ))}
            </div>
            {prova.link && (
              <a
                href={prova.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-white/55 hover:text-brand-green transition-colors"
              >
                Site oficial <ArrowUpRight size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export function CalendarioClient() {
  const [tipo, setTipo] = useState<(typeof TIPOS_PROVA)[number]>('Todas')
  const [regiao, setRegiao] = useState<(typeof REGIOES)[number]>('Todas')
  const [distancia, setDistancia] = useState<DistanciaFiltro>('Todas')
  const [mostrarTodas, setMostrarTodas] = useState(false)

  const hoje = useMemo(() => {
    const n = new Date()
    return new Date(n.getFullYear(), n.getMonth(), n.getDate())
  }, [])

  const provasFiltradas = useMemo(() => {
    return [...PROVAS]
      .filter((p) => (tipo === 'Todas' ? true : p.tipo === tipo))
      .filter((p) => (regiao === 'Todas' ? true : p.regiao === regiao))
      .filter((p) => distanciaCorresponde(p.distancias, distancia))
      .filter((p) => (mostrarTodas ? true : new Date(p.dataInicio + 'T00:00:00') >= hoje))
      .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
  }, [tipo, regiao, distancia, mostrarTodas, hoje])

  // Agrupar por mês para navegação mais fácil
  const grupos = useMemo(() => {
    const map = new Map<string, Prova[]>()
    for (const p of provasFiltradas) {
      const d = new Date(p.dataInicio + 'T00:00:00')
      const chave = `${MESES_PT[d.getMonth()]} ${d.getFullYear()}`
      if (!map.has(chave)) map.set(chave, [])
      map.get(chave)!.push(p)
    }
    return Array.from(map.entries())
  }, [provasFiltradas])

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div
        className="relative pt-28 pb-16 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-green mb-4 font-mono">
            Calendário Nacional
          </p>
          <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            PROVAS EM PORTUGAL
          </h1>
          <p className="text-white/70 max-w-xl text-base leading-relaxed">
            Maratonas, meias maratonas, trail e ultra trail em Portugal. Datas, locais e
            distâncias das principais provas de estrada e montanha do calendário nacional.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Filtros ── */}
        <div className="flex flex-col gap-4 mb-10 sticky top-[60px] z-10 bg-black/90 backdrop-blur-xl py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-white/5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-widest text-white/55 font-mono mr-1">Distância</span>
            {DISTANCIA_FILTROS.map((d) => (
              <button
                key={d}
                onClick={() => setDistancia(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  distancia === d
                    ? 'bg-brand-green text-black border-brand-green'
                    : 'border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-widest text-white/55 font-mono mr-1">Tipo</span>
            {TIPOS_PROVA.map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  tipo === t
                    ? 'bg-brand-green text-black border-brand-green'
                    : 'border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-widest text-white/55 font-mono mr-1">Região</span>
            {REGIOES.map((r) => (
              <button
                key={r}
                onClick={() => setRegiao(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  regiao === r
                    ? 'bg-white/10 text-white border-white/25'
                    : 'border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMostrarTodas(!mostrarTodas)}
            className="self-start text-xs font-bold text-white/55 hover:text-brand-green transition-colors flex items-center gap-1.5"
          >
            <Calendar size={12} />
            {mostrarTodas ? 'Mostrar só próximas provas' : 'Mostrar também provas já realizadas este ano'}
          </button>
        </div>

        {/* ── Lista agrupada por mês ── */}
        {grupos.length === 0 && (
          <p className="text-white/55 text-sm py-12 text-center">Nenhuma prova encontrada com estes filtros.</p>
        )}

        <div className="space-y-12">
          {grupos.map(([mes, provas]) => (
            <section key={mes}>
              <h2 className="text-xl font-black tracking-tight mb-4 text-white/80">{mes}</h2>
              <div className="space-y-4">
                {provas.map((p) => (
                  <ProvaCard
                    key={p.nome}
                    prova={p}
                    passada={new Date(p.dataInicio + 'T00:00:00') < hoje}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── Nota + navegação ── */}
        <div className="border-t border-white/5 pt-8 mt-16">
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            <strong className="text-white/70">Nota:</strong> as datas são recolhidas junto das organizações
            e podem sofrer pequenos ajustes. Confirma sempre a data e inscrições no site oficial da prova
            antes de planeares a tua época.
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <Link href="/ferramentas" className="text-xs text-white/55 hover:text-brand-green transition-colors">
              Calculadora de Previsão de Tempos →
            </Link>
            <Link href="/metodologias" className="text-xs text-white/55 hover:text-brand-green transition-colors">
              Metodologias de Treino
            </Link>
            <Link href="/consulta" className="text-xs text-white/55 hover:text-brand-green transition-colors">
              Consulta Gratuita com IA
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
