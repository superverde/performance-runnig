import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * Rede de segurança para a publicação diária de artigos.
 *
 * O GitHub Action "Gerar Artigos Diários" (.github/workflows/daily-articles.yml)
 * corre por agendamento próprio às ~03:07 hora de Portugal, mas o agendador do
 * GitHub Actions é "best effort" — pode atrasar horas ou, em casos raros,
 * simplesmente não disparar num dado dia (já aconteceu — ver memória
 * project_github_action_atraso_e_duplicados).
 *
 * Este endpoint corre num cron da Vercel (infraestrutura independente do
 * GitHub) por volta das 05:12 hora de Portugal — antes das 06:00, hora a que
 * os artigos têm de estar garantidamente publicados (pedido do Pedro,
 * 2026-07-09, para estarem prontos à hora do pequeno-almoço). Se detetar que
 * ainda não existem os 3 artigos de hoje, dispara o workflow diretamente pela
 * API do GitHub (workflow_dispatch), que normalmente arranca em segundos.
 *
 * Portugal muda de fuso horário ao longo do ano (WET/UTC+0 no inverno,
 * WEST/UTC+1 no verão), e o vercel.json não suporta agendamento condicional
 * por estação como o GitHub Actions — por isso há DOIS crons fixos em UTC
 * ("12 4 * * *" e "12 5 * * *", um por estação) que apontam para este mesmo
 * endpoint todos os dias. A Vercel envia o header `x-vercel-cron-schedule`
 * com o cron exato que disparou o pedido (equivalente ao `github.event.schedule`
 * usado no gate do GitHub Action) — o gate abaixo usa esse header para saber
 * qual dos dois disparos é o "certo" para a estação atual e ignora o outro,
 * mantendo a verificação sempre por volta das 05:12 hora de Portugal, ano todo.
 *
 * É seguro correr isto mesmo que o workflow original já tenha corrido: o
 * próprio script (scripts/generate-articles.mjs) verifica quantos artigos já
 * têm a data de hoje e sai sem fazer nada se já houver 3 — nunca duplica.
 */

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'blog')
const GITHUB_OWNER = 'superverde'
const GITHUB_REPO = 'performance-runnig'
const ARTICLES_PER_DAY = 3

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

// Offset atual de Lisboa em horas face a UTC (1 no verão/WEST, 0 no
// inverno/WET), calculado sem dependências externas via Intl.
function getLisbonOffsetHours(date: Date): number {
  const asUtc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const asLisbon = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }))
  return Math.round((asLisbon.getTime() - asUtc.getTime()) / (60 * 60 * 1000))
}

// Dos dois crons diários definidos em vercel.json (04:12 UTC e 05:12 UTC),
// só o que corresponde à estação atual deve de facto verificar/disparar —
// o outro é o cron "da outra estação" e deve ser ignorado, tal como no gate
// do GitHub Action. A Vercel identifica qual cron disparou o pedido através
// do header `x-vercel-cron-schedule` (só presente em invocações reais de
// cron — um pedido manual autenticado com CRON_SECRET não o tem e passa
// sempre, à semelhança do `workflow_dispatch` no GitHub Action).
function isCorrectSeasonInvocation(req: NextRequest, now: Date): boolean {
  const triggeredBy = req.headers.get('x-vercel-cron-schedule')
  if (!triggeredBy) return true // não é um disparo de cron (ex: teste manual) — deixa passar

  const offset = getLisbonOffsetHours(now)
  const correctCron = offset === 1 ? '12 4 * * *' : '12 5 * * *' // verão (+1) → 04:12 UTC, inverno (+0) → 05:12 UTC
  return triggeredBy === correctCron
}

function countTodayArticles(today: string): number {
  if (!fs.existsSync(ARTICLES_DIR)) return 0
  let count = 0
  for (const f of fs.readdirSync(ARTICLES_DIR)) {
    if (!f.endsWith('.md')) continue
    const content = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')
    const match = content.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)
    if (match && match[1] === today) count++
  }
  return count
}

async function triggerWorkflow(): Promise<{ ok: boolean; status: number; body: string }> {
  const token = process.env.GH_ACTIONS_PAT
  if (!token) {
    return { ok: false, status: 0, body: 'GH_ACTIONS_PAT não configurado na Vercel' }
  }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/daily-articles.yml/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: 'main' }),
    }
  )

  const body = res.status === 204 ? '' : await res.text()
  return { ok: res.ok, status: res.status, body }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const now = new Date()

  if (!isCorrectSeasonInvocation(req, now)) {
    return NextResponse.json({
      date: now.toISOString().slice(0, 10),
      action: 'nenhuma — este é o cron da outra estação do ano (verão/inverno), a ignorar',
      cronRecebido: req.headers.get('x-vercel-cron-schedule'),
    })
  }

  const today = now.toISOString().slice(0, 10)
  const count = countTodayArticles(today)

  if (count >= ARTICLES_PER_DAY) {
    return NextResponse.json({
      date: today,
      articlesToday: count,
      action: 'nenhuma — artigos de hoje já publicados',
    })
  }

  const result = await triggerWorkflow()

  return NextResponse.json({
    date: today,
    articlesToday: count,
    action: 'workflow_dispatch disparado no GitHub Actions',
    triggered: result.ok,
    githubStatus: result.status,
    githubBody: result.body || undefined,
  })
}
