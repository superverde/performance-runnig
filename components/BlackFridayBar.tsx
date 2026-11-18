'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { SEM_PUBLICIDADE, blackFridayAtiva } from '@/lib/irun-config'

const CHAVE_FECHADA = 'bf-2026-barra-fechada'

/**
 * Barra fixa no fundo de todas as páginas durante a Black Friday
 * (BLACK_FRIDAY.inicio a BLACK_FRIDAY.fim, hora de Lisboa). Fica no fundo e
 * não no topo porque a navbar é `fixed top-0` e taparia uma faixa no topo.
 * A data é verificada no browser para não depender de quando a página foi
 * gerada. Pode ser fechada; fica fechada até o separador ser fechado
 * (sessionStorage). `href` vem do layout: o artigo de Black Friday se
 * existir, senão BLACK_FRIDAY.link, senão nada.
 */
export function BlackFridayBar({ href }: { href: string | null }) {
  const pathname = usePathname() || '/'
  const [ativa, setAtiva] = useState(false)

  useEffect(() => {
    let fechada = false
    try {
      fechada = sessionStorage.getItem(CHAVE_FECHADA) === '1'
    } catch {
      // sessionStorage indisponível (modo privado, etc.): mostra a barra
    }
    setAtiva(blackFridayAtiva() && !fechada)
  }, [])

  const visivel =
    !!href &&
    ativa &&
    pathname !== href &&
    !SEM_PUBLICIDADE.some((p) => pathname === p || pathname.startsWith(p + '/'))

  // Reserva espaço no fundo da página para a barra não tapar o rodapé.
  useEffect(() => {
    if (!visivel) return
    const anterior = document.body.style.paddingBottom
    document.body.style.paddingBottom = '64px'
    return () => {
      document.body.style.paddingBottom = anterior
    }
  }, [visivel])

  if (!visivel || !href) return null

  function fechar() {
    try {
      sessionStorage.setItem(CHAVE_FECHADA, '1')
    } catch {
      // ignora: a barra fecha na mesma nesta página
    }
    setAtiva(false)
  }

  const externo = href.startsWith('http')
  return (
    <div
      role="region"
      aria-label="Black Friday"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-green/40 bg-black/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <span className="hidden shrink-0 rounded-md bg-brand-green px-2 py-1 font-display text-sm leading-none tracking-wide text-black sm:inline">
          BLACK FRIDAY
        </span>
        <a
          href={href}
          {...(externo ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})}
          className="min-w-0 flex-1 text-sm font-bold text-white hover:text-brand-green transition-colors"
        >
          <span className="sm:hidden text-brand-green">Black Friday: </span>
          O que vale mesmo a pena comprar para correr
          <span className="ml-2 hidden text-white/45 font-normal md:inline">· até 30 de novembro</span>
        </a>
        <a
          href={href}
          {...(externo ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})}
          className="hidden shrink-0 rounded-full bg-brand-green px-4 py-2 text-xs font-black text-black transition-colors hover:bg-white sm:inline-block"
        >
          Ver o guia →
        </a>
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar a barra de Black Friday"
          className="shrink-0 rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
