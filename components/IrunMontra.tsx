import { IrunCarrossel, type ItemCarrossel } from '@/components/IrunCarrossel'
import { IRUN_LOJA_LINK, marcaModelo, produtosCarrossel } from '@/lib/irun'
import { trackedLink } from '@/lib/tracking'

const TITULOS = {
  sapatilhas: 'Sapatilhas em promoção',
  eletronica: 'Relógios e sensores',
  acessorios: 'Acessórios e nutrição',
} as const

/** Montra rotativa da i-Run (servidor): prepara os cartões e passa-os ao carrossel. */
export function IrunMontra({ grupo, titulo }: { grupo: keyof typeof TITULOS; titulo?: string }) {
  if (!IRUN_LOJA_LINK) return null
  const itens: ItemCarrossel[] = produtosCarrossel(grupo).map((p) => ({
    name: p.name,
    ...marcaModelo(p.name),
    preco: p.preco,
    pvp: p.pvp,
    desconto: p.desconto,
    img: p.img,
    href: trackedLink(p.name, p.url),
  }))
  return <IrunCarrossel titulo={titulo ?? TITULOS[grupo]} itens={itens} />
}
