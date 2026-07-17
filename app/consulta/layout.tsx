import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Treinador de Corrida Online Grátis — Tira Dúvidas 24/7',
  description:
    'Pergunta sobre treino, lesões, nutrição ou preparação de maratona e recebe resposta imediata baseada em ciência. Sem registo, sem custos, disponível 24/7.',
  alternates: { canonical: 'https://www.performancerunning.pt/consulta' },
}

export default function ConsultaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
