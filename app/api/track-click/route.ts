import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const product = searchParams.get('product') || 'unknown'
  const url = searchParams.get('url') || '/'

  const today = new Date().toISOString().slice(0, 10) // "2026-06-22"

  try {
    // Incrementa contador: clicks:{date}:{product}
    await redis.hincrby(`clicks:${today}`, product, 1)
    // Total histórico
    await redis.hincrby('clicks:total', product, 1)
  } catch {
    // Não bloqueia o redirect se Redis falhar
  }

  // Redireciona para o link de afiliado
  return NextResponse.redirect(url, { status: 302 })
}
