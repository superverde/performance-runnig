'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { sapatos, type SapatoProduto } from '@/lib/products'

type Categoria = 'Todas' | SapatoProduto['categoria']

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-brand-green' : 'text-white/15'}>★</span>
      ))}
    </div>
  )
}

function ShoeSelect({ label, value, onChange, options, disabledValue }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: SapatoProduto[]
  disabledValue?: string
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-white/60 font-bold block mb-2">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors cursor-pointer"
      >
        <option value="" className="bg-black">— Escolher sapatilha —</option>
        {options.map(s => (
          <option key={s.name} value={s.name} disabled={s.name === disabledValue} className="bg-black">
            {s.name} · {s.categoria}
          </option>
        ))}
      </select>
    </div>
  )
}

function ShoeCard({ shoe }: { shoe: SapatoProduto }) {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex flex-col h-full">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shoe.img} alt={shoe.name} className="w-full h-full object-contain p-3" />
        <span
          className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wide px-2 py-1 rounded-full text-black"
          style={{ background: shoe.badgeColor }}
        >
          {shoe.badge}
        </span>
      </div>

      <h3 className="text-white font-bold text-base mb-1">{shoe.name}</h3>
      <div className="flex items-center justify-between mb-3">
        <Stars rating={shoe.rating} />
        <span className="text-xs uppercase tracking-widest text-white/60 font-bold">{shoe.categoria}</span>
      </div>

      <div className="text-2xl font-black font-mono text-brand-green mb-3">{shoe.preco}</div>

      <p className="text-white/65 text-xs leading-relaxed mb-4">{shoe.desc}</p>

      <div className="space-y-3 mb-4 flex-1">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-brand-green/80 font-bold mb-1.5">Prós</p>
          <ul className="space-y-1">
            {shoe.pros.map(p => (
              <li key={p} className="text-white/70 text-xs flex gap-1.5">
                <span className="text-brand-green">+</span>{p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60 font-bold mb-1.5">Contras</p>
          <ul className="space-y-1">
            {shoe.contras.map(c => (
              <li key={c} className="text-white/50 text-xs flex gap-1.5">
                <span className="text-red-400/70">−</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a
        href={shoe.link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-auto block text-center px-4 py-2.5 bg-brand-green text-black font-black text-xs uppercase tracking-wide rounded-lg hover:bg-white transition-all"
      >
        Ver em {shoe.loja}
      </a>
    </div>
  )
}

export function ComparadorClient() {
  const [categoria, setCategoria] = useState<Categoria>('Todas')
  const [slot1, setSlot1] = useState('HOKA Clifton 9')
  const [slot2, setSlot2] = useState('ASICS Novablast 5')
  const [slot3, setSlot3] = useState('')

  const filtered = useMemo(
    () => categoria === 'Todas' ? sapatos : sapatos.filter(s => s.categoria === categoria),
    [categoria]
  )

  const selected = [slot1, slot2, slot3]
    .map(name => sapatos.find(s => s.name === name))
    .filter((s): s is SapatoProduto => Boolean(s))

  const categorias: Categoria[] = ['Todas', 'Estrada', 'Trail', 'Competição']

  return (
    <section className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <Link href="/ferramentas" className="text-[11px] uppercase tracking-[0.25em] text-brand-green font-bold mb-3 inline-block hover:text-white transition-colors">
            ← Ferramentas
          </Link>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight mb-4" style={{ fontStyle: 'italic' }}>
            COMPARADOR DE SAPATILHAS
          </h1>
          <p className="text-white/50 text-base max-w-xl">
            Compara até 3 sapatilhas de corrida lado a lado — preço, prós, contras e para que tipo de corredor é cada uma.
          </p>
        </div>

        {/* Filtro de categoria */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categorias.map(c => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                categoria === c
                  ? 'bg-brand-green text-black'
                  : 'bg-white/5 text-white/55 hover:text-white border border-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Seletores */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-5">
            <ShoeSelect label="Sapatilha 1" value={slot1} onChange={setSlot1} options={filtered} disabledValue={slot2} />
            <ShoeSelect label="Sapatilha 2" value={slot2} onChange={setSlot2} options={filtered} disabledValue={slot1} />
            <ShoeSelect label="Sapatilha 3 (opcional)" value={slot3} onChange={setSlot3} options={filtered} disabledValue={slot1} />
          </div>
        </div>

        {/* Comparação */}
        {selected.length === 0 ? (
          <p className="text-white/60 text-sm">Escolhe pelo menos uma sapatilha acima para comparar.</p>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${selected.length === 3 ? 'lg:grid-cols-3' : ''}`}>
            {selected.map(shoe => <ShoeCard key={shoe.name} shoe={shoe} />)}
          </div>
        )}

        {/* Info */}
        <div className="mt-10 bg-white/[0.02] border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-2">Como escolher a sapatilha certa</h3>
          <p className="text-white/65 text-sm leading-relaxed">
            Sapatilhas de <strong className="text-white/70">Estrada</strong> priorizam amortecimento e durabilidade para o treino diário. As de <strong className="text-white/70">Trail</strong> têm grip agressivo e proteção para terreno técnico. As de <strong className="text-white/70">Competição</strong> usam placas de carbono e espumas leves para maximizar velocidade em prova — mas têm durabilidade reduzida e não são pensadas para o treino de todos os dias.
          </p>
        </div>

        <p className="text-xs text-white/55 mt-6">
          Este site pode receber uma comissão de afiliado em compras feitas através dos links acima, sem custo adicional para ti.
        </p>

      </div>
    </section>
  )
}
