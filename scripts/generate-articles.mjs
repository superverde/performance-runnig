/**
 * generate-articles.mjs
 * Gera 3 artigos por dia usando a API Groq (llama-3.1-8b-instant)
 * Corre via GitHub Actions todos os dias às 5:30h UTC
 *
 * Uso: node scripts/generate-articles.mjs
 * Requer: GROQ_API_KEY como variável de ambiente
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'blog')
const COUNTER_FILE = path.join(ARTICLES_DIR, '_topic_counter.json')
const GROQ_API_KEY = process.env.GROQ_API_KEY
const ARTICLES_PER_RUN = 3

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY não definida')
  process.exit(1)
}

// ─────────────────────────────────────────────────────────────────────────────
// BANCO DE TÓPICOS — 150+ tópicos únicos sobre corrida, trail e atletismo
// ─────────────────────────────────────────────────────────────────────────────
const ALL_TOPICS = [
  // TREINO
  { slug: 'vo2max-como-melhorar-pratica', title: 'Como Melhorar o VO2max: Métodos Práticos e Cientificamente Validados', category: 'Fisiologia' },
  { slug: 'limiar-lactato-treino-especifico', title: 'Limiar de Lactato: O Indicador Mais Importante para Corredores de Fundo', category: 'Fisiologia' },
  { slug: 'frequencia-cardiaca-maxima-calcular', title: 'Frequência Cardíaca Máxima: Como Calcular e Usar no Treino', category: 'Treino' },
  { slug: 'tempo-run-beneficios-como-fazer', title: 'Tempo Run: O Treino Que Mais Melhora o Teu Ritmo de Corrida', category: 'Treino' },
  { slug: 'fartlek-treino-velocidade-corrida', title: 'Fartlek: O Método Sueco Que Desenvolveu Campeões Olímpicos', category: 'Treino' },
  { slug: 'treino-base-aerobia-importancia', title: 'Base Aeróbia: Por Que 80% do Teu Treino Deve Ser Fácil', category: 'Treino' },
  { slug: 'corrida-progressiva-treino-limiar', title: 'Corrida Progressiva: Como Estruturar o Treino Mais Versátil da Corrida', category: 'Treino' },
  { slug: 'strides-corrida-eficiencia-velocidade', title: 'Strides: O Exercício de 20 Segundos Que Melhora a Tua Eficiência', category: 'Treino' },
  { slug: 'treino-duplo-two-a-day-corredores', title: 'Treino Duplo: Quando e Como Treinar Duas Vezes por Dia', category: 'Treino' },
  { slug: 'carga-treino-aguda-cronica-racio', title: 'Rácio Carga Aguda:Crónica — A Métrica Que Previne Lesões', category: 'Treino' },
  { slug: 'microciclo-treino-estrutura-semanal', title: 'Como Estruturar uma Semana de Treino para Corredores', category: 'Treino' },
  { slug: 'mesociclo-periodizacao-blocos', title: 'Periodização por Blocos: O Sistema dos Atletas de Elite', category: 'Treino' },
  { slug: 'corrida-noite-beneficios-riscos', title: 'Correr à Noite: Impacto no Sono, Rendimento e Segurança', category: 'Treino' },
  { slug: 'corrida-manha-jejum-performance', title: 'Correr de Manhã em Jejum: O Que a Ciência Realmente Diz', category: 'Treino' },
  { slug: 'volume-vs-intensidade-corrida', title: 'Volume vs Intensidade: O Eterno Debate na Corrida de Fundo', category: 'Treino' },
  { slug: 'cross-training-corredores-natacao-bicicleta', title: 'Cross-Training para Corredores: Natação, Bicicleta e Musculação', category: 'Treino' },
  { slug: 'repetitions-800m-1000m-como-fazer', title: 'Repetições de 800m e 1000m: O Coração do Treino de VO2max', category: 'Treino' },
  { slug: 'treino-altitude-casa-mascaras-tenda', title: 'Simular Altitude em Casa: Tendas Hipóxicas e Alternativas', category: 'Treino' },
  // FISIOLOGIA
  { slug: 'economia-corrida-melhorar-eficiencia', title: 'Economia de Corrida: Como Gastar Menos Energia a Cada Passada', category: 'Fisiologia' },
  { slug: 'sistema-energetico-corrida-atp-pcr', title: 'Os Três Sistemas Energéticos da Corrida: Do Sprint ao Ultra', category: 'Fisiologia' },
  { slug: 'fibras-musculares-tipo-1-2-corrida', title: 'Fibras Musculares Tipo I e II: O Que Determinam na Tua Corrida', category: 'Fisiologia' },
  { slug: 'coração-atleta-adaptações-cardiaca', title: 'O Coração do Atleta: Adaptações Cardíacas ao Treino de Endurance', category: 'Fisiologia' },
  { slug: 'hematocrito-hemoglobina-corrida', title: 'Hematócrito e Hemoglobina: Como o Sangue Determina a Performance', category: 'Fisiologia' },
  { slug: 'termorregulação-corrida-calor-frio', title: 'Termorregulação: Como o Corpo Gere a Temperatura em Corrida', category: 'Fisiologia' },
  { slug: 'epo-altitude-eritropoiese-natural', title: 'EPO Natural: Como Estimular a Eritropoiese com Treino e Altitude', category: 'Fisiologia' },
  { slug: 'depleção-glicogenio-maratona-wall', title: 'A Bioquímica do Muro: O Que Acontece Quando o Glicogénio Acaba', category: 'Fisiologia' },
  { slug: 'fadiga-central-periferica-corrida', title: 'Fadiga Central vs Periférica: Por Que o Cérebro Para Antes dos Músculos', category: 'Fisiologia' },
  { slug: 'frequencia-respiratoria-corrida-tecnica', title: 'Respiração na Corrida: Ritmo, Técnica e Impacto na Performance', category: 'Fisiologia' },
  // NUTRIÇÃO
  { slug: 'carboidratos-treino-base-aerobia', title: 'Carboidratos no Treino de Base: Quanto, Quando e Porquê', category: 'Nutrição' },
  { slug: 'proteina-corredores-quantidade-timing', title: 'Proteína para Corredores: Quanta Precisas e Quando Consumir', category: 'Nutrição' },
  { slug: 'gordura-combustivel-corrida-longa', title: 'Gordura como Combustível: Fat Adaptation na Corrida de Fundo', category: 'Nutrição' },
  { slug: 'pre-race-meal-refeição-antes-prova', title: 'Refeição Pré-Prova: O Que Comer nas 24h Antes da Corrida', category: 'Nutrição' },
  { slug: 'recuperacao-nutricao-pos-treino-janela', title: 'A Janela Anabólica: Nutrição nas Primeiras Horas Pós-Treino', category: 'Nutrição' },
  { slug: 'eletrolitos-sodio-potassio-corrida', title: 'Eletrólitos na Corrida: Sódio, Potássio e Como Evitar Cãibras', category: 'Nutrição' },
  { slug: 'cafeina-dose-timing-corrida', title: 'Cafeína no Desporto: Dose Certa, Timing Perfeito, Resultados Reais', category: 'Nutrição' },
  { slug: 'beta-alanina-bicarbonato-corrida', title: 'Beta-Alanina e Bicarbonato: Os Suplementos de Alta Intensidade', category: 'Nutrição' },
  { slug: 'ferro-fontes-alimentares-corredores', title: 'Ferro para Corredores: Fontes Alimentares e Como Maximizar Absorção', category: 'Nutrição' },
  { slug: 'vitamina-d-corredores-suplementacao', title: 'Vitamina D em Corredores: Ossos, Imunidade e Performance', category: 'Nutrição' },
  { slug: 'dieta-mediterrânea-corrida-portugal', title: 'Dieta Mediterrânica e Corrida: O Padrão Alimentar Ideal', category: 'Nutrição' },
  { slug: 'gut-training-estômago-corrida-longa', title: 'Gut Training: Como Treinar o Estômago para a Maratona', category: 'Nutrição' },
  // BIOMECÂNICA
  { slug: 'cadencia-ideal-corrida-180-spm', title: 'Cadência de Corrida: A Regra dos 180 SPM É Real?', category: 'Biomecânica' },
  { slug: 'passada-corrida-overstriding-lesao', title: 'Overstriding: O Erro de Passada Que Causa 80% das Lesões', category: 'Biomecânica' },
  { slug: 'apoio-pe-corrida-heel-mid-forefoot', title: 'Apoio do Pé na Corrida: Calcanhar, Médio ou Antepé?', category: 'Biomecânica' },
  { slug: 'postura-corrida-tronco-ombros-braços', title: 'Postura na Corrida: Tronco, Ombros e Braços Corretos', category: 'Biomecânica' },
  { slug: 'fraqueza-gluteos-lesões-corrida', title: 'Glúteos Fracos: A Causa Oculta de Lesões em Corredores', category: 'Biomecânica' },
  { slug: 'drop-calcado-zero-drop-corrida', title: 'Drop do Calçado: De Zero Drop a 12mm — Qual é o Certo?', category: 'Biomecânica' },
  { slug: 'arm-swing-balanco-braços-corrida', title: 'Balanço de Braços: Como os Membros Superiores Afetam a Corrida', category: 'Biomecânica' },
  { slug: 'análise-corrida-gait-analysis', title: 'Análise de Corrida (Gait Analysis): Vale a Pena Fazer?', category: 'Biomecânica' },
  // RECUPERAÇÃO
  { slug: 'recuperacao-ativa-vs-passiva-quando', title: 'Recuperação Ativa vs Passiva: Quando Escolher Cada Uma', category: 'Recuperação' },
  { slug: 'foam-roller-miofascial-corrida', title: 'Foam Roller para Corredores: Ciência e Protocolo Eficaz', category: 'Recuperação' },
  { slug: 'massagem-desportiva-recuperação-corrida', title: 'Massagem Desportiva: Quando Ajuda e Quando é Perda de Tempo', category: 'Recuperação' },
  { slug: 'crioterapia-banho-gelo-beneficios', title: 'Crioterapia: O Que a Ciência Diz Sobre Banhos de Gelo', category: 'Recuperação' },
  { slug: 'sauna-calor-corrida-recuperação', title: 'Sauna para Corredores: Adaptações ao Calor e Recuperação', category: 'Recuperação' },
  { slug: 'compressão-meias-calções-corrida', title: 'Roupas de Compressão: Evidência Científica para Corredores', category: 'Recuperação' },
  { slug: 'nutrição-imunidade-overtraining-prevencao', title: 'Imunidade do Corredor: Como o Excesso de Treino Baixa as Defesas', category: 'Recuperação' },
  { slug: 'deload-semana-recuperacao-programar', title: 'Semana de Deload: Como e Quando Programar o Descanso Ativo', category: 'Recuperação' },
  { slug: 'cortisol-treino-recuperacao-atletas', title: 'Cortisol e Treino: O Hormona do Stress Que Controla a Recuperação', category: 'Recuperação' },
  { slug: 'sono-qualidade-atletas-otimizar', title: 'Otimizar o Sono como Atleta: O Guia Baseado em Evidência', category: 'Recuperação' },
  // LESÕES
  { slug: 'fascite-plantar-tratamento-corrida', title: 'Fascite Plantar: Tratamento, Retorno ao Treino e Prevenção', category: 'Lesões' },
  { slug: 'periostite-tibial-canelite-corredores', title: 'Periostite Tibial (Canelite): Causas Reais e Como Resolver', category: 'Lesões' },
  { slug: 'sindrome-iliotibial-joelho-corredor', title: 'Síndrome da Banda Iliotibial: O Joelho do Corredor Desmistificado', category: 'Lesões' },
  { slug: 'fratura-stress-metatarso-prevencao', title: 'Fratura de Stress: Como Identificar e Prevenir em Corredores', category: 'Lesões' },
  { slug: 'tendinite-rotuliana-jumpers-knee', title: 'Tendinopatia Rotuliana: Diagnóstico e Protocolo de Recuperação', category: 'Lesões' },
  { slug: 'nervo-ciático-dor-corrida-lombalgias', title: 'Dor Lombar e Ciática em Corredores: Causas e Abordagem', category: 'Lesões' },
  { slug: 'bolhas-pés-prevencao-ultratrail', title: 'Bolhas nos Pés: Prevenção e Tratamento em Trail e Maratona', category: 'Lesões' },
  { slug: 'síndrome-compartimento-perna-corrida', title: 'Síndrome de Compartimento Crónico: A Lesão Mal Diagnosticada', category: 'Lesões' },
  { slug: 'retorno-corrida-apos-lesão-progressão', title: 'Retorno ao Treino Após Lesão: Protocolo Baseado em Evidência', category: 'Lesões' },
  // PSICOLOGIA
  { slug: 'visualização-mental-corrida-performance', title: 'Visualização Mental: A Técnica dos Atletas de Elite Funciona?', category: 'Psicologia' },
  { slug: 'flow-state-corrida-como-entrar', title: 'Estado de Flow na Corrida: Como Entrar na Zona', category: 'Psicologia' },
  { slug: 'ansiedade-pre-prova-corredores', title: 'Ansiedade Pré-Corrida: Transformar Nervosismo em Combustível', category: 'Psicologia' },
  { slug: 'dialogo-interno-corrida-positivo', title: 'Diálogo Interno: Como as Palavras na Tua Cabeça Afetam a Corrida', category: 'Psicologia' },
  { slug: 'objetivos-smart-corrida-planear', title: 'Definir Objetivos em Corrida: O Sistema SMART Aplicado ao Atletismo', category: 'Psicologia' },
  { slug: 'burn-out-desportivo-sinais-prevencao', title: 'Burnout Desportivo em Corredores: Sinais e Como Prevenir', category: 'Psicologia' },
  { slug: 'gestao-dor-corrida-dissociar-associar', title: 'Associação vs Dissociação: Estratégias Mentais para Aguentar a Dor', category: 'Psicologia' },
  { slug: 'identidade-corredor-propósito-treino', title: 'Identidade de Corredor: Como o Propósito Sustenta a Consistência', category: 'Psicologia' },
  // TRAIL RUNNING
  { slug: 'material-obrigatorio-trail-running', title: 'Material Obrigatório em Trail: O Que Levar e Por Quê', category: 'Trail Running' },
  { slug: 'navigacao-trail-mapa-compasso', title: 'Navegação em Trail: Mapa, Bússola e GPS — Quando Usar Cada Um', category: 'Trail Running' },
  { slug: 'preparação-física-ultra-trail-100k', title: 'Preparação para Ultra Trail de 100km: O Guia Completo', category: 'Trail Running' },
  { slug: 'nutricao-postos-abastecimento-ultra', title: 'Estratégia de Abastecimento em Ultra Trail: O Que Comer em Cada Posto', category: 'Trail Running' },
  { slug: 'caminhada-estratégica-subida-trail', title: 'Caminhar em Trail Não é Fraqueza — É Estratégia', category: 'Trail Running' },
  { slug: 'trail-night-running-segurança', title: 'Night Running em Trail: Segurança, Equipamento e Preparação Mental', category: 'Trail Running' },
  { slug: 'desnivel-equivalente-pace-trail', title: 'Desnível Equivalente: Como Planear o Pace em Trail Running', category: 'Trail Running' },
  { slug: 'aclimatacao-altitude-trail-competição', title: 'Aclimatação à Altitude para Provas de Trail de Montanha', category: 'Trail Running' },
  { slug: 'prova-trail-primeira-vez-conselhos', title: 'Primeira Prova de Trail: O Guia para Não Cometer os Erros Clássicos', category: 'Trail Running' },
  // MARATONA ESPECÍFICO
  { slug: 'plano-treino-maratona-sub3', title: 'Plano de Treino para Maratona Sub-3 Horas', category: 'Treino' },
  { slug: 'plano-treino-maratona-sub4', title: 'Plano de Treino para Maratona Sub-4 Horas', category: 'Treino' },
  { slug: 'maratona-positivo-negativo-split', title: 'Positive vs Negative Split em Maratona: Qual é Mais Rápido?', category: 'Treino' },
  { slug: 'simulação-prova-maratona-treino', title: 'Simular a Maratona em Treino: Os Blocos de Corrida Específica', category: 'Treino' },
  { slug: 'dia-de-prova-maratona-rotina', title: 'Rotina no Dia da Maratona: Dos 3 Dias Antes à Linha de Partida', category: 'Treino' },
  { slug: 'agasalho-maratona-descarte-estrategia', title: 'Agasalho de Descarte na Maratona: Estratégia e Gestão do Frio', category: 'Treino' },
  { slug: 'meia-maratona-sub-1h30-treino', title: 'Meia Maratona Sub-1h30: O Plano e os Treinos Chave', category: 'Treino' },
  { slug: 'meia-maratona-sub-2h-principiantes', title: 'Meia Maratona Sub-2h: Plano para Corredores que Querem Evoluir', category: 'Treino' },
  // VO2MAX ESPECÍFICO
  { slug: 'teste-vo2max-campo-protocolos', title: 'Como Estimar o VO2max Sem Laboratório: Testes de Campo Validados', category: 'Fisiologia' },
  { slug: 'vo2max-relógio-garmin-polar-fiabilidade', title: 'VO2max no Relógio GPS: O Quanto É Fiável?', category: 'Fisiologia' },
  { slug: 'intervalos-vo2max-30-30-nordbeck', title: '30/30 e 60/60: Os Intervalos Que Mais Aumentam o VO2max', category: 'Treino' },
  // FORÇA
  { slug: 'agachamento-corredores-como-fazer', title: 'Agachamento para Corredores: Técnica, Variantes e Progressão', category: 'Treino' },
  { slug: 'força-reativa-plyometria-corrida', title: 'Pliometria para Corredores: Força Reativa e Economia de Corrida', category: 'Treino' },
  { slug: 'core-corredores-exercicios-eficazes', title: 'Core para Corredores: Os Exercícios Que Realmente Importam', category: 'Treino' },
  { slug: 'hip-stability-quadril-corrida', title: 'Estabilidade do Quadril: A Base de Uma Corrida Sem Lesões', category: 'Biomecânica' },
  { slug: 'musculação-corrida-perder-velocidade', title: 'Musculação Torna os Corredores Mais Lentos? A Evidência Diz o Contrário', category: 'Treino' },
  // EQUIPAMENTO E TECNOLOGIA
  { slug: 'relógio-gps-metricas-corrida-importantes', title: 'As 7 Métricas do Relógio GPS Que Todo o Corredor Deve Monitorizar', category: 'Treino' },
  { slug: 'carbono-placa-sapatos-benefícios-riscos', title: 'Sapatos com Placa de Carbono: Vale o Investimento?', category: 'Treino' },
  { slug: 'potencia-running-power-garmin', title: 'Running Power: A Métrica que Vai Substituir o Pace?', category: 'Treino' },
  { slug: 'training-load-stress-score-vercel', title: 'Training Load e ATL/CTL: Como Gerir a Carga de Treino com Dados', category: 'Treino' },
  // JOVENS E VETERANOS
  { slug: 'master-runners-treino-acima-40', title: 'Corredores Masters: Como Treinar Acima dos 40 Anos', category: 'Treino' },
  { slug: 'declínio-vo2max-envelhecimento-atletismo', title: 'Envelhecimento e Performance: Quanto Podemos Travar o Declínio?', category: 'Fisiologia' },
  { slug: 'corrida-gravidez-retorno-pos-parto', title: 'Corrida Durante e Após a Gravidez: O Guia Baseado em Evidência', category: 'Treino' },
  // PROVAS E COMPETIÇÃO
  { slug: 'aquecimento-corrida-antes-prova-protocolo', title: 'Aquecimento Antes da Corrida: O Protocolo Ideal para Cada Distância', category: 'Treino' },
  { slug: 'arrefecimento-cool-down-importancia', title: 'Cool Down: O Que Acontece se Parares a Correr de Repente', category: 'Recuperação' },
  { slug: 'treino-calor-acclimatação-maratona-verão', title: 'Treinar no Calor para Maratona de Verão: Protocolo de Acclimatação', category: 'Treino' },
  { slug: '5km-treino-velocidade-sub20', title: '5km Sub-20 Minutos: O Plano de Treino e os Blocos Chave', category: 'Treino' },
  { slug: '10km-sub-45-minutos-treino', title: '10km Sub-45 Minutos: Estrutura de Treino para Corredores Intermédios', category: 'Treino' },
  { slug: 'ultramarathon-primeiro-100k-guia', title: 'Primeiro Ultramaratona de 100km: Tudo o que Precisas de Saber', category: 'Trail Running' },
]

// ─────────────────────────────────────────────────────────────────────────────
// FUNÇÕES AUXILIARES
// ─────────────────────────────────────────────────────────────────────────────

function getExistingSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true })
    return new Set()
  }
  return new Set(
    fs.readdirSync(ARTICLES_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
  )
}

function loadCounter() {
  if (fs.existsSync(COUNTER_FILE)) {
    try { return JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8')) }
    catch { /* ignore */ }
  }
  return { lastIndex: -1, lastDate: '', lastSlug: '' }
}

function saveCounter(index, date, slug) {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ lastIndex: index, lastDate: date, lastSlug: slug }, null, 2))
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[àáâãä]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n').replace(/ê/g, 'e')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    .trim()
}

async function callGroq(prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2500,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

function buildPrompt(topic) {
  return `Escreve um artigo completo em português de Portugal (não brasileiro) sobre corrida para o site performancerunning.pt.

Tópico: "${topic.title}"
Categoria: ${topic.category}

REGRAS OBRIGATÓRIAS:
1. Tom profissional, técnico mas acessível — como um treinador de elite a explicar ciência
2. Nunca soar a IA genérica. Sem frases como "Neste artigo vamos explorar..."
3. Português de Portugal — nunca brasileirismos (usa "treino" não "treinamento", "evidência" não "evidência científica" em excesso, etc.)
4. Citar estudos reais quando possível (ex: "Helgerud et al., 2007")
5. Incluir exemplos práticos e aplicáveis
6. Estrutura com H2 (##) e H3 (###), listas quando útil
7. Comprimento: 800-1200 palavras de corpo (sem contar frontmatter)

Responde APENAS com o conteúdo markdown do artigo (sem frontmatter, começa diretamente com o corpo).
Começa com uma introdução forte de 2-3 parágrafos sem cabeçalho, depois usa ## para as secções principais.`
}

function buildMdx(topic, content, date) {
  return `---
title: "${topic.title.replace(/"/g, '\\"')}"
date: ${date}
category: "${topic.category}"
excerpt: "${extractExcerpt(content)}"
readTime: ${estimateReadTime(content)}
---

${content.trim()}
`
}

function extractExcerpt(content) {
  // Pega o primeiro parágrafo não vazio sem markdown
  const lines = content.split('\n')
  for (const line of lines) {
    const clean = line.replace(/[#*_`>]/g, '').trim()
    if (clean.length > 80) {
      return clean.slice(0, 200).replace(/"/g, '\\"') + '…'
    }
  }
  return ''
}

function estimateReadTime(content) {
  const words = content.split(/\s+/).length
  return Math.max(4, Math.round(words / 200))
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const today = new Date().toISOString().slice(0, 10)
  const existingSlugs = getExistingSlugs()
  const counter = loadCounter()

  console.log(`📅 Data: ${today}`)
  console.log(`📚 Artigos existentes: ${existingSlugs.size}`)
  console.log(`📍 Último índice: ${counter.lastIndex}`)

  // Filtra tópicos ainda não publicados
  const remaining = ALL_TOPICS.filter(t => !existingSlugs.has(t.slug))
  console.log(`📋 Tópicos disponíveis: ${remaining.length}`)

  if (remaining.length === 0) {
    console.log('⚠️  Todos os tópicos já foram publicados. Adiciona mais ao array ALL_TOPICS.')
    process.exit(0)
  }

  // Pega os próximos N tópicos
  const toGenerate = remaining.slice(0, ARTICLES_PER_RUN)
  let lastIndex = counter.lastIndex
  let lastSlug = counter.lastSlug

  for (const topic of toGenerate) {
    console.log(`\n✍️  A gerar: ${topic.title}`)

    try {
      const content = await callGroq(buildPrompt(topic))
      const mdx = buildMdx(topic, content, today)
      const filePath = path.join(ARTICLES_DIR, `${topic.slug}.md`)

      fs.writeFileSync(filePath, mdx, 'utf8')
      console.log(`✅ Guardado: ${filePath}`)

      lastIndex++
      lastSlug = topic.slug

      // Pausa entre chamadas à API
      await new Promise(r => setTimeout(r, 1500))
    } catch (err) {
      console.error(`❌ Erro ao gerar ${topic.slug}:`, err.message)
      process.exit(1)
    }
  }

  saveCounter(lastIndex, today, lastSlug)
  console.log(`\n🎉 ${toGenerate.length} artigos gerados para ${today}`)
}

main().catch(err => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
