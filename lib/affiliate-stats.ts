import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export interface ProductStat { product: string; total: number }
export interface DayData { date: string; clicks: number }
export interface TodayStat { product: string; count: number }

export interface AffiliateStats {
  ranking: ProductStat[]
  daily: DayData[]
  today: TodayStat[]
  updatedAt: string
}

/**
 * Estatisticas de cliques de afiliado dos ultimos 7 dias.
 *
 * Vive aqui, e nao dentro da rota /api/affiliate-stats, para que a pagina
 * /admin/afiliados possa chamar isto do lado do servidor. Antes a pagina era um
 * client component que chamava a API com a INTERNAL_API_KEY escrita no codigo —
 * o que significava que a chave ia dentro do JavaScript enviado ao browser de
 * quem abrisse a pagina.
 */
export async function getAffiliateStats(): Promise<AffiliateStats> {
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }

  const [totals, ...dailyResults] = await Promise.all([
    redis.hgetall('clicks:total'),
    ...days.map((day) => redis.hgetall(`clicks:${day}`)),
  ])

  // Normaliza — Redis pode devolver null se a chave não existe
  const totalMap = (totals as Record<string, number> | null) ?? {}
  const dailyMaps = (dailyResults as (Record<string, number> | null)[]).map((r) => r ?? {})

  const ranking = Object.entries(totalMap)
    .map(([product, count]) => ({ product, total: Number(count) }))
    .sort((a, b) => b.total - a.total)

  const daily = days.map((date, i) => ({
    date,
    clicks: Object.values(dailyMaps[i]).reduce((sum, v) => sum + Number(v), 0),
  })).reverse() // cronológico

  const todayMap = dailyMaps[0]
  const today = Object.entries(todayMap)
    .map(([product, count]) => ({ product, count: Number(count) }))
    .sort((a, b) => b.count - a.count)

  return { ranking, daily, today, updatedAt: new Date().toISOString() }
}
