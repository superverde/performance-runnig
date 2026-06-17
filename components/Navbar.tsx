'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Início' },
  { href: '/metodologias', label: 'Metodologias' },
  { href: '/planos', label: 'Planos de Treino' },
  { href: '/blog', label: 'Blog' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border bg-brand-dark/90 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-brand-green font-mono font-bold text-lg tracking-tight">
              PERFORMANCE<span className="text-white">RUNNING</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  pathname === l.href
                    ? 'text-brand-green bg-brand-muted'
                    : 'text-brand-text hover:text-white hover:bg-brand-muted'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="ml-3 px-4 py-2 text-sm font-semibold rounded-md bg-brand-green text-black hover:bg-brand-green/90 transition-colors"
            >
              Coaching Online
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-brand-border mt-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 text-sm transition-colors ${
                  pathname === l.href ? 'text-brand-green' : 'text-brand-text hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link
                href="/contacto"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-4 py-2 text-sm font-semibold rounded-md bg-brand-green text-black"
              >
                Coaching Online
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
