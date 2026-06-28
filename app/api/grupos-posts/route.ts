import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'

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

const HASHTAGS: Record<string, string> = {
  'Treino':        '#treino #running #treinodecorrida #corridaportugal #corredores #performancerunning',
  'Fisiologia':    '#fisiologia #running #endurance #corredores #vo2max #performancerunning',
  'Nutrição':      '#nutricao #running #sportsnutrition #corredores #maratona #performancerunning',
  'Biomecânica':   '#biomecanica #tecnicadecorrida #running #corredores #performancerunning',
  'Recuperação':   '#recuperacao #recovery #running #corredores #performancerunning',
  'VO2max':        '#vo2max #fisiologia #running #endurance #corredores #performancerunning',
  'Trail Running': '#trailrunning #trail #ultratrail #trailportugal #performancerunning',
  'Lesões':        '#lesoes #prevencaodelesoes #running #corredores #performancerunning',
  'Psicologia':    '#psicologia #mindset #running #corredores #performancerunning',
}

function buildGroupPost(
  article: { title: string; excerpt: string; slug: string; category: string },
  slot: number
): string {
  const link = `${SITE_URL}/blog/${article.slug}`
  const tags = HASHTAGS[article.category] ?? '#running #corredores #performancerunning'
  const templates = [
    `🔬 ${article.title}\n\n${article.excerpt}\n\nLê o artigo completo → ${link}\n\n${tags}`,
    `Sabias que...\n\n${article.excerpt}\n\n📖 ${article.title}\n\n${link}\n\n${tags}`,
    `💡 ${article.title}\n\n${article.excerpt}\n\nVê a análise completa → ${link}\n\n${tags}`,
  ]
  return fixPtPt(templates[slot] ?? templates[0])
}

export async function GET() {
  const articles = getAllArticles()
  if (articles.length === 0) return NextResponse.json({ posts: [] })

  const now = new Date()
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000
  )

  const posts = [0, 1, 2].map((slot) => {
    const index = (dayOfYear * 3 + slot) % articles.length
    const article = articles[index]
    return {
      slot,
      hora: ['08:00', '13:00', '19:00'][slot],
      titulo: article.title,
      categoria: article.category,
      link: `${SITE_URL}/blog/${article.slug}`,
      texto: buildGroupPost(article, slot),
    }
  })

  return NextResponse.json({ posts, date: now.toISOString().slice(0, 10) })
}
