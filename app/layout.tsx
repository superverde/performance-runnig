import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { ScrollReveal } from '@/components/ScrollReveal'

const inter = Inter({ variable: '--font-geist-sans', subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const barlowCondensed = Barlow_Condensed({
  variable: '--font-display',
  weight: ['700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const SITE_URL = 'https://www.performancerunning.pt'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Performance Running — Treino de Corrida, Trail e Atletismo',
    template: '%s | Performance Running',
  },
  description:
    'A maior base de conhecimento científico sobre corrida em português. Fisiologia, treino, nutrição, biomecânica, trail running e prevenção de lesões — 3 novos artigos científicos todos os dias, totalmente gratuito.',
  keywords: [
    'corrida', 'treino de corrida', 'trail running', 'atletismo', 'maratona portuguesa',
    'meia maratona', 'treino maratona', 'performance running', 'fisiologia do exercício',
    'corrida de montanha', 'VO2max', 'periodização treino', 'nutrição corrida',
    'biomecânica corrida', 'prevenção lesões corrida', 'plano treino corrida',
    'ultra trail', 'corrida 5km', 'corrida 10km', 'limiar de lactato',
  ],
  authors: [{ name: 'Performance Running' }],
  creator: 'Performance Running',
  publisher: 'Performance Running',
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: SITE_URL,
    siteName: 'Performance Running',
    title: 'Performance Running — Treino de Corrida, Trail e Atletismo',
    description:
      'A maior base de conhecimento científico sobre corrida em português. Fisiologia, treino, nutrição e biomecânica — 3 artigos novos todos os dias.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Performance Running — Corrida e Trail Running',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Performance Running',
    description: 'Ciência aplicada à corrida. Trail, maratona, atletismo. 3 artigos por dia.',
    images: ['https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: 'MVoRpGQYV_atkt-Qov_tf6NVxN4TRmRmKWLD2P1Yrss',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${barlowCondensed.variable} antialiased bg-brand-dark text-white`}>
        <ScrollReveal />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
