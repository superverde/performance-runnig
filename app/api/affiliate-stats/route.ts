import { NextRequest, NextResponse } from 'next/server'
import { getAffiliateStats } from '@/lib/affiliate-stats'

// Protegida por INTERNAL_API_KEY. A logica de calculo vive em
// lib/affiliate-stats.ts para poder ser usada tambem do lado do servidor pela
// pagina /admin/afiliados, sem expor a chave ao browser.
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!process.env.INTERNAL_API_KEY || key !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(await getAffiliateStats())
}
