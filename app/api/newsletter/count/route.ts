import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

// Endpoint público e de leitura apenas — expõe unicamente a contagem total de
// subscritores (nenhum email ou dado pessoal) para servir de prova social no
// formulário de newsletter. Sem parâmetro secreto porque não há PII em jogo.
//
// force-dynamic: o redis.scard() faz um fetch interno sem cache (Upstash
// REST client), o que faz o Next tentar gerar esta rota como estática por
// defeito e abortar com "Dynamic server usage" — esse erro interno de
// controlo de fluxo do Next estava a ser apanhado pelo catch abaixo (que não
// devia ver isto), poluindo os logs mesmo sem partir nada (o fallback count:0
// é que mascarava o problema). Marcar como dinâmica evita a tentativa de
// geração estática. Mesmo padrão já usado em app/sitemap.ts.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const count = await redis.scard('newsletter:subscribers')
    return NextResponse.json({ count })
  } catch (err) {
    console.error('Newsletter count route error:', err)
    return NextResponse.json({ count: 0 })
  }
}
