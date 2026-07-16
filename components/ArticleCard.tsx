import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { ArticleMeta } from '@/lib/articles'
import { pickCategoryImage } from '@/lib/images'

/**
 * Cor de destaque por categoria — antes eram 8 cores à parte da marca
 * (índigo, âmbar, laranja, rosa, roxo...), o que dava ao arquivo um ar de
 * painel de gestão de conteúdo genérico em vez de uma marca premium de
 * cor única. Agora só usamos tons dentro da paleta oficial (verde e azul
 * profundo, tailwind.config.ts) mais um único acento quente reservado
 * para "Lesões" (o único caso em que um tom de alerta faz sentido
 * semântico — prevenção/cuidado).
 */
const categoryAccent: Record<string, string> = {
  'Treino':        '#00C896', // brand green
  'Nutrição':      '#00C896', // brand green
  'Trail Running': '#00A87D', // brand green, tom mais escuro/natureza
  'Fisiologia':     '#0066FF', // brand blue
  'Biomecânica':    '#0066FF', // brand blue
  'VO2max':         '#3D8BFF', // brand blue, tom mais claro
  'Recuperação':    '#A0A0A0', // cinza neutro da marca
  'Psicologia':     '#A0A0A0', // cinza neutro da marca
  'Lesões':         '#F5A623', // único acento quente, reservado para alerta/cuidado
}

interface Props {
  article: ArticleMeta
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: Props) {
  const photo = article.coverImage ?? pickCategoryImage(article.category, article.slug, 700)
  const accent = categoryAccent[article.category] ?? '#00C896'

  if (featured) {
    return (
      <Link
        href={`/blog/${article.slug}`}
        className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/5 hover:border-white/10 transition-all card-hover"
        style={{ minHeight: '420px' }}
      >
        {/* Photo */}
        <div
          className="absolute inset-0 photo-card-img"
          style={{
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Deep gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30" />
        {/* Subtle tint from accent */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{ background: accent }}
        />

        {/* Arrow */}
        <ArrowUpRight
          size={20}
          className="absolute top-5 right-5 text-white/0 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />

        {/* Category */}
        <span
          className="absolute top-5 left-5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20 text-white"
          style={{ background: `${accent}22` }}
        >
          {article.category}
        </span>

        {/* Content */}
        <div className="relative p-6 sm:p-8">
          <h3 className="font-black text-white text-xl sm:text-2xl leading-snug mb-3 group-hover:text-brand-green transition-colors">
            {article.title}
          </h3>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-white/60 text-xs font-mono">
            <Clock size={11} />
            <span>{article.readTime} min leitura</span>
            <span className="text-white/15">·</span>
            <span>{article.date}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/5 hover:border-white/10 transition-all card-hover aspect-[4/3]"
    >
      {/* Photo */}
      <div
        className="absolute inset-0 photo-card-img"
        style={{
          backgroundImage: `url(${photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/10" />
      {/* Hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ background: accent }}
      />

      {/* Arrow */}
      <ArrowUpRight
        size={16}
        className="absolute top-4 right-4 text-white/0 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />

      {/* Category */}
      <span
        className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/15 text-white/90"
        style={{ background: `${accent}20` }}
      >
        {article.category}
      </span>

      {/* Content */}
      <div className="relative p-4 sm:p-5">
        <h3 className="font-black text-white text-sm leading-snug mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-white/60 text-xs font-mono">
          <Clock size={10} />
          <span>{article.readTime} min</span>
          <span className="text-white/15">·</span>
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  )
}
