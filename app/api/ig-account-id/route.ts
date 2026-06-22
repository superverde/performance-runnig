import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/ig-account-id?key=INTERNAL_API_KEY
 * Tenta múltiplos métodos para encontrar o Instagram Business Account ID
 * ligado à página Facebook do Performance Running.
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const pageToken = process.env.META_PAGE_ACCESS_TOKEN
  const pageId = '1153609294504327'

  if (!pageToken) {
    return NextResponse.json({ error: 'META_PAGE_ACCESS_TOKEN não configurado' }, { status: 500 })
  }

  const results: Record<string, unknown> = {}

  // Método 1: instagram_business_account (requer instagram_basic)
  try {
    const r1 = await fetch(
      `https://graph.facebook.com/v25.0/${pageId}?fields=instagram_business_account,name&access_token=${pageToken}`
    )
    const d1 = await r1.json()
    results.method1_instagram_business_account = d1
    if (d1.instagram_business_account?.id) {
      return NextResponse.json({
        success: true,
        method: 'instagram_business_account',
        ig_account_id: d1.instagram_business_account.id,
        page_name: d1.name,
        note: 'Copia ig_account_id para META_IG_ACCOUNT_ID no Vercel.',
      })
    }
  } catch (e) {
    results.method1_error = String(e)
  }

  // Método 2: /page/instagram_accounts
  try {
    const r2 = await fetch(
      `https://graph.facebook.com/v25.0/${pageId}/instagram_accounts?access_token=${pageToken}`
    )
    const d2 = await r2.json()
    results.method2_instagram_accounts = d2
    if (d2.data?.[0]?.id) {
      return NextResponse.json({
        success: true,
        method: 'instagram_accounts',
        ig_account_id: d2.data[0].id,
        note: 'Copia ig_account_id para META_IG_ACCOUNT_ID no Vercel.',
      })
    }
  } catch (e) {
    results.method2_error = String(e)
  }

  // Método 3: /page/connected_instagram_account
  try {
    const r3 = await fetch(
      `https://graph.facebook.com/v25.0/${pageId}?fields=connected_instagram_account&access_token=${pageToken}`
    )
    const d3 = await r3.json()
    results.method3_connected_instagram = d3
    if (d3.connected_instagram_account?.id) {
      return NextResponse.json({
        success: true,
        method: 'connected_instagram_account',
        ig_account_id: d3.connected_instagram_account.id,
        note: 'Copia ig_account_id para META_IG_ACCOUNT_ID no Vercel.',
      })
    }
  } catch (e) {
    results.method3_error = String(e)
  }

  // Método 4: tentar direto com o IG user ID encontrado na página
  const knownIgId = '9376637934'
  try {
    const r4 = await fetch(
      `https://graph.facebook.com/v25.0/${knownIgId}?fields=id,username,account_type,name&access_token=${pageToken}`
    )
    const d4 = await r4.json()
    results.method4_direct_ig_id = d4
    if (d4.id && !d4.error) {
      return NextResponse.json({
        success: true,
        method: 'direct_ig_id',
        ig_account_id: d4.id,
        username: d4.username,
        account_type: d4.account_type,
        note: 'ID confirmado via acesso direto.',
      })
    }
  } catch (e) {
    results.method4_error = String(e)
  }

  // Método 5: tentar criar container de media (teste de permissão real)
  const testImageUrl = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1080&q=80'
  try {
    const r5 = await fetch(`https://graph.facebook.com/v25.0/${knownIgId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: testImageUrl,
        caption: 'teste',
        access_token: pageToken,
      }),
    })
    const d5 = await r5.json()
    results.method5_media_container_test = d5
  } catch (e) {
    results.method5_error = String(e)
  }

  return NextResponse.json({
    success: false,
    all_results: results,
    known_ig_id: knownIgId,
    diagnosis: 'Ver all_results para diagnóstico completo do erro Instagram.',
  })
}
