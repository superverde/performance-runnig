import type { Metadata } from 'next'
import { ComparadorClient } from './ComparadorClient'

export const metadata: Metadata = {
  title: 'Comparador de Sapatilhas de Corrida — Estrada, Trail e Competição',
  description:
    'Compara sapatilhas de corrida lado a lado — HOKA, Nike, ASICS, On, Salomon e mais. Preços, prós, contras e recomendação por tipo de corredor.',
  keywords: [
    'comparador sapatilhas corrida', 'melhor sapatilha corrida', 'hoka vs asics',
    'nike vaporfly vs alphafly', 'sapatilhas trail running', 'sapatilhas competição maratona',
  ],
  alternates: { canonical: 'https://www.performancerunning.pt/ferramentas/comparador-sapatilhas' },
}

export default function ComparadorSapatilhasPage() {
  return <ComparadorClient />
}
