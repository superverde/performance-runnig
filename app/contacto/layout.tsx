import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sugerir Tema',
  description:
    'Sugere um tema sobre corrida, fisiologia ou treino para ser abordado num artigo científico no Performance Running.',
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
