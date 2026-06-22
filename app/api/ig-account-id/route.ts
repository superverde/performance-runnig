import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/ig-account-id?key=INTERNAL_API_KEY
 * Usa o token permanente do Vercel para buscar o Instagram Account ID
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

  try {
    const res = await fetch(
      `https://graph.facebook.com/v25.0/${pageId}?fields=instagram_business_account,name&access_token=${pageToken}`
    )
    const data = await res.json()

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 })
    }

    const igId = data.instagram_business_account?.id

    if (!igId) {
      return NextResponse.json({
        page_name: data.name,
        instagram_business_account: null,
        note: 'Nenhuma conta Instagram Business ligada a esta página. Vai a business.facebook.com → Definições → Instagram e liga a conta.',
      })
    }

    return NextResponse.json({
      success: true,
      page_name: data.name,
      page_id: pageId,
      ig_account_id: igId,
      note: 'Copia ig_account_id para META_IG_ACCOUNT_ID no Vercel.',
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
