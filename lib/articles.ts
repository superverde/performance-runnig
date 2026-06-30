import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'blog')

export interface ArticleMeta {
  slug: string
  title: string
  excerpt: string
  date: string      // formatted: "19 de junho de 2026"
  rawDate: string   // ISO: "2026-06-19" — use for sitemap / sort
  category: string
  readTime: number
  coverImage?: string
}

export interface Article extends ArticleMeta {
  content: string // HTML
}

/** Ensure the directory exists before reading */
function ensureDir() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true })
  }
}

/** Parse a single .md file and return ArticleMeta */
function parseMeta(slug: string): ArticleMeta | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  const wordCount = content.split(/\s+/).length
  // Respect frontmatter readTime; fallback to word-count estimate
  const readTime = data.readTime ?? Math.max(1, Math.round(wordCount / 200))

  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? content.slice(0, 160).replace(/[#*_]/g, '') + '…',
    rawDate: data.date ?? '',
    date: data.date
      ? format(new Date(data.date), "d 'de' MMMM 'de' yyyy", { locale: pt })
      : '',
    category: data.category ?? 'Treino',
    readTime,
    coverImage: data.coverImage,
  }
}

/** Get all articles sorted by date descending */
// Cache em memória — evita ler todos os ficheiros a cada request
// A instância serverless fica warm 5-15 min; artigos novos aparecem no próximo cold start
let _articlesCache: { data: ArticleMeta[]; ts: number } | null = null
const ARTICLES_CACHE_TTL = 60_000 // 60 segundos

export function getAllArticles(): ArticleMeta[] {
  if (_articlesCache && Date.now() - _articlesCache.ts < ARTICLES_CACHE_TTL) {
    return _articlesCache.data
  }

  ensureDir()
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'))
  const articles = files
    .map((f) => parseMeta(f.replace(/\.md$/, '')))
    .filter((a): a is ArticleMeta => a !== null)

  const sorted = articles.sort((a, b) => {
    const rawA = matter(fs.readFileSync(path.join(ARTICLES_DIR, `${a.slug}.md`), 'utf8')).data.date
    const rawB = matter(fs.readFileSync(path.join(ARTICLES_DIR, `${b.slug}.md`), 'utf8')).data.date
    return new Date(rawB).getTime() - new Date(rawA).getTime()
  })

  _articlesCache = { data: sorted, ts: Date.now() }
  return sorted
}

/** Get the N most recent articles */
export async function getLatestArticles(n: number): Promise<ArticleMeta[]> {
  return getAllArticles().slice(0, n)
}

/** Get articles published today (ISO date match) */
export function getTodayArticles(): ArticleMeta[] {
  const today = new Date().toISOString().slice(0, 10) // "2026-06-20"
  return getAllArticles().filter((a) => a.rawDate === today)
}

/** Get full article (with parsed HTML content) by slug */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content: mdContent } = matter(raw)

  const processed = await remark().use(remarkHtml, { sanitize: false }).process(mdContent)
  const htmlContent = processed.toString()

  const wordCount = mdContent.split(/\s+/).length
  // Respect frontmatter readTime; fallback to word-count estimate
  const readTime = data.readTime ?? Math.max(1, Math.round(wordCount / 200))

  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? mdContent.slice(0, 160).replace(/[#*_]/g, '') + '…',
    rawDate: data.date ?? '',
    date: data.date
      ? format(new Date(data.date), "d 'de' MMMM 'de' yyyy", { locale: pt })
      : '',
    category: data.category ?? 'Treino',
    readTime,
    coverImage: data.coverImage,
    content: htmlContent,
  }
}

/** Get all slugs (for generateStaticParams) */
export function getAllSlugs(): string[] {
  ensureDir()
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}
