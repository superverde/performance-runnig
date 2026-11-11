/**
 * Configuração dos blocos de parceiro i-Run, separada de lib/irun.ts para
 * que componentes de cliente (ex.: BlackFridayBar, em todas as páginas) não
 * puxem o inventário de produtos inteiro para o bundle do browser.
 * Ver regras em lib/irun.ts.
 */

/** Deep link Kwanko para a página inicial do i-run.pt. Vazio = faixas escondidas. */
export const IRUN_LOJA_LINK = ''

/** Faixa de Black Friday no topo do site (datas inclusivas, hora de Lisboa aprox.). */
export const BLACK_FRIDAY = {
  inicio: '2026-11-20',
  fim: '2026-11-30',
  /** Artigo para onde a faixa aponta, se existir em content/blog. */
  artigoSlug: 'black-friday-2026-corrida-o-que-comprar',
  /** Alternativa: deep link Kwanko para a página de promoções da i-Run. */
  link: '',
}

/** Páginas onde nunca mostramos blocos de parceiro. */
export const SEM_PUBLICIDADE = ['/privacidade', '/contacto', '/consulta', '/admin']
