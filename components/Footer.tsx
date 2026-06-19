import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const nav = [
  { href: '/blog', label: 'Arquivo de Artigos' },
  { href: '/metodologias', label: 'Metodologias' },
  { href: '/sobre', label: 'Sobre o Projeto' },
  { href: '/contacto', label: 'Sugerir Tema' },
]

const modalities = [
  '5 km', '10 km', 'Meia Maratona', 'Maratona',
  'Trail Running', 'Ultra Trail', 'Corrida de Montanha', 'Meio Fundo',
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-md bg-brand-green flex items-center justify-center">
                <span className="text-black font-black text-xs">PR</span>
              </div>
              <span className="font-black text-sm tracking-tight">
                PERFORMANCE<span className="text-brand-green">RUNNING</span>
              </span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-6">
              Metodologias científicas de treino para corredores de todos os níveis.
              Corrida de estrada, trail running e atletismo.
            </p>
            <a
              href="mailto:pedronunes5556@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-brand-green transition-colors"
            >
              pedronunes5556@gmail.com
              <ArrowUpRight size={11} />
            </a>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mb-4">Navegação</p>
            <ul className="space-y-2.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Modalities */}
          <div className="md:col-span-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mb-4">Modalidades</p>
            <ul className="grid grid-cols-2 gap-2">
              {modalities.map((m) => (
                <li key={m}>
                  <Link
                    href="/metodologias"
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {m}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20">
            © {year} Performance Running. Todos os direitos reservados.
          </p>
          <p className="text-[11px] text-white/15 font-mono">
            Next.js · Tailwind CSS · Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
