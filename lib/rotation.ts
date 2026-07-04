/**
 * Rotação periódica de produtos para a página /equipamento.
 * ------------------------------------------------------------------
 * Objetivo: com um inventário maior por categoria, não mostramos sempre
 * os mesmos produtos — mostramos um subconjunto que roda a cada ciclo,
 * dando visibilidade a todo o catálogo ao longo do tempo, sem penalizar
 * os produtos que já provam converter bem (mais clicados ficam "pinned").
 *
 * A rotação é uma função pura do tempo (bucket = janela de N horas), por
 * isso funciona corretamente em ISR/serverless sem precisar de cron jobs
 * nem estado partilhado — todas as instâncias calculam o mesmo resultado
 * para o mesmo bucket.
 */

/** Duração de cada ciclo de rotação, em ms — alinhado com o `revalidate` da página (6h) */
export const ROTATION_CYCLE_MS = 6 * 60 * 60 * 1000

/** Índice do ciclo de rotação atual (muda a cada ROTATION_CYCLE_MS) */
export function getCurrentRotationBucket(cycleMs: number = ROTATION_CYCLE_MS): number {
  return Math.floor(Date.now() / cycleMs)
}

/** Hash determinístico de string → inteiro (djb2) — usado como seed do shuffle */
function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return hash >>> 0
}

/** PRNG determinístico (mulberry32) — mesma seed produz sempre a mesma sequência */
function mulberry32(seed: number) {
  let s = seed | 0
  return function random() {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Baralha um array de forma determinística (Fisher-Yates, seedado) */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  const random = mulberry32(seed)
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Seleciona o subconjunto de produtos a mostrar neste ciclo de rotação.
 *
 * Estratégia:
 *   1. Os `pinnedCount` produtos com mais clicks reais (>0) ficam sempre
 *      visíveis — não sacrificamos conversão já comprovada em nome da
 *      variedade.
 *   2. O resto dos slots visíveis é preenchido com uma seleção que roda
 *      a cada ciclo (baralho determinístico seedado por categoria+bucket),
 *      escolhida entre os restantes produtos do inventário.
 *   3. Se o inventário da categoria for menor ou igual a `visibleCount`,
 *      mostra tudo sem rotação (não há o que rodar).
 *
 * @param items         Produtos da categoria (idealmente já ordenados por clicks desc.)
 * @param clicks        Mapa de clicks reais (slug → contagem)
 * @param toSlug        Função de slug consistente com o tracking de clicks
 * @param visibleCount   Quantos produtos mostrar no total neste ciclo
 * @param pinnedCount    Quantos dos mais clicados ficam sempre fixos
 * @param categoryKey    Chave única da categoria (ex: 'sapatos') — usada na seed
 * @param bucket         Ciclo de rotação atual — ver getCurrentRotationBucket()
 */
export function selectRotatingProducts<T extends { name: string }>(
  items: T[],
  clicks: Record<string, number>,
  toSlug: (name: string) => string,
  visibleCount: number,
  pinnedCount: number,
  categoryKey: string,
  bucket: number
): T[] {
  if (items.length <= visibleCount) return items

  const withClicks = items.filter((item) => (clicks[toSlug(item.name)] ?? 0) > 0)
  const pinned = withClicks.slice(0, Math.min(pinnedCount, withClicks.length))
  const pinnedNames = new Set(pinned.map((p) => p.name))

  const pool = items.filter((item) => !pinnedNames.has(item.name))
  const remainingSlots = Math.max(0, visibleCount - pinned.length)

  const seed = hashString(`${categoryKey}-${bucket}`)
  const rotated = seededShuffle(pool, seed).slice(0, remainingSlots)

  return [...pinned, ...rotated]
}
