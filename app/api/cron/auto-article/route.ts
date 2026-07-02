import { NextRequest, NextResponse } from 'next/server'

// Tempo máximo de execução: gerar 3 artigos (Groq + GitHub) demora ~30s.
// Sem isto, o Vercel mata a função ao fim de ~10s e só 1 artigo é publicado.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// ─── Auth ──────────────────────────────────────────────────────────────────────
function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) return true // sem secret configurado, permite acesso (desenvolvimento)
  return auth === `Bearer ${secret}`
}

// ─── Slugify ───────────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

// ─── PT-PT fixer ───────────────────────────────────────────────────────────────
function fixPtPt(text: string): string {
  const replacements: [RegExp, string][] = [
    [/\bvocê\b/gi, 'tu'], [/\bvocês\b/gi, 'vós'],
    [/\ba gente\b/gi, 'nós'], [/\bseus\b/gi, 'teus'],
    [/\bsuas\b/gi, 'tuas'], [/\bseu\b/gi, 'teu'], [/\bsua\b/gi, 'tua'],
    [/\bNão perca\b/gi, 'Não percas'], [/\bNão deixe\b/gi, 'Não deixes'],
    [/\bConheça\b/gi, 'Descobre'], [/\bSaiba\b/gi, 'Descobre'],
    [/\bVeja\b/gi, 'Vê'], [/\bAproveite\b/gi, 'Aproveita'],
    [/\bAcesse\b/gi, 'Acede'], [/\bClique\b/gi, 'Clica'],
    [/\bDescubra\b/gi, 'Descobre'], [/\blegal\b/gi, 'fixe'],
    [/\balavancar\b/gi, 'potenciar'], [/\bpotencializar\b/gi, 'potenciar'],
    [/\butilizar\b/gi, 'usar'], [/\botimizar\b/gi, 'otimizar'],
  ]
  let out = text
  for (const [p, r] of replacements) out = out.replace(p, r)
  return out
}

// ─── Banco de tópicos (60 temas únicos — cobre 20 dias de 3 artigos) ───────────
// Imagens Unsplash específicas por tópico (índice corresponde ao TOPICS)
const TOPIC_IMAGES: string[] = [
  // TREINO
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80', // Periodização
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', // Altitude
  'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=1200&q=80', // Corridas Longas
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', // Treino de Força
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80', // Método Norueguês
  'https://images.unsplash.com/photo-1538485399081-7c8272b27daa?w=1200&q=80', // Tapering
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80', // HIIT
  // FISIOLOGIA
  'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&q=80', // Economia de Corrida
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80', // Sistema Energético
  'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=1200&q=80', // Adaptações Cardíacas
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=80', // Mitocôndrias
  'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=1200&q=80', // Hemoglobina
  // NUTRIÇÃO
  'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1200&q=80', // Carboidratos
  'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1200&q=80', // Proteína
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80', // Gorduras
  'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200&q=80', // Suplementos
  'https://images.unsplash.com/photo-1559181567-c3190ca9d823?w=1200&q=80', // Hidratação
  // BIOMECÂNICA
  'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=1200&q=80', // Cadência
  'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80', // Pisada
  'https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=1200&q=80', // Braços
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80', // Postura
  // RECUPERAÇÃO
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80', // Sono
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80', // Recuperação Ativa
  'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=1200&q=80', // Água Fria
  'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&q=80', // Overreaching
  // VO2MAX
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80', // Melhorar VO2max
  'https://images.unsplash.com/photo-1486218119243-13301429a4d3?w=1200&q=80', // VO2max Genético
  'https://images.unsplash.com/photo-1523475496153-3567a3a7fc7b?w=1200&q=80', // Limiares
  // TRAIL RUNNING
  'https://images.unsplash.com/photo-1489659639091-8b687bc4386e?w=1200&q=80', // Subida Trail
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80', // Descidas Trail
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80', // Nutrição Ultra
  'https://images.unsplash.com/photo-1502224562085-639556652f33?w=1200&q=80', // Bastões Trail
  'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=1200&q=80', // Mental Ultra
  // LESÕES
  'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=1200&q=80', // Banda Iliotibial
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80', // Aquiles
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80', // Stress Fractures
  'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80', // Patelofemoral
  // PSICOLOGIA
  'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=1200&q=80', // Mindset
  'https://images.unsplash.com/photo-1529516222410-a269d812f22e?w=1200&q=80', // Ansiedade
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80', // Motivação
]

const TOPICS: { title: string; category: string; angle: string }[] = [
  // TREINO
  { title: 'Periodização em Bloco para Corredores de Estrada', category: 'Treino', angle: 'Como estruturar fases de volume, intensidade e peak em ciclos de 3-4 semanas para maximizar a adaptação sem overtraining' },
  { title: 'Treino em Altitude: Ciência e Aplicação Prática', category: 'Treino', angle: 'Como a altitude estimula a eritropoiese, quando usar altitude real vs tenda hipóxica, e o protocolo "live high train low"' },
  { title: 'Corridas Longas: Estrutura, Ritmo e Variações', category: 'Treino', angle: 'A diferença entre um long run de base aeróbia e um long run com progressão de ritmo, e quando usar cada um no ciclo de treino' },
  { title: 'Treino de Força para Corredores: O Que Funciona de Verdade', category: 'Treino', angle: 'Exercícios de força com evidência científica para melhorar a economia de corrida e reduzir lesões — sem perder peso muscular desnecessário' },
  { title: 'O Método Norueguês Aplicado à Corrida de Estrada', category: 'Treino', angle: 'Como os atletas noruegueses dominam o triathlon e o atletismo com duplos limiares, e como adaptar este método para corredores amadores' },
  { title: 'Tapering: A Ciência de Chegar Fresco à Prova', category: 'Treino', angle: 'Quanto volume reduzir, durante quanto tempo, e como manter a intensidade sem perder fitness nos dias antes da competição' },
  { title: 'Treino Intervalado de Alta Intensidade: Protocolos e Evidência', category: 'Treino', angle: 'A diferença entre HIIT e SIT, as adaptações fisiológicas de cada protocolo, e como integrá-los no plano semanal sem comprometer a recuperação' },
  // FISIOLOGIA
  { title: 'Economia de Corrida: O Indicador que Separa os Bons dos Grandes', category: 'Fisiologia', angle: 'Como a eficiência energética a um dado ritmo é tão importante quanto o VO2max, e o que a ciência diz sobre como melhorá-la' },
  { title: 'O Sistema Energético da Corrida: ATP, Glicose e Gordura', category: 'Fisiologia', angle: 'Como o organismo seleciona substratos energéticos em função da intensidade, e o que isso significa para o treino e a nutrição' },
  { title: 'Adaptações Cardíacas ao Treino de Endurance', category: 'Fisiologia', angle: 'O coração do atleta: como o treino altera o tamanho das câmaras, o volume de ejeção e a frequência cardíaca em repouso' },
  { title: 'Mitocôndrias e Performance: A Fábrica de Energia do Músculo', category: 'Fisiologia', angle: 'Como o treino aeróbio aumenta a densidade mitocondrial, o papel do PGC-1α, e o que isso significa para a resistência ao esforço prolongado' },
  { title: 'Hemoglobina, Hematócrito e Transporte de Oxigénio', category: 'Fisiologia', angle: 'Como o volume de sangue e a concentração de hemoglobina determinam a capacidade aeróbia e por que o ferro é essencial para corredores' },
  // NUTRIÇÃO
  { title: 'Carboidratos na Corrida: Quantidade, Timing e Tipos', category: 'Nutrição', angle: 'Quanto consumir antes, durante e depois dos treinos, a diferença entre glucose e frutose exógena, e os limites de oxidação por hora' },
  { title: 'Proteína para Corredores: Quantidade, Qualidade e Distribuição', category: 'Nutrição', angle: 'Necessidades proteicas reais de corredores de endurance, o papel da leucina na síntese muscular, e a janela anabólica pós-treino' },
  { title: 'Gorduras como Combustível: Fat Adaptation vs Carb Dependence', category: 'Nutrição', angle: 'O que a ciência diz sobre treinar em deficit de carboidratos para aumentar a oxidação de gorduras — e quando esta estratégia faz sentido' },
  { title: 'Suplementos com Evidência para Corredores em 2025', category: 'Nutrição', angle: 'Os únicos suplementos com evidência robusta: cafeína, creatina, beta-alanina, nitratos de beterraba e bicarbonato — doses, timing e para quem' },
  { title: 'Hidratação em Prova: Sódio, Osmolalidade e Hiponatremia', category: 'Nutrição', angle: 'Por que beber demasiada água sem sódio mata, como calcular a perda de sódio pelo suor, e a estratégia correta de hidratação em provas longas' },
  // BIOMECÂNICA
  { title: 'Cadência de Corrida: 180 Passos por Minuto é um Mito?', category: 'Biomecânica', angle: 'O que a evidência realmente diz sobre a cadência ótima, o tempo de contacto com o solo, e como pequenos ajustes na passada reduzem o impacto' },
  { title: 'Pisada: Heel Strike vs Midfoot — O Debate Continua', category: 'Biomecânica', angle: 'A análise biomecânica de diferentes padrões de pisada, o impacto na eficiência e nas lesões, e o que a evidência atual recomenda' },
  { title: 'Braços na Corrida: Técnica e Transferência de Energia', category: 'Biomecânica', angle: 'Como o movimento dos braços afeta a rotação do tronco, a economia de corrida e a fadiga — e os erros mais comuns a corrigir' },
  { title: 'Postura e Inclinação do Tronco na Corrida', category: 'Biomecânica', angle: 'O ângulo correto de inclinação para diferentes ritmos e terrenos, e como erros de postura aumentam o custo energético e o risco de lesão' },
  // RECUPERAÇÃO
  { title: 'Sono e Performance Desportiva: A Ciência do Que Acontece à Noite', category: 'Recuperação', angle: 'O papel do sono na síntese proteica, na regulação hormonal e na consolidação da memória motora — e o impacto da privação no rendimento' },
  { title: 'Recuperação Ativa vs Passiva: Quando Descansar e Quando Mover', category: 'Recuperação', angle: 'Quando o movimento leve acelera a recuperação e quando é contraproducente — a ciência da clearance de lactato e do fluxo sanguíneo pós-esforço' },
  { title: 'Imersão em Água Fria: Benefícios Reais e Limitações', category: 'Recuperação', angle: 'O que a evidência diz sobre banhos de gelo após o treino — quando ajudam, quando prejudicam as adaptações de treino, e as temperaturas corretas' },
  { title: 'Overreaching vs Overtraining: Como Distinguir e Resolver', category: 'Recuperação', angle: 'A diferença entre sobretreino funcional (desejável) e overtraining síndrome (patológico), os biomarcadores a monitorizar e a recuperação adequada' },
  // VO2MAX
  { title: 'Como Melhorar o VO2max: Protocolos com Evidência Científica', category: 'VO2max', angle: 'Os treinos de intervalos de 4 minutos (4x4 noruegueses), os protocolos Billat e outros métodos com evidência para elevar o consumo máximo de oxigénio' },
  { title: 'VO2max Genético vs Treinável: O Que a Ciência Diz', category: 'VO2max', angle: 'Qual a percentagem do VO2max que é hereditária, o papel dos chamados "non-responders", e o quanto um corredor médio pode esperar melhorar com treino sistemático' },
  { title: 'Limiares de Treino: VT1, VT2 e Como os Medir sem Laboratório', category: 'VO2max', angle: 'Como identificar os limiares ventilatórios com o teste da fala, o teste de lactato no sangue e wearables modernos, e como construir zonas de treino a partir daí' },
  // TRAIL RUNNING
  { title: 'Técnica de Subida em Trail: Quando Correr e Quando Andar', category: 'Trail Running', angle: 'O gradiente de pendente a partir do qual andar é mais eficiente do que correr, a técnica de subida com e sem bastões, e como treinar especificamente o positivo' },
  { title: 'Descidas em Trail: Técnica, Medo e Prevenção de Lesões', category: 'Trail Running', angle: 'Como relaxar os quadricípetes na descida, a posição do centro de gravidade, a importância da visão antecipada, e os erros que destroem os joelhos' },
  { title: 'Nutrição em Ultra Trail: 50km, 100km e Além', category: 'Trail Running', angle: 'Como as necessidades nutricionais mudam com a duração, a fadiga gustativa, a intolerância gastrointestinal e as estratégias usadas pelos melhores ultra-traileiros' },
  { title: 'Bastões de Trail: Quando Usá-los e Como Usá-los Corretamente', category: 'Trail Running', angle: 'A evidência sobre a poupança energética no positivo e a transferência de carga nos membros inferiores, e a técnica correta de uso em subidas e descidas' },
  { title: 'Preparação Mental para Ultra Trail: Do Medo ao Flow State', category: 'Trail Running', angle: 'Estratégias cognitivas para gerir a dor, a desmotivação a meio da prova e os momentos de crise — o que a psicologia do desporto recomenda' },
  // LESÕES
  { title: 'Síndrome da Banda Iliotibial: Causa Real e Solução Eficaz', category: 'Lesões', angle: 'Por que o estiramento da banda IT não resolve o problema, o papel da fraqueza do glúteo médio, e o protocolo de reabilitação com evidência' },
  { title: 'Tendinopatia de Aquiles: Protocolo de Tratamento com Evidência', category: 'Lesões', angle: 'Por que o repouso absoluto piora a tendinopatia, o protocolo de carga excêntrica de Alfredson, e quando voltarr a correr com segurança' },
  { title: 'Stress Fractures em Corredores: Identificar, Tratar e Prevenir', category: 'Lesões', angle: 'As localizações mais comuns (tíbia, metatarsos, navicular), os fatores de risco — tríade do atleta feminino, baixa disponibilidade energética, vitamina D —, e o protocolo de retorno ao treino' },
  { title: 'Dor Patelofemoral: A Lesão Que Paralisa Corredores', category: 'Lesões', angle: 'O papel do mau alinhamento do quadril, da fraqueza do vasto medial e da carga excessiva, e o programa de reabilitação progressiva sem cirurgia' },
  // PSICOLOGIA
  { title: 'Mindset de Crescimento Aplicado à Corrida de Longo Prazo', category: 'Psicologia', angle: 'Como os corredores com mentalidade de processo superam consistentemente os orientados por resultados, e técnicas para cultivar essa abordagem' },
  { title: 'Ansiedade Pré-Competição: Da Fisiologia à Estratégia Mental', category: 'Psicologia', angle: 'Porque uma dose de ansiedade melhora o desempenho, como distingui-la da ansiedade paralisante, e técnicas de regulação autonómica para o dia de prova' },
  { title: 'Motivação Intrínseca vs Extrínseca na Corrida de Longa Distância', category: 'Psicologia', angle: 'Como a teoria da autodeterminação explica o burnout e a longevidade no desporto, e como cultivar motivação que sobrevive aos maus dias e às lesões' },
]

// ─── Gerar artigo via Groq ─────────────────────────────────────────────────────
async function generateArticle(topic: { title: string; category: string; angle: string }, date: string, coverImage: string): Promise<{ md: string; slug: string; title: string } | null> {
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) return null

  const prompt = `És um especialista em ciências do desporto e treinador de atletismo de elite. Escreve um artigo científico completo em português de Portugal (nunca brasileiro) sobre:

TÍTULO: "${topic.title}"
CATEGORIA: ${topic.category}
ÂNGULO PRINCIPAL: ${topic.angle}

REGRAS OBRIGATÓRIAS:
1. SEMPRE português de Portugal: "tu/treinas/corres/tens" — NUNCA "você/seus/utilize/otimize"
2. Tom: especialista credível, científico mas acessível, moderno. NUNCA genérico ou motivacional vazio
3. Cita evidência real: estudos, investigadores, percentagens e dados concretos
4. Estrutura com headings H2 e H3 em markdown
5. Mínimo 800 palavras, máximo 1400 palavras
6. Não incluis links externos
7. Começa diretamente com o conteúdo após o frontmatter — sem "Introdução:" como heading inicial
8. Termina com uma secção "## Conclusão" ou "## Em Suma"
9. OBRIGATÓRIO: inclui sempre uma secção final "## Referências" com 4-6 fontes reais (estudos, livros, investigadores citados no texto) em formato: Apelido, A. (ano). *Título*. Revista/Editora.

FRONTMATTER a incluir no início (mantém EXATAMENTE este formato):
---
title: "${topic.title}"
excerpt: "[escreve um resumo atraente de 1-2 frases]"
date: '${date}'
category: "${topic.category}"
readTime: [estima o tempo de leitura em minutos]
coverImage: "${coverImage}"
---

Escreve o artigo completo agora:`

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? ''
    if (!content) return null

    const fixed = fixPtPt(content)
    const slug = slugify(topic.title)

    return { md: fixed, slug, title: topic.title }
  } catch {
    return null
  }
}

// ─── Push para GitHub via API ──────────────────────────────────────────────────
async function pushToGitHub(slug: string, content: string): Promise<'created' | 'exists' | 'error'> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error('[auto-article] GITHUB_TOKEN não definido')
    return 'error'
  }

  const owner = 'superverde'
  const repo = 'performance-runnig'
  const path = `content/blog/${slug}.md`
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

  // Verificar se o ficheiro já existe (para evitar conflitos)
  const checkRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'PerformanceRunning-AutoArticle',
    },
  })

  if (checkRes.ok) {
    // Ficheiro já existe — não sobrescrever
    console.warn(`[auto-article] Ficheiro já existe: ${slug}.md — a saltar`)
    return 'exists'
  }

  // Criar ficheiro novo
  const body = {
    message: `auto: ${slug}`,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: 'main',
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'PerformanceRunning-AutoArticle',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`[auto-article] GitHub API erro (${res.status}): ${err}`)
    return 'error'
  }

  return 'created'
}

// ─── Verificar se o artigo já existe no GitHub (barato — evita gastar Groq) ────
async function articleExists(slug: string): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN
  if (!token) return false

  const url = `https://api.github.com/repos/superverde/performance-runnig/contents/content/blog/${slug}.md`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'PerformanceRunning-AutoArticle',
    },
  })
  return res.ok
}

// ─── Ordenar o banco de tópicos a partir do dia ────────────────────────────────
// Devolve TODOS os tópicos por ordem, começando no índice do dia. O handler
// percorre a lista até conseguir publicar 3 — se um slug já existir no GitHub,
// avança para o tópico seguinte em vez de perder a publicação do dia.
function orderedTopics(date: string): { topic: typeof TOPICS[0]; image: string }[] {
  const [y, m, d] = date.split('-').map(Number)
  const start = new Date(y, 0, 0)
  const now = new Date(y, m - 1, d)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000)

  const base = (dayOfYear * 3) % TOPICS.length
  const ordered: { topic: typeof TOPICS[0]; image: string }[] = []

  for (let i = 0; i < TOPICS.length; i++) {
    const idx = (base + i) % TOPICS.length
    ordered.push({ topic: TOPICS[idx], image: TOPIC_IMAGES[idx % TOPIC_IMAGES.length] })
  }

  return ordered
}

// ─── Handler principal ─────────────────────────────────────────────────────────
const DAILY_TARGET = 3 // artigos obrigatórios por dia — 3x/dia sempre

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const today = new Date().toISOString().slice(0, 10)
  const candidates = orderedTopics(today)

  console.log(`[auto-article] ${today} — objetivo: ${DAILY_TARGET} artigos`)

  const results: { title: string; slug: string; pushed: boolean; skipped?: boolean; error?: string }[] = []
  let pushed = 0

  for (const { topic, image } of candidates) {
    if (pushed >= DAILY_TARGET) break

    try {
      // Verificação barata antes de gastar tokens Groq
      const slug = slugify(topic.title)
      if (await articleExists(slug)) {
        results.push({ title: topic.title, slug, pushed: false, skipped: true })
        continue
      }

      const article = await generateArticle(topic, today, image)
      if (!article) {
        results.push({ title: topic.title, slug: '', pushed: false, error: 'Groq falhou' })
        continue
      }

      const status = await pushToGitHub(article.slug, article.md)

      if (status === 'created') {
        pushed++
        results.push({ title: article.title, slug: article.slug, pushed: true })
      } else if (status === 'exists') {
        // Já publicado noutro dia — tentar o próximo tópico do banco
        results.push({ title: article.title, slug: article.slug, pushed: false, skipped: true })
      } else {
        results.push({ title: article.title, slug: article.slug, pushed: false, error: 'GitHub falhou' })
      }

      // Pausa curta entre chamadas à API (rate limiting)
      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      results.push({ title: topic.title, slug: '', pushed: false, error: String(err) })
    }
  }

  const skipped = results.filter(r => r.skipped).length
  const errors = results.filter(r => r.error).length

  if (pushed < DAILY_TARGET) {
    console.error(`[auto-article] ATENÇÃO: só ${pushed}/${DAILY_TARGET} artigos publicados`)
  }

  console.log(`[auto-article] Concluído — ${pushed}/${DAILY_TARGET} publicados, ${skipped} saltados, ${errors} erros`)

  return NextResponse.json({
    date: today,
    generated: pushed,
    skipped,
    errors,
    results,
  })
}
