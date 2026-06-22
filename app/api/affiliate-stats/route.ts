import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

// Protegida por INTERNAL_API_KEY
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Últimos 7 dias
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

  // Normaliza — Redis pode devolver null se chave não existe
  const totalMap = (totals as Record<string, number> | null) ?? {}
  const dailyMaps = (dailyResults as (Record<string, number> | null)[]).map(
    (r) => r ?? {}
  )

  // Ranking total
  const ranking = Object.entries(totalMap)
    .map(([product, count]) => ({ product, total: Number(count) }))
    .sort((a, b) => b.total - a.total)

  // Série diária: { date, clicks }[]
  const daily = days.map((date, i) => ({
    date,
    clicks: Object.values(dailyMaps[i]).reduce(
      (sum, v) => sum + Number(v),
      0
    ),
  })).reverse() // cronológico

  // Cliques de hoje por produto
  const todayMap = dailyMaps[0]
  const today = Object.entries(todayMap)
    .map(([product, count]) => ({ product, count: Number(count) }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({
    ranking,
    daily,
    today,
    updatedAt: new Date().toISOString(),
  })
}
