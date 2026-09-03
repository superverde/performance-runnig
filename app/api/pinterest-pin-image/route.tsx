import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlug } from '@/lib/articles'
import { pickCategoryImage } from '@/lib/images'

/**
 * GET /api/pinterest-pin-image?slug=<slug-do-artigo>
 *
 * Gera a imagem de capa usada nos Pins do Pinterest (`app/api/cron/pinterest-pin/route.ts`).
 *
 * Porquê isto existe: antes, os pins usavam diretamente a foto de stock da
 * pool (`pickCategoryImage`) — uma foto horizontal (1200x800, ratio 3:2) sem
 * título nem marca. O Pinterest é um feed vertical (cards 2:3) e o próprio
 * Pinterest recomenda imagens 1000x1500: uma foto horizontal era cortada de
 * forma imprevisível pelo feed e, sem título sobreposto, o pin não comunicava
 * nada de útil no scroll — só uma foto genérica de corrida indistinguível de
 * qualquer outra conta. Isto compõe com o problema mais antigo (pins sem
 * título/link do Instagram→Pinterest, ver [[project_pinterest_pendente]]).
 *
 * Esta rota compõe: foto de fundo (cover, cortada para 2:3) + gradiente
 * escuro para legibilidade + etiqueta de categoria com a cor da marca +
 * título do artigo em destaque + rodapé com a marca "Performance Running".
 *
 * Robustez: nunca deve fazer a publicação do pin falhar. Se o artigo não
 * existir, devolve um pin genérico (categoria "Treino"). Se o carregamento
 * da fonte falhar (rede), continua sem tipo de letra personalizado em vez
 * de rebentar — o Satori tem uma fonte de contingência própria.
 */

export const runtime = 'nodejs'

const SITE_URL = 'https://www.performancerunning.pt'
const WIDTH = 1000
const HEIGHT = 1500

const CATEGORY_COLORS: Record<string, string> = {
  'Treino': '#0B2A4A',
  'Fisiologia': '#0B2A4A',
  'VO2max': '#0B2A4A',
  'Biomecânica': '#0B2A4A',
  'Equipamento': '#0B2A4A',
  'Trail Running': '#1F4B3F',
  'Recuperação': '#1F4B3F',
  'Nutrição': '#1F4B3F',
  'Lesões': '#2B2B2B',
  'Psicologia': '#2B2B2B',
}
const DEFAULT_COLOR = '#0B2A4A'

async function loadInterFont(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
      {
        headers: {
          // UA antigo força o Google a devolver TTF/OTF em vez de WOFF2 —
          // o Satori (usado pelo ImageResponse) só sabe ler TTF/OTF/WOFF.
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
        },
      }
    )
    const css = await cssRes.text()
    const match = css.match(/src: url\(([^)]+)\)/)
    if (!match) return null
    const fontRes = await fetch(match[1])
    if (!fontRes.ok) return null
    return await fontRes.arrayBuffer()
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? ''
  const article = await getArticleBySlug(slug)

  const title = article?.title ?? 'Ciência aplicada à corrida'
  const category = article?.category ?? 'Treino'
  const accent = CATEGORY_COLORS[category] ?? DEFAULT_COLOR
  const backgroundUrl = pickCategoryImage(category, slug || 'default')

  const [bold, regular] = await Promise.all([loadInterFont(700), loadInterFont(400)])
  const fonts = []
  if (bold) fonts.push({ name: 'Inter', data: bold, weight: 700 as const, style: 'normal' as const })
  if (regular) fonts.push({ name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const })

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
            display: 'flex',
            position: 'relative',
            backgroundColor: '#111',
            fontFamily: fonts.length > 0 ? 'Inter' : undefined,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundUrl}
            width={WIDTH}
            height={HEIGHT}
            style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
          />

          {/* Gradiente escuro para legibilidade do texto */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              display: 'flex',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 32%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 72%)',
            }}
          />

          {/* Etiqueta de categoria */}
          <div
            style={{
              position: 'absolute',
              top: 64,
              left: 60,
              display: 'flex',
              backgroundColor: accent,
              color: '#ffffff',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              padding: '12px 24px',
              borderRadius: 6,
            }}
          >
            {category}
          </div>

          {/* Título + rodapé de marca */}
          <div
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              bottom: 80,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                color: '#ffffff',
                fontSize: title.length > 70 ? 62 : 74,
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: -1,
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: 'flex',
                width: 90,
                height: 4,
                backgroundColor: accent,
                marginTop: 36,
                marginBottom: 28,
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  color: '#ffffff',
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                Performance Running
              </div>
              <div
                style={{
                  display: 'flex',
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 26,
                  fontWeight: 400,
                  marginLeft: 16,
                }}
              >
                performancerunning.pt
              </div>
            </div>
          </div>
        </div>
      ),
      { width: WIDTH, height: HEIGHT, fonts }
    )
  } catch (err) {
    console.error('[pinterest-pin-image] falha a gerar imagem, a redirecionar para a foto simples:', err)
    return NextResponse.redirect(backgroundUrl)
  }
}
