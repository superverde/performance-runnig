import { NextRequest, NextResponse } from 'next/server'
import { getPinterestAccessToken, pinterestRefreshConfigured } from '@/lib/pinterest'

/**
 * GET /api/pinterest-status?key=INTERNAL_API_KEY
 * Diagnostico read-only -- nao publica nenhum pin. Verifica se
 * PINTEREST_ACCESS_TOKEN (ou refresh automatico) / PINTEREST_BOARD_ID
 * estao configurados e validos.
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const refreshConfigured = pinterestRefreshConfigured()
  const token = await getPinterestAccessToken()
  const boardId = process.env.PINTEREST_BOARD_ID

  if (!token) {
    return NextResponse.json({
      configured: false,
      hasToken: false,
      hasBoardId: !!boardId,
      refreshConfigured,
      diagnosis: 'Sem access token valido. Define PINTEREST_ACCESS_TOKEN, ou PINTEREST_APP_ID + PINTEREST_APP_SECRET + PINTEREST_REFRESH_TOKEN no Vercel.',
    })
  }

  // Mesmo sem PINTEREST_BOARD_ID definido, lista os boards disponiveis
  // abaixo para facilitar copiar o ID certo.
  const results: Record<string, unknown> = { hasToken: true, hasBoardId: !!boardId, refreshConfigured, boardIdConfigured: boardId ?? null }

  // Verifica se o token e valido (conta associada)
  try {
    const accRes = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.user_account = await accRes.json()
    results.user_account_status = accRes.status
  } catch (e) {
    results.user_account_error = String(e)
  }

  // Lista os boards acessiveis com este token
  try {
    const boardsRes = await fetch('https://api.pinterest.com/v5/boards', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const boardsData = await boardsRes.json()
    results.boards_status = boardsRes.status
    results.boards = boardsData
    const ids = (boardsData.items ?? []).map((b: { id: string }) => b.id)
    results.boardIdMatchesAnyBoard = boardId ? ids.includes(boardId) : null
  } catch (e) {
    results.boards_error = String(e)
  }

  return NextResponse.json({ configured: true, ...results })
}
