import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

/**
 * GET /api/social-log?key=INTERNAL_API_KEY&days=3
 *
 * Diagnóstico read-only do histórico de publicações em redes sociais
 * (X, Facebook, Instagram, Threads) — cada resultado gravado por
 * app/api/social-post/route.ts fica aqui, com TTL de 30 dias, para
 * consulta muito depois de a janela de 1h dos logs da Vercel (plano
 * Hobby) ter expirado.
 *
 * Parâmetros:
 * - days: quantos dias para trás incluir (default 1 = só hoje, máx 30)
 * - date: um dia específico "YYYY-MM-DD" em vez de days (opcional)
 * - platform: filtra por plataforma ("Facebook", "Instagram", "X", "Threads")
 * - onlyFailed: "true" para mostrar só falhas
 */

interface SocialLogEntry {
  timestamp: string
  article: { title: string; slug: string }
  platform: string
  success: boolean
  error: string | null
}

function isAuthorized(req: NextRequest): boolean {
  const key = req.nextUrl.searchParams.get('key')
  return !!process.env.INTERNAL_API_KEY && key === process.env.INTERNAL_API_KEY
}

function dateKeysToCheck(req: NextRequest): string[] {
  const explicitDate = req.nextUrl.searchParams.get('date')
  if (explicitDate) return [explicitDate]

  const daysParam = parseInt(req.nextUrl.searchParams.get('days') ?? '1', 10)
  const days = Math.min(Math.max(isNaN(daysParam) ? 1 : daysParam, 1), 30)

  const keys: string[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    keys.push(d.toISOString().slice(0, 10))
  }
  return keys
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const platformFilter = req.nextUrl.searchParams.get('platform')
  const onlyFailed = req.nextUrl.searchParams.get('onlyFailed') === 'true'

  const dates = dateKeysToCheck(req)
  let entries: SocialLogEntry[] = []

  for (const date of dates) {
    try {
      const raw = await redis.lrange(`social-log:${date}`, 0, -1)
      for (const item of raw) {
        try {
          // upstash pode devolver já como objeto (auto-parse) ou como string
          const parsed: SocialLogEntry = typeof item === 'string' ? JSON.parse(item) : (item as unknown as SocialLogEntry)
          entries.push(parsed)
        } catch {
          // ignora entradas corrompidas em vez de falhar o endpoint inteiro
        }
      }
    } catch (err) {
      return NextResponse.json({ error: `Erro a ler Redis para ${date}: ${String(err)}` }, { status: 500 })
    }
  }

  if (platformFilter) {
    entries = entries.filter(e => e.platform.toLowerCase() === platformFilter.toLowerCase())
  }
  if (onlyFailed) {
    entries = entries.filter(e => !e.success)
  }

  // Mais recente primeiro
  entries.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

  const summary = {
    total: entries.length,
    success: entries.filter(e => e.success).length,
    failed: entries.filter(e => !e.success).length,
    porPlataforma: entries.reduce((acc: Record<string, { success: number; failed: number }>, e) => {
      acc[e.platform] = acc[e.platform] ?? { success: 0, failed: 0 }
      if (e.success) acc[e.platform].success++
      else acc[e.platform].failed++
      return acc
    }, {}),
  }

  return NextResponse.json({ dates, summary, entries })
}
