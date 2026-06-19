import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ArticleMeta } from '@/lib/articles'

const categoryColors: Record<string, string> = {
  'VO2max':       'bg-purple-500/15 text-purple-400 border-purple-500/20',
  'Treino':       'bg-brand-green/10 text-brand-green border-brand-green/20',
  'Biomecânica':  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Recuperação':  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Nutrição':     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Psicologia':   'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Lesões':       'bg-red-500/10 text-red-400 border-red-500/20',
}

const categoryGradients: Record<string, string> = {
  'VO2max':       'from-purple-900/40',
  'Treino':       'from-emerald-900/40',
  'Biomecânica':  'from-blue-900/40',
  'Recuperação':  'from-orange-900/40',
  'Nutrição':     'from-yellow-900/40',
  'Psicologia':   'from-pink-900/40',
  'Lesões':       'from-red-900/40',
}

interface Props {
  article: ArticleMeta
}

export function ArticleCard({ article }: Props) {
  const colorClass = categoryColors[article.category] ?? 'bg-white/5 text-white/50 border-white/10'
  const gradientClass = categoryGradients[article.category] ?? 'from-white/5'

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-white/5 hover:border-brand-green/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all card-hover"
    >
      {/* Cover */}
      <div className={`relative h-44 bg-gradient-to-br ${gradientClass} to-brand-dark flex items-end p-5`}>
        <ArrowUpRight
          size={18}
          className="absolute top-4 right-4 text-white/10 group-hover:text-brand-green transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-black text-white text-sm leading-snug mb-2.5 group-hover:text-brand-green transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-white/25 text-[10px] font-mono uppercase tracking-wider">
            {article.readTime} min leitura
          </span>
          <span className="text-white/25 text-[10px] font-mono">
            {article.date}
          </span>
        </div>
      </div>
    </Link>
  )
}
