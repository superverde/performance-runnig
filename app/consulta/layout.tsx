import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consulta Gratuita de Treino',
  description:
    'Faz perguntas sobre treino de corrida, fisiologia, nutrição e prevenção de lesões e recebe respostas baseadas em ciência — gratuito.',
  alternates: { canonical: 'https://www.performancerunning.pt/consulta' },
}

export default function ConsultaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
