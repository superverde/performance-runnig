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

function GrelhaProdutos() {
  const produtos = produtosBlackFriday()
  if (produtos.length === 0) return null
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {produtos.map((p) => (
        <li key={p.name}>
          <a
            href={trackedLink(p.name, p.url)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition-all hover:-translate-y-1 hover:border-brand-green/60 hover:shadow-[0_12px_40px_rgba(0,200,150,0.15)]"
          >
            {/* Fotografia a toda a largura do cartão: é o que vende o produto. */}
            <div className="relative flex aspect-[4/3] items-center justify-center bg-white">
              {p.desconto ? (
                <span className="absolute left-2 top-2 z-10 rounded-lg bg-black px-2.5 py-1 font-display text-lg leading-none text-[#c8e100] shadow-lg sm:left-3 sm:top-3 sm:text-2xl">
                  -{p.desconto}%
                </span>
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element -- imagens externas da i-Run, lazy */}
              <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-contain p-2 sm:p-4 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col p-3 sm:p-5">
              <p className="text-[10px] uppercase tracking-wider text-white/40 sm:text-[11px]">{p.tipo}</p>
              <p className="mb-2 text-sm font-bold leading-snug text-white sm:text-lg">{p.name}</p>
              <p className="mt-auto flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-lg font-black text-brand-green sm:text-2xl">{p.preco}</span>
                {p.pvp ? <span className="font-mono text-xs text-white/40 line-through sm:text-sm">{p.pvp} €</span> : null}
              </p>
              <span className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-green px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-black transition-colors group-hover:bg-white sm:text-xs">
                Comprar na i-Run <ArrowUpRight size={14} />
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Logótipo oficial da i-Run (versão para fundo escuro), servido pelo próprio
 * CDN da i-Run — o parceiro identificado de forma clara, sem o redesenhar.
 */
function LogoIrun({ className = 'h-9 sm:h-12' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG oficial do parceiro
    <img src="https://static.i-run.fr/746/site_v2/img/logo-simple.svg" alt="i-Run" width={300} height={82} className={`w-auto ${className}`} />
  )
}

function CabecalhoParceiro() {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <LogoIrun />
      <span className="h-8 w-px bg-white/15 sm:h-10" />
      <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.2em] text-white/60 sm:text-xs">
        Parceiro oficial<br /><span className="text-brand-green">Black Friday 2026</span>
      </p>
    </div>
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

/**
 * Banner de Black Friday da própria i-Run (imagem da campanha "até -70%"
 * do i-run.pt, enviada pelo Pedro a 2026-11-18), a abrir o artigo.
 * Clicável para a loja, com tracking e rel="sponsored".
 */
export function BlackFridayBanner() {
  if (!IRUN_LOJA_LINK || !blackFridayAtiva()) return null
  return (
    <a
      href={trackedLink('i-run-black-friday-banner', IRUN_LOJA_LINK)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block overflow-hidden rounded-2xl border border-white/10 transition-all hover:border-brand-green/60 hover:shadow-[0_12px_40px_rgba(0,200,150,0.15)]"
      aria-label="Black Friday na i-Run: até -70% de desconto — ver promoções"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- banner estático em /public, dimensões fixas */}
      <img
        src="/parceiros/i-run-black-friday-2026.webp"
        alt="Black Friday i-Run: até -70% de desconto em sapatilhas, relógios e auscultadores de corrida"
        width={1164}
        height={244}
        fetchPriority="high"
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
      />
    </a>
  )
}

const AVISO = 'Parceiro i-Run · links de afiliado: se comprares, recebemos uma comissão sem custo extra para ti. Preços indicativos, confirma na loja. Envio grátis acima de 75 € e 30 dias para devolver.'

export function BlackFridayDestaque({ variante }: { variante: Variante }) {
  if (!blackFridayAtiva() || produtosBlackFriday().length === 0) return null

  if (variante === 'blog') {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-green/40 bg-gradient-to-r from-brand-green/[0.15] via-black to-black p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <LogoIrun className="h-8 sm:h-10" />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-brand-green">Black Friday 2026 · até 30 de novembro</p>
        </div>
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
      <aside className="relative overflow-hidden border-y border-brand-green/30 bg-black py-10 sm:py-14" aria-label="Seleção de Black Friday na i-Run">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-brand-green/10 blur-[140px]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <CabecalhoParceiro />
            <BotaoLoja />
          </div>
          <h2 className="mb-6 font-display text-3xl leading-none text-white sm:text-5xl">
            AS NOSSAS <span className="text-brand-green">ESCOLHAS</span>
          </h2>
          <GrelhaProdutos />
          <p className="mt-6 text-[11px] text-white/35">{AVISO}</p>
        </div>
      </aside>
    )
  }

  return (
    <section className="relative overflow-hidden border-y border-brand-green/30 bg-black py-16 sm:py-24" aria-label="Black Friday 2026 para corredores">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand-green/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-6"><CabecalhoParceiro /></div>
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
