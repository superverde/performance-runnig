import { ArrowUpRight } from 'lucide-react'
import { produtosIrunPara } from '@/lib/irun'
import { trackedLink } from '@/lib/tracking'

/**
 * Bloco "Parceiro · i-Run" com produtos ligados ao tema da página.
 * Não renderiza nada enquanto não houver produtos com `linkIrun`.
 */
export function IrunBloco({ categoria, semente = '', n = 2, titulo }: { categoria: string; semente?: string; n?: number; titulo?: string }) {
  const produtos = produtosIrunPara(categoria, n, semente)
  if (produtos.length === 0) return null

  return (
    <aside className="not-prose my-10 p-5 rounded-xl border border-brand-green/25 bg-brand-green/[0.05]" aria-label="Parceiro i-Run">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green/90">
          {titulo ?? 'Equipamento para este treino'}
        </p>
        <span className="text-[10px] uppercase tracking-widest text-white/35 border border-white/10 rounded-full px-2 py-0.5">Parceiro · i-Run</span>
      </div>
      <div className={`grid gap-3 ${produtos.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {produtos.map((p) => (
          <a
            key={p.name}
            href={trackedLink(p.name, p.url)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-black/30 hover:border-brand-green/50 hover:bg-brand-green/[0.08] transition-all"
          >
            {p.img ? (
              <img src={p.img} alt={p.name} loading="lazy" className="w-16 h-16 object-contain rounded-md bg-white shrink-0" />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-white/40">{p.tipo}</p>
              <p className="text-sm font-bold text-white/90 group-hover:text-white truncate">{p.name}</p>
              <p className="text-xs text-brand-green font-mono">{p.preco}</p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-black bg-brand-green px-3 py-2 rounded-lg group-hover:bg-white transition-colors">
              Ver na i-Run <ArrowUpRight size={12} />
            </span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-white/35">
        Links de afiliado: se comprares, recebemos uma comissão sem custo extra para ti. Envio grátis acima de 75 € e 30 dias para devolver na i-Run.
      </p>
    </aside>
  )
}
