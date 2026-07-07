import { NextRequest, NextResponse } from 'next/server'
import { getPinterestAccessToken, pinterestRefreshConfigured } from '@/lib/pinterest'

/**
 * GET /api/pinterest-status?key=INTERNAL_API_KEY
 * Diagnóstico read-only — não publica nenhum pin. Verifica se
 * PINTEREST_ACCESS_TOKEN (ou refresh automático) / PINTEREST_BOARD_ID
 * estão configurados e válidos.
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const refreshConfigured = pinterestRefreshConfigured()
  const token = await getPinterestAccessToken()
  const boardId = process.env.PINTEREST_BOARD_ID

  if (!token || !boardId) {
    return NextResponse.json({
      configured: false,
      hasToken: !!token,
      hasBoardId: !!boardId,
      refreshConfigured,
      diagnosis: 'PINTEREST_ACCESS_TOKEN (ou PINTEREST_APP_ID/PINTEREST_APP_SECRET/PINTEREST_REFRESH_TOKEN) ou PINTEREST_BOARD_ID não estão definidos no Vercel. A app continua sem token válido.',
    })
  }

  const results: Record<string, unknown> = { hasToken: true, hasBoardId: true, refreshConfigured, boardIdConfigured: boardId }

  // Verifica se o token é válido (conta associada)
  try {
    const accRes = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.user_account = await accRes.json()
    results.user_account_status = accRes.status
  } catch (e) {
    results.user_account_error = String(e)
  }

  // Lista os boards acessíveis com este token
  try {
    const boardsRes = await fetch('https://api.pinterest.com/v5/boards', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const boardsData = await boardsRes.json()
    results.boards_status = boardsRes.status
    results.boards = boardsData
    const ids = (boardsData.items ?? []).map((b: { id: string }) => b.id)
    results.boardIdMatchesAnyBoard = ids.includes(boardId)
  } catch (e) {
    results.boards_error = String(e)
  }

  return NextResponse.json({ configured: true, ...results })
}
