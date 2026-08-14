/**
 * Helper de autenticação Pinterest.
 *
 * Suporta dois modos:
 * 1. Token estático — define PINTEREST_ACCESS_TOKEN e usa-o diretamente.
 *    Simples, mas os access tokens da API v5 do Pinterest expiram
 *    (tipicamente 30 dias), por isso isto volta a partir ao fim de algum tempo.
 * 2. Refresh automático (recomendado) — define PINTEREST_APP_ID,
 *    PINTEREST_APP_SECRET e PINTEREST_REFRESH_TOKEN. A cada execução do cron,
 *    troca o refresh token por um access token novo, para nunca expirar
 *    silenciosamente.
 *
 * Ver: https://developers.pinterest.com/docs/api/v5/oauth-token/
 */

let cachedToken: { token: string; expiresAt: number } | null = null

async function refreshAccessToken(): Promise<string | null> {
  const appId = process.env.PINTEREST_APP_ID
  const appSecret = process.env.PINTEREST_APP_SECRET
  const refreshToken = process.env.PINTEREST_REFRESH_TOKEN

  if (!appId || !appSecret || !refreshToken) return null

  // Reutiliza o token em cache se ainda for válido por mais de 60s
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  try {
    const basicAuth = Buffer.from(`${appId}:${appSecret}`).toString('base64')
    const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        continuous_refresh: 'true',
      }),
    })
    const data = await res.json()
    if (!res.ok || !data.access_token) {
      console.error('Pinterest: falha ao renovar access token', data)
      return null
    }
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 1800) * 1000,
    }
    return data.access_token
  } catch (err) {
    console.error('Pinterest: erro ao renovar access token', err)
    return null
  }
}

/**
 * Devolve um access token válido: tenta o refresh automático primeiro,
 * e recua para PINTEREST_ACCESS_TOKEN estático se o refresh não estiver configurado.
 */
export async function getPinterestAccessToken(): Promise<string | null> {
  const refreshed = await refreshAccessToken()
  if (refreshed) return refreshed
  return process.env.PINTEREST_ACCESS_TOKEN ?? null
}

export function pinterestRefreshConfigured(): boolean {
  return !!(process.env.PINTEREST_APP_ID && process.env.PINTEREST_APP_SECRET && process.env.PINTEREST_REFRESH_TOKEN)
}
