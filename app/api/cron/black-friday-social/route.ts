import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { getThreadsAccessToken } from '@/lib/threads-token'
import { diaDaCampanha, imagemDoDia, linkComUtm, textoDoDia, type Rede } from '@/lib/black-friday-campanha'
import { hojeLisboa } from '@/lib/irun-config'

/**
 * GET /api/cron/black-friday-social?platform=facebook|instagram|threads[&data=YYYY-MM-DD]
 *
 * Publicação diária da campanha de Black Friday (20 a 30/11/2026) — uma por
 * rede, a horas desfasadas (ver vercel.json). Conteúdo em
 * lib/black-friday-campanha.ts; imagem em /api/black-friday-imagem.
 *
 * - Fora das datas da campanha não faz nada.
 * - Nunca publica duas vezes o mesmo dia na mesma rede (chave no Redis),
 *   mesmo que o cron dispare duas vezes.
 * - Grava o resultado no mesmo registo de /api/social-log.
 * - `data` só é aceite para testes manuais com o CRON_SECRET.
 */
export const maxDuration = 60

function autorizado(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  return !!secret && req.headers.get('authorization') === `Bearer ${secret}`
}

function configurado(v: string | undefined): v is string {
  return !!v && v !== 'placeholder'
}

type Resultado = { platform: string; success: boolean; id?: string; error?: string }

async function publicarFacebook(texto: string, imagem: string, link: string): Promise<Resultado> {
  const token = process.env.META_PAGE_ACCESS_TOKEN
  const pageId = process.env.META_PAGE_ID
  if (!configurado(token) || !configurado(pageId)) return { platform: 'Facebook', success: false, error: 'Credenciais Meta em falta' }
  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: imagem, caption: texto, access_token: token }),
  })
  const d = await res.json()
  if (!res.ok || d.error) return { platform: 'Facebook', success: false, error: d.error?.message ?? `HTTP ${res.status}` }
  const postId = d.post_id || d.id
  // Link no 1.º comentário (o Facebook corta o alcance de publicações com link no corpo).
  await fetch(`https://graph.facebook.com/v19.0/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Guia de Black Friday: ${link}`, access_token: token }),
  }).catch(() => undefined)
  return { platform: 'Facebook', success: true, id: postId }
}

async function publicarInstagram(texto: string, imagemJpg: string): Promise<Resultado> {
  const token = process.env.META_PAGE_ACCESS_TOKEN
  const igId = process.env.META_IG_ACCOUNT_ID
  if (!configurado(token) || !configurado(igId)) return { platform: 'Instagram', success: false, error: 'Credenciais Instagram em falta' }
  const c = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imagemJpg, caption: texto, access_token: token }),
  })
  const cd = await c.json()
  if (!c.ok || cd.error || !cd.id) return { platform: 'Instagram', success: false, error: cd.error?.message ?? 'Erro ao criar o contentor' }
  // A imagem é gerada na hora: dá tempo ao Instagram para a processar.
  await new Promise((r) => setTimeout(r, 5000))
  const p = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: cd.id, access_token: token }),
  })
  const pd = await p.json()
  if (!p.ok || pd.error) return { platform: 'Instagram', success: false, error: pd.error?.message ?? 'Erro ao publicar' }
  return { platform: 'Instagram', success: true, id: pd.id }
}

async function publicarThreads(texto: string, imagem: string): Promise<Resultado> {
  const token = await getThreadsAccessToken()
  const userId = process.env.THREADS_USER_ID
  if (!configurado(token) || !configurado(userId)) return { platform: 'Threads', success: false, error: 'Credenciais Threads em falta' }
  const c = await fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ media_type: 'IMAGE', image_url: imagem, text: texto, topic_tag: 'Running Threads', access_token: token }),
  })
  const cd = await c.json()
  if (!c.ok || cd.error || !cd.id) return { platform: 'Threads', success: false, error: cd.error?.message ?? 'Erro ao criar o contentor' }
  await new Promise((r) => setTimeout(r, 5000))
  const p = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: cd.id, access_token: token }),
  })
  const pd = await p.json()
  if (!p.ok || pd.error) return { platform: 'Threads', success: false, error: pd.error?.message ?? 'Erro ao publicar' }
  return { platform: 'Threads', success: true, id: pd.id }
}

export async function GET(req: NextRequest) {
  if (!autorizado(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const rede = req.nextUrl.searchParams.get('platform') as Rede | null
  if (rede !== 'facebook' && rede !== 'instagram' && rede !== 'threads') {
    return NextResponse.json({ error: 'platform tem de ser facebook, instagram ou threads' }, { status: 400 })
  }
  const data = req.nextUrl.searchParams.get('data') ?? hojeLisboa()
  const dia = diaDaCampanha(data)
  if (!dia) return NextResponse.json({ data, publicado: false, motivo: 'fora da campanha' })

  const texto = textoDoDia(dia, rede)
  if (!texto) return NextResponse.json({ data, publicado: false, motivo: 'produto do dia sem link i-Run' })

  // Trava contra publicações repetidas (cron disparado duas vezes, retry...).
  const chave = `bf-social:${data}:${rede}`
  const livre = await redis.set(chave, new Date().toISOString(), { nx: true, ex: 60 * 60 * 24 * 3 })
  if (!livre) return NextResponse.json({ data, rede, publicado: false, motivo: 'já publicado hoje' })

  let r: Resultado
  try {
    r =
      rede === 'facebook' ? await publicarFacebook(texto, imagemDoDia(data), linkComUtm('facebook', data))
      : rede === 'instagram' ? await publicarInstagram(texto, imagemDoDia(data, 'jpg'))
      : await publicarThreads(texto, imagemDoDia(data, 'jpg'))
  } catch (err) {
    r = { platform: rede, success: false, error: String(err) }
  }

  // Se falhou, liberta a trava para o próximo disparo poder tentar de novo.
  if (!r.success) await redis.del(chave).catch(() => undefined)

  try {
    const key = `social-log:${new Date().toISOString().slice(0, 10)}`
    await redis.rpush(key, JSON.stringify({
      timestamp: new Date().toISOString(),
      article: { title: `Black Friday ${data} (${dia.tipo}${dia.produto ? `: ${dia.produto}` : ''})`, slug: 'black-friday-campanha' },
      platform: r.platform, success: r.success, error: r.error ?? null,
    }))
    await redis.expire(key, 60 * 60 * 24 * 30)
  } catch {
    /* o registo nunca bloqueia a publicação */
  }

  console.log(`[black-friday-social] ${data} ${rede}: ${r.success ? 'ok' : r.error}`)
  return NextResponse.json({ data, rede, tipo: dia.tipo, produto: dia.produto ?? null, ...r })
}
