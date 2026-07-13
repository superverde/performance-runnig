import type { Metadata } from 'next'
import { ZonasFcClient } from './ZonasFcClient'

export const metadata: Metadata = {
  title: 'Calculadora de Zonas de Frequência Cardíaca — Corrida',
  description:
    'Calcula as tuas 5 zonas de frequência cardíaca para treino de corrida — pelo método de Karvonen (FC de reserva) e por percentagem da FC máxima. Grátis.',
  keywords: [
    'zonas de frequência cardíaca', 'zonas de treino corrida', 'método karvonen',
    'frequência cardíaca máxima', 'zona 2 corrida', 'fc reserva', 'calculadora zonas fc',
  ],
  alternates: { canonical: 'https://www.performancerunning.pt/ferramentas/zonas-fc' },
}

export default function ZonasFcPage() {
  return <ZonasFcClient />
}
