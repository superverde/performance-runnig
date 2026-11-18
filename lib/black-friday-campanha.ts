/**
 * Campanha de Black Friday 2026 nas redes (Facebook, Instagram, Threads) e
 * nos grupos de Facebook onde o Pedro partilha à mão.
 * ------------------------------------------------------------------
 * Decidido com o Pedro a 2026-11-18: publicações sem custo (sem anúncios
 * pagos), a promover o guia de Black Friday do site e as escolhas da i-Run.
 *
 * Regras:
 * - Textos escritos à mão aqui, sem IA, para não sair nada inventado. Os
 *   preços e descontos vêm SEMPRE de lib/products.ts (os mesmos do site,
 *   lidos nas fichas da i-Run), nunca escritos nos textos.
 * - Os links apontam para o guia do nosso site (com UTM), não diretamente
 *   para a i-Run: o leitor vê as escolhas e o contexto antes de comprar.
 * - Português de Portugal (tu, corres, vê).
 */
import { BLACK_FRIDAY } from '@/lib/irun-config'
import { sapatos, relogios, sensoresFc, nutricao, acessorios } from '@/lib/products'

const SITE_URL = 'https://www.performancerunning.pt'
export const GUIA_URL = `${SITE_URL}/blog/${BLACK_FRIDAY.artigoSlug}`

export type Rede = 'facebook' | 'instagram' | 'threads' | 'grupos'
export type TipoDia = 'guia' | 'produto' | 'dicas' | 'dia-d' | 'ultimo'

export interface DiaCampanha {
  data: string // YYYY-MM-DD (Lisboa)
  tipo: TipoDia
  /** Nome exato do produto em lib/products.ts (só para tipo 'produto'). */
  produto?: string
  /** Uma frase sobre o produto, tirada do guia de Black Friday. */
  frase?: string
}

export const CALENDARIO: DiaCampanha[] = [
  { data: '2026-11-20', tipo: 'guia' },
  { data: '2026-11-21', tipo: 'produto', produto: 'Nike Vaporfly 3', frase: 'Uma das referências em sapatilhas com placa, para provas de 10 km à maratona. Só compensa se a fores usar em prova.' },
  { data: '2026-11-22', tipo: 'produto', produto: 'On Cloudmonster 2', frase: 'Muito amortecimento com uma transição rápida. Hoje está bem abaixo da Cloudmonster 3.' },
  { data: '2026-11-23', tipo: 'dicas' },
  { data: '2026-11-24', tipo: 'produto', produto: 'Polar Pacer Pro', frase: 'Relógio GPS de corrida da Polar, para quem treina por frequência cardíaca e quer analisar a carga de treino.' },
  { data: '2026-11-25', tipo: 'produto', produto: 'HOKA Speedgoat 7', frase: 'Para trilhos técnicos e distâncias longas: aderência e amortecimento.' },
  { data: '2026-11-26', tipo: 'produto', produto: 'ASICS Gel-Nimbus 28', frase: 'Para rodagens longas e lentas e corredores mais pesados: amortecimento elevado e conforto.' },
  { data: '2026-11-27', tipo: 'dia-d' },
  { data: '2026-11-28', tipo: 'produto', produto: 'Petzl Iko Core', frase: 'Lanterna frontal com fita AirFit, para treinos de trail ao amanhecer, ao fim do dia e provas noturnas.' },
  { data: '2026-11-29', tipo: 'produto', produto: 'Saucony Endorphin Pro 5', frase: 'Placa com mais conforto, para maratonistas que querem equilíbrio entre resposta e amortecimento.' },
  { data: '2026-11-30', tipo: 'ultimo' },
]

export interface ProdutoCampanha {
  name: string
  preco: string
  img: string
  desconto?: number
  pvp?: number
}

/** Procura o produto em todo o inventário (só os que têm link i-Run). */
export function produtoCampanha(nome: string): ProdutoCampanha | null {
  const todos = [...sapatos, ...relogios, ...sensoresFc, ...nutricao, ...acessorios]
  const p = todos.find((x) => x.name === nome && x.linkIrun)
  return p ? { name: p.name, preco: p.preco, img: p.img, desconto: p.desconto, pvp: p.pvp } : null
}

/** Dia da campanha para uma data (YYYY-MM-DD), ou null fora da campanha. */
export function diaDaCampanha(data: string): DiaCampanha | null {
  return CALENDARIO.find((d) => d.data === data) ?? null
}

export function linkComUtm(rede: Rede, data: string): string {
  return `${GUIA_URL}?utm_source=${rede}&utm_medium=social&utm_campaign=black-friday-2026&utm_content=${data}`
}

/** URL da imagem do dia. `jpg` para o Instagram (só aceita JPEG). */
export function imagemDoDia(data: string, formato: 'png' | 'jpg' = 'png'): string {
  return `${SITE_URL}/api/black-friday-imagem?data=${data}${formato === 'jpg' ? '&fmt=jpg' : ''}`
}

const HASHTAGS_IG = '#blackfriday #corrida #running #corridaportugal'
const HASHTAGS_GRUPOS = '#blackfriday #corrida #running #corridaportugal #trailrunning #corredores #performancerunning'

function linhaPreco(p: ProdutoCampanha): string {
  const desconto = p.desconto ? `-${p.desconto}% · ` : ''
  const pvp = p.pvp ? ` (preço recomendado ${p.pvp} €)` : ''
  return `${desconto}${p.preco.replace('~', '')} na i-Run${pvp}`
}

/** Corpo comum (sem link nem hashtags) do dia. */
function corpo(dia: DiaCampanha): string | null {
  switch (dia.tipo) {
    case 'guia':
      return [
        '🖤 A Black Friday da i-Run já começou, com descontos até -70% segundo a própria loja.',
        '',
        'Antes de comprar, lê o nosso guia: como perceber se um desconto é real, o que vale mesmo a pena para cada tipo de corredor e os erros que te fazem gastar mal.',
      ].join('\n')
    case 'dicas':
      return [
        '3 regras antes de comprar sapatilhas na Black Friday 👟',
        '',
        '1. Conforto primeiro. Sapatilha que magoa na loja não melhora com 100 km.',
        '2. Compra o que vais usar nos próximos meses. Sem prova marcada, uma boa sapatilha de treino rende mais do que uma de competição.',
        '3. Compara com o preço habitual, não com o preço riscado.',
        '',
        'No guia explicamos cada uma e deixamos as nossas escolhas por perfil.',
      ].join('\n')
    case 'dia-d':
      return [
        '⚡ Hoje é Black Friday.',
        '',
        'A melhor compra é quase sempre a sapatilha de treino que já sabes que te serve, a um preço mais baixo. Depois disso, a sapatilha de prova para um objetivo concreto, ou um sensor de frequência cardíaca se treinas por zonas.',
        '',
        'As nossas escolhas, com os descontos da i-Run, estão no guia.',
      ].join('\n')
    case 'ultimo':
      return [
        '⏳ Último dia: as promoções de Black Friday acabam hoje, com a Cyber Monday.',
        '',
        'Se ainda estás indeciso, o nosso guia resume o que vale a pena para cada perfil de corredor e como evitar descontos que não o são.',
      ].join('\n')
    case 'produto': {
      const p = dia.produto ? produtoCampanha(dia.produto) : null
      if (!p) return null
      return [
        `🔥 Black Friday · ${p.name}`,
        '',
        linhaPreco(p),
        '',
        dia.frase ?? '',
        '',
        'Esta e as outras escolhas por perfil estão no nosso guia de Black Friday.',
      ].join('\n').replace(/\n{3,}/g, '\n\n')
    }
  }
}

const AVISO = 'Parceiro i-Run: os links da loja no guia são de afiliado. Preços indicativos, confirma na loja.'

/**
 * Texto final por rede.
 * - Facebook (página): sem link no corpo; o link vai no 1.º comentário
 *   (mesma estratégia de app/api/social-post).
 * - Instagram: "link na bio" + 4 hashtags.
 * - Threads: link no fim (máx. 500 caracteres no total).
 * - Grupos: link direto no texto (é o que resulta melhor, decisão do Pedro).
 */
export function textoDoDia(dia: DiaCampanha, rede: Rede): string | null {
  const base = corpo(dia)
  if (!base) return null
  const link = linkComUtm(rede, dia.data)
  switch (rede) {
    case 'facebook':
      return `${base}\n\n👇 Link do guia no primeiro comentário.\n\n${AVISO}`
    case 'instagram':
      return `${base}\n\n🔗 Guia completo: link na bio.\n\n${AVISO}\n\n${HASHTAGS_IG}`
    case 'threads': {
      const fim = `\n\n🔗 ${link}`
      const max = 500 - fim.length
      const t = base.length > max ? base.slice(0, max - 1).trimEnd() + '…' : base
      return t + fim
    }
    case 'grupos':
      return `${base}\n\n👉 Guia completo: ${link}\n\n${AVISO}\n\n${HASHTAGS_GRUPOS}`
  }
}

/**
 * Publicações prontas para o Pedro partilhar à mão nos grupos de Facebook
 * (página /grupos) durante a Black Friday: o tema do dia da campanha e um
 * produto em destaque (o do dia, ou senão o da seleção com maior desconto).
 * Antes de 20/11 (sem dia de campanha) usa o post do guia.
 */
export function postsGrupos(data: string): { titulo: string; texto: string; link: string }[] {
  const out: { titulo: string; texto: string; link: string }[] = []
  const hoje = diaDaCampanha(data)
  const geral: DiaCampanha = hoje && hoje.tipo !== 'produto' ? hoje : { data, tipo: 'guia' }
  const tituloGeral: Record<Exclude<TipoDia, 'produto'>, string> = {
    guia: 'Black Friday — guia: o que vale mesmo a pena comprar',
    dicas: 'Black Friday — 3 regras antes de comprar sapatilhas',
    'dia-d': 'Black Friday — é hoje',
    ultimo: 'Black Friday — último dia (Cyber Monday)',
  }
  const tg = textoDoDia(geral, 'grupos')
  if (tg) out.push({ titulo: tituloGeral[geral.tipo as Exclude<TipoDia, 'produto'>], texto: tg, link: linkComUtm('grupos', data) })

  let diaProduto: DiaCampanha | null = hoje && hoje.tipo === 'produto' ? hoje : null
  if (!diaProduto) {
    const candidatos = CALENDARIO.filter((d) => d.tipo === 'produto' && d.produto)
      .map((d) => ({ d, p: produtoCampanha(d.produto as string) }))
      .filter((x) => x.p)
      .sort((a, b) => (b.p?.desconto ?? 0) - (a.p?.desconto ?? 0))
    diaProduto = candidatos[0] ? { ...candidatos[0].d, data } : null
  }
  const tp = diaProduto ? textoDoDia(diaProduto, 'grupos') : null
  if (diaProduto && tp) out.push({ titulo: `Black Friday — ${diaProduto.produto}`, texto: tp, link: linkComUtm('grupos', data) })
  return out
}
