import { ArrowUpRight } from 'lucide-react'
import { IRUN_LOJA_LINK, blackFridayAtiva, produtosIrunPara } from '@/lib/irun'
import { trackedLink } from '@/lib/tracking'
import { BlackFridayBanner } from '@/components/BlackFridayDestaque'

/**
 * Destaque da i-Run no topo de /blog e /equipamento.
 * ------------------------------------------------------------------
 * - Durante a Black Friday: o banner da própria campanha da i-Run
 *   (até -70%), a toda a largura — como no i-run.pt.
 * - Fora da Black Friday: cartão escuro com o logótipo da i-Run, 4
 *   produtos com foto, preço e desconto, e botão para a loja.
 * Escondido enquanto IRUN_LOJA_LINK estiver vazio.
 */
export function IrunFaixa({ className = '' }: { className?: string }) {
  if (!IRUN_LOJA_LINK) return null

  if (blackFridayAtiva()) {
    return (
      <div className={className}>
        <BlackFridayBanner />
        <p className="mt-2 text-right text-[10px] uppercase tracking-widest text-white/30">Parceiro · i-Run · link de afiliado</p>
      </div>
    )
  }

  const produtos = produtosIrunPara('Equipamento', 4, 'faixa')
  return (
    <section
      aria-label="Parceiro i-Run"
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#c8e100]/15 blur-[90px]" />
      <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_2fr] lg:items-center">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG oficial do parceiro */}
          <img src="https://static.i-run.fr/746/site_v2/img/logo-simple.svg" alt="i-Run" width={300} height={82} className="mb-4 h-10 w-auto sm:h-12" />
          <p className="mb-2 text-2xl font-black leading-tight text-white sm:text-3xl">Tudo para correr, num só sítio</p>
          <p className="mb-5 text-sm text-white/55">Envio grátis acima de 75 € · 30 dias para devolver · pagamento em prestações</p>
          <a
            href={trackedLink('i-run-loja', IRUN_LOJA_LINK)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 rounded-full bg-[#c8e100] px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-white"
          >
            Ver a loja <ArrowUpRight size={15} />
          </a>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {produtos.map((p) => (
            <li key={p.name}>
              <a
                href={trackedLink(p.name, p.url)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group block overflow-hidden rounded-xl border border-white/10 bg-[#111] transition-all hover:-translate-y-0.5 hover:border-[#c8e100]/60"
              >
                <div className="relative flex aspect-square items-center justify-center bg-white">
                  {p.desconto ? (
                    <span className="absolute left-2 top-2 rounded-md bg-black px-2 py-0.5 font-display text-base leading-none text-[#c8e100]">-{p.desconto}%</span>
                  ) : null}
                  {/* eslint-disable-next-line @next/next/no-img-element -- imagens externas da i-Run, lazy */}
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105" />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-bold text-white/90">{p.name}</p>
                  <p className="font-mono text-sm font-black text-[#c8e100]">{p.preco}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="relative px-6 pb-4 text-[10px] uppercase tracking-widest text-white/30 sm:px-8">Parceiro · links de afiliado</p>
    </section>
  )
}
