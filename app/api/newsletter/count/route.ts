import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

// Endpoint público e de leitura apenas — expõe unicamente a contagem total de
// subscritores (nenhum email ou dado pessoal) para servir de prova social no
// formulário de newsletter. Sem parâmetro secreto porque não há PII em jogo.
export async function GET() {
  try {
    const count = await redis.scard('newsletter:subscribers')
    return NextResponse.json({ count })
  } catch (err) {
    console.error('Newsletter count route error:', err)
    return NextResponse.json({ count: 0 })
  }
}
