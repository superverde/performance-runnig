import { NextResponse } from 'next/server'
import { getAllArticles, getTodayArticles } from '@/lib/articles'

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

// Regra: hashtags PT + 3-4 internacionais (EN/ES/FR/DE) para alcance em grupos
// globais, não só portugueses — ver memória "hashtags-comunidades-globais".
const HASHTAGS: Record<string, string> = {
  'Treino':        '#treino #running #treinodecorrida #corridaportugal #corredores #performancerunning #runningcommunity #marathontraining #correr #laufen',
  'Fisiologia':    '#fisiologia #running #endurance #corredores #vo2max #performancerunning #runnersworld #resistencia #ausdauer',
  'Nutrição':      '#nutricao #running #sportsnutrition #corredores #maratona #performancerunning #runningfuel #nutricion #ernährung',
  'Biomecânica':   '#biomecanica #tecnicadecorrida #running #corredores #performancerunning #runningform #biomechanics #lauftechnik',
  'Recuperação':   '#recuperacao #recovery #running #corredores #performancerunning #erholung #récupération #sportrecovery',
  'VO2max':        '#vo2max #fisiologia #running #endurance #corredores #performancerunning #runnersworld #resistencia',
  'Trail Running': '#trailrunning #trail #ultratrail #trailportugal #performancerunning #ultrarunning #UTMB #mountainrunning #trailfrance',
  'Lesões':        '#lesoes #prevencaodelesoes #running #corredores #performancerunning #runninginjury #laufverletzung #prevenciondelesiones',
  'Psicologia':    '#psicologia #mindset #running #corredores #performancerunning #sportpsychologie #psicologiadeportiva',
}

const DEFAULT_HASHTAGS = '#corrida #running #atletismo #corredores #corridaportugal #performancerunning #runnersworld #marathon'

function buildGroupPost(
  article: { title: string; excerpt: string; slug: string; category: string },
  slot: number
): string {
  const link = `${SITE_URL}/blog/${article.slug}`
  const tags = HASHTAGS[article.category] ?? DEFAULT_HASHTAGS
  const templates = [
    `🔬 ${article.title}\n\n${article.excerpt}\n\nLê o artigo completo → ${link}\n\n${tags}`,
    `Sabias que...\n\n${article.excerpt}\n\n📖 ${article.title}\n\n${link}\n\n${tags}`,
    `💡 ${article.title}\n\n${article.excerpt}\n\nVê a análise completa → ${link}\n\n${tags}`,
  ]
  return fixPtPt(templates[slot] ?? templates[0])
}

export async function GET() {
  const allArticles = getAllArticles()
  if (allArticles.length === 0) return NextResponse.json({ posts: [] })

  const now = new Date()

  // Prioridade máxima: os artigos publicados HOJE. Antes disto, os posts
  // sugeridos para os grupos eram escolhidos só por rotação de dia-do-ano
  // sobre TODO o arquivo (~200+ artigos), o que fazia os textos e links
  // mostrados em /grupos não corresponderem aos artigos novos do dia — este
  // é o bug reportado ("publicações nas páginas dos grupos não coincidem
  // com as publicações de hoje"). app/api/cron/daily-social/route.ts já
  // usava este padrão (hoje primeiro, arquivo só como fallback); esta rota
  // tinha ficado com a lógica antiga e desalinhada.
  const todayArticles = getTodayArticles()
  const selected = [...todayArticles]

  if (selected.length < 3) {
    // Fallback (só quando não há 3 artigos publicados hoje — ex. antes de o
    // cron diário correr, ou a geração falhou): completa com o arquivo por
    // rotação de dia-do-ano, sem repetir artigos já escolhidos.
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000
    )
    let offset = 0
    while (selected.length < 3 && offset < allArticles.length) {
      const candidate = allArticles[(dayOfYear + offset) % allArticles.length]
      if (!selected.some((a) => a.slug === candidate.slug)) selected.push(candidate)
      offset++
    }
  }

  const posts = selected.slice(0, 3).map((article, slot) => ({
    slot,
    hora: ['08:00', '13:00', '19:00'][slot],
    titulo: article.title,
    categoria: article.category,
    link: `${SITE_URL}/blog/${article.slug}`,
    texto: buildGroupPost(article, slot),
  }))

  // Post evergreen (slot 3) — não depende dos artigos do dia, fica sempre
  // disponível no painel para captar subscritores da newsletter. Pedido do
  // Pedro em 2026-08-18 para ter sempre um post de newsletter pronto a
  // copiar, a par dos 3 posts diários de artigos.
  posts.push({
    slot: 3,
    hora: 'Sempre disponível',
    titulo: 'Newsletter — Porque a Maioria dos Corredores Estagna',
    categoria: 'Newsletter',
    link: SITE_URL,
    texto: fixPtPt(
      `📬 A maioria dos corredores treina às cegas — não por preguiça, mas porque a informação está toda espalhada e contraditória.

Todas as semanas mandamos um resumo direto ao ponto: fisiologia, periodização, prevenção de lesões — sem achismo, sem jargão académico a mais. 3 artigos científicos por semana, grátis, e cancelas quando quiseres.

👉 ${SITE_URL}

Já perderam tempo a seguir um conselho que não fazia sentido para o vosso treino? Contem aí 👇

#corridaportugal #runningportugal #corredoresportugal #performancerunning #running #runningcommunity #treinodecorrida #correr`
    ),
  })

  return NextResponse.json({ posts, date: now.toISOString().slice(0, 10) })
}
