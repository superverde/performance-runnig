import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'

// Mesma razao do app/blog/page.tsx: sem isto, o sitemap fica congelado com os
// artigos que existiam no ultimo build/deploy em vez de refletir os artigos
// publicados diariamente pelo GitHub Action.
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.performancerunning.pt'

const MODALIDADES_SLUGS = [
  'maratona', 'meia-maratona', '10km', '5km',
  'trail-running', 'ultra-trail', 'corrida-montanha', 'meio-fundo',
]

const BLOG_CATEGORIAS = [
  'treino', 'fisiologia', 'nutricao', 'biomecanica',
  'recuperacao', 'psicologia', 'trail-running', 'lesoes', 'vo2max',
  'equipamento',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: article.rawDate ? new Date(article.rawDate) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const modalidadesUrls: MetadataRoute.Sitemap = MODALIDADES_SLUGS.map((slug) => ({
    url: `${SITE_URL}/modalidades/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const categoriaUrls: MetadataRoute.Sitemap = BLOG_CATEGORIAS.map((cat) => ({
    url: `${SITE_URL}/blog/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/modalidades`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/metodologias`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/patrocinios`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/equipamento`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/calendario`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ferramentas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ferramentas/idade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/ferramentas/comparador-sapatilhas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/consulta`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...modalidadesUrls,
    ...categoriaUrls,
    ...articleUrls,
  ]
}
