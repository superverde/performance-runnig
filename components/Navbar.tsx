'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useLocale } from '@/components/LocaleProvider'
import { LOCALE_LABELS, LOCALES } from '@/lib/locale'
import type { Locale } from '@/lib/locale'

const TOOLS_SUBLINKS = [
  { href: '/ferramentas', label: 'VDOT & Pace', isNew: false },
  { href: '/ferramentas/idade', label: 'Classificação por Idade', isNew: true },
  { href: '/ferramentas/comparador-sapatilhas', label: 'Comparador de Sapatilhas', isNew: false },
  { href: '/ferramentas/zonas-fc', label: 'Zonas de Frequência Cardíaca', isNew: true },
  { href: '/ferramentas/splits', label: 'Tabela de Passagens (Splits)', isNew: true },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const toolsRef = useRef<HTMLDivElement>(null)
  const { locale, t, changeLocale, isPending } = useLocale()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const navLinks = [
    { href: '/metodologias', key: 'metodologias' },
    { href: '/blog', key: 'arquivo' },
    { href: '/calendario', key: 'calendario' },
    { href: '/equipamento', key: 'equipamento' },
    { href: '/reviews', key: 'testemunhos' },
    { href: '/sobre', key: 'sobre' },
  ]

  const isToolsActive = pathname.startsWith('/ferramentas')

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
            <span className="font-display text-white tracking-tight text-[19px] leading-none" style={{ fontStyle: 'italic' }}>
              PERFORMANCE<span className="text-brand-green">RUNNING</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/metodologias"
              className={`relative px-4 py-2 font-display text-[16px] tracking-[0.06em] uppercase rounded-lg transition-all ${
                pathname === '/metodologias' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              {t('nav', 'metodologias')}
              {pathname === '/metodologias' && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-brand-green" />
              )}
            </Link>
            <Link
              href="/blog"
              className={`relative px-4 py-2 font-display text-[16px] tracking-[0.06em] uppercase rounded-lg transition-all ${
                pathname === '/blog' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              {t('nav', 'arquivo')}
              {pathname === '/blog' && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-brand-green" />
              )}
            </Link>

            {/* Ferramentas — dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`relative flex items-center gap-1.5 px-4 py-2 font-display text-[16px] tracking-[0.06em] uppercase rounded-lg transition-all ${
                  isToolsActive ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {t('nav', 'ferramentas')}
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                <ChevronDown size={12} className={`transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                {isToolsActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-brand-green" />
                )}
              </button>

              {toolsOpen && (
                <div className="absolute left-0 top-full mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[260px]">
                  {TOOLS_SUBLINKS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setToolsOpen(false)}
                      className={`flex items-center justify-between gap-2 px-4 py-3 text-sm font-bold transition-colors hover:bg-white/5 ${
                        pathname === tool.href ? 'text-brand-green' : 'text-white/80'
                      }`}
                    >
                      {tool.label}
                      {tool.isNew && (
                        <span className="px-1.5 py-0.5 bg-brand-green text-black text-xs font-black uppercase tracking-wide rounded-full">
                          Novo
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(2).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-2 font-display text-[16px] tracking-[0.06em] uppercase rounded-lg transition-all ${
                  pathname === l.href
                    ? 'text-white'
                    : 'text-white/80 hover:text-white'
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 text-sm font-bold transition-all"
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
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-white/5 ${
                          locale === loc ? 'text-brand-green' : 'text-white/75'
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
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-black rounded-full bg-brand-green text-black hover:bg-white transition-all"
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
            {navLinks.slice(0, 2).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-3 font-display text-base uppercase tracking-[0.06em] rounded-lg transition-all ${
                  pathname === l.href
                    ? 'text-brand-green bg-brand-green/5'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {t('nav', l.key)}
              </Link>
            ))}

            {/* Ferramentas — grupo expansível */}
            <button
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
              className={`w-full flex items-center justify-between px-3 py-3 font-display text-base uppercase tracking-[0.06em] rounded-lg transition-all ${
                isToolsActive ? 'text-brand-green bg-brand-green/5' : 'text-white/75 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                {t('nav', 'ferramentas')}
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              </span>
              <ChevronDown size={16} className={`transition-transform ${mobileToolsOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-out ${mobileToolsOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
              {TOOLS_SUBLINKS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => { setOpen(false); setMobileToolsOpen(false) }}
                  className={`flex items-center justify-between gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    pathname === tool.href ? 'text-brand-green' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tool.label}
                  {tool.isNew && (
                    <span className="px-1.5 py-0.5 bg-brand-green text-black text-xs font-black uppercase tracking-wide rounded-full">
                      Novo
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {navLinks.slice(2).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-3 font-display text-base uppercase tracking-[0.06em] rounded-lg transition-all ${
                  pathname === l.href
                    ? 'text-brand-green bg-brand-green/5'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {t('nav', l.key)}
              </Link>
            ))}

            {/* Seletor idioma mobile */}
            <div className="px-3 pt-3 pb-2">
              <p className="text-xs uppercase tracking-widest text-white/50 font-mono mb-2">Idioma</p>
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        locale === loc
                          ? 'border-brand-green/40 text-brand-green bg-brand-green/5'
                          : 'border-white/10 text-white/65 hover:text-white'
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
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
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
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
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
