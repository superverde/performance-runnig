import { NextResponse } from 'next/server'
import { getAllArticles, getTodayArticles, type ArticleMeta } from '@/lib/articles'
import { hashtagsFor } from '@/lib/hashtags'

const SITE_URL = 'https://www.performancerunning.pt'

function fixPtPt(text: string): string {
  const replacements: [RegExp, string][] = [
    [/\bvocê\b/gi, 'tu'], [/\bvocês\b/gi, 'vós'],
    [/\bseu\b/gi, 'teu'], [/\bsua\b/gi, 'tua'],
    [/\bseus\b/gi, 'teus'], [/\bsuas\b/gi, 'tuas'],
    [/\bNão perca\b/gi, 'Não percas'], [/\bDescubra\b/gi, 'Descobre'],
  ]
  let out = text
  for (const [p, r] of replacements) out = out.replace(p, r)
  return out
}

// Corta o excerto na primeira frase e trunca a ~110 chars, terminando em
// reticências — o post NÃO deve contar o artigo todo, só abrir a curiosidade
// (curiosity gap). O valor completo fica atrás do clique.
function teaseFrom(excerpt: string): string {
  const firstSentence = excerpt.split(/(?<=[.!?])\s+/)[0] ?? excerpt
  const cut = firstSentence.length > 110 ? `${firstSentence.slice(0, 110).trimEnd()}` : firstSentence
  // remove pontuação final e fecha com reticências para deixar em aberto
  return `${cut.replace(/[.!?…\s]+$/, '')}…`
}

// Templates teaser por slot do dia: gancho + curiosidade + link. Nunca colar o
// excerto completo — se o post responde à pergunta, ninguém clica.
function buildGroupPost(article: ArticleMeta, slot: number): string {
  const link = `${SITE_URL}/blog/${article.slug}`
  const tags = hashtagsFor(article.category)
  const tease = teaseFrom(article.excerpt)
  const templates = [
    // Manhã — facto que intriga
    `🔬 ${tease}\n\nA maioria dos corredores só descobre isto depois de perder meses de progresso. Publicámos hoje a explicação completa, com base científica:\n\n👉 ${link}\n\n${tags}`,
    // Tarde — desafio/erro comum
    `Pergunta séria para quem treina: ${tease}\n\nO artigo de hoje mostra o que a ciência diz — e provavelmente não é o que estás a fazer.\n\n📖 ${article.title}\n👉 ${link}\n\n${tags}`,
    // Noite — pergunta à comunidade (engagement)
    `💬 ${tease}\n\nSaiu hoje no site a análise completa. Antes de leres: qual é a tua experiência com isto? Conta nos comentários 👇\n\n👉 ${link}\n\n${tags}`,
  ]
  return fixPtPt(templates[slot] ?? templates[0])
}

export async function GET() {
  // Prioridade: os artigos publicados HOJE no site (3/dia). Se por alguma
  // razão ainda não houver 3 (ex: manhã cedo, atraso do GitHub Action),
  // completa com os mais recentes do arquivo — nunca mostra a página vazia.
  const today = getTodayArticles()
  const all = getAllArticles()
  if (all.length === 0) return NextResponse.json({ posts: [] })

  const chosen: ArticleMeta[] = [...today]
  for (const a of all) {
    if (chosen.length >= 3) break
    if (!chosen.some((c) => c.slug === a.slug)) chosen.push(a)
  }

  const now = new Date()
  const posts = chosen.slice(0, 3).map((article, slot) => ({
    slot,
    hora: ['08:00', '13:00', '19:00'][slot],
    titulo: article.title,
    categoria: article.category,
    link: `${SITE_URL}/blog/${article.slug}`,
    texto: buildGroupPost(article, slot),
  }))

  return NextResponse.json({ posts, date: now.toISOString().slice(0, 10) })
}
