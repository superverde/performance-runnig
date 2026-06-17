import Link from 'next/link'
import { Clock, Tag } from 'lucide-react'
import type { ArticleMeta } from '@/lib/articles'

interface Props {
  article: ArticleMeta
}

export function ArticleCard({ article }: Props) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col rounded-lg border border-brand-border bg-brand-muted overflow-hidden hover:border-brand-green/40 transition-all"
    >
      {/* Cover placeholder */}
      <div className="h-36 bg-gradient-to-br from-brand-gray to-brand-dark flex items-end p-4">
        <span className="text-xs font-mono text-brand-green/80 font-semibold uppercase tracking-wider">
          {article.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-brand-text text-xs leading-relaxed mb-4 line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-brand-text">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {article.readTime} min
          </span>
          <span className="flex items-center gap-1">
            <Tag size={11} />
            {article.date}
          </span>
        </div>
      </div>
    </Link>
  )
}
