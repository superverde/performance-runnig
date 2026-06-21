import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const views = (await redis.get<number>(`views:${params.slug}`)) ?? 0
  return NextResponse.json({ views })
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const views = await redis.incr(`views:${params.slug}`)
  return NextResponse.json({ views })
}
