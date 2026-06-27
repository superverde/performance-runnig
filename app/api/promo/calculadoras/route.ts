import { NextRequest, NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'

const SITE_URL     = 'https://www.performancerunning.pt'
const CALC_URL     = `${SITE_URL}/ferramentas`
const IMAGE_URL    = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80'
const META_PAGE_ID = process.env.META_PAGE_ID!
const META_TOKEN   = process.env.META_PAGE_ACCESS_TOKEN!
const IG_ID        = process.env.META_IG_ACCOUNT_ID

function isAuthorized(req: NextRequest): boolean {
  return req.headers.get('x-internal-key') === process.env.INTERNAL_API_KEY
}

const FB_TEXT = `Sabes a que ritmo tens de correr para fazer sub-4h na maratona?

E as tuas zonas de treino estao corretas para o teu nivel atual?

A maioria dos corredores treina sem saber a resposta. Depois perguntam-se por que razao nao melhoram.

Criamos duas calculadoras gratuitas para isso:

Calculadora VDOT - descobre o teu nivel de corrida real e os ritmos certos para cada treino (intervalos, tempo, longo, recuperacao)

Calculadora de Pace - converte qualquer objetivo de corrida em ritmo por km. Sete distancias. Resultado imediato.

Sem registo. Sem email. So precisas de um resultado recente.

${CALC_URL}

#corrida #running #treinodecorrida #calculadoravdot #pace #corridaportugal #corredores #performancerunning #maratona`

const IG_CAPTION = `Sabes a que ritmo tens de correr para atingir o teu objetivo?

A maioria dos corredores nao sabe. E e por isso que os treinos nao resultam.

Duas ferramentas gratuitas:

Calculadora VDOT - descobre o teu nivel real e os ritmos certos para cada sessao
Calculadora de Pace - qualquer distancia, qualquer objetivo, ritmo por km em segundos

Sem registo. Entra, calcula, treina melhor.

Link na bio - /ferramentas

#corrida #running #treinodecorrida #calculadoravdot #pace #corridaportugal #corredores #runnersworld #performancerunning #maratona`

const X_THREAD = [
  `A maioria dos corredores treina sem saber os seus ritmos certos.

E o erro numero 1 que trava a evolucao.

Criamos duas calculadoras gratuitas para resolver isso:`,
  `Calculadora VDOT

Metes um resultado recente (5K, 10K, meia ou maratona) e ela calcula:

- O teu VDOT (nivel de corrida real)
- Ritmo para intervalos
- Ritmo para treino de tempo
- Ritmo para corrida longa
- Ritmo de recuperacao`,
  `Calculadora de Pace

Defines o teu objetivo de tempo e a distancia e ela diz-te a que ritmo por km tens de correr.

7 distancias. Do 5K ao ultra.`,
  `Sem registo. Sem email. Sem subscricao.

So precisas de um resultado recente de corrida.

Em 10 segundos sabes exatamente como treinar.

${CALC_URL}

#corrida #running #treinodecorrida #calculadoravdot #pace #performancerunning #corredores`,
]

async function postFacebook() {
  const res = await fetch(`https://graph.facebook.com/v19.0/${META_PAGE_ID}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: FB_TEXT, access_token: META_TOKEN }),
  })
  const data = await res.json() as { id?: string; error?: { message: string } }
  return data.error ? { ok: false, error: data.error.message } : { ok: true, id: data.id }
}

async function postInstagram() {
  if (!IG_ID) return { ok: false, error: 'META_IG_ACCOUNT_ID nao configurado' }
  const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: IMAGE_URL, caption: IG_CAPTION, access_token: META_TOKEN }),
  })
  const media = await mediaRes.json() as { id?: string; error?: { message: string } }
  if (media.error || !media.id) return { ok: false, error: media.error?.message ?? 'sem media id' }
  const pubRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: media.id, access_token: META_TOKEN }),
  })
  const pub = await pubRes.json() as { id?: string; error?: { message: string } }
  return pub.error ? { ok: false, error: pub.error.message } : { ok: true, id: pub.id }
}

async function postX() {
  try {
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY!, appSecret: process.env.X_API_SECRET!,
      accessToken: process.env.X_ACCESS_TOKEN!, accessSecret: process.env.X_ACCESS_SECRET!,
    })
    let lastId: string | undefined
    for (const text of X_THREAD) {
      const tweet = await client.readWrite.v2.tweet(text, lastId ? { reply: { in_reply_to_tweet_id: lastId } } : undefined)
      lastId = tweet.data.id
    }
    return { ok: true, id: lastId }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  const [fb, ig, x] = await Promise.all([postFacebook(), postInstagram(), postX()])
  return NextResponse.json({ facebook: fb, instagram: ig, x })
}
