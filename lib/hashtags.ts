/**
 * Hashtags centralizadas para publicações automáticas (Facebook, Instagram,
 * X, Threads).
 *
 * ANTES: 3 ficheiros diferentes (social-post, evening-social, midday-tip)
 * tinham cada um o seu próprio mapa de hashtags por categoria, já
 * divergentes entre si, com 6 a 13 hashtags por post (ex: "#running
 * #corredores #performancerunning" repetido em quase todas as categorias,
 * mais 5 hashtags extra acrescentados no prompt do Instagram em cima dos
 * da categoria). A auditoria de 2026-07-17 (ver commit a25a98b) já tinha
 * trocado os hashtags internacionais por um mix PT+BR (47% do tráfego era
 * dos EUA com bounce de 64%), mas manteve 7-8 hashtags por categoria.
 *
 * Isto já não ajuda o alcance: o próprio Instagram (Adam Mosseri, CEO)
 * confirmou que hashtags deixaram de aumentar alcance — servem apenas para
 * categorizar o conteúdo. Testes de mercado (2026) mostram que 3-5 hashtags
 * relevantes geram ~25% mais engagement do que 10+ genéricos, e que
 * legendas com palavras-chave no texto geram mais alcance do que posts
 * carregados de hashtags. Publicar sempre 7-13 hashtags é tratado pelo
 * algoritmo como sinal de spam, não de relevância — provável causa raiz
 * de posts com 0 gostos/comentários/partilhas apesar de hashtags "certos".
 *
 * AGORA: máximo 4 hashtags por categoria, mantendo a orientação PT+BR da
 * auditoria de 2026-07-17 mas cortando os genéricos repetidos em todas as
 * categorias (#corrida, #corredores, #performancerunning), centralizados
 * aqui para as 3 rotas usarem os mesmos valores e não divergirem outra vez.
 */

export const CATEGORY_HASHTAGS: Record<string, string> = {
  'Treino':        '#treino #treinodecorrida #corridaderua #vidadecorredor',
  'Fisiologia':    '#fisiologia #vo2max #resistencia #vidadecorredor',
  'Nutrição':      '#nutricaoesportiva #maratona #vidadecorredor #corridaportugal',
  'Biomecânica':   '#biomecanica #tecnicadecorrida #corridaderua #vidadecorredor',
  'Recuperação':   '#recuperacao #descanso #vidadecorredor #corridaportugal',
  'Psicologia':    '#psicologiadoesporte #mentalidade #vidadecorredor #corridaportugal',
  'Trail Running': '#trailrunning #trailportugal #trailbrasil #corridademontanha',
  'Lesões':        '#prevencaodelesoes #fisioterapia #vidadecorredor #corridaportugal',
  'VO2max':        '#vo2max #fisiologia #resistencia #vidadecorredor',
}

export const DEFAULT_HASHTAGS = '#corrida #corridaderua #atletismo #vidadecorredor'

/** Devolve as hashtags da categoria, ou o conjunto por omissão. */
export function hashtagsFor(category: string): string {
  return CATEGORY_HASHTAGS[category] ?? DEFAULT_HASHTAGS
}
