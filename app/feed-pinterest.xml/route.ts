import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'
import { CATEGORY_HASHTAGS } from '@/lib/hashtags'

/**
 * GET /feed-pinterest.xml
 *
 * Feed RSS dedicado ao "Bulk create Pins" do Pinterest
 * (pinterest.com/settings/bulk-create-pins), separado do /feed.xml geral.
 *
 * Porque existe um feed a mais: a app da API continua em "Acesso Trial", e
 * apps em trial nao podem criar pins em producao -- o Pinterest responde
 * 403 code 29 e manda usar o sandbox (ver memoria do projeto). Ate haver
 * Acesso Normal, a unica via de publicacao automatica real e o RSS. Mas o
 * /feed.xml tem enclosures com a foto de stock horizontal (1200x800), que
 * num feed vertical 2:3 fica cortada e sem titulo -- exatamente o problema
 * que levou a apagar 14 pins mudos em 2026-07-19. Aqui o enclosure aponta
 * para /api/pinterest-pin-image, a mesma imagem 1000x1500 com titulo,
 * categoria e marca que o cron usa, para os pins do RSS ficarem iguais aos
 * da API quando esta for desbloqueada.
 *
 * Quando o Acesso Normal for aprovado: desligar o RSS no Pinterest antes de
 * reativar os crons, senao cada artigo entra duas vezes.
 */

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.performancerunning.pt'
const MAX_ITEMS = 25

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const articles = getAllArticles().slice(0, MAX_ITEMS)

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/blog/${a.slug}`
      const imageUrl = `${SITE_URL}/api/pinterest-pin-image?slug=${encodeURIComponent(a.slug)}`
      const hashtags = CATEGORY_HASHTAGS[a.category] ?? '#corridaderua #vidadecorredor'
      // O Pinterest usa a description do item como descricao do pin: excerpt
      // primeiro (e o que informa), hashtags no fim (categorizam, nao dao
      // alcance -- ver lib/hashtags.ts), tudo abaixo dos 500 caracteres que
      // o Pinterest trunca.
      const description = `${a.excerpt}\n\n${hashtags}`.slice(0, 480)
      return `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${new Date(a.rawDate).toUTCString()}</pubDate>
      <category><![CDATA[${a.category}]]></category>
      <enclosure url="${escapeXml(imageUrl)}" type="image/png" length="0"/>
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Performance Running — Pinterest</title>
    <link>${SITE_URL}</link>
    <description>Ciencia aplicada a corrida, trail running e atletismo</description>
    <language>pt-PT</language>
    <atom:link href="${SITE_URL}/feed-pinterest.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
