import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'
import { PNG } from 'pngjs'
import jpeg from 'jpeg-js'
import { CALENDARIO, diaDaCampanha, produtoCampanha, type DiaCampanha } from '@/lib/black-friday-campanha'

/**
 * GET /api/black-friday-imagem?data=YYYY-MM-DD[&fmt=jpg]
 *
 * Imagem 1080x1350 (formato vertical do Instagram) da campanha de Black
 * Friday para o dia indicado — ver lib/black-friday-campanha.ts.
 * - Dias de produto: foto da i-Run, selo de desconto, preço e PVP riscado
 *   (valores de lib/products.ts, os mesmos do site).
 * - Restantes dias: imagem da campanha da i-Run (até -70%) + título.
 * `fmt=jpg` converte para JPEG, porque a API do Instagram só aceita JPEG.
 */
export const runtime = 'nodejs'

const SITE_URL = 'https://www.performancerunning.pt'
const W = 1080
const H = 1350
const LIMA = '#c8e100'

async function carregarFonte(familia: string, peso: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${familia}:wght@${peso}&display=swap`, {
        // UA antigo: o Google devolve TTF, que o Satori sabe ler (não lê WOFF2).
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' },
      })
    ).text()
    // O CSS traz um ficheiro por alfabeto (cirílico, vietnamita, latin-ext,
    // latin...). O latin básico vem em último: usar o primeiro deixava letras
    // como o "A" sem glifo e o Satori trocava-as por outra fonte.
    const urls = css.match(/src: url\([^)]+\)/g)?.map((m) => m.slice(9, -1)) ?? []
    const url = urls[urls.length - 1]
    if (!url) return null
    const res = await fetch(url)
    return res.ok ? await res.arrayBuffer() : null
  } catch {
    return null
  }
}

const TITULOS: Record<Exclude<DiaCampanha['tipo'], 'produto'>, [string, string]> = {
  guia: ['O QUE VALE MESMO', 'A PENA COMPRAR'],
  dicas: ['3 REGRAS ANTES', 'DE COMPRAR'],
  'dia-d': ['É HOJE.', 'AS NOSSAS ESCOLHAS'],
  ultimo: ['ÚLTIMO DIA', 'CYBER MONDAY'],
}

function Rodape({ fonte }: { fonte: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontFamily: fonte }}>
      <div style={{ display: 'flex', fontSize: 34, color: '#ffffff', fontWeight: 700 }}>
        PERFORMANCE<span style={{ color: '#00C896' }}>RUNNING</span>
      </div>
      <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.55)' }}>Guia em performancerunning.pt</div>
    </div>
  )
}

function arteProduto(dia: DiaCampanha, fonte: string, display: string, foto: string | null) {
  const p = dia.produto ? produtoCampanha(dia.produto) : null
  if (!p) return null
  return (
    <div style={{ width: W, height: H, display: 'flex', flexDirection: 'column', backgroundColor: '#000', padding: 64, fontFamily: fonte }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', fontFamily: display, fontSize: 120, color: '#fff', lineHeight: 1 }}>
          BLACK <span style={{ color: LIMA, marginLeft: 24 }}>FRIDAY</span>
        </div>
      </div>
      <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Escolha do dia · parceiro i-Run</div>

      <div style={{ display: 'flex', position: 'relative', marginTop: 40, width: W - 128, height: 640, backgroundColor: '#fff', borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {foto ? <img src={foto} width={760} height={600} style={{ objectFit: 'contain' }} /> : null}
        {p.desconto ? (
          <div style={{ position: 'absolute', top: 28, left: 28, display: 'flex', backgroundColor: '#000', color: LIMA, fontFamily: display, fontSize: 96, lineHeight: 1, padding: '14px 26px', borderRadius: 20 }}>
            -{p.desconto}%
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', fontSize: 64, color: '#fff', fontWeight: 700, marginTop: 40, lineHeight: 1.1 }}>{p.name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 16 }}>
        <div style={{ display: 'flex', fontFamily: display, fontSize: 104, color: LIMA, lineHeight: 1 }}>{p.preco.replace('~', '')}</div>
        {p.pvp ? <div style={{ display: 'flex', fontSize: 44, color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through', marginLeft: 28 }}>{`${p.pvp} €`}</div> : null}
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }} />
      <Rodape fonte={fonte} />
    </div>
  )
}

function arteGeral(dia: DiaCampanha, fonte: string, display: string) {
  const [l1, l2] = TITULOS[dia.tipo as keyof typeof TITULOS]
  return (
    <div style={{ width: W, height: H, display: 'flex', flexDirection: 'column', backgroundColor: '#000', padding: 64, fontFamily: fonte }}>
      {/* Imagem da campanha da i-Run (até -70%), como no i-run.pt. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SITE_URL}/parceiros/i-run-black-friday-2026-popup.png`} width={W - 128} height={Math.round(((W - 128) * 350) / 672)} style={{ borderRadius: 28 }} />
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 56 }}>
        <div style={{ display: 'flex', fontFamily: display, fontSize: 112, color: '#fff', lineHeight: 1 }}>{l1}</div>
        <div style={{ display: 'flex', fontFamily: display, fontSize: 112, color: LIMA, lineHeight: 1, marginTop: 8 }}>{l2}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 38, color: 'rgba(255,255,255,0.75)', marginTop: 36, lineHeight: 1.35 }}>
        {dia.tipo === 'dicas'
          ? 'Conforto primeiro · compra o que vais usar · compara com o preço habitual'
          : 'Sapatilhas, relógios e acessórios: as nossas escolhas por perfil de corredor.'}
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }} />
      <Rodape fonte={fonte} />
    </div>
  )
}

/**
 * Descarrega a foto da i-Run e devolve-a como data URI. O CDN da i-Run
 * responde com "image/jpg" (tipo não normalizado), que o Satori rejeita —
 * por isso a foto saía em branco quando era passada por URL.
 */
async function fotoComoDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    return `data:image/jpeg;base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

function pngParaJpeg(png: Buffer): Buffer {
  const img = PNG.sync.read(png)
  return jpeg.encode({ data: img.data, width: img.width, height: img.height }, 88).data
}

export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get('data') ?? CALENDARIO[0].data
  const dia = diaDaCampanha(data)
  if (!dia) return NextResponse.json({ error: 'Data fora da campanha' }, { status: 404 })

  const [inter, barlow] = await Promise.all([carregarFonte('Inter', 700), carregarFonte('Barlow+Condensed', 800)])
  const fonts = []
  if (inter) fonts.push({ name: 'Inter', data: inter, weight: 700 as const, style: 'normal' as const })
  if (barlow) fonts.push({ name: 'Barlow', data: barlow, weight: 800 as const, style: 'normal' as const })
  const fonte = inter ? 'Inter' : 'sans-serif'
  const display = barlow ? 'Barlow' : fonte

  const produto = dia.produto ? produtoCampanha(dia.produto) : null
  const foto = produto ? await fotoComoDataUri(produto.img) : null
  const arte = dia.tipo === 'produto' ? arteProduto(dia, fonte, display, foto) : arteGeral(dia, fonte, display)
  if (!arte) return NextResponse.json({ error: 'Produto do dia sem link i-Run' }, { status: 404 })

  const resposta = new ImageResponse(arte, { width: W, height: H, fonts })
  const png = Buffer.from(await resposta.arrayBuffer())

  if (req.nextUrl.searchParams.get('fmt') === 'jpg') {
    return new NextResponse(new Uint8Array(pngParaJpeg(png)), {
      headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
    })
  }
  return new NextResponse(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
  })
}
