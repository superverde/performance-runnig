import { redirect } from 'next/navigation'

// Redirecionar /planos para /consulta
export default function PlanosPage() {
  redirect('/consulta')
}
