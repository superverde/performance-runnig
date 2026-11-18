/**
 * Configuração dos blocos de parceiro i-Run, separada de lib/irun.ts para
 * que componentes de cliente (ex.: BlackFridayBar, em todas as páginas) não
 * puxem o inventário de produtos inteiro para o bundle do browser.
 * Ver regras em lib/irun.ts.
 */

/** Deep link Kwanko para a página inicial do i-run.pt. Vazio = faixas escondidas. */
export const IRUN_LOJA_LINK =
  'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2F'

/**
 * Black Friday (datas inclusivas, hora de Lisboa). Durante este período:
 * barra fixa no fundo de todas as páginas, secção grande na homepage,
 * destaque no /blog e seleção de produtos no topo do artigo.
 * 2026-11-18: início antecipado de 20/11 para 18/11 — a i-Run já tinha a
 * campanha de Black Friday ativa e o Pedro pediu "grande destaque".
 */
export const BLACK_FRIDAY = {
  inicio: '2026-11-18',
  fim: '2026-11-30',
  /** Artigo para onde a faixa aponta, se existir em content/blog. */
  artigoSlug: 'black-friday-2026-corrida-o-que-comprar',
  /** Alternativa: deep link Kwanko para a página de promoções da i-Run. */
  link: '',
}

/**
 * Produtos em destaque na Black Friday (nomes exatos de lib/products.ts).
 * Só aparecem os que tiverem `linkIrun`.
 */
export const BLACK_FRIDAY_DESTAQUES = [
  'Nike Pegasus 41',
  'ASICS Novablast 6',
  'On Cloudmonster 2',
  'Nike Vaporfly 3',
  'HOKA Speedgoat 7',
  'Polar H10',
]

/** Data de hoje (YYYY-MM-DD) em Lisboa. */
export function hojeLisboa(agora: Date = new Date()): string {
  return agora.toLocaleDateString('sv-SE', { timeZone: 'Europe/Lisbon' })
}

/** true entre BLACK_FRIDAY.inicio e BLACK_FRIDAY.fim (inclusive), hora de Lisboa. */
export function blackFridayAtiva(agora: Date = new Date()): boolean {
  const hoje = hojeLisboa(agora)
  return hoje >= BLACK_FRIDAY.inicio && hoje <= BLACK_FRIDAY.fim
}

/** Páginas onde nunca mostramos blocos de parceiro. */
export const SEM_PUBLICIDADE = ['/privacidade', '/contacto', '/consulta', '/admin']
