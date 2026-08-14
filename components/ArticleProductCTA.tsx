import { ArrowUpRight } from 'lucide-react'
import { sapatos, relogios, sensoresFc, nutricao, acessorios } from '@/lib/products'
import { trackedLink } from '@/lib/tracking'

type Pick = { name: string; preco: string; img: string; link: string }

function byName<T extends { name: string; preco: string; img: string; link: string }>(
  list: T[],
  name: string
): Pick | null {
  const found = list.find((p) => p.name === name)
  if (!found) return null
  return { name: found.name, preco: found.preco, img: found.img, link: found.link }
}

const PICKS: Record<string, (Pick | null)[]> = {
  equipamento: [byName(sapatos, 'HOKA Clifton 9'), byName(relogios, 'Garmin Forerunner 265')],
  treino: [byName(relogios, 'Garmin Forerunner 265'), byName(sensoresFc, 'Polar H10')],
  fisiologia: [byName(sensoresFc, 'Polar H10'), byName(relogios, 'Garmin Forerunner 955')],
  nutricao: [byName(nutricao, 'SiS Beta Fuel Gel'), byName(nutricao, 'Maurten Gel 100')],
  biomecanica: [byName(sapatos, 'ASICS Novablast 5'), byName(sapatos, 'Nike Pegasus 41')],
  recuperacao: [byName(acessorios, 'TriggerPoint GRID Foam Roller'), byName(nutricao, 'Whey Proteina Isolada')],
  psicologia: [byName(sapatos, 'HOKA Clifton 9'), byName(relogios, 'Garmin Forerunner 265')],
  'trail-running': [byName(sapatos, 'Salomon Speedcross 6'), byName(acessorios, 'Salomon Active Skin 8')],
  lesoes: [byName(sapatos, 'Brooks Ghost Max 2'), byName(acessorios, 'TriggerPoint GRID Foam Roller')],
  vo2max: [byName(sensoresFc, 'Polar H10'), byName(relogios, 'Garmin Forerunner 970')],
}

export function ArticleProductCTA({ categorySlug }: { categorySlug: string }) {
  const picks = (PICKS[categorySlug] ?? PICKS.equipamento).filter(Boolean) as Pick[]
  if (picks.length === 0) return null

  return (
    <div className="mt-10 p-5 rounded-xl border border-brand-green/20 bg-brand-green/[0.04]">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green/80 mb-4">
        Equipamento recomendado
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {picks.map((p) => (
          <a
            key={p.name}
            href={trackedLink(p.name, p.link)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:border-brand-green/40 hover:bg-brand-green/[0.06] transition-all"
          >
            <img src={p.img} alt={p.name} className="w-14 h-14 object-contain rounded-md bg-white/5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white/85 group-hover:text-white truncate">{p.name}</p>
              <p className="text-xs text-brand-green font-mono">{p.preco}</p>
            </div>
            <ArrowUpRight size={16} className="text-white/30 group-hover:text-brand-green transition-colors shrink-0" />
          </a>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-white/35">
        Links de afiliado, podemos receber uma comissao sem custo extra para ti.{' '}
        <a href="/equipamento" className="underline hover:text-brand-green/70">Ver todo o equipamento &#8594;</a>
      </p>
    </div>
  )
}
