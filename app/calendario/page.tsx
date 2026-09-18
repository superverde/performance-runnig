import type { Metadata } from 'next'
import { CalendarioClient } from './CalendarioClient'
import { provasFuturas } from '@/lib/provas'

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

  // Pedido do Pedro (2026-09-18, via auditoria de CTR de 2026-08-26): /calendario
  // era a única página de listagem sem schema Event, o que a deixa fora dos
  // rich results de eventos do Google (as outras já tinham Organization/
  // WebSite/CollectionPage/BreadcrumbList). Espelha exatamente o que a
  // CalendarioClient mostra por omissão (provasFuturas() == mesmo filtro
  // "mostrarTodas=false" do cliente) para o schema nunca descrever provas
  // que não estão visíveis na página.
  const eventsLd = provasFuturas().map((prova) => ({
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: prova.nome,
    startDate: prova.dataInicio,
    ...(prova.dataFim ? { endDate: prova.dataFim } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: prova.local,
      address: {
        '@type': 'PostalAddress',
        addressLocality: prova.local,
        addressRegion: prova.regiao,
        addressCountry: 'PT',
      },
    },
    description: prova.desc,
    url: prova.link || `${SITE_URL}/calendario`,
    sport: 'Running',
  }))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsLd) }} />
      <CalendarioClient />
    </>
  )
}
