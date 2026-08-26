import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { redis } from '@/lib/redis'
import { sondagemPorId } from '@/lib/sondagens'

/**
 * GET  /api/sondagem?id=<id>            → contagens atuais
 * POST /api/sondagem  { id, opcao }     → regista voto e devolve contagens
 *
 * Sem registo e sem dados pessoais. Para evitar que o mesmo browser vote
 * dezenas de vezes ha duas travoes: o componente guarda no localStorage que ja
 * votou, e aqui guarda-se um hash do IP durante 30 dias. O IP nunca e gravado
 * em claro — so o hash, e com sal. Isto nao torna a sondagem a prova de bots
 * (ja tivemos cliques de datacenter no tracking de afiliados), mas evita o caso
 * trivial de alguem carregar no botao 200 vezes.
 */

const TTL_DEDUPE = 60 * 60 * 24 * 30 // 30 dias

function ipHash(req: NextRequest, id: string): string {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'desconhecido'
  const sal = process.env.INTERNAL_API_KEY ?? 'performance-running'
  return createHash('sha256').update(`${sal}:${id}:${ip}`).digest('hex').slice(0, 24)
}

async function contagens(id: string): Promise<Record<string, number>> {
  const raw = await redis.hgetall<Record<string, number>>(`sondagem:votos:${id}`)
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(raw ?? {})) out[k] = Number(v)
  return out
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || !sondagemPorId(id)) {
    return NextResponse.json({ error: 'Sondagem desconhecida' }, { status: 400 })
  }
  return NextResponse.json({ id, contagens: await contagens(id) })
}

export async function POST(req: NextRequest) {
  let body: { id?: string; opcao?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 })
  }

  const { id, opcao } = body
  const sondagem = id ? sondagemPorId(id) : null

  if (!sondagem || !opcao || !sondagem.opcoes.includes(opcao)) {
    // Só aceitamos opções que existem na definição — nada de escrita livre.
    return NextResponse.json({ error: 'Voto inválido' }, { status: 400 })
  }

  const chaveDedupe = `sondagem:ip:${ipHash(req, sondagem.id)}`
  const jaVotou = await redis.get(chaveDedupe)

  if (!jaVotou) {
    await redis.hincrby(`sondagem:votos:${sondagem.id}`, opcao, 1)
    await redis.set(chaveDedupe, opcao, { ex: TTL_DEDUPE })
  }

  return NextResponse.json({
    id: sondagem.id,
    contagens: await contagens(sondagem.id),
    repetido: !!jaVotou,
  })
}
