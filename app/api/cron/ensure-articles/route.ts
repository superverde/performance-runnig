import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * Rede de segurança para a publicação diária de artigos.
 *
 * O GitHub Action "Gerar Artigos Diários" (.github/workflows/daily-articles.yml)
 * corre por agendamento próprio (cron do GitHub), mas o agendador do GitHub
 * Actions é "best effort" — pode atrasar horas ou, em casos raros, simplesmente
 * não disparar num dado dia (já aconteceu — ver memória
 * project_github_action_atraso_e_duplicados).
 *
 * Este endpoint corre num cron da Vercel (infraestrutura independente do
 * GitHub) bastante depois da hora normal de publicação. Se detetar que ainda
 * não existem os 3 artigos de hoje, dispara o workflow diretamente pela API
 * do GitHub (workflow_dispatch).
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

  const today = new Date().toISOString().slice(0, 10)
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
