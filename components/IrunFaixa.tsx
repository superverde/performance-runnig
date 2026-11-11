import { ArrowUpRight } from 'lucide-react'
import { IRUN_LOJA_LINK } from '@/lib/irun'
import { trackedLink } from '@/lib/tracking'

/** Faixa i-Run para /blog e /equipamento. Escondida enquanto IRUN_LOJA_LINK estiver vazio. */
export function IrunFaixa({ className = '' }: { className?: string }) {
  if (!IRUN_LOJA_LINK) return null
  return (
    <a
      href={trackedLink('i-run-loja', IRUN_LOJA_LINK)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl border border-brand-green/25 bg-brand-green/[0.05] hover:border-brand-green/50 transition-all ${className}`}
    >
      <span className="text-sm text-white/80">
        <strong className="text-white">Sapatilhas, eletrónica e nutrição na i-Run</strong>
        <span className="text-white/45"> · envio grátis acima de 75 € · 30 dias para devolver</span>
      </span>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-brand-green group-hover:text-white transition-colors">
        Parceiro · ver loja <ArrowUpRight size={12} />
      </span>
    </a>
  )
}
