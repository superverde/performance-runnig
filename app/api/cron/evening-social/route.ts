import { NextRequest, NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'
import { getAllArticles } from '@/lib/articles'
import { pickCategoryImage } from '@/lib/images'
import { hashtagsFor } from '@/lib/hashtags'
import { redis } from '@/lib/redis'

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

async function generateEveningCaptions(article: {
  title: string; excerpt: string; slug: string; category: string
}): Promise<{ facebook: string; instagram: string; x: string }> {
  const groqKey = process.env.GROQ_API_KEY
  const link = `${SITE_URL}/blog/${article.slug}`
  const hashtags = hashtagsFor(article.category)

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
HASHTAGS (usar EXATAMENTE estas 4 — nunca inventar mais): ${hashtags}

REGRAS:
1. Ângulo de engagement: termina com uma pergunta directa à audiência ("E tu?", "Já tentaste?", "Qual é o teu maior erro em X?")
2. Tom mais casual e próximo do que o post da manhã — final do dia, comunidade
3. SEMPRE português de Portugal (tu, treinas, corres — nunca você, seus, Não perca)
4. Cada plataforma com texto diferente e nativo
5. As 4 hashtags no fim — nunca mais do que isso. Hashtags só categorizam, não aumentam alcance; o alcance vem das palavras-chave escritas na frase (ex: "treino de corrida", "meia maratona")

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

interface PlatformResult {
  success: boolean
  error?: string
}

async function postToFacebook(message: string, link: string): Promise<PlatformResult> {
  const pageToken = process.env.META_PAGE_ACCESS_TOKEN
  const pageId = process.env.META_PAGE_ID
  if (!pageToken || !pageId) return { success: false, error: 'Credenciais Meta não configuradas' }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, link, access_token: pageToken }),
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      return { success: false, error: data.error?.message || `HTTP ${res.status}` }
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

async function postToInstagram(caption: string, imageUrl: string): Promise<PlatformResult> {
  const pageToken = process.env.META_PAGE_ACCESS_TOKEN
  const igId = process.env.META_IG_ACCOUNT_ID
  if (!pageToken || !igId || igId === 'placeholder') {
    return { success: false, error: 'Credenciais Instagram não configuradas (placeholder)' }
  }

  try {
    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: pageToken }),
    })
    const container = await containerRes.json()
    if (!containerRes.ok || container.error || !container.id) {
      return { success: false, error: container.error?.message || 'Erro criar container' }
    }

    await new Promise(r => setTimeout(r, 2000))

    const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id, access_token: pageToken }),
    })
    const publishData = await publishRes.json()
    if (!publishRes.ok || publishData.error) {
      return { success: false, error: publishData.error?.message || 'Erro publicar Instagram' }
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

async function postToX(text: string): Promise<PlatformResult> {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET } = process.env
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) {
    return { success: false, error: 'Chaves X não configuradas' }
  }

  try {
    const client = new TwitterApi({
      appKey: X_API_KEY, appSecret: X_API_SECRET,
      accessToken: X_ACCESS_TOKEN, accessSecret: X_ACCESS_TOKEN_SECRET,
    })
    await client.v2.tweet(text)
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err)
    return { success: false, error: msg }
  }
}

// Mesmo mecanismo de registo duradouro usado em app/api/social-post/route.ts —
// ver [[project_social_log_diagnostico]]. O evening-social tinha o seu próprio
// código de publicação (duplicado do social-post) que descartava a mensagem de
// erro real (só guardava true/false) e nunca gravava nada consultável depois
// da janela de 1h dos logs da Vercel. Isto alinha-o com o mesmo /api/social-log.
async function logSocialResults(
  article: { title: string; slug: string },
  results: { platform: string; success: boolean; error?: string }[]
) {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const key = `social-log:${today}`
    const timestamp = new Date().toISOString()
    for (const r of results) {
      await redis.rpush(key, JSON.stringify({
        timestamp,
        article: { title: article.title, slug: article.slug },
        platform: r.platform,
        success: r.success,
        error: r.error ?? null,
      }))
    }
    await redis.expire(key, 60 * 60 * 24 * 30)
  } catch (err) {
    console.error('[evening-social] Erro ao gravar social-log no Redis:', err)
  }
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

  const toResult = (r: PromiseSettledResult<PlatformResult>): PlatformResult =>
    r.status === 'fulfilled' ? r.value : { success: false, error: String(r.reason) }

  const fbResult = toResult(fb)
  const igResult = toResult(ig)
  const xFinal = toResult(xResult)

  const results = {
    facebook: fbResult.success,
    instagram: igResult.success,
    x: xFinal.success,
  }

  console.log(`[evening-social] ${article.slug} | FB:${results.facebook} IG:${results.instagram} X:${results.x}`)
  if (!fbResult.success) console.error(`[evening-social] Facebook: ${fbResult.error}`)
  if (!igResult.success) console.error(`[evening-social] Instagram: ${igResult.error}`)
  if (!xFinal.success) console.error(`[evening-social] X: ${xFinal.error}`)

  await logSocialResults(
    { title: article.title, slug: article.slug },
    [
      { platform: 'Facebook', ...fbResult },
      { platform: 'Instagram', ...igResult },
      { platform: 'X', ...xFinal },
    ]
  )

  return NextResponse.json({ article: article.slug, results })
}
