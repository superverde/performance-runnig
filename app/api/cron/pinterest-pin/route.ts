import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'
import { getPinterestAccessToken } from '@/lib/pinterest'

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

  // Imagem gerada sob medida para o Pinterest (2:3, com titulo e marca
  // sobrepostos) em vez da foto de stock nua -- ver app/api/pinterest-pin-image
  // para o porque. pickCategoryImage fica como fallback caso a geracao falhe.
  const imageUrl = `${SITE_URL}/api/pinterest-pin-image?slug=${encodeURIComponent(article.slug)}`
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
    const raw = await res.text()
    let data: Record<string, unknown> = {}
    try {
      data = JSON.parse(raw)
    } catch {
      // resposta não-JSON (ex. HTML de erro de um proxy) -- o texto cru fica no log
    }
    if (!res.ok) {
      // Log obrigatorio: durante semanas o cron devolveu 200 e nao publicava nada
      // porque o erro real do Pinterest nunca chegava a lado nenhum (o detalhe de
      // chamadas externas na Vercel esta atras do Observability Plus). Os logs de
      // consola sao gratuitos e ficam visiveis em vercel.com -> Logs.
      console.error(
        '[pinterest-pin] Pinterest recusou o pin',
        JSON.stringify({
          status: res.status,
          body: raw.slice(0, 800),
          imageUrl,
          articleUrl,
          boardId,
        })
      )
      const message =
        (typeof data.message === 'string' && data.message) ||
        raw.slice(0, 300) ||
        `HTTP ${res.status}`
      return { success: false, error: `HTTP ${res.status}: ${message}` }
    }
    return { success: true, pinId: typeof data.id === 'string' ? data.id : undefined }
  } catch (err) {
    console.error('[pinterest-pin] Excecao ao publicar', String(err))
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
  if (!result.success) {
    // Estado de erro real em vez de 200: um cron que falha tem de aparecer
    // como falha nos Logs/alertas da Vercel, senao passa semanas despercebido.
    return NextResponse.json({ slot, article: article.slug, ...result }, { status: 502 })
  }
  console.log('[pinterest-pin] Pin publicado', JSON.stringify({ slot, article: article.slug, pinId: result.pinId }))
  return NextResponse.json({ slot, article: article.slug, ...result })
}
