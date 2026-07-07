import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'

// Mesma razao de app/blog/page.tsx e app/sitemap.ts: sem isto, este route
// handler é gerado como estático no build e fica com os artigos de nesse
// momento em vez dos artigos publicados diariamente.
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.performancerunning.pt'
const SITE_NAME = 'Performance Running'
const SITE_DESC = 'Ciência aplicada à corrida, trail running e atletismo'

// Imagens por slug de artigo (específicas por tema)
const ARTICLE_IMAGES: Record<string, string> = {
  'como-correr-mais-rapido': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80',
  'corrida-jejum-fat-adaptation': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
  'hidratacao-corrida-guia-cientifico': 'https://images.unsplash.com/photo-1559181567-c3190ca9d823?w=1200&q=80',
  'joelho-corredor-sindrome-patelofemoral': 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80',
  'long-run-como-fazer-corretamente': 'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=1200&q=80',
  'melhor-relogio-gps-corrida-2026': 'https://images.unsplash.com/photo-1523475496153-3567a3a7fc7b?w=1200&q=80',
  'melhores-sapatilhas-corrida-2026': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
  'monitor-cardiaco-treino-zonas-polar-h10': 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=1200&q=80',
  'pacing-estrategia-ritmo-maratona': 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=1200&q=80',
  'plano-treino-meia-maratona': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80',
  'taper-maratona-semana-final': 'https://images.unsplash.com/photo-1538485399081-7c8272b27daa?w=1200&q=80',
  'recuperacao-ativa-vs-passiva-quando-descansar-e-quando-mover': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
  'overreaching-vs-overtraining-como-distinguir-e-resolver': 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&q=80',
  'imersao-em-agua-fria-beneficios-reais-e-limitacoes': 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=1200&q=80',
  'como-melhorar-o-vo2max-protocolos-com-evidencia-cientifica': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80',
}

// Imagens por categoria (fallback)
const CATEGORY_IMAGES: Record<string, string> = {
  'Treino':        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80',
  'Fisiologia':    'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&q=80',
  'Biomecânica':   'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80',
  'Nutrição':      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
  'Recuperação':   'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
  'Psicologia':    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80',
  'Trail Running': 'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=1200&q=80',
  'Lesões':        'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=1200&q=80',
  'VO2max':        'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80'

export async function GET() {
  const articles = getAllArticles().slice(0, 50)

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/blog/${a.slug}`
      const pubDate = new Date(a.rawDate).toUTCString()
      const imageUrl = a.coverImage
        || ARTICLE_IMAGES[a.slug]
        || CATEGORY_IMAGES[a.category]
        || DEFAULT_IMAGE
      return `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${a.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${a.category}]]></category>
      <enclosure url="${imageUrl}" type="image/jpeg" length="0"/>
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
