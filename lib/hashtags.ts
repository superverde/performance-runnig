/**
 * Hashtags centralizadas para publicações automáticas (Facebook, Instagram,
 * X, Threads).
 *
 * ANTES: 3 ficheiros diferentes (social-post, evening-social, midday-tip)
 * tinham cada um o seu próprio mapa de hashtags por categoria, já
 * divergentes entre si, com 6 a 13 hashtags genéricos por post (ex:
 * "#running #corredores #performancerunning" repetido em quase todas as
 * categorias, mais 5 hashtags extra acrescentados no prompt do Instagram
 * em cima dos da categoria).
 *
 * Isto já não ajuda o alcance: o próprio Instagram (Adam Mosseri, CEO)
 * confirmou que hashtags deixaram de aumentar alcance — servem apenas para
 * categorizar o conteúdo. Testes de mercado (2026) mostram que 3-5 hashtags
 * relevantes geram ~25% mais engagement do que 10+ genéricos, e que
 * legendas com palavras-chave no texto geram mais alcance do que posts
 * carregados de hashtags. Publicar sempre 8-13 hashtags amplos é tratado
 * pelo algoritmo como sinal de spam, não de relevância.
 *
 * AGORA: máximo 4 hashtags por categoria, específicos do nicho (em vez de
 * genéricos tipo #running #corredores repetidos em todas as categorias),
 * centralizados aqui para as 3 rotas usarem os mesmos valores e não
 * divergirem outra vez.
 */

export const CATEGORY_HASHTAGS: Record<string, string> = {
  'Treino':        '#treino #treinodecorrida #planodeTreino #corredores',
  'Fisiologia':     '#fisiologia #vo2max #resistenciaaerobica #corredores',
  'Nutrição':       '#nutricaodesportiva #runningfuel #alimentacaosaudavel #corredores',
  'Biomecânica':    '#biomecanica #tecnicadecorrida #posturadecorrida #corredores',
  'Recuperação':    '#recuperacaomuscular #recovery #descansoativo #corredores',
  'Psicologia':     '#psicologiadesportiva #mindsetdecorredor #foconotreino #corredores',
  'Trail Running':  '#trailrunning #trailportugal #montanha #ultratrail',
  'Lesões':         '#prevencaodelesoes #lesoesdesportivas #fisioterapiadesportiva #corredores',
  'VO2max':         '#vo2max #fisiologia #resistenciaaerobica #corredores',
}

export const DEFAULT_HASHTAGS = '#corrida #running #atletismo #corredores'

/** Devolve as hashtags da categoria, ou o conjunto por omissão. */
export function hashtagsFor(category: string): string {
  return CATEGORY_HASHTAGS[category] ?? DEFAULT_HASHTAGS
}
