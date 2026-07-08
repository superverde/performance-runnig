import { NextRequest, NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'
import { getAllArticles } from '@/lib/articles'
import { pickCategoryImage } from '@/lib/images'

const SITE_URL = 'https://www.performancerunning.pt'

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

function fixPtPt(text: string): string {
  const replacements: [RegExp, string][] = [
    [/\bvocê\b/gi, 'tu'], [/\bvocês\b/gi, 'vós'], [/\ba gente\b/gi, 'nós'],
    [/\bseus\b/gi, 'teus'], [/\bsuas\b/gi, 'tuas'], [/\bseu\b/gi, 'teu'], [/\bsua\b/gi, 'tua'],
    [/\bNão perca\b/gi, 'Não percas'], [/\bNão deixe\b/gi, 'Não deixes'],
    [/\bConheça\b/gi, 'Descobre'], [/\bSaiba\b/gi, 'Descobre'], [/\bVeja\b/gi, 'Vê'],
    [/\bAproveite\b/gi, 'Aproveita'], [/\bAcesse\b/gi, 'Acede'], [/\bClique\b/gi, 'Clica'],
    [/\bDescubra\b/gi, 'Descobre'], [/\blegal\b/gi, 'fixe'], [/\balavancar\b/gi, 'potenciar'],
  ]
  let out = text
  for (const [p, r] of replacements) out = out.replace(p, r)
  return out
}

const CATEGORY_HASHTAGS: Record<string, string> = {
  'Treino':        '#treino #running #treinodecorrida #corridaportugal #performancerunning #corredores',
  'Fisiologia':    '#fisiologia #vo2max #running #endurance #performancerunning #corredores',
  'Nutrição':      '#nutricao #runningfuel #corridaportugal #performancerunning #corredores',
  'Biomecânica':   '#biomecanica #tecnicadecorrida #running #performancerunning #corredores',
  'Recuperação':   '#recuperacao #recovery #running #performancerunning #corredores',
  'Trail Running': '#trailrunning #trail #trailportugal #mountainrunning #performancerunning',
  'Lesões':        '#lesoes #prevencaodelesoes #runninginjury #performancerunning #corredores',
  'VO2max':        '#vo2max #fisiologia #running #endurance #performancerunning #corredores',
}
const DEFAULT_HASHTAGS = '#corrida #running #corridaportugal #performancerunning #corredores'

async function generateEveningCaptions(article: {
  title: string; excerpt: string; slug: string; category: string
}): Promise<{ facebook: string; instagram: string; x: string }> {
  const groqKey = process.env.GROQ_API_KEY
  const link = `${SITE_URL}/blog/${article.slug}`
  const hashtags = CATEGORY_HASHTAGS[article.category] ?? DEFAULT_HASHTAGS

  if (!groqKey) {
    return {
      facebook: `🌙 Para terminar o dia:\n\n${article.title}\n\n${article.excerpt}\n\n👉 ${link}\n\n${hashtags}`,
      instagram: `${article.title}\n\n${article.excerpt}\n\n🔗 Link na bio\n\n${hashtags}`,
      x: `${article.title}\n\n${link}\n\n${hashtags.split(' ').slice(0, 3).join(' ')}`,
    }
  }

  const prompt = `És o Growth System do Performance Running. É final de tarde (18h30). Cria posts para promover este artigo do arquivo com ângulo de ENGAGEMENT — termina sempre com uma pergunta que convide à resposta.

ARTIGO:
TÍTULO: ${article.title}
RESUMO: ${article.excerpt}
LINK: ${link}
HASHTAGS: ${hashtags}

REGRAS:
1. Ângulo de engagement: termina com uma pergunta directa à audiência ("E tu?", "Já tentaste?", "Qual é o teu maior erro em X?")
2. Tom mais casual e próximo do que o post da manhã — final do dia, comunidade
3. SEMPRE português de Portugal (tu, treinas, corres — nunca você, seus, Não perca)
4. Cada plataforma com texto diferente e nativo
5. Hashtags obrigatórias no fim

Responde em JSON:
{
  "facebook": "post Facebook com pergunta de engagement + link + hashtags",
  "instagram": "post Instagram com pergunta + 'link na bio' + hashtags",
  "x": "post X máx 270 chars: insight + pergunta + link + 2-3 hashtags"
}`

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    }),
  })

  const data = await res.json()
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? '{}')

  return {
    facebook: fixPtPt(parsed.facebook ?? ''),
    instagram: fixPtPt(parsed.instagram ?? ''),
    x: fixPtPt(parsed.x ?? ''),
  }
}

async function postToFacebook(message: string, link: string): Promise<boolean> {
  const pageToken = process.env.META_PAGE_ACCESS_TOKEN
  const pageId = process.env.META_PAGE_ID
  if (!pageToken || !pageId) return false

  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, link, access_token: pageToken }),
  })
  return res.ok
}

async function postToInstagram(caption: string, imageUrl: string): Promise<boolean> {
  const pageToken = process.env.META_PAGE_ACCESS_TOKEN
  const igId = process.env.META_IG_ACCOUNT_ID
  if (!pageToken || !igId || igId === 'placeholder') return false

  const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: pageToken }),
  })
  const container = await containerRes.json()
  if (!container.id) return false

  await new Promise(r => setTimeout(r, 2000))

  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: pageToken }),
  })
  return publishRes.ok
}

async function postToX(text: string): Promise<boolean> {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET } = process.env
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) return false

  try {
    const client = new TwitterApi({
      appKey: X_API_KEY, appSecret: X_API_SECRET,
      accessToken: X_ACCESS_TOKEN, accessSecret: X_ACCESS_TOKEN_SECRET,
    })
    await client.v2.tweet(text)
    return true
  } catch { return false }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const allArticles = getAllArticles()
  if (allArticles.length === 0) {
    return NextResponse.json({ message: 'Sem artigos no arquivo' })
  }

  // Usa offset +1 em relação ao cron da manhã para nunca repetir o mesmo artigo no mesmo dia
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  )
  const article = allArticles[(dayOfYear + 1) % allArticles.length]
  const image = article.coverImage ?? pickCategoryImage(article.category, article.slug, 1080)
  const link = `${SITE_URL}/blog/${article.slug}`

  const captions = await generateEveningCaptions(article)

  const [fb, ig, xResult] = await Promise.allSettled([
    postToFacebook(captions.facebook, link),
    postToInstagram(captions.instagram, image),
    postToX(captions.x),
  ])

  const results = {
    facebook: fb.status === 'fulfilled' ? fb.value : false,
    instagram: ig.status === 'fulfilled' ? ig.value : false,
    x: xResult.status === 'fulfilled' ? xResult.value : false,
  }

  console.log(`[evening-social] ${article.slug} | FB:${results.facebook} IG:${results.instagram} X:${results.x}`)

  return NextResponse.json({ article: article.slug, results })
}
