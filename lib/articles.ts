import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'blog')

/**
 * Normaliza o campo `date` do frontmatter para uma string ISO "YYYY-MM-DD".
 *
 * gray-matter usa js-yaml para fazer parse do frontmatter. Em YAML, um valor
 * de data SEM aspas (ex.: `date: 2026-07-01`) é interpretado como um timestamp
 * YAML e chega aqui como objeto `Date`, enquanto um valor COM aspas
 * (ex.: `date: '2026-07-01'`) chega como `string`. Sem esta normalização,
 * comparações de igualdade como `rawDate === today` falhavam silenciosamente
 * sempre que um artigo era escrito com a data sem aspas — foi o que aconteceu
 * em 2026-07-01, onde 3 de 4 artigos do dia desapareceram do filtro
 * "Publicados Hoje" por terem `date` sem aspas no frontmatter.
 */
function toISODate(value: unknown): string {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

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

/**
 * Parse a single .md file e devolve ArticleMeta.
 *
 * Envolvido em try/catch de propósito: um único ficheiro com frontmatter
 * inválido (ex.: YAML truncado a meio por uma escrita incompleta) NÃO deve
 * derrubar a listagem inteira do blog, o sitemap ou o RSS feed — só esse
 * artigo é ignorado (com aviso na consola) e os restantes continuam a
 * funcionar normalmente. Isto aconteceu em 2026-07-01 com lib/articles.ts
 * (não um artigo, mas o mesmo tipo de escrita truncada) e partiu o build;
 * esta blindagem existe para que um artigo malformado nunca tenha o mesmo
 * impacto.
 */
function parseMeta(slug: string): ArticleMeta | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)

    if (!data.title || !data.date) {
      console.error(`[articles] "${slug}.md" sem title/date no frontmatter — ignorado`)
      return null
    }

    const wordCount = content.split(/\s+/).length
    // Respect frontmatter readTime; fallback to word-count estimate
    const readTime = data.readTime ?? Math.max(1, Math.round(wordCount / 200))

    const rawDate = toISODate(data.date)

    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? content.slice(0, 160).replace(/[#*_]/g, '') + '…',
      rawDate,
      date: rawDate
        ? format(new Date(rawDate), "d 'de' MMMM 'de' yyyy", { locale: pt })
        : '',
      category: data.category ?? 'Treino',
      readTime,
      coverImage: data.coverImage,
    }
  } catch (err) {
    console.error(`[articles] Falha ao processar "${slug}.md" — artigo ignorado:`, err)
    return null
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

  const sorted = articles.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())

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

/** Remove acentos/diacríticos — slugs canónicos são sempre ASCII */
export function deaccentSlug(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Get full article (with parsed HTML content) by slug */
export async function getArticleBySlug(rawSlug: string): Promise<Article | null> {
  // Aceita tanto o slug ASCII como variantes antigas com acentos
  // (URLs partilhados antes da normalização) — resolve para o mesmo ficheiro.
  let slug = rawSlug
  let filePath = path.join(ARTICLES_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) {
    // O App Router entrega o slug percent-encoded (ex: eletr%C3%B3litos-…)
    // — sem decode, o deaccent não fazia nada e a variante acentuada dava
    // sempre "não encontrado" apesar do fallback existir.
    let decoded = rawSlug
    try {
      decoded = decodeURIComponent(rawSlug)
    } catch {
      // encoding inválido — mantém o original
    }
    slug = deaccentSlug(decoded)
    filePath = path.join(ARTICLES_DIR, `${slug}.md`)
  }
  if (!fs.existsSync(filePath)) return null

  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content: mdContent } = matter(raw)

    const processed = await remark().use(remarkHtml, { sanitize: false }).process(mdContent)
    const htmlContent = processed.toString()

    const wordCount = mdContent.split(/\s+/).length
    // Respect frontmatter readTime; fallback to word-count estimate
    const readTime = data.readTime ?? Math.max(1, Math.round(wordCount / 200))

    const rawDate = toISODate(data.date)

    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? mdContent.slice(0, 160).replace(/[#*_]/g, '') + '…',
      rawDate,
      date: rawDate
        ? format(new Date(rawDate), "d 'de' MMMM 'de' yyyy", { locale: pt })
        : '',
      category: data.category ?? 'Treino',
      readTime,
      coverImage: data.coverImage,
      content: htmlContent,
    }
  } catch (err) {
    console.error(`[articles] Falha ao renderizar "${slug}.md":`, err)
    return null
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
