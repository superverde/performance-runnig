import { redis } from '@/lib/redis'

/**
 * Gestão do token de acesso do Threads.
 *
 * PORQUE ISTO EXISTE
 * O token do Threads e de longa duracao mas expira ao fim de 60 dias. Segundo a
 * documentacao da Meta, um token que nao seja renovado dentro desses 60 dias
 * "expira e ja nao pode ser renovado" — a recuperacao obriga a repetir o fluxo
 * OAuth num browser, a mao. Ate agora o token vivia so na variavel de ambiente
 * THREADS_ACCESS_TOKEN da Vercel, o que significava que a publicacao automatica
 * no Threads parava em silencio de 60 em 60 dias, sem erro visivel, ate alguem
 * reparar.
 *
 * COMO FUNCIONA
 * O token passa a viver no Redis (mesma infraestrutura ja usada pelo social-log).
 * Um cron chama refreshThreadsToken() duas vezes por semana; cada renovacao
 * devolve um token novo, valido por mais 60 dias, que e gravado no Redis. A
 * variavel de ambiente continua a servir de arranque (primeira renovacao) e de
 * rede de seguranca se o Redis estiver vazio.
 *
 * NOTA IMPORTANTE: a Meta exige que o token tenha pelo menos 24 horas para poder
 * ser renovado. Por isso o cron corre segundas e quintas, nunca dois dias
 * seguidos, e o codigo recusa renovar um token renovado ha menos de 36 horas.
 */

const KEY = 'threads:token'

/** A Meta so aceita renovar tokens com mais de 24h. Margem de seguranca. */
const MIN_HOURS_BETWEEN_REFRESHES = 36

export interface StoredThreadsToken {
  accessToken: string
  /** epoch ms em que o token expira */
  expiresAt: number
  /** epoch ms da ultima renovacao bem sucedida */
  refreshedAt: number
  /** mensagem da ultima tentativa falhada, se houver */
  lastError?: string | null
  /** epoch ms da ultima tentativa falhada */
  lastErrorAt?: number | null
}

function isUsable(value: string | undefined | null): value is string {
  return !!value && value !== 'placeholder' && value.length > 10
}

export async function getStoredThreadsToken(): Promise<StoredThreadsToken | null> {
  try {
    const raw = await redis.get<StoredThreadsToken>(KEY)
    if (raw && isUsable(raw.accessToken)) return raw
    return null
  } catch {
    // Redis em baixo nao pode impedir a publicacao: cai para a env var.
    return null
  }
}

/**
 * Token a usar para publicar. Redis primeiro (é o que está atualizado),
 * variável de ambiente como recurso.
 *
 * Além de ler, isto também repara: se ainda não houver nada gravado no Redis
 * (primeira vez a correr com este código) ou se o token estiver a menos de 15
 * dias de expirar, tenta renovar aqui mesmo. Assim o sistema arranca sozinho no
 * primeiro post depois do deploy, sem depender de o cron ter corrido nem de
 * alguém carregar num botão — e continua a curar-se sozinho se o cron falhar.
 */
export async function getThreadsAccessToken(): Promise<string | undefined> {
  const stored = await getStoredThreadsToken()

  if (!stored) {
    // Nunca foi gravado: semear o Redis a partir da variável de ambiente.
    const outcome = await refreshThreadsToken()
    if (outcome.ok && !outcome.skipped) {
      const seeded = await getStoredThreadsToken()
      if (seeded) return seeded.accessToken
    }
    const fromEnv = process.env.THREADS_ACCESS_TOKEN
    return isUsable(fromEnv) ? fromEnv : undefined
  }

  const daysLeft = (stored.expiresAt - Date.now()) / 86400000
  if (daysLeft < 15) {
    const outcome = await refreshThreadsToken()
    if (outcome.ok && !outcome.skipped) {
      const renewed = await getStoredThreadsToken()
      if (renewed) return renewed.accessToken
    }
  }

  return stored.accessToken
}

/** Dias que faltam até o token expirar. null se não houver registo no Redis. */
export async function getThreadsTokenDaysLeft(): Promise<number | null> {
  const stored = await getStoredThreadsToken()
  if (!stored?.expiresAt) return null
  return Math.floor((stored.expiresAt - Date.now()) / 86400000)
}

export interface RefreshOutcome {
  ok: boolean
  skipped?: boolean
  reason?: string
  daysLeft?: number
  refreshedAt?: string
  source?: 'redis' | 'env'
}

/**
 * Renova o token junto da Meta e grava o novo no Redis.
 * Nunca devolve o token em si — só metadados seguros de registar em logs.
 */
export async function refreshThreadsToken(force = false): Promise<RefreshOutcome> {
  const stored = await getStoredThreadsToken()
  const source: 'redis' | 'env' = stored ? 'redis' : 'env'
  const current = stored?.accessToken ?? process.env.THREADS_ACCESS_TOKEN

  if (!isUsable(current)) {
    return { ok: false, reason: 'Sem token do Threads configurado (nem no Redis nem em THREADS_ACCESS_TOKEN)' }
  }

  if (!force && stored?.refreshedAt) {
    const hoursSince = (Date.now() - stored.refreshedAt) / 3600000
    if (hoursSince < MIN_HOURS_BETWEEN_REFRESHES) {
      return {
        ok: true,
        skipped: true,
        reason: `Renovado ha ${hoursSince.toFixed(1)}h — a Meta exige 24h entre renovacoes`,
        daysLeft: Math.floor((stored.expiresAt - Date.now()) / 86400000),
        source,
      }
    }
  }

  try {
    const url = new URL('https://graph.threads.net/refresh_access_token')
    url.searchParams.set('grant_type', 'th_refresh_token')
    url.searchParams.set('access_token', current)

    const res = await fetch(url.toString(), { method: 'GET' })
    const data = await res.json()

    if (!res.ok || data.error || !data.access_token) {
      const message = data?.error?.message ?? `HTTP ${res.status}`
      await recordFailure(stored, message)
      return { ok: false, reason: message, source }
    }

    const expiresInSeconds = Number(data.expires_in) || 60 * 86400
    const next: StoredThreadsToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + expiresInSeconds * 1000,
      refreshedAt: Date.now(),
      lastError: null,
      lastErrorAt: null,
    }

    await redis.set(KEY, next)

    return {
      ok: true,
      daysLeft: Math.floor(expiresInSeconds / 86400),
      refreshedAt: new Date(next.refreshedAt).toISOString(),
      source,
    }
  } catch (err) {
    const message = String(err)
    await recordFailure(stored, message)
    return { ok: false, reason: message, source }
  }
}

async function recordFailure(stored: StoredThreadsToken | null, message: string): Promise<void> {
  if (!stored) return
  try {
    await redis.set(KEY, { ...stored, lastError: message, lastErrorAt: Date.now() })
  } catch {
    // Se o Redis falhar aqui, o token antigo continua válido — não há nada a fazer.
  }
}
