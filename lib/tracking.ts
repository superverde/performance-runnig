/**
 * Utilitário partilhado para tracking de cliques em links de afiliado.
 * ------------------------------------------------------------------
 * Qualquer link de afiliado no site (Amazon, etc.) deve passar por
 * `trackedLink()` antes de ser usado num `href`, para que o clique seja
 * contabilizado em Redis via /api/track-click e apareça no relatório
 * diário e em /api/affiliate-stats.
 *
 * O slug tem de ser gerado sempre pela mesma função (`toSlug`) em todos
 * os sítios onde é usado, para que os cliques do mesmo produto fiquem
 * agrupados sob a mesma chave em Redis.
 */

/** Gera um slug estável a partir do nome do produto. */
export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/** Converte um link de afiliado num URL de tracking interno (/api/track-click). */
export function trackedLink(productName: string, affiliateUrl: string): string {
  return `/api/track-click?product=${encodeURIComponent(toSlug(productName))}&url=${encodeURIComponent(affiliateUrl)}`
}
