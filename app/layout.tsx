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

export const metadata: Metadata = {
  title: {
    default: 'Performance Running — Treino de Corrida, Trail e Atletismo',
    template: '%s | Performance Running',
  },
  description:
    'A maior base de conhecimento científico sobre corrida em português. Artigos sobre fisiologia, treino, nutrição, biomecânica e trail running — 3 novos artigos todos os dias, totalmente gratuito.',
  keywords: [
    'corrida', 'treino de corrida', 'trail running', 'atletismo', 'maratona',
    'meia maratona', 'treino maratona', 'performance running', 'fisiologia corrida',
    'corrida de montanha', 'VO2max', 'periodização', 'nutrição corrida', 'biomecânica corrida',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    siteName: 'Performance Running',
  },
  robots: { index: true, follow: true },
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
