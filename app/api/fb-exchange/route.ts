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
    // 1. Trocar user token curto por long-lived (60 dias)
    const r1 = await fetch(
      `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${userToken}`
    )
    const d1 = await r1.json()
    if (d1.error) {
      return NextResponse.json({ step: 'exchange', error: d1.error }, { status: 400 })
    }

    const longLivedToken = d1.access_token

    // 2. Obter page token permanente via /me/accounts
    const r2 = await fetch(`https://graph.facebook.com/me/accounts?access_token=${longLivedToken}`)
    const d2 = await r2.json()
    if (d2.error) {
      return NextResponse.json({ step: 'me/accounts', error: d2.error }, { status: 400 })
    }

    // Debug: mostrar o que veio do /me/accounts
    const rawPages = d2.data ?? []
    const page = rawPages.find((p: { id: string }) => p.id === pageId)

    if (!page) {
      // Tentar também com o token original (sem exchange)
      const r3 = await fetch(`https://graph.facebook.com/me/accounts?access_token=${userToken}`)
      const d3 = await r3.json()

      return NextResponse.json({
        error: 'Página não encontrada em /me/accounts',
        debug: {
          long_lived_token_length: longLivedToken?.length,
          long_lived_token_prefix: longLivedToken?.slice(0, 20),
          pages_with_long_lived: rawPages.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })),
          pages_with_original_token: d3.data?.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })) ?? d3,
        }
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      page_name: page.name,
      page_id: page.id,
      page_token: page.access_token,
      note: 'Este token nunca expira. Copia page_token para META_PAGE_ACCESS_TOKEN no Vercel.'
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
