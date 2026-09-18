/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Wildcard porque `coverImage` nos artigos (content/blog/*.md) é um
      // campo livre no frontmatter — pode apontar para qualquer host, não só
      // Unsplash ou o próprio domínio (pool-images). Sem isto, o next/image
      // rebenta em runtime ("hostname not configured") em qualquer artigo
      // cujo coverImage não esteja explicitamente listado aqui.
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
