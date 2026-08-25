import { NextRequest, NextResponse } from 'next/server'
import { refreshThreadsToken, getStoredThreadsToken } from '@/lib/threads-token'

/**
 * GET /api/cron/threads-refresh
 *
 * Renova o token de acesso do Threads antes de ele expirar. Corre por cron
 * (segundas e quintas) — ver vercel.json. O token da Meta dura 60 dias e, se
 * expirar, NAO pode ser renovado: obriga a repetir o fluxo OAuth a mao. Correr
 * duas vezes por semana da ~17 oportunidades dentro de cada janela de 60 dias,
 * ou seja, o sistema aguenta semanas de falhas seguidas sem se perder.
 *
 * Autorizacao: header do cron da Vercel (CRON_SECRET) ou ?key=INTERNAL_API_KEY
 * para poder ser disparado a mao quando for preciso.
 *
 * Parametros:
 * - force=1  ignora a regra das 36h entre renovacoes (usar so em diagnostico)
 */

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true

  const key = req.nextUrl.searchParams.get('key')
  return !!process.env.INTERNAL_API_KEY && key === process.env.INTERNAL_API_KEY
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const force = req.nextUrl.searchParams.get('force') === '1'
  const outcome = await refreshThreadsToken(force)
  const stored = await getStoredThreadsToken()

  return NextResponse.json({
    ...outcome,
    expiraEm: stored?.expiresAt ? new Date(stored.expiresAt).toISOString() : null,
    ultimoErro: stored?.lastError ?? null,
  }, { status: outcome.ok ? 200 : 500 })
}
