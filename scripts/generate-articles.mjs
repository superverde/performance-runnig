/**
 * generate-articles.mjs
 * Gera e publica os 3 artigos diários do blog Performance Running:
 * 2 artigos TÉCNICOS + 1 artigo COMERCIAL de equipamento.
 * Corre via GitHub Actions todos os dias, de forma totalmente independente
 * do computador do utilizador ou de qualquer sessão do Claude.
 *
 * Uso: node scripts/generate-articles.mjs
 * Requer: GROQ_API_KEY como variável de ambiente
 *
 * IMPORTANTE: este é o ÚNICO sistema automático de publicação de artigos.
 * O cron do Vercel (/api/cron/auto-article) e a tarefa agendada do Claude
 * Cowork foram desativados para evitar duplicação — ver commit que
 * introduziu este ficheiro para contexto.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'blog')
const COUNTER_FILE = path.join(ARTICLES_DIR, '_topic_counter.json')
const GROQ_API_KEY = process.env.GROQ_API_KEY
const TECHNICAL_PER_RUN = 2
const COMMERCIAL_PER_RUN = 1

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY não definida')
  process.exit(1)
}

// ─────────────────────────────────────────────────────────────────────────────
// BANCO DE TÓPICOS TÉCNICOS — 150+ tópicos únicos sobre corrida, trail e atletismo
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
  // EQUIPAMENTO E TECNOLOGIA (técnico, não confundir com o pool comercial)
  { slug: 'relógio-gps-metricas-corrida-importantes', title: 'As 7 Métricas do Relógio GPS Que Todo o Corredor Deve Monitorizar', category: 'Treino' },
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
// BANCO DE TÓPICOS COMERCIAIS — 30 temas com intenção de compra (categoria Equipamento)
// ─────────────────────────────────────────────────────────────────────────────
const COMMERCIAL_TOPICS = [
  { slug: 'melhores-sapatilhas-corrida-maratona-2026', title: 'Melhores Sapatilhas de Corrida para Maratona em 2026', category: 'Equipamento' },
  { slug: 'melhores-relogios-gps-corrida-trail-2026', title: 'Melhores Relógios GPS para Corrida e Trail em 2026', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-trail-terrenos-tecnicos', title: 'Melhores Sapatilhas de Trail Running para Terrenos Técnicos', category: 'Equipamento' },
  { slug: 'sapatilhas-corrida-melhor-relacao-qualidade-preco', title: 'Sapatilhas de Corrida com Melhor Relação Qualidade/Preço', category: 'Equipamento' },
  { slug: 'melhores-mochilas-coletes-hidratacao-trail-2026', title: 'Melhores Mochilas e Coletes de Hidratação para Trail', category: 'Equipamento' },
  { slug: 'garmin-vs-coros-vs-suunto-relogio-trail-2026', title: 'Garmin vs. Coros vs. Suunto: Que Relógio Escolher para Trail', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-corredores-pesados-80kg', title: 'Melhores Sapatilhas para Corredores Pesados (+80kg)', category: 'Equipamento' },
  { slug: 'melhores-geis-energeticos-maratona-comparativo', title: 'Melhores Géis Energéticos para Maratona: Comparativo', category: 'Equipamento' },
  { slug: 'como-escolher-sapatilhas-corrida-guia-pisada', title: 'Como Escolher Sapatilhas de Corrida: Guia Completo por Tipo de Pisada', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-treino-diario-daily-trainers-2026', title: 'Melhores Sapatilhas de Treino Diário (Daily Trainers) 2026', category: 'Equipamento' },
  { slug: 'bastoes-trail-running-quando-usar-quais-escolher', title: 'Bastões de Trail Running: Quando Usar e Quais Escolher', category: 'Equipamento' },
  { slug: 'melhores-fones-para-correr-osso-vs-in-ear', title: 'Melhores Fones para Correr: Osso vs. In-Ear', category: 'Equipamento' },
  { slug: 'roupa-corrida-inverno-guia-camadas', title: 'Roupa de Corrida para Inverno: Guia de Camadas', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-5km-10km-rapidos', title: 'Melhores Sapatilhas para 5km e 10km Rápidos', category: 'Equipamento' },
  { slug: 'frontais-lanternas-trail-noturno-guia-compra', title: 'Frontais (Lanternas) para Trail Noturno: Guia de Compra', category: 'Equipamento' },
  { slug: 'melhores-meias-corrida-prevencao-bolhas-conforto', title: 'Melhores Meias de Corrida: Prevenção de Bolhas e Conforto', category: 'Equipamento' },
  { slug: 'cintos-porta-dorsais-corrida-o-que-usar-prova', title: 'Cintos e Porta-Dorsais de Corrida: O Que Usar em Prova', category: 'Equipamento' },
  { slug: 'smartwatches-baratos-comecar-correr-ate-250', title: 'Smartwatches Baratos para Começar a Correr: Até 250€', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-meia-maratona-2026', title: 'Melhores Sapatilhas de Meia Maratona 2026', category: 'Equipamento' },
  { slug: 'oculos-sol-corrida-trail-o-que-importa', title: 'Óculos de Sol para Corrida e Trail: O Que Importa', category: 'Equipamento' },
  { slug: 'rolo-espuma-pistolas-massagem-valem-a-pena', title: 'Rolo de Espuma e Pistolas de Massagem: Valem a Pena?', category: 'Equipamento' },
  { slug: 'melhores-barras-alimentos-solidos-ultra-trail', title: 'Melhores Barras e Alimentos Sólidos para Ultra Trail', category: 'Equipamento' },
  { slug: 'passadeiras-treinar-em-casa-guia-compra', title: 'Passadeiras para Treinar em Casa: Guia de Compra', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-maximalistas-amortecimento-alto', title: 'Melhores Sapatilhas Maximalistas (Amortecimento Alto)', category: 'Equipamento' },
  { slug: 'impermeaveis-corta-ventos-trail-gore-tex-alternativas', title: 'Impermeáveis e Corta-Ventos para Trail: Guia GORE-TEX vs. Alternativas', category: 'Equipamento' },
  { slug: 'medidores-potencia-corrida-stryd-vale-a-pena', title: 'Medidores de Potência de Corrida (Stryd): Vale a Pena?', category: 'Equipamento' },
  { slug: 'melhores-apps-treino-corrida-2026-gratis-vs-pagas', title: 'Melhores Apps de Treino de Corrida em 2026: Grátis vs. Pagas', category: 'Equipamento' },
  { slug: 'equipamento-obrigatorio-ultra-trail-checklist', title: 'Equipamento Obrigatório para Ultra Trail: Checklist Completo', category: 'Equipamento' },
  { slug: 'prendas-corredores-melhores-ideias-orcamento', title: 'Prendas para Corredores: As Melhores Ideias por Orçamento', category: 'Equipamento' },
]

// ─────────────────────────────────────────────────────────────────────────────
// BANCO DE REFERÊNCIAS CIENTÍFICAS REAIS (por categoria) — usado para garantir
// que a secção de Referências nunca cita estudos inventados. O modelo é
// instruído a ESCOLHER destas listas, nunca a inventar DOIs novos.
// ─────────────────────────────────────────────────────────────────────────────
const REFERENCE_BANK = {
  'Fisiologia': [
    'Bassett, D. R., & Howley, E. T. (2000). Limiting factors for maximum oxygen uptake and determinants of endurance performance. Medicine & Science in Sports & Exercise, 32(1), 70-84. https://doi.org/10.1097/00005768-200001000-00012',
    'Jones, A. M., & Carter, H. (2000). The effect of endurance training on parameters of aerobic fitness. Sports Medicine, 29(6), 373-386. https://doi.org/10.2165/00007256-200029060-00001',
    'Saltin, B., & Astrand, P. O. (1967). Maximal oxygen uptake in athletes. Journal of Applied Physiology, 23(3), 353-358. https://doi.org/10.1152/jappl.1967.23.3.353',
    'Midgley, A. W., McNaughton, L. R., & Wilkinson, M. (2006). Is there an optimal training intensity for enhancing the maximal oxygen uptake in distance runners? Sports Medicine, 36(2), 117-132. https://doi.org/10.2165/00007256-200636020-00003',
  ],
  'Treino': [
    'Seiler, S. (2010). What is best practice for training intensity and duration distribution in endurance athletes? International Journal of Sports Physiology and Performance, 5(3), 276-291. https://doi.org/10.1123/ijspp.5.3.276',
    'Laursen, P. B. (2010). Training for intense exercise performance: high-intensity or high-volume training? Scandinavian Journal of Medicine & Science in Sports, 20(s2), 1-10. https://doi.org/10.1111/j.1600-0838.2010.01184.x',
    'Buchheit, M., & Laursen, P. B. (2013). High-intensity interval training, solutions to the programming puzzle. Sports Medicine, 43(5), 313-338. https://doi.org/10.1007/s40279-013-0029-x',
    'Bompa, T. O., & Buzzichelli, C. (2018). Periodization: Theory and Methodology of Training (6th ed.). Human Kinetics.',
  ],
  'Nutrição': [
    'Jeukendrup, A. E. (2014). A step towards personalized sports nutrition: carbohydrate intake during exercise. Sports Medicine, 44(Suppl 1), 25-33. https://doi.org/10.1007/s40279-014-0148-z',
    'Burke, L. M., Hawley, J. A., Wong, S. H., & Jeukendrup, A. E. (2011). Carbohydrates for training and competition. Journal of Sports Sciences, 29(sup1), S17-S27. https://doi.org/10.1080/02640414.2011.585473',
    'Thomas, D. T., Erdman, K. A., & Burke, L. M. (2016). American College of Sports Medicine Joint Position Statement: Nutrition and Athletic Performance. Medicine & Science in Sports & Exercise, 48(3), 543-568. https://doi.org/10.1249/MSS.0000000000000852',
    'Maughan, R. J., & Shirreffs, S. M. (2010). Dehydration and rehydration in competitive sport. Scandinavian Journal of Medicine & Science in Sports, 20(s3), 40-47. https://doi.org/10.1111/j.1600-0838.2010.01207.x',
  ],
  'Biomecânica': [
    'Moore, I. S. (2016). Is there an economical running technique? A review of modifiable biomechanical factors affecting running economy. Sports Medicine, 46(6), 793-807. https://doi.org/10.1007/s40279-016-0474-4',
    'Lieberman, D. E., Venkadesan, M., Werbel, W. A., Daoud, A. I., D\'Andrea, S., Davis, I. S., Mang\'eni, R. O., & Pitsiladis, Y. (2010). Foot strike patterns and collision forces in habitually barefoot versus shod runners. Nature, 463(7280), 531-535. https://doi.org/10.1038/nature08723',
    'Daoud, A. I., Geissler, G. J., Wang, F., Saretsky, J., Daoud, Y. A., & Lieberman, D. E. (2012). Foot strike and injury rates in endurance runners: a retrospective study. Medicine & Science in Sports & Exercise, 44(7), 1325-1334. https://doi.org/10.1249/MSS.0b013e3182465115',
    'Novacheck, T. F. (1998). The biomechanics of running. Gait & Posture, 7(1), 77-95. https://doi.org/10.1016/S0966-6362(97)00038-6',
  ],
  'Recuperação': [
    'Kellmann, M., Bertollo, M., Bosquet, L., et al. (2018). Recovery and Performance in Sport: Consensus Statement. International Journal of Sports Physiology and Performance, 13(2), 240-245. https://doi.org/10.1123/ijspp.2017-0759',
    'Halson, S. L. (2014). Monitoring training load to understand fatigue in athletes. Sports Medicine, 44(Suppl 2), 139-147. https://doi.org/10.1007/s40279-014-0253-z',
    'Bishop, P. A., Jones, E., & Woods, A. K. (2008). Recovery from training: a brief review. Journal of Strength and Conditioning Research, 22(3), 1015-1024. https://doi.org/10.1519/JSC.0b013e31816eb518',
    'Vitale, K. C., Owens, R., Hopkins, S. R., & Malhotra, A. (2019). Sleep hygiene for optimizing recovery in athletes: review and recommendations. International Journal of Sports Medicine, 40(8), 535-543. https://doi.org/10.1055/a-0905-3103',
  ],
  'Lesões': [
    'van Gent, R. N., Siem, D., van Middelkoop, M., van Os, A. G., Bierma-Zeinstra, S. M. A., & Koes, B. W. (2007). Incidence and determinants of lower extremity running injuries in long distance runners. British Journal of Sports Medicine, 41(8), 469-480. https://doi.org/10.1136/bjsm.2006.033548',
    'Lopes, A. D., Hespanhol Júnior, L. C., Yeung, S. S., & Costa, L. O. P. (2012). What are the main running-related musculoskeletal injuries? Sports Medicine, 42(10), 891-905. https://doi.org/10.1007/BF03262301',
    'Warden, S. J., Davis, I. S., & Fredericson, M. (2014). Management and prevention of bone stress injuries in long-distance runners. Journal of Orthopaedic & Sports Physical Therapy, 44(10), 749-765. https://doi.org/10.2519/jospt.2014.5334',
    'Taunton, J. E., Ryan, M. B., Clement, D. B., McKenzie, D. C., Lloyd-Smith, D. R., & Zumbo, B. D. (2002). A retrospective case-control analysis of 2002 running injuries. British Journal of Sports Medicine, 36(2), 95-101. https://doi.org/10.1136/bjsm.36.2.95',
  ],
  'Psicologia': [
    'Brick, N., MacIntyre, T., & Campbell, M. (2014). Attentional focus in endurance activity: new paradigms and future directions. International Review of Sport and Exercise Psychology, 7(1), 106-134. https://doi.org/10.1080/1750984X.2014.885554',
    'Tenenbaum, G., & Eklund, R. C. (Eds.). (2007). Handbook of Sport Psychology (3rd ed.). John Wiley & Sons.',
    'Noakes, T. D. (2012). Fatigue is a brain-derived emotion that regulates the exercise behavior to ensure the protection of whole body homeostasis. Frontiers in Physiology, 3, 82. https://doi.org/10.3389/fphys.2012.00082',
    'McCormick, A., Meijen, C., & Marcora, S. (2015). Psychological determinants of whole-body endurance performance. Sports Medicine, 45(7), 997-1015. https://doi.org/10.1007/s40279-015-0319-6',
  ],
  'Trail Running': [
    'Vernillo, G., Giandolini, M., Edwards, W. B., Morin, J. B., Samozino, P., Horvais, N., & Millet, G. Y. (2017). Biomechanics and physiology of uphill and downhill running. Sports Medicine, 47(4), 615-629. https://doi.org/10.1007/s40279-016-0605-y',
    'Millet, G. Y., Tomazin, K., Verges, S., et al. (2011). Neuromuscular consequences of an extreme mountain ultra-marathon. PLoS ONE, 6(2), e17059. https://doi.org/10.1371/journal.pone.0017059',
    'Scheer, V., Basset, P., Giovanelli, N., Vernillo, G., Millet, G. P., & Costa, R. J. S. (2020). Defining off-road running: a position statement. Sports Medicine, 50(3), 1-13. https://doi.org/10.1007/s40279-019-01237-0',
    'Balducci, P., Clémençon, M., Trama, R., Blache, Y., & Hautier, C. (2017). Performance factors in a mountain ultramarathon. International Journal of Sports Medicine, 38(11), 819-825. https://doi.org/10.1055/s-0043-112339',
  ],
}

// Referências transversais (equipamento/biomecânica de calçado) usadas no artigo comercial
const COMMERCIAL_REFERENCE_BANK = [
  'Nigg, B. M., Baltich, J., Hoerzer, S., & Enders, H. (2015). Running shoes and running injuries: mythbusting and a proposal for two new paradigms. British Journal of Sports Medicine, 49(20), 1290-1294. https://doi.org/10.1136/bjsports-2015-095054',
  'Hoogkamer, W., Kipp, S., Frank, J. H., Farina, E. M., Luo, G., & Kram, R. (2018). A comparison of the energetic cost of running in marathon racing shoes. Sports Medicine, 48(4), 1009-1019. https://doi.org/10.1007/s40279-017-0811-2',
  'Malisoux, L., Chambon, N., Delattre, N., Gueguen, N., Urhausen, A., & Theisen, D. (2016). Injury risk in runners using standard or motion control shoes: a randomised controlled trial. British Journal of Sports Medicine, 50(8), 481-487. https://doi.org/10.1136/bjsports-2015-094929',
  'Fuller, J. T., Bellenger, C. R., Thewlis, D., Tsiros, M. D., & Buckley, J. D. (2015). The effect of footwear on running performance and running economy in distance runners. Sports Medicine, 45(3), 411-422. https://doi.org/10.1007/s40279-014-0283-6',
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

// A conta Groq gratuita ("on_demand") tem um limite de tokens por minuto (TPM)
// baixo (6000 TPM à data de escrita). Com prompts mais longos (banco de
// referências incluído), uma única chamada já usa perto do limite — por isso
// esta função faz retry com backoff quando apanha um 429 rate_limit_exceeded,
// em vez de abortar a publicação do dia inteiro.
async function callGroq(prompt, attempt = 1) {
  const MAX_ATTEMPTS = 3
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
      max_tokens: 2200,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()

    if (res.status === 429 && attempt < MAX_ATTEMPTS) {
      const match = errText.match(/try again in ([\d.]+)s/i)
      const suggested = match ? parseFloat(match[1]) : 30
      const waitMs = Math.ceil((suggested + 5) * 1000) // +5s de margem
      console.log(`  ⏳ Rate limit (429). A aguardar ${Math.round(waitMs / 1000)}s antes de tentar novamente (tentativa ${attempt + 1}/${MAX_ATTEMPTS})...`)
      await new Promise(r => setTimeout(r, waitMs))
      return callGroq(prompt, attempt + 1)
    }

    throw new Error(`Groq API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

function buildTechnicalPrompt(topic) {
  const refs = REFERENCE_BANK[topic.category] || REFERENCE_BANK['Treino']
  const refsList = refs.map((r, i) => `${i + 1}. ${r}`).join('\n')

  return `Escreve um artigo completo em português de Portugal (não brasileiro) sobre corrida para o site performancerunning.pt.

Tópico: "${topic.title}"
Categoria: ${topic.category}

REGRAS OBRIGATÓRIAS:
1. Tom profissional, técnico mas acessível — como um treinador de elite a explicar ciência
2. Nunca soar a IA genérica. Sem frases como "Neste artigo vamos explorar..."
3. Português de Portugal — nunca brasileirismos (usa "treino" não "treinamento", "fixe" não "legal", etc.)
4. Incluir exemplos práticos e aplicáveis, com valores numéricos e protocolos quando fizer sentido
5. Estrutura com ## para secções principais (Base Científica, Aplicação Prática, Erros Comuns, Protocolo/Conclusão)
6. Comprimento: 800-1200 palavras de corpo (sem contar frontmatter nem referências)
7. OBRIGATÓRIO — termina SEMPRE com uma secção "## Referências Científicas" citando PELO MENOS 4 das referências da lista abaixo (as que forem mais relevantes ao tópico). Copia a referência EXATAMENTE como está fornecida, não alteres nem inventes autores, títulos, revistas ou DOIs. NUNCA acrescentes uma referência que não esteja nesta lista.

REFERÊNCIAS DISPONÍVEIS (escolhe no mínimo 4, podes usar todas se fizer sentido):
${refsList}

Responde APENAS com o conteúdo markdown do artigo (sem frontmatter, começa diretamente com o corpo, incluindo a secção final de Referências Científicas).
Começa com uma introdução forte de 2-3 parágrafos sem cabeçalho, depois usa ## para as secções principais.`
}

function buildCommercialPrompt(topic, relatedSlugs) {
  const refsList = COMMERCIAL_REFERENCE_BANK.map((r, i) => `${i + 1}. ${r}`).join('\n')
  const related = relatedSlugs.slice(0, 2).map(s => `/blog/${s}`)

  return `Escreve um artigo de compra completo em português de Portugal (não brasileiro) sobre equipamento de corrida para o site performancerunning.pt.

Título: "${topic.title}"
Categoria: Equipamento

REGRAS OBRIGATÓRIAS:
1. Tom de especialista/reviewer de equipamento de alta performance — nunca genérico ou tipo "loja online"
2. Português de Portugal — nunca brasileirismos
3. Estrutura com ## para secções: Introdução (sem cabeçalho, 100-150 palavras), "## Como Escolher: Critérios Que Importam" (250-350 palavras, critérios técnicos com base científica), "## As Melhores Opções em 2026" (4-6 produtos reais e atuais: nome, para quem é, pontos fortes/fracos, faixa de preço — NUNCA preços exatos, usa faixas como "entre 150€ e 200€"), "## Veredicto: Qual Comprar" (150-200 palavras, recomendação por perfil: iniciante, competidor, orçamento limitado)
4. Incluir no mínimo 3 links internos no corpo do texto: um para [Equipamento](/equipamento), e links para estes dois artigos relacionados: [artigo relacionado 1](${related[0] || '/equipamento'}) e [artigo relacionado 2](${related[1] || '/equipamento'})
5. Terminar o corpo (antes das referências) com a linha: "👉 **Vê a nossa seleção completa de equipamento testado em [performancerunning.pt/equipamento](/equipamento)**"
6. Comprimento: 900-1200 palavras de corpo (sem contar frontmatter nem referências)
7. OBRIGATÓRIO — termina SEMPRE com uma secção "## Referências" citando PELO MENOS 3 das referências da lista abaixo. Copia a referência EXATAMENTE como está fornecida, não alteres nem inventes autores, títulos, revistas ou DOIs. NUNCA acrescentes uma referência que não esteja nesta lista.

REFERÊNCIAS DISPONÍVEIS (escolhe no mínimo 3):
${refsList}

Responde APENAS com o conteúdo markdown do artigo (sem frontmatter, começa diretamente com o corpo, incluindo a secção final de Referências).`
}

function extractExcerpt(content) {
  const lines = content.split('\n')
  for (const line of lines) {
    const clean = line.replace(/[#*_`>👉]/g, '').trim()
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

function buildMdx(topic, content, date) {
  return `---
title: "${topic.title.replace(/"/g, '\\"')}"
date: '${date}'
category: "${topic.category}"
excerpt: "${extractExcerpt(content)}"
readTime: ${estimateReadTime(content)}
---

${content.trim()}
`
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

  const remainingTechnical = ALL_TOPICS.filter(t => !existingSlugs.has(t.slug))
  const remainingCommercial = COMMERCIAL_TOPICS.filter(t => !existingSlugs.has(t.slug))

  console.log(`📋 Tópicos técnicos disponíveis: ${remainingTechnical.length}`)
  console.log(`🛒 Tópicos comerciais disponíveis: ${remainingCommercial.length}`)

  if (remainingTechnical.length === 0 && remainingCommercial.length === 0) {
    console.log('⚠️  Todos os tópicos já foram publicados. Adiciona mais aos arrays.')
    process.exit(0)
  }

  // Pausa generosa entre chamadas à Groq — a conta gratuita tem um limite de
  // tokens/minuto (TPM) baixo, e os prompts com banco de referências usam
  // bastante margem desse limite numa só chamada. Esperar aqui em vez de só
  // confiar no retry reduz a probabilidade de sequer bater no rate limit.
  const PAUSE_BETWEEN_CALLS_MS = 25000

  let lastIndex = counter.lastIndex
  let lastSlug = counter.lastSlug
  const publishedTitles = []
  let isFirstCall = true

  // Gera um artigo de uma "fila" de candidatos, avançando para o próximo
  // candidato se um tópico falhar mesmo depois do retry em callGroq — isto
  // garante que continuamos a tentar chegar aos 3 artigos do dia em vez de
  // abortar a publicação inteira por causa de UM tópico problemático.
  async function generateFromQueue(queue, kind, countNeeded) {
    let generated = 0
    let queueIndex = 0

    while (generated < countNeeded && queueIndex < queue.length) {
      const topic = queue[queueIndex]
      queueIndex++

      console.log(`\n✍️  A gerar (${kind}): ${topic.title}`)

      if (!isFirstCall) {
        console.log(`  ⏸  A aguardar ${PAUSE_BETWEEN_CALLS_MS / 1000}s antes da próxima chamada à Groq...`)
        await new Promise(r => setTimeout(r, PAUSE_BETWEEN_CALLS_MS))
      }
      isFirstCall = false

      try {
        const relatedSlugs = Array.from(existingSlugs).sort(() => Math.random() - 0.5)
        const prompt = kind === 'commercial'
          ? buildCommercialPrompt(topic, relatedSlugs)
          : buildTechnicalPrompt(topic)

        const content = await callGroq(prompt)
        const mdx = buildMdx(topic, content, today)
        const filePath = path.join(ARTICLES_DIR, `${topic.slug}.md`)

        fs.writeFileSync(filePath, mdx, 'utf8')
        console.log(`✅ Guardado: ${filePath}`)

        lastIndex++
        lastSlug = topic.slug
        publishedTitles.push(topic.title)
        existingSlugs.add(topic.slug) // evita reutilizar como "relacionado" duplicado
        generated++
      } catch (err) {
        console.error(`❌ Erro ao gerar ${topic.slug} (a saltar para o próximo tópico):`, err.message)
      }
    }

    return generated
  }

  const technicalDone = await generateFromQueue(remainingTechnical, 'technical', TECHNICAL_PER_RUN)
  const commercialDone = await generateFromQueue(remainingCommercial, 'commercial', COMMERCIAL_PER_RUN)
  const totalDone = technicalDone + commercialDone

  saveCounter(lastIndex, today, lastSlug)

  if (totalDone < TECHNICAL_PER_RUN + COMMERCIAL_PER_RUN) {
    console.log(`\n⚠️  Só foi possível gerar ${totalDone} de ${TECHNICAL_PER_RUN + COMMERCIAL_PER_RUN} artigos hoje (falhas repetidas na Groq). Publicados: ${publishedTitles.join(', ') || '(nenhum)'}`)
  } else {
    console.log(`\n🎉 ${totalDone} artigos gerados para ${today}: ${publishedTitles.join(', ')}`)
  }

  // Só falha o job (e portanto não faz commit/push) se NENHUM artigo tiver
  // sido gerado — parcial é melhor do que zero, dado que os artigos "têm de
  // entrar" mesmo em dias com problemas pontuais na API.
  if (totalDone === 0) {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
