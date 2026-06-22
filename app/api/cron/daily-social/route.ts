import { NextRequest, NextResponse } from 'next/server'
import { getTodayArticles } from '@/lib/articles'

const SITE_URL = 'https://www.performancerunning.pt'

// Vercel envia este header automaticamente quando CRON_SECRET está definido
function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false
  return auth === `Bearer ${cronSecret}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const todayArticles = getTodayArticles()

  if (todayArticles.length === 0) {
    console.log('[cron/daily-social] Nenhum artigo publicado hoje.')
    return NextResponse.json({ message: 'Sem artigos hoje', posted: 0 })
  }

  console.log(`[cron/daily-social] ${todayArticles.length} artigo(s) para publicar nas redes.`)

  const results = []

  for (const article of todayArticles) {
    try {
      const res = await fetch(`${SITE_URL}/api/social-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-key': process.env.INTERNAL_API_KEY ?? '',
        },
        body: JSON.stringify({
          title: article.title,
          excerpt: article.excerpt,
          slug: article.slug,
          category: article.category,
          coverImage: article.coverImage,
        }),
      })

      const data = await res.json()
      results.push({ slug: article.slug, ...data })
      console.log(`[cron/daily-social] ${article.slug} — ${data.summary?.success ?? 0} sucesso`)
    } catch (err) {
      console.error(`[cron/daily-social] Erro em ${article.slug}:`, err)
      results.push({ slug: article.slug, error: String(err) })
    }
  }

  return NextResponse.json({
    date: new Date().toISOString().slice(0, 10),
    articles: todayArticles.length,
    results,
  })
}
