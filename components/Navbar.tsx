'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/metodologias', label: 'Metodologias' },
  { href: '/blog', label: 'Arquivo' },
  { href: '/reviews', label: 'Testemunhos' },
  { href: '/sobre', label: 'Sobre' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_24px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[60px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            {/* PR logomark */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-green rounded-lg" />
              <span className="relative font-display text-black text-[15px] leading-none" style={{ fontStyle: 'italic' }}>
                PR
              </span>
            </div>
            <span className="font-display text-white tracking-tight text-[17px] leading-none" style={{ fontStyle: 'italic' }}>
              PERFORMANCE<span className="text-brand-green">RUNNING</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-2 font-display text-[15px] tracking-[0.08em] uppercase rounded-lg transition-all ${
                  pathname === l.href
                    ? 'text-white'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {l.label}
                {pathname === l.href && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-brand-green" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/consulta"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-black rounded-full bg-brand-green text-black hover:bg-white transition-all"
            >
              Consulta Gratuita
            </Link>

            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-5 pt-2 border-t border-white/5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-3 font-display text-base uppercase tracking-[0.08em] rounded-lg transition-all ${
                  pathname === l.href
                    ? 'text-brand-green bg-brand-green/5'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="px-3 pt-3">
              <Link
                href="/consulta"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full py-3 text-sm font-black rounded-full bg-brand-green text-black hover:bg-white transition-all"
              >
                Consulta Gratuita
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
