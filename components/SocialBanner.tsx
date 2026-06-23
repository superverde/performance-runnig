'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const FB_URL = 'https://www.facebook.com/profile.php?id=61591235338834'
const IG_URL = 'https://www.instagram.com/performance.running0224/'

export function SocialBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('social-banner-dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  function dismiss() {
    localStorage.setItem('social-banner-dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="relative z-[60] w-full bg-[#0a0a0a] border-b border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-center gap-3">

        <span className="text-[11px] text-white/50 font-medium tracking-wide hidden sm:inline">
          Segue-nos nas redes sociais
        </span>

        <div className="flex items-center gap-2">
          {/* Facebook */}
          <a
            href={FB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-[11px] font-bold transition-all"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            Facebook
          </a>

          {/* Instagram */}
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-[11px] font-bold transition-all"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
            </svg>
            Instagram
          </a>
        </div>

        {/* Fechar */}
        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}
