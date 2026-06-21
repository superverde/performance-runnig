import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-brand-green text-xs font-mono font-bold tracking-widest uppercase mb-4">
          404
        </p>
        <h1 className="text-5xl font-black mb-4">Página não encontrada</h1>
        <p className="text-brand-text mb-8 max-w-sm mx-auto">
          A página que procuras não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-black font-bold rounded-md hover:bg-brand-green/90 transition-all"
        >
          <ArrowLeft size={15} />
          Voltar ao Início
        </Link>
      </div>
    </div>
  )
}
