'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BLACK_FRIDAY, SEM_PUBLICIDADE } from '@/lib/irun-config'

/**
 * Faixa fina no topo de todas as páginas durante a Black Friday
 * (BLACK_FRIDAY.inicio a BLACK_FRIDAY.fim). A data é verificada no browser
 * para não depender de quando a página foi gerada. `href` vem do layout:
 * o artigo de Black Friday se existir, senão BLACK_FRIDAY.link, senão nada.
 */
export function BlackFridayBar({ href }: { href: string | null }) {
  const pathname = usePathname() || '/'
  const [ativa, setAtiva] = useState(false)

  useEffect(() => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Lisbon' }) // YYYY-MM-DD
    setAtiva(hoje >= BLACK_FRIDAY.inicio && hoje <= BLACK_FRIDAY.fim)
  }, [])

  if (!href || !ativa) return null
  if (SEM_PUBLICIDADE.some((p) => pathname === p || pathname.startsWith(p + '/'))) return null
  if (pathname === href) return null

  const externo = href.startsWith('http')
  return (
    <a
      href={href}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})}
      className="block w-full bg-brand-green text-black text-center text-xs sm:text-sm font-bold py-2 px-4 hover:bg-white transition-colors"
    >
      Black Friday para corredores: o que vale mesmo a pena comprar →
    </a>
  )
}
