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

  // Nenhum método funcionou — o token não tem permissões Instagram
  return NextResponse.json({
    success: false,
    all_results: results,
    fix: 'O token não tem permissões Instagram. Gera um novo token em: https://developers.facebook.com/tools/explorer/ com permissões: pages_show_list, pages_manage_posts, pages_read_engagement, instagram_basic, instagram_content_publish — e chama /api/fb-exchange?user_token=NOVO_TOKEN para obter token permanente com Instagram.',
  })
}
