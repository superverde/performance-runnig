import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'

const SITE_URL = 'https://www.performancerunning.pt'

/**
 * GET /api/test-post?key=INTERNAL_API_KEY[&slug=optional-slug]
 *
 * Publica um artigo nas redes sociais para teste.
 * Sem slug → escolhe um artigo aleatório do arquivo.
 * Com slug → publica esse artigo específico.
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const allArticles = getAllArticles()
  if (allArticles.length === 0) {
    return NextResponse.json({ error: 'Sem artigos no site' }, { status: 404 })
  }

  // Escolhe artigo: slug específico ou aleatório
  const slugParam = req.nextUrl.searchParams.get('slug')
  const article = slugParam
    ? allArticles.find(a => a.slug === slugParam) ?? allArticles[0]
    : allArticles[Math.floor(Math.random() * allArticles.length)]

  console.log(`[test-post] A publicar: ${article.slug}`)

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

  return NextResponse.json({
    article: { title: article.title, slug: article.slug, category: article.category },
    ...data,
  })
}
