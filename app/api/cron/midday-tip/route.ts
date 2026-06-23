import { NextRequest, NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'

const SITE_URL = 'https://www.performancerunning.pt'

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

// Temas rotativos por dia da semana — alinhados com o calendário editorial
const TEMAS_POR_DIA = [
  'treino e estrutura semanal para corredores',        // Segunda
  'erros de pacing e overtraining',                    // Terça
  'nutrição e hidratação para corredores',             // Quarta
  'biomecânica e técnica de corrida',                  // Quinta
  'preparação para provas e estratégia de corrida',    // Sexta
  'recuperação e sono para corredores',                // Sábado
  'fisiologia e VO2max',                               // Domingo
]

const HASHTAGS_POR_DIA = [
  '#treino #running #treinodecorrida #corridaportugal #performancerunning #corredores',
  '#pacing #overtraining #running #corridaportugal #performancerunning #corredores',
  '#nutricao #runningfuel #corridaportugal #performancerunning #corredores #maratona',
  '#biomecanica #tecnicadecorrida #running #performancerunning #corredores',
  '#running #maratona #corridaportugal #performancerunning #corredores #prova',
  '#recuperacao #recovery #running #performancerunning #corredores #sono',
  '#vo2max #fisiologia #running #endurance #performancerunning #corredores',
]

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

async function generateTip(tema: string, hashtags: string): Promise<{ facebook: string; instagram: string; x: string }> {
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) {
    const fallback = `💡 Facto do dia sobre ${tema}.\n\nVê mais em ${SITE_URL}/blog\n\n${hashtags}`
    return { facebook: fallback, instagram: fallback, x: fallback.slice(0, 270) }
  }

  const prompt = `És o Growth System do Performance Running. Cria um facto científico surpreendente sobre "${tema}" para publicar nas redes sociais ao meio-dia.

REGRAS:
1. Começa com um facto concreto e surpreendente — número, percentagem ou dado real
2. 2-4 linhas. Direto. Sem introdução nem "hoje vamos falar de"
3. SEMPRE em português de Portugal (tu, treinas, corres — nunca você, seus, Não perca)
4. Não inclui link — é conteúdo standalone para gerar alcance e partilhas
5. Tom: autoridade científica + linguagem acessível

Responde em JSON:
{
  "facebook": "post Facebook: facto + 1-2 frases de contexto + hashtags no fim",
  "instagram": "post Instagram: facto + 1-2 frases + hashtags no fim",
  "x": "post X: máx 270 chars, só o facto + 2-3 hashtags"
}`

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    }),
  })

  const data = await res.json()
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? '{}')

  const addHashtags = (text: string) =>
    text.includes('#') ? text : `${text}\n\n${hashtags}`

  return {
    facebook: fixPtPt(addHashtags(parsed.facebook ?? '')),
    instagram: fixPtPt(addHashtags(parsed.instagram ?? '')),
    x: fixPtPt(parsed.x ?? ''),
  }
}

async function postToFacebook(message: string): Promise<boolean> {
  const pageToken = process.env.META_PAGE_ACCESS_TOKEN
  const pageId = process.env.META_PAGE_ID
  if (!pageToken || !pageId) return false

  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: pageToken }),
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

// Imagem genérica para posts sem artigo (tema visual de corrida)
const TIP_IMAGES = [
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1080&q=80',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1080&q=80',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1080&q=80',
  'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=1080&q=80',
  'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1080&q=80',
  'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=1080&q=80',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1080&q=80',
]

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const diaSemana = new Date().getDay() // 0=Dom, 1=Seg, ..., 6=Sab
  const tema = TEMAS_POR_DIA[diaSemana]
  const hashtags = HASHTAGS_POR_DIA[diaSemana]
  const image = TIP_IMAGES[diaSemana]

  const captions = await generateTip(tema, hashtags)

  const [fb, ig, xResult] = await Promise.allSettled([
    postToFacebook(captions.facebook),
    postToInstagram(captions.instagram, image),
    postToX(captions.x),
  ])

  const results = {
    facebook: fb.status === 'fulfilled' ? fb.value : false,
    instagram: ig.status === 'fulfilled' ? ig.value : false,
    x: xResult.status === 'fulfilled' ? xResult.value : false,
  }

  console.log(`[midday-tip] Tema: ${tema} | FB:${results.facebook} IG:${results.instagram} X:${results.x}`)

  return NextResponse.json({ tema, results })
}
