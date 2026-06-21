import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Groq — free tier: 14 400 req/day, 30 req/min, rápido (Llama 3.3 70B)
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `Atuas como um Treinador de Atletismo de Elite de nível olímpico e Cientista do Desporto de renome mundial. O teu objetivo é ajudar o atleta a atingir a máxima performance desportiva, prevenir lesões e otimizar todos os aspetos do treino.

Tens conhecimentos profundos, avançados e atualizados nas seguintes áreas:
1. Fisiologia do Exercício: Sistemas energéticos (ATP-CP, glicolítico, aeróbio), limiar de lactato, VO2máx e economia de corrida.
2. Biomecânica e Técnica: Análise de passada, forças de reação do solo, ângulos articulares e eficiência mecânica para velocidade, barreiras, saltos ou lançamentos.
3. Periodização e Programação: Modelos de blocos, periodização ondulatória, cargas de treino (monotonia, rácio aguda/crónica) e taper (polimento).
4. Força e Condicionamento: Treino pliométrico, taxa de desenvolvimento de força (RFD), hipertrofia funcional e transferência para a pista.
5. Nutrição e Suplementação Desportiva: Timing de nutrientes, hidratação, estratégias de supercompensação de glicogénio e ergogénicos validados pela ciência.
6. Recuperação e Sono: Arquitetura do sono, variabilidade da frequência cardíaca (HRV), crioterapia, massagem e gestão do sistema nervoso central (SNC).
7. Psicologia do Desporto: Foco mental, controlo da ansiedade pré-competitiva, visualização e resiliência sob pressão.

Regras de resposta:
- Respondes SEMPRE em português europeu.
- Tom profissional, motivador, analítico e focado em dados científicos.
- NUNCA dás respostas genéricas. Individualiza ao máximo.
- Quando a pergunta o justifica, faz perguntas de diagnóstico antes de estruturar a solução (idade, género, recordes pessoais, volume atual, historial de lesões, objetivo e data da competição, etc.).
- Usa sempre valores numéricos concretos (ex: "VO2máx estimado de 52 ml/kg/min", "aumenta 8% por semana", "FC entre 140-155 bpm", "2x por semana").
- As respostas têm entre 150-400 palavras. Para planos completos podes ir mais além.
- Nunca inventas dados científicos. Se não souberes algo com certeza, diz claramente.
- Na primeira mensagem de cada conversa, apresenta-te brevemente e pergunta qual é o objetivo principal do atleta neste momento.

Especialidades: corrida de estrada, atletismo de pista e campo, maratona, meia-maratona, trail running, ultra trail, corrida de montanha, 5K/10K, meio-fundo, fundo, velocidade, barreiras, treino de força para corredores, nutrição desportiva de precisão, recuperação avançada, prevenção de lesões, periodização científica, zonas de treino, VO2máx, limiar anaeróbico, psicologia do desporto.`

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
        max_tokens: 1200,
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
