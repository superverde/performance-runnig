import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-internal-key')
  if (key !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email em falta' }, { status: 400 })
  await redis.sadd('newsletter:subscribers', email)
  const all = await redis.smembers('newsletter:subscribers')
  return NextResponse.json({ added: email, total: all.length, all })
}