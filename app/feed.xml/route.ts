import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'

const SITE_URL = 'https://www.performancerunning.pt'
const SITE_NAME = 'Performance Running'
const SITE_DESC = 'Ciência aplicada à corrida, trail running e atletismo'

export async function GET() {
  const articles = getAllArticles().slice(0, 50)

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/blog/${a.slug}`
      const pubDate = new Date(a.rawDate).toUTCString()
      return `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${a.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${a.category}]]></category>
      ${a.coverImage ? `<enclosure url="${a.coverImage}" type="image/jpeg" length="0"/>` : ''}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>pt-PT</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
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