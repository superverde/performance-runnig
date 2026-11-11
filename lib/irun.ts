/**
 * Blocos de parceiro i-Run (programa de afiliados via Kwanko, campanha i-Run PT
 * P79921, 15% CPA). 2026-11-11.
 * ------------------------------------------------------------------
 * Regras (decididas com o Pedro):
 * - A i-Run aparece em destaque, mas no sítio certo: a meio de cada artigo,
 *   na homepage, no /blog e no /equipamento. Faixa no topo de todas as
 *   páginas só durante a Black Friday.
 * - Sem publicidade em /privacidade, /contacto, /consulta e /admin.
 * - Só links e imagens simples, sem scripts da Kwanko (site rápido e sem
 *   necessidade de consentimento de cookies). Sempre identificado como
 *   "Parceiro" / link de afiliado.
 * - Tudo fica escondido enquanto não houver links: os produtos só aparecem
 *   quando têm `linkIrun` em lib/products.ts, e as faixas só aparecem quando
 *   IRUN_LOJA_LINK estiver preenchido. Os links têm de ser deep links gerados
 *   no painel publisher.kwanko.com, nunca copiados de anúncios.
 */
import { sapatos, relogios, sensoresFc, nutricao, acessorios } from '@/lib/products'

export { IRUN_LOJA_LINK, BLACK_FRIDAY, SEM_PUBLICIDADE } from '@/lib/irun-config'

export interface IrunProduto {
  name: string
  preco: string
  img: string
  url: string
  tipo: string
}

type Base = { name: string; preco: string; img: string; linkIrun?: string }

function comIrun<T extends Base>(list: T[], tipo: string): IrunProduto[] {
  return list
    .filter((p) => !!p.linkIrun)
    .map((p) => ({ name: p.name, preco: p.preco, img: p.img, url: p.linkIrun as string, tipo }))
}

const estrada = () => comIrun(sapatos.filter((s) => s.categoria === 'Estrada'), 'Sapatilha de estrada')
const competicao = () => comIrun(sapatos.filter((s) => s.categoria === 'Competição'), 'Sapatilha de competição')
const trail = () => comIrun(sapatos.filter((s) => s.categoria === 'Trail'), 'Sapatilha de trail')
const eletronica = () => [...comIrun(sensoresFc, 'Sensor de FC'), ...comIrun(relogios, 'Relógio GPS')]
const nutri = () => comIrun(nutricao, 'Nutrição')
const acess = () => comIrun(acessorios, 'Acessório')
const todos = () => [...estrada(), ...trail(), ...competicao(), ...eletronica(), ...nutri(), ...acess()]

/** Produtos mais relevantes para cada categoria de artigo (por ordem de preferência). */
const POR_CATEGORIA: Record<string, () => IrunProduto[]> = {
  'Trail Running': () => [...trail(), ...acess()],
  Nutrição: () => [...nutri(), ...estrada()],
  Fisiologia: () => [...eletronica(), ...estrada()],
  VO2max: () => [...eletronica(), ...competicao()],
  Treino: () => [...estrada(), ...eletronica(), ...competicao()],
  Biomecânica: () => [...estrada(), ...competicao()],
  Lesões: () => [...estrada(), ...acess()],
  Recuperação: () => [...acess(), ...estrada()],
  Psicologia: () => [...estrada(), ...eletronica()],
  Equipamento: () => [...estrada(), ...competicao(), ...trail(), ...eletronica()],
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/**
 * Escolhe `n` produtos i-Run para uma categoria. A `semente` (ex.: o slug do
 * artigo) roda a escolha para que artigos diferentes mostrem produtos
 * diferentes, mas o mesmo artigo mostre sempre os mesmos.
 */
export function produtosIrunPara(categoria: string, n = 2, semente = ''): IrunProduto[] {
  const preferidos = (POR_CATEGORIA[categoria] ?? todos)()
  const lista = preferidos.length >= n ? preferidos : [...preferidos, ...todos()]
  const unicos = lista.filter((p, i) => lista.findIndex((q) => q.name === p.name) === i)
  if (unicos.length <= n) return unicos
  const inicio = hash(semente) % unicos.length
  return Array.from({ length: n }, (_, i) => unicos[(inicio + i) % unicos.length])
}
