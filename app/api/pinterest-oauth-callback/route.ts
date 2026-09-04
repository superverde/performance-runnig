import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/pinterest-oauth-callback
 *
 * Endpoint de configuração ÚNICA (não faz parte do fluxo diário de
 * publicação). O Pinterest redireciona para aqui depois de o utilizador
 * autorizar a app no ecrã de consentimento OAuth, com um `code` de uso único
 * na query string. Esta rota troca esse `code` por um access_token +
 * refresh_token (scope pins:write) e devolve-os em JSON, junto com a lista
 * de boards disponíveis, para copiar para as environment variables do
 * Vercel (PINTEREST_APP_ID, PINTEREST_APP_SECRET, PINTEREST_REFRESH_TOKEN,
 * PINTEREST_BOARD_ID). Ver lib/pinterest.ts para o consumo normal destes
 * tokens pelos crons de publicação.
 *
 * Protegida por `state` para evitar que pedidos aleatórios/replay a esta
 * rota desperdicem tentativas de troca — o valor tem de coincidir com o
 * gerado ao construir o link de autorização.
 */

const REDIRECT_URI = 'https://www.performancerunning.pt/api/pinterest-oauth-callback'
const EXPECTED_STATE = 'pr-pinterest-setup-2026-boardswrite'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const error = req.nextUrl.searchParams.get('error')

  if (error) {
    return NextResponse.json({ error, description: req.nextUrl.searchParams.get('error_description') }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: 'Sem "code" na query string. Este endpoint só deve ser chamado pelo redirect do Pinterest OAuth.' }, { status: 400 })
  }

  if (state !== EXPECTED_STATE) {
    return NextResponse.json({ error: 'state inválido ou em falta' }, { status: 400 })
  }

  const appId = process.env.PINTEREST_APP_ID
  const appSecret = process.env.PINTEREST_APP_SECRET
  if (!appId || !appSecret) {
    return NextResponse.json({ error: 'PINTEREST_APP_ID / PINTEREST_APP_SECRET não definidos no ambiente' }, { status: 500 })
  }

  const basicAuth = Buffer.from(`${appId}:${appSecret}`).toString('base64')

  const tokenRes = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  })
  const tokenData = await tokenRes.json()

  if (!tokenRes.ok) {
    return NextResponse.json({ step: 'token_exchange', status: tokenRes.status, error: tokenData }, { status: 502 })
  }

  let boards: unknown = null
  try {
    const boardsRes = await fetch('https://api.pinterest.com/v5/boards', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    boards = await boardsRes.json()
  } catch (e) {
    boards = { error: String(e) }
  }

  return NextResponse.json({
    success: true,
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    scope: tokenData.scope,
    expires_in: tokenData.expires_in,
    boards,
    next_steps: 'Copia refresh_token para PINTEREST_REFRESH_TOKEN e o id do board certo para PINTEREST_BOARD_ID nas env vars do Vercel. Depois podes remover esta rota.',
  })
}
