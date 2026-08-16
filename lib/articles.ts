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
  /**
   * true quando o artigo tem um vídeo embutido no conteúdo (ver
   * `content/blog/*.md` — bloco `<video>` logo após o frontmatter).
   * Vem do campo `hasVideo: true` no frontmatter. Usado para destacar
   * estes artigos na homepage (ver `getVideoArticles`) — pedido do Pedro
   * para aumentar o tempo de permanência (baixo, ~11s, segundo o GA4).
   */
  hasVideo?: boolean
  /**
   * Perguntas frequentes (2-3 pares pergunta/resposta) extraídas do artigo
   * no momento da geração — ver scripts/generate-articles.mjs `extractFaqs`.
   * Usado para gerar schema FAQPage (JSON-LD) e a secção visível de FAQ na
   * página do artigo — pedido do Pedro para aumentar hipótese de citação por
   * assistentes de IA (canal "AI Assistant" no GA4), que tendem a extrair
   * respostas diretas em formato pergunta/resposta. Artigos antigos (antes
   * desta mudança) não têm este campo — é opcional e a UI trata isso.
   */
  faqs?: { q: string; a: string }[]
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
      hasVideo: data.hasVideo === true,
      faqs: Array.isArray(data.faqs) ? data.faqs : undefined,
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

/**
 * Artigos com vídeo embutido (`hasVideo: true` no frontmatter) — usado para
 * os destacar na homepage em vez de dependerem só da data de publicação
 * (o long run e o VO2max, por exemplo, já não estariam nos "últimos 7"
 * meses depois de saírem, apesar de terem o vídeo mais recente do site).
 */
export function getVideoArticles(): ArticleMeta[] {
  return getAllArticles().filter((a) => a.hasVideo === true)
}

/**
 * Remove acentos/diacríticos — mesma lógica do middleware.ts. Duplicada
 * aqui (em vez de importada) porque middleware.ts corre no Edge Runtime e
 * este ficheiro corre em Node; manter os dois em sincronia se um mudar.
 */
function deaccentSlug(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/**
 * Get full article (with parsed HTML content) by slug.
 *
 * Faz decodeURIComponent + deaccent como segunda linha de defesa para
 * slugs com acentos, mesmo que o middleware (primeira linha de defesa,
 * ver middleware.ts) já devesse ter redirecionado antes de chegar aqui —
 * ver [[project_slugs_acentos_404]] (sequela de 2026-07-18: esta camada
 * já existiu, foi perdida numa reescrita, e sozinha não chegava porque
 * recebia o slug ainda percent-encoded).
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  let filePath = path.join(ARTICLES_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) {
    const decoded = deaccentSlug(decodeURIComponent(slug))
    const fallbackPath = path.join(ARTICLES_DIR, `${decoded}.md`)
    if (fs.existsSync(fallbackPath)) {
      filePath = fallbackPath
      slug = decoded // usar o slug ASCII canónico no objeto devolvido (URL canónica, schema, etc.)
    } else {
      return null
    }
  }

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
      hasVideo: data.hasVideo === true,
      faqs: Array.isArray(data.faqs) ? data.faqs : undefined,
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
