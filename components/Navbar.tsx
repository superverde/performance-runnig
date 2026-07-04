'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import { LOCALE_LABELS, LOCALES } from '@/lib/locale'
import type { Locale } from '@/lib/locale'

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const { locale, t, changeLocale, isPending } = useLocale()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const navLinks = [
    { href: '/metodologias', key: 'metodologias' },
    { href: '/blog', key: 'arquivo' },
    { href: '/ferramentas', key: 'ferramentas' },
    { href: '/calendario', key: 'calendario' },
    { href: '/equipamento', key: 'equipamento' },
    { href: '/reviews', key: 'testemunhos' },
    { href: '/sobre', key: 'sobre' },
  ]

  const current = LOCALE_LABELS[locale]

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
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-2 font-display text-[15px] tracking-[0.08em] uppercase rounded-lg transition-all ${
                  pathname === l.href
                    ? 'text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {t('nav', l.key)}
                {pathname === l.href && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-brand-green" />
                )}
              </Link>
            ))}
          </div>

          {/* Seletor idioma + CTA + mobile */}
          <div className="flex items-center gap-2">

            {/* Language switcher */}
            <div ref={langRef} className="relative hidden md:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                disabled={isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/55 hover:text-white hover:border-white/20 text-[12px] font-bold transition-all"
              >
                <span>{current.flag}</span>
                <span>{current.label}</span>
                <ChevronDown size={11} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[130px]">
                  {LOCALES.map((loc) => {
                    const info = LOCALE_LABELS[loc as Locale]
                    return (
                      <button
                        key={loc}
                        onClick={() => {
                          changeLocale(loc as Locale)
                          setLangOpen(false)
                        }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-bold transition-colors hover:bg-white/5 ${
                          locale === loc ? 'text-brand-green' : 'text-white/60'
                        }`}
                      >
                        <span>{info.flag}</span>
                        <span>{info.label}</span>
                        {locale === loc && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-green" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Redes sociais desktop */}
            <div className="hidden md:flex items-center gap-1.5">
              <a
                href="https://www.facebook.com/profile.php?id=61591235338834"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/performancerunning.pt/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>

            <Link
              href="/consulta"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-black rounded-full bg-brand-green text-black hover:bg-white transition-all"
            >
              {t('nav', 'cta')}
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
            open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-5 pt-2 border-t border-white/5">
            {navLinks.map((l) => (
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
                {t('nav', l.key)}
              </Link>
            ))}

            {/* Seletor idioma mobile */}
            <div className="px-3 pt-3 pb-2">
              <p className="text-[9px] uppercase tracking-widest text-white/25 font-mono mb-2">Idioma</p>
              <div className="flex flex-wrap gap-2">
                {LOCALES.map((loc) => {
                  const info = LOCALE_LABELS[loc as Locale]
                  return (
                    <button
                      key={loc}
                      onClick={() => {
                        changeLocale(loc as Locale)
                        setOpen(false)
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                        locale === loc
                          ? 'border-brand-green/40 text-brand-green bg-brand-green/5'
                          : 'border-white/10 text-white/45 hover:text-white'
                      }`}
                    >
                      {info.flag} {info.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Redes sociais mobile */}
            <div className="px-3 pt-2 pb-1 flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61591235338834"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                Facebook
              </a>
              <a
                href="https://www.instagram.com/performancerunning.pt/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            </div>

            <div className="px-3 pt-2">
              <Link
                href="/consulta"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full py-3 text-sm font-black rounded-full bg-brand-green text-black hover:bg-white transition-all"
              >
                {t('nav', 'cta')}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
