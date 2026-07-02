import { NextRequest, NextResponse } from 'next/server'

// Endpoint de apoio para obter o token de acesso PERMANENTE do Threads (uso único, manual).
//
// Como usar:
// 1. Configurar THREADS_APP_ID e THREADS_APP_SECRET no Vercel (App ID/Secret do Threads,
//    encontrados em App Dashboard → Use cases → Access the Threads API → Settings).
// 2. Registar este URL como "Redirect URI" válido nas definições do Threads Use Case:
//    https://www.performancerunning.pt/api/threads-auth
// 3. Visitar no browser (autenticado com a conta Threads a usar para publicar):
//    https://threads.net/oauth/authorize?client_id=SEU_APP_ID&redirect_uri=https://www.performancerunning.pt/api/threads-auth&scope=threads_basic,threads_content_publish&response_type=code
// 4. Após aprovar, o Threads redireciona para este endpoint com ?code=..., que faz
//    automaticamente a troca por um token de longa duração (60 dias) e devolve o resultado em JSON.
// 5. Copiar "long_lived_token" para THREADS_ACCESS_TOKEN e "user_id" para THREADS_USER_ID no Vercel.
//
// Nota: o token de longa duração dura 60 dias — depois de configurado, é preciso um mecanismo
// de refresh periódico (endpoint separado, não incluído aqui) ou repetir este processo antes de expirar.

const REDIRECT_URI = 'https://www.performancerunning.pt/api/threads-auth'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')
  const errorDescription = req.nextUrl.searchParams.get('error_description')

  if (error) {
    return NextResponse.json({ error, error_description: errorDescription }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({
      error: 'Falta o parâmetro "code". Este endpoint é o redirect_uri do fluxo OAuth do Threads — não deve ser chamado diretamente.',
    }, { status: 400 })
  }

  const appId = process.env.THREADS_APP_ID
  const appSecret = process.env.THREADS_APP_SECRET

  if (!appId || !appSecret) {
    return NextResponse.json({ error: 'THREADS_APP_ID ou THREADS_APP_SECRET não configurados no Vercel' }, { status: 500 })
  }

  try {
    // Passo 1: trocar o código de autorização por um token de curta duração
    const shortForm = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code,
    })

    const shortRes = await fetch('https://graph.threads.net/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: shortForm.toString(),
    })
    const shortData = await shortRes.json()

    if (!shortRes.ok || shortData.error) {
      return NextResponse.json({ step: 'short_lived_exchange', error: shortData }, { status: 400 })
    }

    const shortLivedToken = shortData.access_token
    const userId = shortData.user_id

    // Passo 2: trocar o token de curta duração por um de longa duração (60 dias)
    const longUrl = `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken}`
    const longRes = await fetch(longUrl)
    const longData = await longRes.json()

    if (!longRes.ok || longData.error) {
      return NextResponse.json({
        step: 'long_lived_exchange',
        error: longData,
        fallback_short_lived_token: shortLivedToken,
        user_id: userId,
        note: 'A troca para long-lived falhou, mas o token de curta duração acima funciona para testes imediatos (expira em 1-2h).',
      }, { status: 400 })
    }

    // Passo 3: confirmar a conta (username) com o token de longa duração
    let username: string | null = null
    try {
      const meRes = await fetch(`https://graph.threads.net/v1.0/me?fields=id,username&access_token=${longData.access_token}`)
      const meData = await meRes.json()
      username = meData.username ?? null
    } catch {
      // não crítico — apenas informativo
    }

    return NextResponse.json({
      success: true,
      username,
      user_id: userId,
      long_lived_token: longData.access_token,
      expires_in_seconds: longData.expires_in,
      note: 'Copia "long_lived_token" para THREADS_ACCESS_TOKEN e "user_id" para THREADS_USER_ID no Vercel (Settings → Environment Variables).',
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
