'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { IRUN_LOJA_LINK, SEM_PUBLICIDADE, blackFridayAtiva } from '@/lib/irun-config'
import { trackedLink } from '@/lib/tracking'

const CHAVE_VISTO = 'bf-2026-popup-visto'
/** Espera antes de abrir, para não tapar a página à chegada (regra do Google sobre interstitials). */
const ATRASO_MS = 8000
/** Ou abre mais cedo se o visitante já fez scroll de 35% da página. */
const SCROLL_MINIMO = 0.35

/**
 * Pop-up de Black Friday com a imagem da campanha da i-Run (até -70%),
 * enviada pelo Pedro a 2026-11-18. Regras:
 * - só durante BLACK_FRIDAY (hora de Lisboa) e nunca em SEM_PUBLICIDADE;
 * - abre uma vez por sessão, depois de 8 s ou de 35% de scroll;
 * - fecha com o X, com Esc ou a clicar fora; botão com tracking e
 *   rel="sponsored", identificado como parceiro.
 */
export function BlackFridayPopup() {
  const pathname = usePathname() || '/'
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLAnchorElement>(null)

  const bloqueada =
    !IRUN_LOJA_LINK || SEM_PUBLICIDADE.some((p) => pathname === p || pathname.startsWith(p + '/'))

  const fechar = useCallback(() => setAberto(false), [])

  useEffect(() => {
    if (bloqueada || !blackFridayAtiva()) return
    try {
      if (sessionStorage.getItem(CHAVE_VISTO) === '1') return
    } catch {
      return // sem sessionStorage não conseguimos garantir "uma vez por sessão": não abre
    }

    let feito = false
    const abrir = () => {
      if (feito) return
      feito = true
      try {
        sessionStorage.setItem(CHAVE_VISTO, '1')
      } catch {
        /* ignora */
      }
      setAberto(true)
      limpar()
    }
    const aoScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total > 0 && window.scrollY / total >= SCROLL_MINIMO) abrir()
    }
    const t = window.setTimeout(abrir, ATRASO_MS)
    window.addEventListener('scroll', aoScroll, { passive: true })
    function limpar() {
      window.clearTimeout(t)
      window.removeEventListener('scroll', aoScroll)
    }
    return limpar
  }, [bloqueada])

  useEffect(() => {
    if (!aberto) return
    botaoRef.current?.focus()
    const aoTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar()
    }
    window.addEventListener('keydown', aoTecla)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', aoTecla)
      document.body.style.overflow = overflow
    }
  }, [aberto, fechar])

  if (!aberto || bloqueada) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={fechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Black Friday na i-Run"
        className="relative w-full max-w-[680px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X size={18} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element -- imagem estática em /public */}
        <img
          src="/parceiros/i-run-black-friday-2026-popup.webp"
          alt="Black Friday i-Run: até -70% de desconto"
          width={672}
          height={350}
          className="block h-auto w-full"
        />
        <div className="flex flex-col items-center gap-2 bg-[#d9fa85] px-4 py-6">
          <a
            ref={botaoRef}
            href={trackedLink('i-run-black-friday-popup', IRUN_LOJA_LINK)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={fechar}
            className="rounded-full bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            Descobrir as melhores ofertas
          </a>
          <p className="text-[10px] text-black/55">Parceiro i-Run · link de afiliado</p>
        </div>
      </div>
    </div>
  )
}
