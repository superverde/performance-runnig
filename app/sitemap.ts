import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'

const SITE_URL = 'https://www.performancerunning.pt'

const MODALIDADES_SLUGS = [
  'maratona', 'meia-maratona', '10km', '5km',
  'trail-running', 'ultra-trail', 'corrida-montanha', 'meio-fundo',
]

const BLOG_CATEGORIAS = [
  'treino', 'fisiologia', 'nutricao', 'biomecanica',
  'recuperacao', 'psicologia', 'trail-running', 'lesoes', 'vo2max',
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

  const categoriaUrls: MetadataRoute.Sitemap = 