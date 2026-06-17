import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react'
import { getArticleBySlug, getAllSlugs } from '@/lib/articles'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-brand-gray to-brand-dark">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-brand-text hover:text-brand-green transition-colors mb-8"
          >
            <ArrowLeft size={13} />
            Voltar ao Blog
          </Link>

          {/* Category */}
          <div className="mb-4">
            <span className="inline-block px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wider text-brand-green border border-brand-green/30 bg-brand-green/10">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-5">
            {article.title}
          </h1>

          <p className="text-brand-text text-base leading-relaxed mb-6 max-w-2xl">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-text">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {article.readTime} min de leitura
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={12} />
              {article.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-brand-text hover:text-brand-green transition-colors"
          >
            <ArrowLeft size={14} />
            Ver todos os artigos
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green text-black font-bold rounded-md hover:bg-brand-green/90 transition-all text-sm"
          >
            Coaching Online →
          </Link>
        </div>
      </article>
    </div>
  )
}
