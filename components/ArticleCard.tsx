import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { ArticleMeta } from '@/lib/articles'

/* ── Multiple curated photos per category — selected by slug hash to avoid repetition ── */
const categoryPhotos: Record<string, string[]> = {
  'Treino': [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&q=75', // runner road
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=700&q=75', // track athletes
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=700&q=75', // running silhouette
    'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=700&q=75', // runner city
    'https://images.unsplash.com/photo-1486218119243-13301ef4b7b2?w=700&q=75', // runner track
    'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=700&q=75', // runner sunset
  ],
  'Fisiologia': [
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&q=75', // heart/medical
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=700&q=75', // lab/science
    'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=700&q=75', // athlete fitness
    'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=700&q=75', // runner breathing
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=75', // treadmill test
  ],
  'Biomecânica': [
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=700&q=75', // track sprint
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=700&q=75', // running form
    'https://images.unsplash.com/photo-1524646349956-1590eacfa324?w=700&q=75', // runner detail
    'https://images.unsplash.com/photo-1567598508481-65985588e295?w=700&q=75', // shoe/foot strike
  ],
  'Nutrição': [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700&q=75', // healthy food
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=75', // energy gel
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&q=75', // sports nutrition
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=75', // meal prep
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=75', // vegetables bowl
  ],
  'Recuperação': [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&q=75', // foam roller
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=75', // sleep recovery
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=75', // stretching outdoor
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&q=75', // physiotherapy
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=700&q=75', // massage/recovery
  ],
  'Psicologia': [
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=75', // runner focus
    'https://images.unsplash.com/photo-1529516548873-9ce57c8f155e?w=700&q=75', // lone runner
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=75', // runner mountains
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=75', // zen/meditation
  ],
  'Trail Running': [
    'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=700&q=75', // trail mountain
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&q=75', // trail pack
    'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=700&q=75', // mountain trail
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=75', // trail running
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=75', // mountain running
  ],
  'Lesões': [
    'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=700&q=75', // knee injury
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=75', // medical/sports
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&q=75', // medical care
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=700&q=75', // physiotherapy
  ],
  'VO2max': [
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=700&q=75', // runner track
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=75', // treadmill test
    'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=700&q=75', // athlete effort
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&q=75', // sprint effort
  ],
}

/* ── Simple hash to pick a consistent image per slug ── */
function hashSlug(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0
  }
  return h
}

function getPhoto(category: string, slug: string): string {
  const photos = categoryPhotos[category] ?? categoryPhotos['Treino']
  return photos[hashSlug(slug) % photos.length]
}

const defaultPhoto = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=700&q=75'

const categoryAccent: Record<string, string> = {
  'Treino':       '#00C896',
  'Fisiologia':   '#6366f1',
  'Biomecânica':  '#3b82f6',
  'Nutrição':     '#f59e0b',
  'Recuperação':  '#f97316',
  'Psicologia':   '#ec4899',
  'Trail Running':'#22c55e',
  'Lesões':       '#ef4444',
  'VO2max':       '#8b5cf6',
}

const defaultPhoto = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=700&q=75'

interface Props {
  article: ArticleMeta
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: Props) {
  const photo = article.coverImage ?? getPhoto(article.category, article.slug)
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
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
          <p className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-white/35 text-[11px] font-mono">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
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
        <div className="flex items-center gap-2 text-white/35 text-[10px] font-mono">
          <Clock size={10} />
          <span>{article.readTime} min</span>
          <span className="text-white/15">·</span>
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  )
}
