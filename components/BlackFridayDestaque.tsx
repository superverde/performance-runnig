import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { BLACK_FRIDAY, IRUN_LOJA_LINK, blackFridayAtiva, produtosBlackFriday } from '@/lib/irun'
import { trackedLink } from '@/lib/tracking'

/**
 * Destaque de Black Friday (parceiro i-Run).
 * ------------------------------------------------------------------
 * - `home`: secção grande logo a seguir ao hero da homepage.
 * - `blog`: cartão no topo do /blog.
 * - `artigo`: seleção de produtos no topo do artigo de Black Friday.
 *
 * Só renderiza entre BLACK_FRIDAY.inicio e BLACK_FRIDAY.fim (hora de Lisboa)
 * e quando há deep links i-Run. A verificação da data é feita no servidor:
 * a homepage e o /blog são force-dynamic, por isso nunca ficam presos fora
 * do período. Todos os links de afiliado passam por /api/track-click e
 * levam rel="sponsored".
 */
type Variante = 'home' | 'blog' | 'artigo'

const ARTIGO_HREF = `/blog/${BLACK_FRIDAY.artigoSlug}`

function GrelhaProdutos({ compacta = false }: { compacta?: boolean }) {
  const produtos = produtosBlackFriday()
  if (produtos.length === 0) return null
  return (
    <ul className={`grid gap-3 ${compacta ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
      {produtos.map((p) => (
        <li key={p.name}>
          <a
            href={trackedLink(p.name, p.url)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:-translate-y-0.5 hover:border-brand-green/60 hover:bg-brand-green/[0.06]"
          >
            <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element -- imagens externas da i-Run, pequenas e lazy */}
              <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-white/40">{p.tipo}</p>
            <p className="mb-1 text-sm font-bold leading-snug text-white/90 group-hover:text-white">{p.name}</p>
            <p className="mt-auto font-mono text-sm font-bold text-brand-green">{p.preco}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-white/60 group-hover:text-brand-green">
              Ver na i-Run <ArrowUpRight size={12} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function BotaoLoja({ texto = 'Ver todas as promoções na i-Run' }: { texto?: string }) {
  if (!IRUN_LOJA_LINK) return null
  return (
    <a
      href={trackedLink('i-run-loja', IRUN_LOJA_LINK)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white/80 transition-all hover:border-brand-green hover:text-white"
    >
      {texto} <ArrowUpRight size={15} />
    </a>
  )
}

const AVISO = 'Parceiro i-Run · links de afiliado: se comprares, recebemos uma comissão sem custo extra para ti. Preços indicativos, confirma na loja. Envio grátis acima de 75 € e 30 dias para devolver.'

export function BlackFridayDestaque({ variante }: { variante: Variante }) {
  if (!blackFridayAtiva() || produtosBlackFriday().length === 0) return null

  if (variante === 'blog') {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-green/40 bg-gradient-to-r from-brand-green/[0.15] via-black to-black p-6 sm:p-8">
        <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-brand-green">Black Friday 2026 · até 30 de novembro</p>
        <p className="mb-5 max-w-2xl text-2xl font-black leading-tight text-white sm:text-3xl">O que vale mesmo a pena comprar para correr</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={ARTIGO_HREF} className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-black text-black transition-all hover:bg-white">
            Ler o guia de Black Friday <ArrowRight size={15} />
          </Link>
          <BotaoLoja />
        </div>
        <p className="mt-4 text-[11px] text-white/35">{AVISO}</p>
      </div>
    )
  }

  if (variante === 'artigo') {
    return (
      <aside className="not-prose mb-12 rounded-2xl border border-brand-green/40 bg-brand-green/[0.05] p-5 sm:p-6" aria-label="Seleção de Black Friday na i-Run">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-green">As nossas escolhas · Black Friday</p>
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/35">Parceiro · i-Run</span>
        </div>
        <GrelhaProdutos compacta />
        <div className="mt-5"><BotaoLoja /></div>
        <p className="mt-4 text-[11px] text-white/35">{AVISO}</p>
      </aside>
    )
  }

  return (
    <section className="relative overflow-hidden border-y border-brand-green/30 bg-black py-16 sm:py-24" aria-label="Black Friday 2026 para corredores">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand-green/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-green" />
              27 de novembro · até à Cyber Monday, 30 de novembro
            </p>
            <h2 className="font-display leading-none text-white" style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}>
              BLACK <span className="text-brand-green">FRIDAY</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
              Sapatilhas, sensores e material de trail em promoção. Escolhemos o que vale mesmo a pena e explicamos como perceber se um desconto é real.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={ARTIGO_HREF} className="group inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 text-sm font-black text-black transition-all hover:gap-3 hover:bg-white">
              Ler o guia de Black Friday <ArrowRight size={15} />
            </Link>
            <BotaoLoja />
          </div>
        </div>
        <GrelhaProdutos />
        <p className="mt-6 text-[11px] text-white/35">{AVISO}</p>
      </div>
    </section>
  )
}
