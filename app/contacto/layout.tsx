import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Entra em contacto para coaching online personalizado em corrida, trail running e atletismo. Primeira conversa gratuita.',
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
