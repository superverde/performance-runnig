import type { Metadata } from 'next'
import { SplitsClient } from './SplitsClient'

export const metadata: Metadata = {
  title: 'Tabela de Passagens por Km (Splits) — 5km, 10km, Meia e Maratona',
  description:
    'Gera a tua tabela de passagens km a km para qualquer tempo alvo — 5 km, 10 km, meia maratona ou maratona, com estratégia uniforme ou negative split. Grátis.',
  keywords: [
    'tabela de passagens maratona', 'splits por km', 'ritmo por km maratona',
    'tempos de passagem 10km', 'negative split', 'pace prova', 'tabela ritmos corrida',
  ],
  alternates: { canonical: 'https://www.performancerunning.pt/ferramentas/splits' },
}

export default function SplitsPage() {
  return <SplitsClient />
}
