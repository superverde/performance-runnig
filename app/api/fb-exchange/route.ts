import { NextRequest, NextResponse } from 'next/server'

// Rota temporária para trocar user token por page token permanente
// Uso: GET /api/fb-exchange?user_token=EAA...
// Apagar após obter o token permanente

export async function GET(req: NextRequest) {
  const userToken = req.nextUrl.searchParams.get('user_token')
  if (!userToken) {
    return NextResponse.json({ error: 'Falta user_token' }, { status: 400 })
  }

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  const pageId = '1153609294504327'

  if (!appId || !appSecret) {
    return NextResponse.json({ error: 'META_APP_ID ou META_APP_SECRET não configurados no Vercel' }, { status: 500 })
  }

  try {
    // Passo 1: /me/accounts com o user token diretamente
    const r1 = await fetch(`https://graph.facebook.com/me/accounts?access_token=${userToken}`)
    const d1 = await r1.json()

    if (d1.error) {
      return NextResponse.json({ step: 'me/accounts direto', error: d1.error }, { status: 400 })
    }

    const allPages = d1.data ?? []
    const page = allPages.find((p: { id: string }) => p.id === pageId)

    if (page) {
      // Temos o page token — tentar agora obter versão permanente via exchange
      try {
        const rx = await fetch(
          `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${userToken}`
        )
        const dx = await rx.json()
        if (!dx.error && dx.access_token) {
          const ry = await fetch(`https://graph.facebook.com/me/accounts?access_token=${dx.access_token}`)
          const dy = await ry.json()
          const permanentPage = dy.data?.find((p: { id: string }) => p.id === pageId)
          if (permanentPage) {
            return NextResponse.json({
              success: true,
              type: 'permanent',
              page_name: permanentPage.name,
              page_id: permanentPage.id,
              page_token: permanentPage.access_token,
              note: 'Token permanente (nunca expira). Atualiza META_PAGE_ACCESS_TOKEN no Vercel.'
            })
          }
        }
      } catch { /* fallback para token curto */ }

      // Fallback: page token de curta duração (mas funciona para testar)
      return NextResponse.json({
        success: true,
        type: 'short_lived',
        page_name: page.name,
        page_id: page.id,
        page_token: page.access_token,
        note: 'Token de curta duração (~1h). Atualiza META_PAGE_ACCESS_TOKEN no Vercel e testa o post.'
      })
    }

    // Tentar obter page token diretamente via /{page-id}?fields=access_token
   