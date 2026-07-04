import type { Metadata } from 'next'
import { CalendarioClient } from './CalendarioClient'

const SITE_URL = 'https://www.performancerunning.pt'

export const metadata: Metadata = {
  title: 'Calendário de Provas de Corrida e Trail em Portugal 2026',
  description:
    'Calendário completo de maratonas, meias maratonas, trail e ultra trail em Portugal em 2026. Datas, locais e distâncias das principais provas nacionais.',
  keywords: [
    'calendário provas corrida portugal', 'maratonas portugal 2026', 'meias maratonas portugal',
    'calendário trail running portugal', 'ultra trail portugal', 'provas de atletismo 2026',
    'maratona de lisboa', 'maratona do porto', 'são silvestre portugal',
  ],
  alternates: { canonical: `${SITE_URL}/calendario` },
  openGraph: {
    title: 'Calendário de Provas de Corrida e Trail em Portugal',
    description: 'Maratonas, meias maratonas, trail e ultra trail em Portugal — datas, locais e distâncias.',
    images: [{ url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&q=80', width: 1200, height: 630 }],
  },
}

export default function CalendarioPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Calendário de Provas de Corrida e Trail em Portugal',
    description: 'Maratonas, meias maratonas, trail e ultra trail em Portugal — datas, locais e distâncias.',
    url: `${SITE_URL}/calendario`,
    inLanguage: 'pt-PT',
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Calendário', item: `${SITE_URL}/calendario` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <CalendarioClient />
    </>
  )
}
