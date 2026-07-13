import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

// Purga a cache de rotas da Vercel. Existe porque /blog ficou preso numa
// resposta em cache de 7 de julho (96 artigos) enquanto a homepage já ia em
// 114 — uma entrada órfã de CDN de um deploy antigo que os deploys novos não
// invalidaram. Ver memória "Arquivo /blog Desatualizado".
//
// - Sem autenticação: só purga um conjunto fixo e inofensivo de rotas públicas
//   (são todas force-dynamic, por isso purgar é sempre seguro).
// - Com Bearer CRON_SECRET ou ?secret=: purga o layout inteiro.

const SAFE_PATHS = ['/', '/blog', '/sitemap.xml', '/feed.xml', '/metodologias', '/modalidades']

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const qsSecret = req.nextUrl.searchParams.get('secret')
  const secret = process.env.CRON_SECRET
  const isAdmin = Boolean(secret) && (auth === `Bearer ${secret}` || qsSecret === secret)

  if (isAdmin) {
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true, scope: 'layout (tudo)', at: new Date().toISOString() })
  }

  for (const p of SAFE_PATHS) revalidatePath(p)
  return NextResponse.json({ ok: true, scope: SAFE_PATHS, at: new Date().toISOString() })
}
