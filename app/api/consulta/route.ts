import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Groq — free tier: 14 400 req/day, 30 req/min, rápido (Llama 3.3 70B)
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `És um especialista em fisiologia do exercício, biomecânica da corrida, metodologias de treino e nutrição desportiva de alta performance. Tens 15 anos de experiência a trabalhar com corredores de todos os níveis, do iniciante ao atleta de elite.

Respondes sempre em português europeu. És direto, técnico e prático. Usas valores numéricos concretos sempre que possível (ex: "aumenta 10% por semana", "2x por semana", "FC entre 140-155 bpm"). As tuas respostas têm entre 150-350 palavras. Nunca inventas dados. Se não souberes algo, diz claramente.

Especialidades: corrida de estrada, maratona, meia-maratona, trail running, ultra trail, 5K/10K, atletismo, treino de força para corredores, nutrição desportiva, recuperação, prevenção de lesões, periodização, zonas de treino, VO2max, limiar anaeróbico.`

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Serviço de IA não configurado. Contacta o administrador.' },
        { status: 500 },
      )
    }

    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensagens inválidas.' }, { status: 400 })
    }

    // Groq usa formato OpenAI: array de {role, content}
    // role 'model' → 'assistant' para compatibilidade
    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.content,
      })),
    ]

    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 800,
        top_p: 0.9,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Groq error:', err)
      return NextResponse.json(
        { error: 'Erro ao gerar resposta. Tenta novamente.' },
        { status: 502 },
      )
    }

    const data = await res.json()
    const text: string | undefined = data?.choices?.[0]?.message?.content

    if (!text) {
      return NextResponse.json(
        { error: 'Resposta vazia da IA. Tenta novamente.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ reply: text })
  } catch (err) {
    console.error('Consulta route error:', err)
    return NextResponse.json(
      { error: 'Erro interno. Tenta novamente.' },
      { status: 500 },
    )
  }
}
