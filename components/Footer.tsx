import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-brand-border bg-brand-dark mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-brand-green font-mono font-bold text-lg">
              PERFORMANCE<span className="text-white">RUNNING</span>
            </span>
            <p className="mt-3 text-brand-text text-sm max-w-xs leading-relaxed">
              Metodologias científicas de treino para corredores de todos os níveis.
              Corrida de estrada, trail running e atletismo.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="mailto:coaching@performancerunning.pt"
                className="text-xs text-brand-text hover:text-brand-green transition-colors"
              >
                coaching@performancerunning.pt
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-text mb-3">Navegação</p>
            <ul className="space-y-2">
              {[
                { href: '/metodologias', label: 'Metodologias' },
                { href: '/planos', label: 'Planos de Treino' },
                { href: '/blog', label: 'Blog' },
                { href: '/sobre', label: 'Sobre' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-brand-text hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Modalities */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-text mb-3">Modalidades</p>
            <ul className="space-y-2">
              {['5km / 10km', 'Meia Maratona', 'Maratona', 'Trail Running', 'Ultra Trail', 'Meio Fundo'].map((m) => (
                <li key={m}>
                  <Link
                    href="/metodologias"
                    className="text-sm text-brand-text hover:text-white transition-colors"
                  >
                    {m}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-text">
            © {year} Performance Running. Todos os direitos reservados.
          </p>
          <p className="text-xs text-brand-text">
            Construído com Next.js + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
