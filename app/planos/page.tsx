import { redirect } from 'next/navigation'

// Página de planos removida — o site é gratuito e de acesso livre
export default function PlanosPage() {
  redirect('/blog')
}
