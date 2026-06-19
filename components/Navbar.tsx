'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'

const links = [
  { href: '/metodologias', label: 'Metodologias' },
  { href: '/blog', label: 'Arquivo' },
  { href: '/sobre', label: 'Sobre' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_0_rgba(255,255,255,0.05)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-brand-green flex items-center justify-center">
              <span className="text-black font-black text-xs">PR</span>
            </div>
            <span className="font-black text-sm tracking-tight">
              PERFORMANCE<span className="text-brand-green">RUNNING</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === l.href
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {l.label}
                {pathname === l.href && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-brand-green" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-brand-green text-black hover:bg-brand-green/90 transition-all hover:scale-105 active:scale-95"
            >
              Ler Artigos
              <ChevronRight size={12} />
            </Link>

            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-md border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 pt-2 border-t border-white/5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-3 text-sm rounded-md transition-colors ${
                  pathname === l.href
                    ? 'text-brand-green bg-brand-green/5'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {l.label}
                <ChevronRight size={14} className="opacity-40" />
              </Link>
            ))}
            <div className="px-3 pt-3">
              <Link
                href="/blog"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold rounded-full bg-brand-green text-black"
              >
                Ler Artigos
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
