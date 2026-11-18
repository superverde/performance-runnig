'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface ItemCarrossel {
  /** Nome completo (para o alt da imagem e o aria-label). */
  name: string
  marca: string
  modelo: string
  preco: string
  pvp?: number
  desconto?: number
  img: string
  /** URL já com tracking (/api/track-click?...). */
  href: string
}

/** Intervalo da rotação automática. */
const INTERVALO_MS = 4000

/**
 * Carrossel de produtos da i-Run, ao estilo da montra "mais vendidos" do
 * i-run.pt: fotos grandes, selo de promoção, preço com o PVP riscado,
 * setas laterais e rotação automática.
 * - A rotação pára com o rato por cima, com foco do teclado, depois de o
 *   visitante usar as setas/scroll e se o sistema pedir menos movimento.
 * - Scroll horizontal nativo com snap (funciona com o dedo no telemóvel).
 */
export function IrunCarrossel({ titulo, itens }: { titulo: string; itens: ItemCarrossel[] }) {
  const pistaRef = useRef<HTMLUListElement>(null)
  const [pausado, setPausado] = useState(false)
  const [parado, setParado] = useState(false) // o visitante mexeu: deixa de rodar sozinho

  const passo = useCallback((dir: 1 | -1) => {
    const pista = pistaRef.current
    if (!pista) return
    const cartao = pista.querySelector('li')
    const largura = cartao ? cartao.getBoundingClientRect().width + 16 : pista.clientWidth * 0.8
    const fim = pista.scrollWidth - pista.clientWidth - 4
    if (dir === 1 && pista.scrollLeft >= fim) pista.scrollTo({ left: 0, behavior: 'smooth' })
    else if (dir === -1 && pista.scrollLeft <= 4) pista.scrollTo({ left: fim, behavior: 'smooth' })
    else pista.scrollBy({ left: dir * largura, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (pausado || parado) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => passo(1), INTERVALO_MS)
    return () => window.clearInterval(t)
  }, [pausado, parado, passo])

  if (itens.length === 0) return null

  return (
    <section
      aria-label={titulo}
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl italic leading-none text-white sm:text-4xl">{titulo}</h2>
        <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/35">Parceiro · i-Run</span>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => { setParado(true); passo(-1) }}
          className="absolute -left-3 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#142c3a] text-[#c8e100] shadow-lg transition-transform hover:scale-110 sm:flex"
        >
          <ChevronLeft size={22} strokeWidth={3} />
        </button>
        <button
          type="button"
          aria-label="Seguinte"
          onClick={() => { setParado(true); passo(1) }}
          className="absolute -right-3 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#142c3a] text-[#c8e100] shadow-lg transition-transform hover:scale-110 sm:flex"
        >
          <ChevronRight size={22} strokeWidth={3} />
        </button>

        <ul
          ref={pistaRef}
          onTouchStart={() => setParado(true)}
          onWheel={(e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) setParado(true) }}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {itens.map((p) => (
            <li key={p.name} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[19%]">
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                aria-label={`${p.name} — ${p.preco} na i-Run`}
                className="group flex h-full flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-[0_10px_30px_rgba(200,225,0,0.25)]"
              >
                <div className="relative flex aspect-square items-center justify-center bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element -- imagens externas da i-Run, lazy */}
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                  {p.desconto ? (
                    <span className="absolute bottom-2 left-0 rounded-r-full bg-[#ff4d4d] py-1 pl-2 pr-3 text-[11px] font-black uppercase tracking-wide text-white">
                      Promoção - {p.desconto} %
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-neutral-100 px-3 pb-3 pt-2">
                  <p className="text-xs text-neutral-500">{p.marca}</p>
                  <p className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">{p.modelo}</p>
                  <p className="mt-auto flex items-baseline gap-2 font-display">
                    <span className="text-lg text-[#ff4d4d]">{p.preco.replace('~', '')}</span>
                    {p.pvp ? <span className="text-sm text-neutral-800 line-through">{p.pvp} €</span> : null}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
