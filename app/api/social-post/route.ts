import { NextRequest, NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'
import { pickCategoryImage } from '@/lib/images'
import { redis } from '@/lib/redis'

// ── TIPOS ────────────────────────────────────────────────────────────────────

interface ArticlePayload {
  title: string
  excerpt: string
  slug: string
  category: string
  coverImage?: string
}

interface PostResult {
  platform: string
  success: boolean
  id?: string
  error?: string
}

const SITE_URL = 'https://www.performancerunning.pt'

// Verifica se uma credencial está realmente configurada (não é placeholder)
function isConfigured(value: string | undefined): boolean {
  return !!value && value !== 'placeholder' && value.length > 10
}

// Seleção de imagem de capa: ver lib/images.ts. Antes havia aqui 1 imagem
// fixa por categoria (repetida em todos os posts da mesma categoria, há
// meses) — agora usa uma pool de 50 imagens, escolhida de forma
// determinística pelo slug do artigo (mesmo artigo = mesma imagem em todas
// as redes, artigos diferentes da mesma categoria já não colidem).
function selectImage(slug: string, category: string): string {
  return pickCategoryImage(category, slug, 1080)
}

// ── HASHTAGS POR CATEGORIA ───────────────────────────────────────────────────

// Estratégia PT/BR (auditoria 2026-07-17): 47% do tráfego vinha dos EUA com bounce
// de 64% — hashtags DE/FR/ES/EN removidas para focar audiência lusófona (PT + BR).
// Tags BR de alto volume: #corridaderua #vidadecorredor #corredoresderua
const CATEGORY_HASHTAGS: Record<string, string> = {
  'Treino':        '#treino #treinodecorrida #corrida #corridaderua #vidadecorredor #corridaportugal #corredores #performancerunning',
  'Fisiologia':    '#fisiologia #vo2max #resistencia #corrida #corredores #vidadecorredor #corridaportugal #performancerunning',
  'Nutrição':      '#nutricao #nutricaoesportiva #corrida #corredores #maratona #vidadecorredor #corridaportugal #performancerunning',
  'Biomecânica':   '#biomecanica #tecnicadecorrida #corrida #corredores #corridaderua #vidadecorredor #performancerunning',
  'Recuperação':   '#recuperacao #corrida #corredores #vidadecorredor #corridaportugal #descanso #performancerunning',
  'Psicologia':    '#psicologiadoesporte #mentalidade #corrida #corredores #vidadecorredor #corridaportugal #performancerunning',
  'Trail Running': '#trailrunning #trail #ultratrail #trailportugal #trailbrasil #corridademontanha #corredores #performancerunning',
  'Lesões':        '#lesoes #prevencaodelesoes #corrida #corredores #fisioterapia #vidadecorredor #performancerunning',
  'VO2max':        '#vo2max #fisiologia #corrida #resistencia #corredores #corridaportugal #vidadecorredor #performancerunning',
}

const DEFAULT_HASHTAGS = '#corrida #corridaderua #treinodecorrida #atletismo #corredores #vidadecorredor #corridaportugal #performancerunning'

// ── CORREÇÃO PT-PT (pós-processamento determinístico, custo zero) ────────────

function fixPtPt(text: string): string {
  const replacements: [RegExp, string][] = [
    // Pronomes / tratamento
    [/\bvocê\b/gi, 'tu'],
    [/\bvocês\b/gi, 'vós'],
    [/\ba gente\b/gi, 'nós'],
    [/\bseus\b/gi, 'teus'],
    [/\bsuas\b/gi, 'tuas'],
    [/\bseu\b/gi, 'teu'],
    [/\bsua\b/gi, 'tua'],
    // Imperativo BR → PT-PT (formas mais comuns)
    [/\bNão perca\b/gi, 'Não percas'],
    [/\bNão deixe\b/gi, 'Não deixes'],
    [/\bNão perca\b/gi, 'Não percas'],
    [/\bConheça\b/gi, 'Descobre'],
    [/\bSaiba\b/gi, 'Descobre'],
    [/\bVeja\b/gi, 'Vê'],
    [/\bAproveite\b/gi, 'Aproveita'],
    [/\bAcesse\b/gi, 'Acede'],
    [/\bClique\b/gi, 'Clica'],
    [/\bLeia\b/gi, 'Lê'],
    [/\bComece\b/gi, 'Começa'],
    [/\bDescubra\b/gi, 'Descobre'],
    [/\bAcompanhe\b/gi, 'Acompanha'],
    [/\bEntenda\b/gi, 'Percebe'],
    // Vocabulário BR
    [/\blegal\b/gi, 'fixe'],
    [/\bbacana\b/gi, 'fixe'],
    [/\balavancar\b/gi, 'potenciar'],
    [/\bperformar\b/gi, 'render'],
    [/\bdiferenciado\b/gi, 'diferente'],
  ]
  let out = text
  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement)
  }
  return out
}

// ── GERAÇÃO DE CAPTIONS VIA GROQ ────────────────────────────────────────────

async function generateCaptions(article: ArticlePayload): Promise<{
  x: string
  instagram: string
  facebook: string
  threads: string
}> {
  const groqKey = process.env.GROQ_API_KEY
  const hashtags = CATEGORY_HASHTAGS[article.category] || DEFAULT_HASHTAGS
  const link = `${SITE_URL}/blog/${article.slug}`

  if (!groqKey) {
    // Fallback sem Groq
    return {
      x: `${article.title}\n\n${article.excerpt.slice(0, 120)}...\n\n🔗 ${link}\n\n${hashtags.split(' ').slice(0, 3).join(' ')}`,
      instagram: `${article.title}\n\n${article.excerpt}\n\n🔗 Link na bio — performancerunning.pt\n\n${hashtags} #portugal #fitness`,
      facebook: `📖 Novo artigo no Performance Running:\n\n${article.title}\n\n${article.excerpt}\n\n👉 ${link}`,
      threads: `${article.title}\n\n${article.excerpt.slice(0, 200)}`,
    }
  }

  const prompt = `És o Growth System do Performance Running — editor-chefe, estratega de crescimento e copywriter especializado em corrida, atletismo e trail running.

O teu trabalho é criar posts para redes sociais que gerem cliques, partilhas e guardados. Nunca soar a IA genérica. Sempre em português de Portugal.

ARTIGO A PROMOVER:
TÍTULO: ${article.title}
RESUMO: ${article.excerpt}
LINK: ${link}
CATEGORIA: ${article.category}

HASHTAGS (incluir SEMPRE — obrigatório):
${hashtags} #corridaportugal #runningportugal #atletismoportugal #corredoresportugal #performancerunning

REGRAS ABSOLUTAS:
1. Primeiro gancho tem de prender imediatamente — sem introduções mortas
2. Conteúdo útil antes do clique, mas que desperte curiosidade para ler mais
3. Tom: credível, direto, prático — como alguém que percebe muito de corrida e respeita a ciência
4. NUNCA: português do Brasil, IA genérica, influencer vazio, jargão científico sem aplicação
5. Cada plataforma tem texto diferente e nativo
6. PORTUGUÊS DE PORTUGAL — REGRA ABSOLUTA. Nunca usar português do Brasil. Substitui SEMPRE:
   PRONOMES/TRATAMENTO:
   ❌ "você" → ✅ "tu"
   ❌ "seus corredores" → ✅ "os teus treinos"
   ❌ "seu desempenho" → ✅ "o teu desempenho"
   ❌ "a gente" → ✅ "nós"
   VERBOS (imperativo PT-PT):
   ❌ "Não perca" → ✅ "Não percas"
   ❌ "Não deixe" → ✅ "Não deixes"
   ❌ "Conheça" → ✅ "Conhece" ou "Descobre"
   ❌ "Saiba" → ✅ "Sabe" ou "Descobre"
   ❌ "Veja" → ✅ "Vê" ou "Descobre"
   ❌ "Aproveite" → ✅ "Aproveita"
   VOCABULÁRIO:
   ❌ "legal", "bacana", "incrível" (BR) → ✅ "fixe", "bom", "óptimo"
   ❌ "treino massa" → ✅ "treino excelente"
   ❌ "diferenciado" → ✅ "diferente", "único"
   ❌ "impactante" → ✅ "forte", "marcante"
   ❌ "alavancar" → ✅ "melhorar", "potenciar"
   ❌ "performar" → ✅ "ter um bom desempenho", "render"

ÂNGULOS POSSÍVEIS (escolhe o mais forte para o tema):
- Erro que está a travar a evolução
- Sinal de alerta / overtraining / pacing errado
- "Treinas mais mas não melhoras"
- Mito vs evidência — o que a ciência realmente diz
- Checklist guardável
- Contrarian — "mais treino nem sempre é melhor"

Gera 4 posts DIFERENTES. Responde APENAS em JSON válido:
{
  "x": "post X/Twitter — máx 270 chars, hook forte, 1 facto surpreendente ou estatística, link, 3-4 hashtags",
  "instagram": "post Instagram — hook na 1ª linha, 3-5 frases de valor, emoji moderado, CTA 'link na bio', TODAS as hashtags no fim numa linha separada",
  "facebook": "post Facebook — hook forte, 2-4 parágrafos com valor real, link completo no final, 4-6 hashtags relevantes integradas ou no fim",
  "threads": "post Threads — tom casual e direto, insight surpreendente, máx 200 chars, sem link"
}`

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.75,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
    }),
  })

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Groq não respondeu')

  const parsed = JSON.parse(content)
  // Garantir PT-PT independentemente do que a IA gerar
  return {
    x: fixPtPt(parsed.x ?? ''),
    instagram: fixPtPt(parsed.instagram ?? ''),
    facebook: fixPtPt(parsed.facebook ?? ''),
    threads: fixPtPt(parsed.threads ?? ''),
  }
}

// ── X (TWITTER) — via twitter-api-v2 ─────────────────────────────────────────

async function postToX(text: string): Promise<PostResult> {
  const apiKey = process.env.X_API_KEY
  const apiSecret = process.env.X_API_SECRET
  const accessToken = process.env.X_ACCESS_TOKEN
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET

  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    return { platform: 'X', success: false, error: 'Chaves X não configuradas' }
  }

  try {
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    })

    const tweet = await client.v2.tweet(text)
    return { platform: 'X', success: true, id: tweet.data.id }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err)
    console.error('[social-post] X erro:', msg)
    return { platform: 'X', success: false, error: msg }
  }
}

// ── FACEBOOK PAGE ─────────────────────────────────────────────────────────────

// A Graph API do Facebook por vezes devolve erro (ex: "Please reduce the
// amount of data you're asking for, then retry your request") mesmo depois
// de já ter criado o post do lado deles — falso negativo conhecido sob
// rate-limit/carga. Antes de declarar falha, confirma-se via GET ao feed da
// página se um post com a mesma mensagem apareceu nos últimos minutos.
async function verifyFacebookPost(pageId: string, pageToken: string, expectedMessage: string): Promise<string | null> {
  try {
    const url = `https://graph.facebook.com/v19.0/${pageId}/feed?fields=id,message,created_time&limit=5&access_token=${encodeURIComponent(pageToken)}`
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok || data.error || !Array.isArray(data.data)) return null

    const now = Date.now()
    for (const post of data.data) {
      const created = new Date(post.created_time).getTime()
      const isRecent = now - created < 5 * 60 * 1000 // 5 minutos
      if (isRecent && typeof post.message === 'string' && post.message.trim() === expectedMessage.trim()) {
        return post.id
      }
    }
    return null
  } catch {
    return null
  }
}

async function postToFacebook(message: string, link: string): Promise<PostResult> {
  const pageToken = process.env.META_PAGE_ACCESS_TOKEN
  const pageId = process.env.META_PAGE_ID

  if (!pageToken || !pageId) {
    return { platform: 'Facebook', success: false, error: 'Credenciais Meta não configuradas' }
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, link, access_token: pageToken }),
    })

    const data = await res.json()
    if (!res.ok || data.error) {
      const errMsg = data.error?.message || 'Erro Facebook'

      // Confirma se o post foi mesmo criado apesar do erro na resposta,
      // antes de o marcar como falha (evita falsos negativos no log e
      // evita reenviar/duplicar se houver retry a montante).
      await new Promise(r => setTimeout(r, 1500))
      const verifiedId = await verifyFacebookPost(pageId, pageToken, message)
      if (verifiedId) {
        console.warn(`[social-post] Facebook: resposta de erro ("${errMsg}") mas post confirmado criado (id ${verifiedId}) — tratado como sucesso`)
        return { platform: 'Facebook', success: true, id: verifiedId }
      }

      return { platform: 'Facebook', success: false, error: errMsg }
    }

    return { platform: 'Facebook', success: true, id: data.id }
  } catch (err) {
    return { platform: 'Facebook', success: false, error: String(err) }
  }
}

// ── INSTAGRAM (via Meta Graph API) ───────────────────────────────────────────

async function postToInstagram(caption: string, imageUrl: string): Promise<PostResult> {
  const pageToken = process.env.META_PAGE_ACCESS_TOKEN
  const igAccountId = process.env.META_IG_ACCOUNT_ID

  if (!isConfigured(pageToken) || !isConfigured(igAccountId)) {
    return { platform: 'Instagram', success: false, error: 'Credenciais Instagram não configuradas (placeholder)' }
  }

  try {
    // Passo 1: criar container de media
    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: pageToken,
      }),
    })
    const containerData = await containerRes.json()
    if (!containerRes.ok || containerData.error || !containerData.id) {
      return { platform: 'Instagram', success: false, error: containerData.error?.message || 'Erro criar container' }
    }

    // Aguarda 2s para o container ficar pronto
    await new Promise(r => setTimeout(r, 2000))

    // Passo 2: publicar o container
    const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: pageToken,
      }),
    })
    const publishData = await publishRes.json()
    if (!publishRes.ok || publishData.error) {
      return { platform: 'Instagram', success: false, error: publishData.error?.message || 'Erro publicar Instagram' }
    }

    return { platform: 'Instagram', success: true, id: publishData.id }
  } catch (err) {
    return { platform: 'Instagram', success: false, error: String(err) }
  }
}

// ── THREADS ───────────────────────────────────────────────────────────────────

async function postToThreads(text: string): Promise<PostResult> {
  const accessToken = process.env.THREADS_ACCESS_TOKEN
  const userId = process.env.THREADS_USER_ID

  if (!isConfigured(accessToken) || !isConfigured(userId)) {
    return { platform: 'Threads', success: false, error: 'Credenciais Threads não configuradas (placeholder)' }
  }

  try {
    // Passo 1: criar container
    const containerRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'TEXT',
        text,
        access_token: accessToken,
      }),
    })
    const containerData = await containerRes.json()
    if (!containerRes.ok || containerData.error || !containerData.id) {
      return { platform: 'Threads', success: false, error: containerData.error?.message || 'Erro criar container Threads' }
    }

    await new Promise(r => setTimeout(r, 1000))

    // Passo 2: publicar
    const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken,
      }),
    })
    const publishData = await publishRes.json()
    if (!publishRes.ok || publishData.error) {
      return { platform: 'Threads', success: false, error: publishData.error?.message || 'Erro publicar Threads' }
    }

    return { platform: 'Threads', success: true, id: publishData.id }
  } catch (err) {
    return { platform: 'Threads', success: false, error: String(err) }
  }
}

// ── REGISTO DURADOURO DE RESULTADOS (Redis) ──────────────────────────────────
//
// Os logs da Vercel (plano Hobby) só guardam a última 1 hora — insuficiente
// para diagnosticar falhas intermitentes (ex: Facebook a falhar silenciosamente
// enquanto Instagram continua a funcionar, só detetado dias depois). Isto
// grava cada resultado (sucesso ou erro) numa lista Redis por dia, com TTL de
// 30 dias, para ficar consultável via /api/social-log muito depois de a janela
// de logs da Vercel expirar. Nunca deve bloquear nem falhar a publicação em si.
async function logSocialResults(article: { title: string; slug: string }, results: PostResult[]) {
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
    await redis.expire(key, 60 * 60 * 24 * 30) // 30 dias
  } catch (err) {
    // Falha a gravar o log não pode impedir a resposta normal do endpoint
    console.error('[social-post] Erro ao gravar social-log no Redis:', err)
  }
}

// ── HANDLER PRINCIPAL ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Verifica chave de segurança interna
  const auth = req.headers.get('x-internal-key')
  if (auth !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const article: ArticlePayload = await req.json()
    const { title, excerpt, slug, category, coverImage } = article

    if (!title || !slug) {
      return NextResponse.json({ error: 'title e slug são obrigatórios' }, { status: 400 })
    }

    const articleUrl = `${SITE_URL}/blog/${slug}`
    const image = coverImage || selectImage(slug, category)

    // Gera captions para todas as plataformas
    const captions = await generateCaptions(article)

    // Publica em paralelo em todas as plataformas configuradas
    const results = await Promise.allSettled([
      postToX(captions.x),
      postToFacebook(captions.facebook, articleUrl),
      postToInstagram(captions.instagram, image),
      postToThreads(captions.threads),
    ])

    const postResults: PostResult[] = results.map(r =>
      r.status === 'fulfilled' ? r.value : { platform: 'unknown', success: false, error: String(r.reason) }
    )

    const success = postResults.filter(r => r.success)
    const failed = postResults.filter(r => !r.success)

    console.log(`[social-post] ${title} — ${success.length} sucesso, ${failed.length} erro`)
    failed.forEach(f => console.error(`[social-post] ${f.platform}: ${f.error}`))

    await logSocialResults({ title, slug }, postResults)

    return NextResponse.json({
      article: { title, slug },
      results: postResults,
      summary: { success: success.length, failed: failed.length },
    })
  } catch (err) {
    console.error('[social-post] Erro:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
