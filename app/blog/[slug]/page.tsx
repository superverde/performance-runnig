import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Tag, Calendar } from 'lucide-react'
import { getArticleBySlug, getAllSlugs, getAllArticles } from '@/lib/articles'
import { ViewCounter } from '@/components/ViewCounter'
import { BlogClient } from '@/components/BlogClient'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { ArticleContent } from '@/components/ArticleContent'

const SITE_URL = 'https://www.performancerunning.pt'

// Imagens locais em public/pool-images/ (ver lib/images.ts) — antes apontavam
// para images.unsplash.com, que pode remover fotos sem aviso (ver
// [[project_imagens_unsplash_ids_mortos]]). Uma cópia local elimina essa
// dependência.
const poolImg = (id: string) => `${SITE_URL}/pool-images/${id}.jpg`

/* ── CATEGORY MAP ─────────────────────────────────────────────────── */
const CATEGORIAS: Record<string, { label: string; description: string; hero: string }> = {
  treino: {
    label: 'Treino',
    description: 'Metodologias científicas de treino para corrida — periodização, zonas de intensidade, volume semanal e tipos de sessão para todos os níveis.',
    hero: poolImg('photo-1571019614242-c5c5dee9f50b'),
  },
  fisiologia: {
    label: 'Fisiologia',
    description: 'Fisiologia do exercício aplicada à corrida — VO2max, limiar anaeróbico, adaptações cardiovasculares e metabolismo energético.',
    hero: poolImg('photo-1727094141271-9bea5bc8c757'),
  },
  nutricao: {
    label: 'Nutrição',
    description: 'Nutrição desportiva para corredores — estratégias de hidratação, carboidratos, proteína e suplementação baseadas em evidência científica.',
    hero: poolImg('photo-1490645935967-10de6ba17061'),
  },
  biomecanica: {
    label: 'Biomecânica',
    description: 'Biomecânica da corrida — técnica de passada, economia de corrida, cadência, apoio e como correr de forma mais eficiente e segura.',
    hero: poolImg('photo-1476480862126-209bfaa8edc8'),
  },
  recuperacao: {
    label: 'Recuperação',
    description: 'Recuperação desportiva baseada em ciência — sono, nutrição pós-treino, terapias de recuperação e gestão da fadiga para corredores.',
    hero: poolImg('photo-1544367567-0f2fcb009e0b'),
  },
  psicologia: {
    label: 'Psicologia',
    description: 'Psicologia desportiva para corredores — mentalidade de performance, gestão da dor, motivação e estratégias cognitivas em prova.',
    hero: poolImg('photo-1552674605-db6ffd4facb5'),
  },
  'trail-running': {
    label: 'Trail Running',
    description: 'Tudo sobre trail running — técnica de montanha, preparação para provas de trail, equipamento e gestão de desnível.',
    hero: poolImg('photo-1504025468847-0e438279542c'),
  },
  lesoes: {
    label: 'Lesões',
    description: 'Prevenção e tratamento de lesões em corredores — causas, recuperação, exercícios de reforço e regresso ao treino baseados em evidência.',
    hero: poolImg('photo-1562771379-eafdca7a02f8'),
  },
  vo2max: {
    label: 'VO2max',
    description: 'VO2max — o que é, como se mede, como melhorar e qual a sua relação com a performance em corrida de fundo e trail running.',
    hero: poolImg('photo-1541534741688-6078c6bfb5c5'),
  },
  equipamento: {
    label: 'Equipamento',
    description: 'Guias de compra e comparativos de equipamento de corrida — sapatilhas, relógios GPS, mochilas de trail e acessórios testados e analisados.',
    hero: poolImg('photo-1595950653106-6c9ebd614d3a'),
  },
}

/* OG image per category */
const categoryOgImages: Record<string, string> = {
  'Treino':        poolImg('photo-1571019614242-c5c5dee9f50b'),
  'Fisiologia':    poolImg('photo-1727094141271-9bea5bc8c757'),
  'Biomecânica':   poolImg('photo-1476480862126-209bfaa8edc8'),
  'Nutrição':      poolImg('photo-1490645935967-10de6ba17061'),
  'Recuperação':   poolImg('photo-1544367567-0f2fcb009e0b'),
  'Psicologia':    poolImg('photo-1552674605-db6ffd4facb5'),
  'Trail Running': poolImg('photo-1504025468847-0e438279542c'),
  'Lesões':        poolImg('photo-1562771379-eafdca7a02f8'),
  'VO2max':        poolImg('photo-1541534741688-6078c6bfb5c5'),
  'Equipamento':   poolImg('photo-1595950653106-6c9ebd614d3a'),
}
const defaultOgImage = poolImg('photo-1571008887538-b36bb32f4571')

interface Props {
  params: { slug: string }
}

/* ── STATIC PARAMS — article slugs + category slugs ──────────────── */
export async function generateStaticParams() {
  const articleSlugs = getAllSlugs().map((slug) => ({ slug }))
  const categorySlugs = Object.keys(CATEGORIAS).map((cat) => ({ slug: cat }))
  return [...articleSlugs, ...categorySlugs]
}

/* ── METADATA ─────────────────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Category page?
  const cat = CATEGORIAS[params.slug]
  if (cat) {
    return {
      title: `Artigos de ${cat.label} | Performance Running`,
      description: cat.description,
      openGraph: {
        title: `${cat.label} — Base de Conhecimento Científico`,
        description: cat.description,
        images: [{ url: cat.hero, width: 1200, height: 630 }],
      },
      alternates: { canonical: `${SITE_URL}/blog/${params.slug}` },
    }
  }

  // Article page
  const article = await getArticleBySlug(params.slug)
  if (!article) return {}

  const ogImage = categoryOgImages[article.category] ?? defaultOgImage
  const canonicalUrl = `${SITE_URL}/blog/${params.slug}`

  return {
    title: article.title,
    description: article.excerpt,
    keywords: ['corrida', article.category.toLowerCase(), 'treino de corrida', 'performance running', 'fisiologia corrida'],
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

/* ── PAGE COMPONENT ───────────────────────────────────────────────── */
export default async function BlogSlugPage({ params }: Props) {
  // ── CATEGORY PAGE ──────────────────────────────────────────────────
  const cat = CATEGORIAS[params.slug]
  if (cat) {
    const allArticles = getAllArticles()
    const categoryArticles = allArticles.filter(
      (a) =>
        a.category.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-') === params.slug ||
        a.category.toLowerCase() === cat.label.toLowerCase()
    )

    const catUrl = `${SITE_URL}/blog/${params.slug}`
    const catBreadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Arquivo', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: cat.label, item: catUrl },
      ],
    }
    const collectionLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${cat.label} — Performance Running`,
      description: cat.description,
      url: catUrl,
      inLanguage: 'pt-PT',
      numberOfItems: categoryArticles.length,
      hasPart: categoryArticles.slice(0, 10).map((a) => ({
        '@type': 'Article',
        headline: a.title,
        url: `${SITE_URL}/blog/${a.slug}`,
        datePublished: a.date,
      })),
    }

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catBreadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
        <BlogClient
          articles={categoryArticles}
          initialCategory={cat.label}
          heroTitle={cat.label}
          heroDescription={cat.description}
          heroBg={cat.hero}
        />
      </>
    )
  }

  // ── ARTICLE PAGE ───────────────────────────────────────────────────
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  const related = getAllArticles()
    .filter((a) => a.category === article.category && a.slug !== params.slug)
    .slice(0, 3)

  const ogImage = categoryOgImages[article.category] ?? defaultOgImage
  const canonicalUrl = `${SITE_URL}/blog/${params.slug}`

  const categorySlug = article.category
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')

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
    keywords: `corrida, ${article.category}, treino, performance running, corrida portugal`,
    wordCount: article.content.replace(/<[^>]+>/g, '').split(/\s+/).length,
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Arquivo', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: article.category, item: `${SITE_URL}/blog/${categorySlug}` },
      { '@type': 'ListItem', position: 4, name: article.title, item: canonicalUrl },
    ],
  }

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* ── Hero banner ── */}
      <div
        className="relative pt-24 pb-14 overflow-hidden"
        style={{ backgroundImage: `url(${ogImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-white/50 font-mono uppercase tracking-widest mb-8 flex-wrap">
            <Link href="/" className="hover:text-brand-green transition-colors">Início</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-brand-green transition-colors">Arquivo</Link>
            <span>/</span>
            <Link href={`/blog/${categorySlug}`} className="hover:text-brand-green transition-colors">{article.category}</Link>
            <span>/</span>
            <span className="text-white/50 truncate max-w-[200px]">{article.title}</span>
          </nav>
          <div className="mb-4">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brand-green border border-brand-green/25 bg-brand-green/10">
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-5 text-white">
            {article.title}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-7 max-w-2xl">{article.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/55 font-mono">
            <span className="flex items-center gap-1.5"><Calendar size={11} />{article.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={11} />{article.readTime} min de leitura</span>
            <span className="flex items-center gap-1.5"><Tag size={11} />{article.category}</span>
            <ViewCounter slug={params.slug} />
          </div>
        </div>
      </div>

      {/* ── Article content ── */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
        <ArticleContent
          slug={params.slug}
          originalContent={article.content}
          originalTitle={article.title}
          originalExcerpt={article.excerpt}
        />
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-brand-green transition-colors font-medium">
            <ArrowLeft size={13} /> Ver todos os artigos
          </Link>
          <Link href={`/blog/${categorySlug}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green text-black font-black rounded-full hover:bg-white transition-all text-sm">
            Mais sobre {article.category} →
          </Link>
        </div>

        {/* ── Links internos SEO ── */}
        <div className="mt-10 p-5 rounded-xl border border-white/6 bg-white/[0.015]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-3">Explorar mais</p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/blog/${categorySlug}`}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:border-brand-green/40 hover:text-brand-green transition-all">
              Arquivo · {article.category}
            </Link>
            <Link href="/metodologias"
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:border-brand-green/40 hover:text-brand-green transition-all">
              Metodologias de Treino
            </Link>
            <Link href="/consulta"
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:border-brand-green/40 hover:text-brand-green transition-all">
              Consulta Gratuita com IA
            </Link>
            <Link href="/blog"
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:border-brand-green/40 hover:text-brand-green transition-all">
              Todos os Artigos
            </Link>
          </div>
        </div>
      </article>

      {/* ── Newsletter ── */}
      <section className="border-t border-white/5 bg-[#0a0a0a]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <NewsletterSignup variant="inline" />
        </div>
      </section>

      {/* ── Artigos relacionados ── */}
      {related.length > 0 && (
        <section className="border-t border-white/5 bg-[#080808]">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-brand-green text-xs font-mono font-bold tracking-[0.25em] uppercase mb-1">Continua a ler</p>
                <h2 className="font-display text-white text-3xl leading-none">MAIS EM {article.category.toUpperCase()}</h2>
              </div>
              <Link
                href={`/blog/${article.category.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')}`}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-white/50 hover:text-brand-green transition-colors uppercase tracking-widest"
              >
                Ver todos <ArrowRight size={10} />
              </Link>
            </div>
            <div className="space-y-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-white/5 hover:border-brand-green/20 bg-white/[0.01] hover:bg-brand-green/[0.03] transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono font-bold text-brand-green/60 uppercase tracking-wider block mb-1">
                      {rel.category} · {rel.readTime} min
                    </span>
                    <h3 className="text-sm font-bold text-white/75 group-hover:text-white transition-colors leading-snug line-clamp-2">{rel.title}</h3>
                  </div>
                  <ArrowRight size={14} className="text-white/20 group-hover:text-brand-green transition-colors shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
