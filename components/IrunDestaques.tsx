import { IrunMontra } from '@/components/IrunMontra'
import { produtosCarrossel } from '@/lib/irun'

/** Montra rotativa da i-Run na homepage. Escondida se não houver produtos. */
export function IrunDestaques() {
  if (produtosCarrossel('sapatilhas').length < 2) return null
  return (
    <section className="py-16 sm:py-20 border-t border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <IrunMontra grupo="sapatilhas" />
      </div>
    </section>
  )
}
