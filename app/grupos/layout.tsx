import type { Metadata } from 'next'

// Página interna de apoio à divulgação — não deve ser indexada.
export const metadata: Metadata = {
  title: 'Grupos',
  robots: { index: false, follow: false },
}

export default function GruposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
