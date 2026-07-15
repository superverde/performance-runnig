import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'

// Mesma razao de app/blog/page.tsx e app/sitemap.ts: sem isto, este route
// handler e gerado como estatico no build e fica com os artigos de nesse
// momento em vez dos artigos publicados diariamente.
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.performancerunning.pt'
const SITE_NAME = 'Performance Running'
const SITE_DESC = 'Ciencia aplicada a corrida, trail running e atletismo'

// Imagens por slug de artigo (especificas por tema)
const ARTICLE_IMAGES: Record<string, string> = {
  'como-correr-mais-rapido': 'https://www.performancerunning.pt/pool-images/photo-1552674605-db6ffd4facb5.jpg',
  'corrida-jejum-fat-adaptation': 'https://www.performancerunning.pt/pool-images/photo-1490645935967-10de6ba17061.jpg',
  'hidratacao-corrida-guia-cientifico': 'https://www.performancerunning.pt/pool-images/photo-1467453678174-768ec283a940.jpg',
  'joelho-corredor-sindrome-patelofemoral': 'https://www.performancerunning.pt/pool-images/photo-1571008887538-b36bb32f4571.jpg',
  'long-run-como-fazer-corretamente': 'https://www.performancerunning.pt/pool-images/photo-1504025468847-0e438279542c.jpg',
  'melhor-relogio-gps-corrida-2026': 'https://www.performancerunning.pt/pool-images/photo-1549896869-ca27eeffe4fb.jpg',
  'melhores-sapatilhas-corrida-2026': 'https://www.performancerunning.pt/pool-images/photo-1542291026-7eec264c27ff.jpg',
  'monitor-cardiaco-treino-zonas-polar-h10': 'https://www.performancerunning.pt/pool-images/photo-1557800636-894a64c1696f.jpg',
  'pacing-estrategia-ritmo-maratona': 'https://www.performancerunning.pt/pool-images/photo-1461897104016-0b3b00cc81ee.jpg',
  'plano-treino-meia-maratona': 'https://www.performancerunning.pt/pool-images/photo-1476480862126-209bfaa8edc8.jpg',
  'taper-maratona-semana-final': 'https://www.performancerunning.pt/pool-images/photo-1456613820599-bfe244172af5.jpg',
  'recuperacao-ativa-vs-passiva-quando-descansar-e-quando-mover': 'https://www.performancerunning.pt/pool-images/photo-1544367567-0f2fcb009e0b.jpg',
  'overreaching-vs-overtraining-como-distinguir-e-resolver': 'https://www.performancerunning.pt/pool-images/photo-1727094141271-9bea5bc8c757.jpg',
  'imersao-em-agua-fria-beneficios-reais-e-limitacoes': 'https://www.performancerunning.pt/pool-images/photo-1560347876-aeef00ee58a1.jpg',
  'como-melhorar-o-vo2max-protocolos-com-evidencia-cientifica': 'https://www.performancerunning.pt/pool-images/photo-1541534741688-6078c6bfb5c5.jpg',
}

// Imagens por categoria (fallback)
const CATEGORY_IMAGES: Record<string, string> = {
  'Treino':        'https://www.performancerunning.pt/pool-images/photo-1571019614242-c5c5dee9f50b.jpg',
  'Fisiologia':    'https://www.performancerunning.pt/pool-images/photo-1727094141271-9bea5bc8c757.jpg',
  'Biomecânica':   'https://www.performancerunning.pt/pool-images/photo-1476480862126-209bfaa8edc8.jpg',
  'Nutrição':      'https://www.performancerunning.pt/pool-images/photo-1490645935967-10de6ba17061.jpg',
  'Recuperação':   'https://www.performancerunning.pt/pool-images/photo-1544367567-0f2fcb009e0b.jpg',
  'Psicologia':    'https://www.performancerunning.pt/pool-images/photo-1552674605-db6ffd4facb5.jpg',
  'Trail Running': 'https://www.performancerunning.pt/pool-images/photo-1504025468847-0e438279542c.jpg',
  'Lesões':        'https://www.performancerunning.pt/pool-images/photo-1562771379-eafdca7a02f8.jpg',
  'VO2max':        'https://www.performancerunning.pt/pool-images/photo-1541534741688-6078c6bfb5c5.jpg',
}
const DEFAULT_IMAGE = 'https://www.performancerunning.pt/pool-images/photo-1571008887538-b36bb32f4571.jpg'

// Escapa caracteres especiais XML em valores usados dentro de atributos
// (url="...") ou de texto fora de CDATA. Sem isto, um "&" literal (ex: nos
// query params das imagens do Unsplash, "?w=1200&q=80") produz XML invalido
// ("EntityRef: expecting ';'") e o feed fica ilegivel para leitores de RSS
// (ex: a publicacao automatica do Pinterest, que rejeita o feed inteiro).
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

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
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description><![CDATA[${a.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${a.category}]]></category>
      <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0"/>
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
