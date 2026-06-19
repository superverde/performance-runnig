import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react'
import { getArticleBySlug, getAllSlugs } from '@/lib/articles'
import { ViewCounter } from '@/components/ViewCounter'

const SITE_URL = 'https://www.performancerunning.pt'

/* OG image per category — same mapping as ArticleCard */
const categoryOgImages: Record<string, string> = {
  'Treino':       'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80',
  'Fisiologia':   'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&q=80',
  'Biomecânica':  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80',
  'Nutrição':     'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
  'Recuperação':  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
  'Psicologia':   'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80',
  'Trail Running':'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=1200&q=80',
  'Lesões':       'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=1200&q=80',
  'VO2max':       'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80',
}
const defaultOgImage = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) return {}

  const ogImage = categoryOgImages[article.category] ?? defaultOgImage
  const canonicalUrl = `${SITE_URL}/blog/${params.slug}`

  return {
    title: article.title,
    description: article.excerpt,
    keywords: [
      'corrida', article.category.toLowerCase(), 'treino de corrida',
      'performance running', 'fisiologia corrida', 'trail running',
    ],
    authors: [{ name: 'Performance Running' }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      section: article.category,
      url: canonicalUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
    alternates: { canonical: canonicalUrl },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  const ogImage = categoryOgImages[article.category] ?? defaultOgImage
  const canonicalUrl = `${SITE_URL}/blog/${params.slug}`

  /* JSON-LD structured data — improves indexation on Google */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: ogImage,
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Organization', name: 'Performance Running', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Performance Running',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    articleSection: article.category,
    inLanguage: 'pt-PT',
    keywords: `corrida, ${article.category}, treino, performance running`,
  }

  return (
    <div className="min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero banner ── */}
      <div
        className="relative pt-24 pb-14 overflow-hidden"
        style={{
          backgroundImage: `url(${ogImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[11px] text-white/40 hover:text-brand-green transition-colors mb-8 font-mono uppercase tracking-widest"
          >
            <ArrowLeft size={12} />
            Arquivo
          </Link>

          {/* Category badge */}
          <div className="mb-4">
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-green border border-brand-green/25 bg-brand-green/10">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-5 text-white">
            {article.title}
          </h1>

          <p className="text-white/55 text-base leading-relaxed mb-7 max-w-2xl">
            {article.excerpt}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/35 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              {article.readTime} min de leitura
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={11} />
              {article.category}
            </span>
            <ViewCounter slug={params.slug} />
          </div>
        </div>
      </div>

      {/* ── Article content ── */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Bottom nav */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-brand-green transition-colors font-medium"
          >
            <ArrowLeft size={13} />
            Ver todos os artigos
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green text-black font-black rounded-full hover:bg-white transition-all text-sm"
          >
            Mais artigos →
          </Link>
        </div>
      </article>
    </div>
  )
}
