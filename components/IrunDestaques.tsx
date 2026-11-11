import { IrunBloco } from '@/components/IrunBloco'
import { produtosIrunPara } from '@/lib/irun'

/** Secção da homepage com equipamento recomendado na i-Run. Escondida se houver menos de 2 produtos. */
export function IrunDestaques() {
  if (produtosIrunPara('Equipamento', 4).length < 2) return null
  return (
    <section className="py-16 sm:py-20 border-t border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <IrunBloco categoria="Equipamento" n={4} semente="homepage" titulo="Equipamento recomendado · i-Run" />
      </div>
    </section>
  )
}
