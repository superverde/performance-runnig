import type { Metadata } from 'next'
import { AgeGradingClient } from './AgeGradingClient'

export const metadata: Metadata = {
  title: 'Calculadora de Classificação por Idade (Age Grading) — Corrida',
  description:
    'Calcula o teu age grading — a percentagem da tua performance face ao recorde do mundo ajustado à idade e sexo. Compara resultados entre 5km, 10km, meia maratona e maratona.',
  keywords: [
    'age grading', 'classificação por idade corrida', 'tabela idade corrida',
    'age grade calculator', 'age grading maratona', 'performance por idade corredor',
  ],
  alternates: { canonical: 'https://www.performancerunning.pt/ferramentas/idade' },
}

export default function AgeGradingPage() {
  return <AgeGradingClient />
}
