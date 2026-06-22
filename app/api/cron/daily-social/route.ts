import { NextRequest, NextResponse } from 'next/server'
import { getTodayArticles, getAllArticles } from '@/lib/articles'

const SITE_URL = 'https://www.performancerunning.pt'

// Vercel envia este header automaticamente quando CRON_SECRET está definido
function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false
  return auth === `Bearer ${cronSecret}`
}

async function publishArticle(article: {
  title: string
  excerpt: string
  slug: string
  category: string
  coverImage?: string
}) {
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
  return res.json()
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const todayArticles = getTodayArticles()
  const results = []

  if (todayArticles.length > 0) {
    // Publica os artigos de hoje
    console.log(`[cron/daily-social] ${todayArticles.length} artigo(s) de hoje para publicar.`)
    for (const article of todayArticles) {
      try {
        const data = await publishArticle(article)
        results.push({ slug: article.slug, source: 'today', ...data })
        console.log(`[cron/daily-social] ${article.slug} — ${data.summary?.success ?? 0} sucesso`)
      } catch (err) {
        console.error(`[cron/daily-social] Erro em ${article.slug}:`, err)
        results.push({ slug: article.slug, error: String(err) })
      }
    }
  } else {
    // Fallback: escolhe um artigo do arquivo com base no dia do ano
    // (evita repetir o mesmo artigo em dias consecutivos)
    const allArticles = getAllArticles()
    if (allArticles.length === 0) {
      return NextResponse.json({ message: 'Sem artigos no arquivo', posted: 0 })
    }

    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
    )
    const randomArticle = allArticles[dayOfYear % allArticles.length]

    console.log(`[cron/daily-social] Sem artigos hoje — arquivo: ${randomArticle.slug}`)

    try {
      const data = await publishArticle(randomArticle)
      results.push({ slug: randomArticle.slug, source: 'archive', ...data })
      console.log(`[cron/daily-social] ${randomArticle.slug} (arquivo) — ${data.summary?.success ?? 0} sucesso`)
    } catch (err) {
      console.error(`[cron/daily-social] Erro no artigo do arquivo:`, err)
      results.push({ slug: randomArticle.slug, error: String(err) })
    }
  }

  return NextResponse.json({
    date: new Date().toISOString().slice(0, 10),
    articles: results.length,
    results,
  })
}
