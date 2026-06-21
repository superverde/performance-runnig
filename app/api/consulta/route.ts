import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

function buildPrompt(
  nome: string,
  modalidade: string,
  kmSemana: string,
  objetivo: string,
  questao: string,
): string {
  return `És um especialista em fisiologia do exercício, biomecânica da corrida, metodologias de treino e nutrição desportiva de alta performance. Tens 15 anos de experiência a trabalhar com corredores de todos os níveis, do iniciante ao atleta de elite. Respondes sempre em português europeu, com rigor técnico e linguagem acessível.

Um corredor pediu uma análise personalizada. Estes são os dados fornecidos:

Nome: ${nome}
Modalidade principal: ${modalidade || 'Não especificada'}
Volume semanal aproximado: ${kmSemana || 'Não especificado'}
Objetivo principal: ${objetivo}
Questão / Situação: ${questao}

Escreve uma análise personalizada e aprofundada que:
1. Aborde diretamente a situação e questão apresentadas — sem respostas genéricas
2. Explique o raciocínio fisiológico ou metodológico por trás das recomendações
3. Apresente 3 ações concretas que ${nome} pode implementar imediatamente
4. Identifique 1 erro comum para esta situação que deve evitar
5. Termine com uma frase motivacional curta e específica para o objetivo

Formato obrigatório (usa estes títulos exatamente):
## Análise da Situação
## Raciocínio Técnico
## 3 Ações Para Esta Semana
## Erro a Evitar
## Nota Final

Regras:
- Mínimo 500 palavras, máximo 750 palavras
- Usa o nome "${nome}" pelo menos 2 vezes na resposta
- Nunca inventar dados que não foram fornecidos
- Linguagem direta, sem rodeios
- Valores numéricos concretos sempre que possível (ex: "aumenta o volume 10% por semana", "faz 2x por semana", etc.)`
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Serviço de IA não configurado. Contacta o administrador.' },
        { status: 500 },
      )
    }

    const body = await req.json()
    const { nome, modalidade, kmSemana, objetivo, questao } = body

    if (!nome || !objetivo || !questao) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 })
    }

    const prompt = buildPrompt(nome, modalidade, kmSemana, objetivo, questao)

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 1200,
          topP: 0.9,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini error:', err)
      return NextResponse.json(
        { error: 'Erro ao gerar análise. Tenta novamente.' },
        { status: 502 },
      )
    }

    const data = await res.json()
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json(
        { error: 'Resposta vazia da IA. Tenta novamente.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ analysis: text })
  } catch (err) {
    console.error('Consulta route error:', err)
    return NextResponse.json(
      { error: 'Erro interno. Tenta novamente.' },
      { status: 500 },
    )
  }
}
