import { NextRequest, NextResponse } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from '@/lib/locale'

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') || DEFAULT_LOCALE
  const safeLocale = (LOCALES as readonly string[]).includes(locale) ? locale : DEFAULT_LOCALE

  try {
    const messages = await import(`@/messages/${safeLocale}.json`)
    return NextResponse.json(messages.default, {
      headers: { 'Cache-Control': 'public, max-age=86400' },
    })
  } catch {
    const fallback = await import('@/messages/pt.json')
    return NextResponse.json(fallback.default)
  }
}
