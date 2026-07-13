import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.performancerunning.pt'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/grupos'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
