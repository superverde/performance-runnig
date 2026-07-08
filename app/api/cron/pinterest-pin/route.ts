import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'
import { getPinterestAccessToken } from '@/lib/pinterest'
import { pickCategoryImage } from '@/lib/images'

const SITE_URL = 'https://www.performancerunning.pt'

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

function buildDescription(article: { title: string; excerpt: string; category: string }): string {
  const tags: Record<string, string> = {
    'Treino':        '#treino #running #treinodecorrida #corridaportugal #corredores #runningtraining #performancerunning #atletismo',
    'Fisiologia':    '#fisiologia #running #endurance #corredores #vo2max #resistencia #performancerunning',
    'Nutrição':      '#nutricao #running #sportsnutrition #corredores #maratona #performancerunning',
    'Biomecânica':   '#biomecanica #running #tecnicadecorrida #corredores #performancerunning',
    'Recuperação':   '#recuperacao #running #recovery #corredores #performancerunning',
    'VO2max':        '#vo2max #fisiologia #running #endurance #corredores #performancerunning',
    'Trail Running': '#trailrunning #trail #ultratrail #trailportugal #performancerunning',
    'Lesões':        '#lesoes #prevencaodelesoes #running #corredores #performancerunning',
    'Psicologia':    '#psicologia #running #mindset #corredores #performancerunning',
  }
  const categoryTags = tags[article.category] ?? '#running #corredores #performancerunning'
  return `${article.excerpt}\n\n${categoryTags}`.slice(0, 500)
}

function selectArticle(slotIndex: number) {
  const articles = getAllArticles()
  if (articles.length === 0) return null
  const now = new Date()
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000
  )
  const index = (dayOfYear * 3 + slotIndex) % articles.length
  return articles[index]
}

async function createPin(article: {
  title: string; excerpt: string; slug: string; category: string
}, slotIndex: number): Promise<{ success: boolean; pinId?: string; error?: string }> {
  const token = await getPinterestAccessToken()
  const boardId = process.env.PINTEREST_BOARD_ID

  if (!token || !boardId) {
    return { success: false, error: 'Sem access token válido (verifica PINTEREST_ACCESS_TOKEN ou PINTEREST_APP_ID/PINTEREST_APP_SECRET/PINTEREST_REFRESH_TOKEN) ou PINTEREST_BOARD_ID não definido' }
  }

  const imageUrl = pickCategoryImage(article.category, article.slug, 1000)
  const articleUrl = `${SITE_URL}/blog/${article.slug}`
  const suffixes = ['', ' | Performance Running', ' — Ciência da Corrida']
  const title = `${article.title}${suffixes[slotIndex] ?? ''}`.slice(0, 100)

  const body = {
    title,
    description: buildDescription(article),
    link: articleUrl,
    board_id: boardId,
    media_source: { source_type: 'image_url', url: imageUrl },
  }

  try {
    const res = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) return { success: false, error: data.message ?? `HTTP ${res.status}` }
    return { success: true, pinId: data.id }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const hour = new Date().getUTCHours() + 1
  const slot = hour < 10 ? 0 : hour < 15 ? 1 : 2
  const article = selectArticle(slot)
  if (!article) return NextResponse.json({ error: 'Sem artigos' }, { status: 404 })
  const result = await createPin(article, slot)
  return NextResponse.json({ slot, article: article.slug, ...result })
}
