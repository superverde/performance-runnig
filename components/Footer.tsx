import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { NewsletterSignup } from '@/components/NewsletterSignup'

const nav = [
  { href: '/blog', label: 'Arquivo de Artigos' },
  { href: '/metodologias', label: 'Metodologias' },
  { href: '/sobre', label: 'Sobre o Projeto' },
  { href: '/contacto', label: 'Sugerir Tema' },
]

// Cada modalidade liga à sua página dedicada /modalidades/<slug> — antes
// todos os links apontavam genericamente para /metodologias, o que deixava
// as páginas de modalidade órfãs de links internos (mau para SEO).
const modalities = [
  { label: '5 km', slug: '5km' },
  { label: '10 km', slug: '10km' },
  { label: 'Meia Maratona', slug: 'meia-maratona' },
  { label: 'Maratona', slug: 'maratona' },
  { label: 'Trail Running', slug: 'trail-running' },
  { label: 'Ultra Trail', slug: 'ultra-trail' },
  { label: 'Corrida de Montanha', slug: 'corrida-montanha' },
  { label: 'Meio Fundo', slug: 'meio-fundo' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/10 overflow-hidden bg-black">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-md bg-brand-green flex items-center justify-center">
                <span className="text-black font-black text-xs">PR</span>
              </div>
              <span className="font-black text-sm tracking-tight">
                PERFORMANCE<span className="text-brand-green">RUNNING</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
              Metodologias científicas de treino para corredores de todos os níveis.
              Corrida de estrada, trail running e atletismo.
            </p>
            <a
              href="mailto:performance.running0224@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-brand-green transition-colors"
            >
              performance.running0224@gmail.com
              <ArrowUpRight size={11} />
            </a>

            {/* Redes sociais */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.facebook.com/profile.php?id=61591235338834"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/performancerunning.pt/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <NewsletterSignup variant="footer" />
          </div>

          {/* Nav */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Navegação</p>
            <ul className="space-y-2.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/65 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Modalities */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Modalidades</p>
            <ul className="grid grid-cols-2 gap-2">
              {modalities.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/modalidades/${m.slug}`}
                    className="text-sm text-white/65 hover:text-white transition-colors"
                  >
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/40">
            © {year} Performance Running. Todos os direitos reservados.
          </p>
          <p className="text-[11px] text-white/30 font-mono">
            Next.js · Tailwind CSS · Vercel
          </p>
        </div>
      </div>
    </footer>

  )
}
