import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ variable: '--font-geist-sans', subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Performance Running — Treino de Corrida, Trail e Atletismo',
    template: '%s | Performance Running',
  },
  description:
    'Metodologias científicas de treino para corredores de todos os níveis. 5km, 10km, Maratona, Trail Running e Corrida de Montanha. Coaching online com treinador especializado.',
  keywords: [
    'corrida', 'treino de corrida', 'trail running', 'atletismo', 'maratona',
    'meia maratona', 'planos de treino', 'coaching online', 'performance running',
    'corrida de montanha', 'VO2max', 'periodização',
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-brand-dark text-white`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
