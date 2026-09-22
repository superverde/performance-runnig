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

  // ─── NUTRIÇÃO DESPORTIVA (banco alargado, ago/2026) ───
  { slug: 'hidratos-90g-hora-treino-intestinal', title: '90g de Hidratos por Hora: Como Treinar o Intestino para Tolerar', category: 'Nutrição' },
  { slug: 'dieta-low-carb-lchf-corredores-evidencia', title: 'Dieta Low-Carb para Corredores: O Que o Estudo dos Marchadores de Elite Revelou', category: 'Nutrição' },
  { slug: 'distribuicao-proteina-ao-longo-do-dia', title: 'Distribuição da Proteína ao Longo do Dia: Porque 4x20g Bate a Dose Única', category: 'Nutrição' },
  { slug: 'nitratos-beterraba-economia-corrida', title: 'Nitratos e Sumo de Beterraba: Quanto Melhoram Mesmo a Economia de Corrida', category: 'Nutrição' },
  { slug: 'cafeina-protocolo-issn-dose-timing', title: 'Cafeína: O Protocolo de Dose e Timing da Position Stand da ISSN', category: 'Nutrição' },
  { slug: 'sindrome-gastrointestinal-exercicio-causas', title: 'Síndrome Gastrointestinal do Exercício: Porque é Que o Estômago Falha nos Ultras', category: 'Nutrição' },
  { slug: 'taxa-de-suor-calcular-plano-hidratacao', title: 'Como Calcular a Tua Taxa de Suor e Construir um Plano de Hidratação', category: 'Nutrição' },
  { slug: 'red-s-disponibilidade-energetica-corredores', title: 'RED-S: A Baixa Disponibilidade Energética Que Trava o Corredor', category: 'Nutrição' },
  { slug: 'periodizacao-nutricional-train-low-compete-high', title: 'Periodização Nutricional: Treinar com Pouco, Competir com Muito', category: 'Nutrição' },
  { slug: 'recuperacao-hidratos-proteina-pos-longo', title: 'Hidratos e Proteína no Pós-Longo: Rácios, Doses e a Janela Real', category: 'Nutrição' },
  // ─── RENDIMENTO / PERFORMANCE (banco alargado, ago/2026) ───
  { slug: 'tres-pilares-performance-vo2max-limiar-economia', title: 'Os Três Pilares da Performance: VO2max, Limiar e Economia de Corrida', category: 'Fisiologia' },
  { slug: 'taper-duas-semanas-como-fazer', title: 'Taper: As Duas Semanas Que Valem 3% de Performance', category: 'Treino' },
  { slug: 'treino-forca-economia-corrida-revisao', title: 'Treino de Força e Economia de Corrida: O Que Diz a Revisão Sistemática', category: 'Treino' },
  { slug: 'aclimatacao-calor-protocolo-10-dias', title: 'Aclimatação ao Calor: O Protocolo de 10 Dias Que Também Melhora em Fresco', category: 'Fisiologia' },
  { slug: 'durabilidade-resistencia-fadiga-maratona', title: 'Durabilidade: A Métrica Que Explica Quem Não Quebra ao km 32', category: 'Fisiologia' },
  { slug: 'carga-interna-vs-externa-monitorizar', title: 'Carga Interna vs Carga Externa: O Que Deves Mesmo Monitorizar', category: 'Treino' },
  { slug: 'intervalos-longos-vs-curtos-vo2max', title: 'Intervalos Longos vs Curtos: Qual Desenvolve Mais o VO2max', category: 'Treino' },
  { slug: 'treino-polarizado-vs-limiar-evidencia', title: 'Treino Polarizado vs Treino ao Limiar: O Que a Evidência Mostra', category: 'Treino' },
  { slug: 'pliometria-rigidez-tendinea-corrida', title: 'Pliometria e Rigidez Tendínea: Força Reativa ao Serviço da Economia', category: 'Treino' },
  { slug: 'velocidade-critica-modelo-ritmo-sustentavel', title: 'Velocidade Crítica: O Modelo Que Prevê o Teu Ritmo Sustentável', category: 'Fisiologia' },
  // ─── RECUPERAÇÃO (banco alargado, ago/2026) ───
  { slug: 'banho-gelo-quando-evitar-adaptacoes', title: 'Banho de Gelo: Quando Ajuda e Quando Rouba Adaptações ao Treino', category: 'Recuperação' },
  { slug: 'extensao-sono-performance-evidencia', title: 'Dormir Mais Melhora a Performance: A Evidência da Extensão de Sono', category: 'Recuperação' },
  { slug: 'quantas-horas-dormir-corredor-consenso', title: 'Quantas Horas Deve Dormir um Corredor? O Consenso Internacional de 2021', category: 'Recuperação' },
  { slug: 'metodos-recuperacao-ranking-meta-analise', title: 'Ranking dos Métodos de Recuperação: O Que a Meta-Análise Mostra', category: 'Recuperação' },
  { slug: 'sumo-cereja-acida-recuperacao-maratona', title: 'Sumo de Cereja Ácida: A Evidência na Recuperação da Maratona', category: 'Recuperação' },
  { slug: 'antioxidantes-excesso-bloqueiam-adaptacao', title: 'Antioxidantes em Excesso Podem Bloquear as Tuas Adaptações', category: 'Recuperação' },
  { slug: 'doms-dores-tardias-o-que-funciona', title: 'DOMS: O Que Realmente Reduz as Dores Musculares Tardias', category: 'Recuperação' },
  { slug: 'sesta-power-nap-corredores', title: 'Sesta para Corredores: Duração, Timing e Efeito no Treino', category: 'Recuperação' },
  { slug: 'recuperacao-entre-treinos-duplos', title: 'Recuperar Entre Treinos Duplos: Janela, Nutrição e Sono', category: 'Recuperação' },
  { slug: 'monitorizar-recuperacao-questionarios-vs-hrv', title: 'Monitorizar a Recuperação: Questionários Subjetivos vs HRV', category: 'Recuperação' },

  // ─── LOTE 2026-09-18 (Claude — monitor-performance-running) — banco
  // técnico esgotou-se por completo neste dia (0 tópicos por publicar);
  // adicionado lote de 55 para repor a reserva. ───
  { slug: 'treino-passadeira-vs-estrada-diferencas', title: 'Treino em Passadeira vs. Estrada: As Diferenças Que Importam', category: 'Treino' },
  { slug: 'series-longas-3000m-5000m-como-estruturar', title: 'Séries Longas de 3000m a 5000m: Como Estruturar o Treino', category: 'Treino' },
  { slug: 'treino-em-grupo-vantagens-desvantagens', title: 'Treinar em Grupo: Vantagens, Riscos e Como Aproveitar Melhor', category: 'Treino' },
  { slug: 'periodizacao-inversa-block-training-corrida', title: 'Periodização Inversa: Quando Treinar a Intensidade Primeiro Funciona', category: 'Treino' },
  { slug: 'treino-em-subida-uphill-intervals-beneficios', title: 'Treino em Subida: Os Benefícios dos Uphill Intervals para Todos os Corredores', category: 'Treino' },
  { slug: 'corrida-em-descida-downhill-training-tecnica', title: 'Corrida em Descida: Como Treinar a Técnica Sem Se Lesionar', category: 'Treino' },
  { slug: 'treino-por-tempo-vs-distancia-qual-melhor', title: 'Treinar por Tempo ou por Distância: Qual Faz Mais Sentido', category: 'Treino' },
  { slug: 'semana-recorde-pessoal-como-planear-pico', title: 'Como Planear a Semana do Teu Recorde Pessoal', category: 'Treino' },
  { slug: 'treino-indoor-pista-coberta-vantagens', title: 'Treino em Pista Coberta: Vantagens Para o Meio Fundo', category: 'Treino' },
  { slug: 'corrida-esteira-inclinacao-simular-trail', title: 'Simular Trail na Passadeira: Como Usar a Inclinação a Teu Favor', category: 'Treino' },
  { slug: 'limiar-ventilatorio-vt1-vt2-corrida', title: 'Limiares Ventilatórios VT1 e VT2: A Alternativa ao Lactato', category: 'Fisiologia' },
  { slug: 'consumo-oxigenio-lento-slow-component-corrida', title: 'O Componente Lento do VO2: Porque a Corrida Fica Mais Cara a Meio', category: 'Fisiologia' },
  { slug: 'capilarizacao-muscular-treino-endurance', title: 'Capilarização Muscular: A Adaptação Invisível Que Sustenta o Endurance', category: 'Fisiologia' },
  { slug: 'mitocondrias-biogenese-treino-aerobio', title: 'Biogénese Mitocondrial: Como o Treino Multiplica as Tuas Centrais de Energia', category: 'Fisiologia' },
  { slug: 'volume-plasmatico-adaptacao-calor-altitude', title: 'Volume Plasmático: A Adaptação Rápida Que Melhora o Rendimento no Calor', category: 'Fisiologia' },
  { slug: 'deriva-cardiaca-cardiac-drift-corrida-longa', title: 'Deriva Cardíaca: Porque o Coração Acelera Mesmo a Ritmo Constante', category: 'Fisiologia' },
  { slug: 'lactato-combustivel-nao-so-residuo', title: 'Lactato Como Combustível: A Molécula Mais Incompreendida da Fisiologia', category: 'Fisiologia' },
  { slug: 'variabilidade-frequencia-cardiaca-hrv-treino', title: 'HRV no Treino de Corrida: Como Usar a Variabilidade Cardíaca a Teu Favor', category: 'Fisiologia' },
  { slug: 'creatina-corredores-fundo-evidencia-2026', title: 'Creatina para Corredores de Fundo: O Que Mudou na Evidência Recente', category: 'Nutrição' },
  { slug: 'jejum-intermitente-corredores-riscos-beneficios', title: 'Jejum Intermitente e Corrida: Riscos e Benefícios Reais', category: 'Nutrição' },
  { slug: 'alcool-recuperacao-desportiva-impacto', title: 'Álcool e Recuperação Desportiva: O Que Acontece Depois da Corrida Longa', category: 'Nutrição' },
  { slug: 'omega-3-inflamacao-recuperacao-corredores', title: 'Ómega-3 em Corredores: Inflamação, Recuperação e Dose Eficaz', category: 'Nutrição' },
  { slug: 'colagenio-vitamina-c-tendoes-corredores', title: 'Colagénio e Vitamina C: A Combinação Que Protege os Teus Tendões', category: 'Nutrição' },
  { slug: 'periodizacao-hidratos-semana-treino', title: 'Periodizar os Hidratos ao Longo da Semana de Treino', category: 'Nutrição' },
  { slug: 'suplementos-desnecessarios-corredores-mitos', title: 'Suplementos Que a Maioria dos Corredores Não Precisa', category: 'Nutrição' },
  { slug: 'alimentacao-vegetariana-vegan-corredores-fundo', title: 'Corredores Vegetarianos e Veganos: Como Cobrir as Necessidades Nutricionais', category: 'Nutrição' },
  { slug: 'assimetrias-corrida-desequilibrios-bilaterais', title: 'Assimetrias na Corrida: Quando os Dois Lados Não Trabalham Igual', category: 'Biomecânica' },
  { slug: 'oscilacao-vertical-corrida-o-que-significa', title: 'Oscilação Vertical: O Que Esta Métrica Realmente Diz Sobre a Tua Corrida', category: 'Biomecânica' },
  { slug: 'tempo-contacto-solo-ground-contact-time', title: 'Tempo de Contacto com o Solo: Métrica-Chave da Eficiência', category: 'Biomecânica' },
  { slug: 'rigidez-tornozelo-stiffness-corrida-economia', title: 'Rigidez do Tornozelo: A Propriedade Mecânica Que Poupa Energia', category: 'Biomecânica' },
  { slug: 'mobilidade-anca-corredores-limitacoes-comuns', title: 'Mobilidade da Anca em Corredores: As Limitações Mais Comuns', category: 'Biomecânica' },
  { slug: 'corrida-piso-inclinado-camber-estrada', title: 'Correr em Piso Inclinado: O Efeito Camber na Tua Biomecânica', category: 'Biomecânica' },
  { slug: 'periodizacao-recuperacao-macrociclo-anual', title: 'Periodizar a Recuperação ao Longo da Época', category: 'Recuperação' },
  { slug: 'fadiga-neuromuscular-sinais-recuperacao', title: 'Fadiga Neuromuscular: Os Sinais Que Precedem o Overtraining', category: 'Recuperação' },
  { slug: 'alongamento-estatico-dinamico-quando-usar', title: 'Alongamento Estático vs. Dinâmico: Quando Usar Cada Um', category: 'Recuperação' },
  { slug: 'banhos-contraste-frio-quente-recuperacao', title: 'Banhos de Contraste: Alternar Frio e Quente Funciona Mesmo?', category: 'Recuperação' },
  { slug: 'respiracao-nasal-recuperacao-sistema-nervoso', title: 'Respiração Nasal e Sistema Nervoso: Ferramenta de Recuperação Subestimada', category: 'Recuperação' },
  { slug: 'periodizacao-semanas-cutback-reduzir-volume', title: 'Semanas de Cutback: Reduzir Volume Sem Perder Forma', category: 'Recuperação' },
  { slug: 'entorse-tornozelo-corredores-retorno-treino', title: 'Entorse de Tornozelo em Corredores: Da Lesão ao Retorno Seguro', category: 'Lesões' },
  { slug: 'tendinopatia-aquiles-causas-tratamento', title: 'Tendinopatia de Aquiles: Causas Reais e Protocolo de Recuperação', category: 'Lesões' },
  { slug: 'joelho-corredor-condropatia-rotuliana', title: 'Condropatia Rotuliana: O Diagnóstico Mais Comum na Dor de Joelho', category: 'Lesões' },
  { slug: 'lesoes-recorrentes-porque-voltam-corredores', title: 'Porque as Lesões Voltam: O Ciclo Que Poucos Corredores Quebram', category: 'Lesões' },
  { slug: 'sinais-alerta-lesao-iminente-corrida', title: 'Sinais de Alerta de uma Lesão Iminente Que Não Deves Ignorar', category: 'Lesões' },
  { slug: 'fisioterapia-preventiva-corredores-rotina', title: 'Fisioterapia Preventiva: Porque Não Deves Esperar Pela Dor', category: 'Lesões' },
  { slug: 'motivacao-intrinseca-extrinseca-corredores', title: 'Motivação Intrínseca vs. Extrínseca: O Que Sustenta a Consistência', category: 'Psicologia' },
  { slug: 'rotina-pre-treino-ritual-mental-corrida', title: 'Rotina Pré-Treino: Como um Ritual Mental Melhora a Consistência', category: 'Psicologia' },
  { slug: 'comparacao-social-strava-saude-mental-corredores', title: 'Comparação Social no Strava: Impacto na Relação com a Corrida', category: 'Psicologia' },
  { slug: 'resiliencia-mental-construir-treino-longo-prazo', title: 'Resiliência Mental: Como Se Constrói ao Longo de Anos de Treino', category: 'Psicologia' },
  { slug: 'medo-de-falhar-corredores-prova-alvo', title: 'Medo de Falhar Antes da Prova-Alvo: Como Gerir a Pressão', category: 'Psicologia' },
  { slug: 'orientacao-gps-relogio-trail-configurar', title: 'Configurar o GPS do Relógio para Navegação em Trail', category: 'Trail Running' },
  { slug: 'treino-tecnico-descida-tecnica-pes-rapidos', title: 'Técnica de Descida: Como Treinar Pés Rápidos em Terreno Técnico', category: 'Trail Running' },
  { slug: 'gestao-frio-altitude-trail-montanha', title: 'Gerir o Frio em Altitude: Preparação para Trail de Montanha', category: 'Trail Running' },
  { slug: 'vertical-kilometer-treino-especifico', title: 'Vertical Kilometer: Como Treinar Especificamente para a Prova Mais Vertical', category: 'Trail Running' },
  { slug: 'sky-running-diferencas-trail-tradicional', title: 'Skyrunning: Em Que Difere do Trail Running Tradicional', category: 'Trail Running' },
  { slug: 'primeira-100-milhas-preparacao-mental-fisica', title: 'Primeira Prova de 100 Milhas: Preparação Física e Mental', category: 'Trail Running' },
  // ─────────────────────────────────────────────────────────────────────────
  // LOTE 2026-09-18 — reposição dos bancos esgotados. Tópicos ancorados na
  // literatura já presente no REFERENCE_BANK de cada categoria (ver
  // "REFERENCE_BANK é o gargalo da qualidade": só se adicionam tópicos que
  // tenham fundamento citável no banco da respetiva categoria).
  // ─────────────────────────────────────────────────────────────────────────

  // Fisiologia
  { slug: 'reserva-frequencia-cardiaca-karvonen', title: 'Fórmula de Karvonen: Reserva de FC na Prática', category: 'Fisiologia' },
  { slug: 'eficiencia-mitocondrial-endurance', title: 'Eficiência Mitocondrial: O Motor do Corredor', category: 'Fisiologia' },
  { slug: 'volume-sistolico-adaptacao-endurance', title: 'Volume Sistólico: Como o Coração se Adapta', category: 'Fisiologia' },
  { slug: 'consumo-oxigenio-excesso-epoc', title: 'EPOC: O Consumo de Oxigénio Depois do Treino', category: 'Fisiologia' },
  { slug: 'steady-state-maximo-lactato-mlss', title: 'MLSS: O Verdadeiro Limite do Estado Estável', category: 'Fisiologia' },
  { slug: 'componente-lenta-vo2-intensidade', title: 'Componente Lenta do VO2: O Custo Escondido', category: 'Fisiologia' },
  { slug: 'tamponamento-bicarbonato-acidose', title: 'Acidose e Tamponamento: A Química da Fadiga', category: 'Fisiologia' },
  { slug: 'hemoglobina-massa-total-endurance', title: 'Massa Total de Hemoglobina e Performance', category: 'Fisiologia' },
  { slug: 'custo-energetico-corrida-vs-caminhada', title: 'Correr vs Caminhar: O Custo Energético Real', category: 'Fisiologia' },
  { slug: 'velocidade-aerobia-maxima-vvo2max', title: 'vVO2max: A Velocidade Que Define o Teu Teto', category: 'Fisiologia' },
  { slug: 'tempo-limite-vvo2max-tlim', title: 'Tlim: Quanto Tempo Aguentas ao vVO2max', category: 'Fisiologia' },
  { slug: 'economia-corrida-fatores-determinantes', title: 'Economia de Corrida: Os 6 Fatores Que Mandam', category: 'Fisiologia' },
  { slug: 'humidade-vs-temperatura-performance', title: 'Humidade vs Temperatura: Qual Trava Mais?', category: 'Fisiologia' },
  { slug: 'live-high-train-low-protocolo', title: 'Live High Train Low: O Protocolo de Altitude', category: 'Fisiologia' },
  { slug: 'desidratacao-2-porcento-performance', title: 'Desidratação de 2%: Quanto Custa na Prova', category: 'Fisiologia' },
  { slug: 'limiar-anaerobio-individual-determinar', title: 'Limiar Anaeróbio Individual: Como Determinar', category: 'Fisiologia' },

  // Treino
  { slug: 'treino-intervalado-30-15-ift', title: '30-15 IFT: O Intervalado Que Vem do Futebol', category: 'Treino' },
  { slug: 'series-piramidais-corrida-estrutura', title: 'Séries Piramidais: Como Estruturar a Sessão', category: 'Treino' },
  { slug: 'treino-ritmo-competicao-especifico', title: 'Treino ao Ritmo de Prova: Quanto e Quando', category: 'Treino' },
  { slug: 'semana-tipo-corredor-3-treinos', title: 'Só 3 Treinos por Semana: A Semana Ideal', category: 'Treino' },
  { slug: 'semana-tipo-corredor-5-treinos', title: '5 Treinos por Semana: Como Distribuir', category: 'Treino' },
  { slug: 'progressao-volume-regra-10-porcento', title: 'A Regra dos 10%: Mito ou Boa Prática?', category: 'Treino' },
  { slug: 'forca-maxima-vs-resistencia-corredores', title: 'Força Máxima vs Resistência para Corredores', category: 'Treino' },
  { slug: 'hill-sprints-curtos-neuromuscular', title: 'Hill Sprints: 10 Segundos Que Mudam Tudo', category: 'Treino' },
  { slug: 'treino-descidas-adaptacao-excentrica', title: 'Treino de Descidas: Blindar os Quadricípites', category: 'Treino' },
  { slug: 'fartlek-estruturado-vs-livre', title: 'Fartlek Livre vs Estruturado: Qual Escolher', category: 'Treino' },
  { slug: 'tempo-run-continuo-vs-fracionado', title: 'Tempo Run Contínuo vs Fracionado', category: 'Treino' },
  { slug: 'long-run-dividido-em-dois', title: 'Long Run Dividido em Dois: Faz Sentido?', category: 'Treino' },
  { slug: 'periodizacao-ondulatoria-corredores', title: 'Periodização Ondulatória para Corredores', category: 'Treino' },
  { slug: 'off-season-corredor-o-que-fazer', title: 'Off-Season do Corredor: O Que Fazer', category: 'Treino' },
  { slug: 'retorno-treino-apos-ferias', title: 'Voltar aos Treinos Depois de Férias', category: 'Treino' },
  { slug: 'inclinacao-passadeira-1-porcento', title: 'Inclinação de 1% na Passadeira: Porquê?', category: 'Treino' },
  { slug: 'treinar-por-potencia-corrida-zonas', title: 'Treinar por Potência: Guia de Zonas', category: 'Treino' },
  { slug: 'duas-maratonas-por-ano-periodizar', title: 'Duas Maratonas por Ano: Como Periodizar', category: 'Treino' },
  { slug: 'plano-treino-10km-sub-50', title: '10km Sub-50: Plano para Quem Está a Começar', category: 'Treino' },
  { slug: 'plano-treino-10km-sub-40', title: '10km Sub-40: O Plano e os Treinos Chave', category: 'Treino' },
  { slug: 'plano-treino-5km-sub-25', title: '5km Sub-25 Minutos: Plano de 8 Semanas', category: 'Treino' },
  { slug: 'plano-meia-maratona-sub-1h45', title: 'Meia Maratona Sub-1h45: Plano Completo', category: 'Treino' },
  { slug: 'plano-maratona-sub-3h30', title: 'Maratona Sub-3h30: O Plano Realista', category: 'Treino' },
  { slug: 'do-sofa-aos-10km-principiantes', title: 'Do Sofá aos 10km: Plano para Principiantes', category: 'Treino' },
  { slug: 'treino-corridas-obstaculos-ocr', title: 'Treino para Corridas de Obstáculos (OCR)', category: 'Treino' },
  { slug: 'superficies-treino-qual-escolher', title: 'Superfícies de Treino: Qual Escolher e Quando', category: 'Treino' },
  { slug: 'negative-split-como-treinar', title: 'Correr em Negative Split: Como Treinar', category: 'Treino' },
  { slug: 'sessoes-duplas-limiar-vale-a-pena', title: 'Sessões Duplas de Limiar: Vale a Pena?', category: 'Treino' },
  { slug: 'treino-forca-em-casa-corredores', title: 'Treino de Força em Casa para Corredores', category: 'Treino' },
  { slug: 'exercicios-unilaterais-assimetrias', title: 'Exercícios Unilaterais: Corrigir Assimetrias', category: 'Treino' },
  { slug: 'drills-tecnica-corrida-progressao', title: 'Drills de Técnica: A Progressão Correta', category: 'Treino' },
  { slug: 'aumentar-cadencia-metronomo-protocolo', title: 'Aumentar a Cadência com Metrónomo', category: 'Treino' },
  { slug: 'treino-musculos-respiratorios-evidencia', title: 'Treino dos Músculos Respiratórios: Funciona?', category: 'Treino' },
  { slug: 'correr-com-colete-lastro-evidencia', title: 'Correr com Colete de Peso: A Ciência', category: 'Treino' },
  { slug: 'quantos-km-por-semana-correr', title: 'Quantos km por Semana Deves Correr?', category: 'Treino' },
  { slug: 'correr-todos-os-dias-run-streak', title: 'Correr Todos os Dias: Benefícios e Riscos', category: 'Treino' },
  { slug: 'eliptica-remo-alternativas-impacto', title: 'Elíptica e Remo: Alternativas ao Impacto', category: 'Treino' },
  { slug: 'correr-de-manha-ou-a-noite', title: 'Manhã ou Noite: Quando Rendes Mais', category: 'Treino' },
  { slug: 'treinar-bem-com-4-horas-semana', title: 'Treinar Bem com 4 Horas por Semana', category: 'Treino' },
  { slug: 'monitorizar-treino-sem-complicar', title: 'Como Monitorizar o Treino Sem Complicar', category: 'Treino' },

  // Nutrição
  { slug: 'periodizar-hidratos-conforme-treino', title: 'Periodizar Hidratos Conforme o Treino do Dia', category: 'Nutrição' },
  { slug: 'o-que-comer-antes-treino-manha', title: 'O Que Comer Antes do Treino da Manhã', category: 'Nutrição' },
  { slug: 'carga-hidratos-protocolo-3-dias', title: 'Carga de Hidratos: O Protocolo de 3 Dias', category: 'Nutrição' },
  { slug: 'bebidas-desportivas-concentracao-ideal', title: 'Bebidas Desportivas: A Concentração Certa', category: 'Nutrição' },
  { slug: 'hiponatremia-corrida-prevencao', title: 'Hiponatremia na Corrida: Como Prevenir', category: 'Nutrição' },
  { slug: 'tolerancia-cafeina-ciclar-corredores', title: 'Tolerância à Cafeína: Vale a Pena Ciclar?', category: 'Nutrição' },
  { slug: 'bicarbonato-sodio-protocolo-prova', title: 'Bicarbonato de Sódio: Protocolo de Prova', category: 'Nutrição' },
  { slug: 'magnesio-caibras-evidencia', title: 'Magnésio e Cãibras: A Evidência Real', category: 'Nutrição' },
  { slug: 'probioticos-intestino-corredor', title: 'Probióticos para o Intestino do Corredor', category: 'Nutrição' },
  { slug: 'suplementos-antioxidantes-ajudam', title: 'Suplementos Antioxidantes: Ajudam ou Travam?', category: 'Nutrição' },
  { slug: 'corredores-vegetarianos-guia', title: 'Corredores Vegetarianos: Guia Nutricional', category: 'Nutrição' },
  { slug: 'perder-peso-sem-perder-performance', title: 'Perder Peso Sem Perder Performance', category: 'Nutrição' },
  { slug: 'peso-ideal-corredor-existe', title: 'Peso Ideal do Corredor: Existe Mesmo?', category: 'Nutrição' },
  { slug: 'proteina-antes-de-dormir-corredores', title: 'Proteína Antes de Dormir: Vale a Pena?', category: 'Nutrição' },
  { slug: 'comer-em-ultra-solidos-vs-liquidos', title: 'Comer em Ultra: Sólidos vs Líquidos', category: 'Nutrição' },
  { slug: 'suplementos-com-evidencia-real', title: 'Os 5 Suplementos Com Evidência Real', category: 'Nutrição' },

  // Recuperação
  { slug: 'sono-profundo-hormona-crescimento', title: 'Sono Profundo: A Fase Que Repara o Músculo', category: 'Recuperação' },
  { slug: 'jet-lag-viagem-competicao-protocolo', title: 'Viajar para Competir: Gerir o Jet Lag', category: 'Recuperação' },
  { slug: 'recuperar-de-uma-maratona-4-semanas', title: 'Recuperar de uma Maratona: 4 Semanas', category: 'Recuperação' },
  { slug: 'recuperar-de-um-ultra-protocolo', title: 'Recuperar de um Ultra: Protocolo Completo', category: 'Recuperação' },
  { slug: 'eletroestimulacao-recuperacao-corredores', title: 'Eletroestimulação na Recuperação', category: 'Recuperação' },
  { slug: 'massagem-vs-libertacao-miofascial', title: 'Massagem vs Libertação Miofascial', category: 'Recuperação' },
  { slug: 'quando-fazer-semana-recuperacao', title: 'Quando Fazer uma Semana de Recuperação', category: 'Recuperação' },
  { slug: 'sinais-fadiga-acumulada-vigiar', title: '5 Sinais de Fadiga Acumulada a Vigiar', category: 'Recuperação' },
  { slug: 'hrv-ao-acordar-treinar-ou-descansar', title: 'HRV ao Acordar: Treinar ou Descansar?', category: 'Recuperação' },
  { slug: 'fc-repouso-indicador-simples', title: 'FC de Repouso: O Indicador Mais Simples', category: 'Recuperação' },
  { slug: 'recuperacao-depois-dos-40-o-que-muda', title: 'Recuperação Depois dos 40: O Que Muda', category: 'Recuperação' },
  { slug: 'stress-trabalho-carga-treino', title: 'Stress do Trabalho e Carga de Treino', category: 'Recuperação' },
  { slug: 'noite-mal-dormida-antes-da-prova', title: 'Noite Mal Dormida Antes da Prova: E Agora?', category: 'Recuperação' },
  { slug: 'rotina-pos-treino-15-minutos', title: 'Rotina Pós-Treino de 15 Minutos', category: 'Recuperação' },

  // Biomecânica
  { slug: 'analisar-corrida-com-telemovel', title: 'Analisar a Tua Corrida com o Telemóvel', category: 'Biomecânica' },
  { slug: 'rigidez-membro-inferior-corrida', title: 'Rigidez do Membro Inferior na Corrida', category: 'Biomecânica' },
  { slug: 'cruzar-linha-media-erro-invisivel', title: 'Cruzar a Linha Média: O Erro Invisível', category: 'Biomecânica' },
  { slug: 'inclinacao-tronco-quanto-ideal', title: 'Inclinação do Tronco: Quanto é o Ideal', category: 'Biomecânica' },
  { slug: 'pronacao-lesoes-mito-desfeito', title: 'Pronação e Lesões: O Mito Desfeito', category: 'Biomecânica' },
  { slug: 'forcas-impacto-corrida-aguentar', title: 'Forças de Impacto: O Que Aguenta o Corpo', category: 'Biomecânica' },
  { slug: 'transicao-calcado-minimalista-sem-lesoes', title: 'Passar a Calçado Minimalista Sem Lesões', category: 'Biomecânica' },
  { slug: 'correr-descalco-o-que-a-ciencia-mostra', title: 'Correr Descalço: O Que a Ciência Mostra', category: 'Biomecânica' },
  { slug: 'tecnica-subida-biomecanica-certa', title: 'Técnica de Subida: A Biomecânica Certa', category: 'Biomecânica' },
  { slug: 'fadiga-altera-tecnica-corrida', title: 'Como a Fadiga Estraga a Tua Técnica', category: 'Biomecânica' },

  // Lesões
  { slug: 'dor-joelho-forca-como-tratamento', title: 'Dor no Joelho: Força Como Tratamento', category: 'Lesões' },
  { slug: 'sindrome-piriforme-corredores', title: 'Síndrome do Piriforme em Corredores', category: 'Lesões' },
  { slug: 'pubalgia-corredor-sinais-tratamento', title: 'Pubalgia no Corredor: Sinais e Tratamento', category: 'Lesões' },
  { slug: 'neuroma-morton-dor-antepe', title: 'Neuroma de Morton: Dor no Antepé', category: 'Lesões' },
  { slug: 'isquiotibiais-prevenir-lesao', title: 'Isquiotibiais: Prevenir a Lesão Número 1', category: 'Lesões' },
  { slug: 'dor-lombar-corredor-papel-core', title: 'Dor Lombar no Corredor: O Papel do Core', category: 'Lesões' },
  { slug: 'carga-treino-risco-lesao-acwr', title: 'Carga de Treino e Risco de Lesão', category: 'Lesões' },
  { slug: 'correr-com-dor-quando-parar', title: 'Correr com Dor: Quando Parar Mesmo', category: 'Lesões' },
  { slug: 'voltar-a-correr-apos-fratura-stress', title: 'Voltar a Correr Após Fratura de Stress', category: 'Lesões' },
  { slug: 'prevencao-lesoes-corredoras', title: 'Prevenção de Lesões em Corredoras', category: 'Lesões' },
  { slug: 'repouso-ou-fisioterapia-o-que-funciona', title: 'Repouso ou Fisioterapia: O Que Funciona', category: 'Lesões' },
  { slug: 'esporao-vs-fascite-diferenca', title: 'Esporão vs Fascite: Não São o Mesmo', category: 'Lesões' },

  // Psicologia
  { slug: 'rotinas-pre-prova-construir', title: 'Rotinas Pré-Prova: Construir a Tua', category: 'Psicologia' },
  { slug: 'como-criar-habito-de-correr', title: 'Como Criar o Hábito de Correr', category: 'Psicologia' },
  { slug: 'treinar-sozinho-ou-em-grupo', title: 'Treinar Sozinho ou em Grupo: O Impacto', category: 'Psicologia' },
  { slug: 'mindfulness-corrida-como-praticar', title: 'Mindfulness na Corrida: Como Praticar', category: 'Psicologia' },
  { slug: 'construir-autoconfianca-corredor', title: 'Construir Autoconfiança Como Corredor', category: 'Psicologia' },
  { slug: 'primeira-maratona-gerir-expectativas', title: 'Primeira Maratona: Gerir Expectativas', category: 'Psicologia' },
  { slug: 'depressao-pos-maratona-porque-acontece', title: 'Depressão Pós-Maratona: Porque Acontece', category: 'Psicologia' },
  { slug: 'objetivos-processo-vs-resultado', title: 'Objetivos de Processo vs de Resultado', category: 'Psicologia' },

  // Trail Running
  { slug: 'treinar-desnivel-sem-montanha', title: 'Treinar Desnível Positivo Sem Montanha', category: 'Trail Running' },
  { slug: 'forca-especifica-trail-running', title: 'Força Específica para Trail Running', category: 'Trail Running' },
  { slug: 'tecnica-bastoes-subida-trail', title: 'Técnica de Bastões na Subida', category: 'Trail Running' },
  { slug: 'gerir-ritmo-ultra-trail-estrategia', title: 'Gerir o Ritmo num Ultra: Estratégia', category: 'Trail Running' },
  { slug: 'dormir-em-ultra-privacao-sono', title: 'Dormir em Ultras: Gerir a Privação', category: 'Trail Running' },
  { slug: 'seguranca-montanha-essencial-trail', title: 'Segurança na Montanha: O Essencial', category: 'Trail Running' },
  { slug: 'seguir-gpx-no-relogio-guia', title: 'Seguir um GPX no Relógio: Guia Prático', category: 'Trail Running' },
  { slug: 'correr-terreno-tecnico-sem-cair', title: 'Correr em Terreno Técnico Sem Cair', category: 'Trail Running' },
  { slug: 'trail-inverno-neve-lama-frio', title: 'Treinar no Inverno: Neve, Lama e Frio', category: 'Trail Running' },
  { slug: 'da-estrada-para-o-trail-transicao', title: 'Da Estrada para o Trail: A Transição', category: 'Trail Running' },
]

// ─────────────────────────────────────────────────────────────────────────────
// BANCO DE TÓPICOS COMERCIAIS — 30 temas com intenção de compra (categoria Equipamento)
// ─────────────────────────────────────────────────────────────────────────────
const COMMERCIAL_TOPICS = [
  { slug: 'melhores-sapatilhas-corrida-maratona-2026', title: 'Melhores Sapatilhas de Corrida para Maratona em 2026', category: 'Equipamento' },
  { slug: 'sapatilhas-placa-carbono-vale-a-pena-comparativo', title: 'Sapatilhas com Placa de Carbono: Valem o Preço? Comparativo', category: 'Equipamento' },
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
  // LOTE 2026-08-15 — banco original (30) esgotou-se por completo neste dia
  // (ver memória "Reserva de Tópicos Comerciais Baixa"); lote maior (40) desta
  // vez para dar mais margem do que os lotes anteriores de ~15.
  { slug: 'melhores-sapatilhas-corrida-mulher-2026', title: 'Melhores Sapatilhas de Corrida para Mulher em 2026', category: 'Equipamento' },
  { slug: 'sapatilhas-corrida-largura-extra-pes-largos', title: 'Sapatilhas de Corrida para Pés Largos: As Melhores Opções', category: 'Equipamento' },
  { slug: 'sapatilhas-corrida-pronacao-como-escolher', title: 'Sapatilhas para Pronação: Como Escolher a Certa', category: 'Equipamento' },
  { slug: 'sapatilhas-corrida-supinacao-guia-compra', title: 'Sapatilhas para Supinação: Guia de Compra', category: 'Equipamento' },
  { slug: 'relogios-corrida-bateria-longa-duracao-ultra', title: 'Relógios com Bateria de Longa Duração para Ultra Trail', category: 'Equipamento' },
  { slug: 'melhores-auriculares-bluetooth-corrida-impermeaveis', title: 'Melhores Auriculares Bluetooth Impermeáveis para Corrida', category: 'Equipamento' },
  { slug: 'cintos-vs-mochilas-hidratacao-qual-escolher', title: 'Cintos vs. Mochilas de Hidratação: Qual Escolher', category: 'Equipamento' },
  { slug: 'melhores-soft-flasks-garrafas-trail-running', title: 'Melhores Soft Flasks para Trail Running', category: 'Equipamento' },
  { slug: 'meias-mangas-compressao-corrida-beneficios', title: 'Meias e Mangas de Compressão: Valem a Pena para Corredores?', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-atletismo-pista-treino', title: 'Melhores Sapatilhas para Treino de Pista', category: 'Equipamento' },
  { slug: 'spikes-atletismo-como-escolher-guia', title: 'Spikes de Atletismo: Como Escolher os Certos', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-corrida-chuva-aderencia', title: 'Melhores Sapatilhas de Corrida para Chuva e Pisos Molhados', category: 'Equipamento' },
  { slug: 'roupa-tecnica-verao-corrida-guia-compra', title: 'Roupa Técnica de Verão para Corrida: Guia de Compra', category: 'Equipamento' },
  { slug: 'melhores-toucas-gorros-corrida-inverno', title: 'Melhores Toucas e Gorros para Correr no Frio', category: 'Equipamento' },
  { slug: 'melhores-luvas-corrida-inverno', title: 'Melhores Luvas de Corrida para o Inverno', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-recuperacao-pos-treino', title: 'Melhores Sapatilhas de Recuperação Pós-Treino', category: 'Equipamento' },
  { slug: 'protetor-solar-desportivo-corredores-resistente-suor', title: 'Protetor Solar Desportivo Resistente ao Suor: Guia de Compra', category: 'Equipamento' },
  { slug: 'mantas-termicas-emergencia-kit-seguranca-trail', title: 'Manta Térmica de Emergência: Equipamento de Segurança para Trail', category: 'Equipamento' },
  { slug: 'gps-portateis-dedicados-vs-relogio-trail', title: 'GPS Portátil Dedicado vs. Relógio: Qual Escolher para Trail', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-zero-drop-corrida-natural', title: 'Melhores Sapatilhas Zero Drop para Corrida Natural', category: 'Equipamento' },
  { slug: 'drop-alto-vs-baixo-sapatilhas-diferenca-guia', title: 'Drop Alto vs. Baixo nas Sapatilhas: O Que Muda no Teu Treino', category: 'Equipamento' },
  { slug: 'melhores-palmilhas-ortopedicas-corredores', title: 'Melhores Palmilhas para Corredores: Guia de Escolha', category: 'Equipamento' },
  { slug: 'joelheiras-tornozeleiras-corrida-prevencao-lesoes', title: 'Joelheiras e Tornozeleiras para Corrida: Prevenção de Lesões', category: 'Equipamento' },
  { slug: 'sacos-organizadores-transporte-sapatilhas-viagem', title: 'Melhores Sacos de Transporte para Sapatilhas de Corrida', category: 'Equipamento' },
  { slug: 'melhores-relogios-corrida-baratos-entrada', title: 'Melhores Relógios de Corrida Económicos para Começar', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-corrida-inverno-impermeaveis', title: 'Melhores Sapatilhas Impermeáveis para Correr no Inverno', category: 'Equipamento' },
  { slug: 'camelbak-vs-salomon-mochilas-hidratacao-comparativo', title: 'CamelBak vs. Salomon: Comparativo de Mochilas de Hidratação', category: 'Equipamento' },
  { slug: 'melhores-power-banks-portateis-ultra-trail', title: 'Melhores Power Banks Portáteis para Ultra Trail', category: 'Equipamento' },
  { slug: 'melhores-relogios-multisport-triatlo-corrida', title: 'Melhores Relógios Multisport para Triatlo e Corrida', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-corrida-recuperacao-ativa', title: 'Sapatilhas para Recuperação Ativa: As Melhores Opções', category: 'Equipamento' },
  { slug: 'melhores-cremes-anti-atrito-corredores', title: 'Melhores Cremes Anti-Atrito para Corredores (Anti-Bolhas)', category: 'Equipamento' },
  { slug: 'fita-kinesiologia-corredores-como-quando-usar', title: 'Fita de Kinesiologia para Corredores: Como e Quando Usar', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-longa-distancia-conforto', title: 'Melhores Sapatilhas para Longas Distâncias: Foco no Conforto', category: 'Equipamento' },
  { slug: 'melhores-cronometros-desportivos-treino-intervalado', title: 'Melhores Cronómetros Desportivos para Treino Intervalado', category: 'Equipamento' },
  { slug: 'melhores-suportes-telemovel-corrida-braco', title: 'Melhores Suportes de Telemóvel para Correr no Braço', category: 'Equipamento' },
  { slug: 'melhores-viseiras-bones-corrida-sol', title: 'Melhores Viseiras e Bonés para Correr ao Sol', category: 'Equipamento' },
  { slug: 'melhores-fatos-triatlo-corredores-multisport', title: 'Melhores Fatos de Triatlo para Corredores Multisport', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-hibridas-caminho-misto', title: 'Melhores Sapatilhas Híbridas para Caminho Misto (Estrada + Trail)', category: 'Equipamento' },
  { slug: 'melhores-tapetes-yoga-mobilidade-corredores', title: 'Melhores Tapetes de Yoga e Mobilidade para Corredores', category: 'Equipamento' },
  { slug: 'sapatilhas-corrida-quando-trocar-guia-pratico', title: 'Quando Trocar as Tuas Sapatilhas de Corrida: Guia Prático', category: 'Equipamento' },

  // ─── LOTE 2026-09-18 (Claude — monitor-performance-running) — banco
  // comercial esgotou-se por completo neste dia (0 tópicos por publicar);
  // adicionado lote de 35 para repor a reserva. ───
  { slug: 'melhores-sapatilhas-corrida-homem-2026', title: 'Melhores Sapatilhas de Corrida para Homem em 2026', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-corrida-pisos-mistos-2026', title: 'Melhores Sapatilhas para Pisos Mistos em 2026', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-crianca-atletismo-jovens', title: 'Melhores Sapatilhas de Atletismo para Crianças e Jovens', category: 'Equipamento' },
  { slug: 'melhores-relogios-garmin-forerunner-comparativo-2026', title: 'Gama Garmin Forerunner 2026: Qual Modelo Escolher', category: 'Equipamento' },
  { slug: 'coros-pace-3-vs-garmin-265-comparativo', title: 'Coros Pace 3 vs. Garmin Forerunner 265: Comparativo Direto', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-super-shoes-economicas', title: 'Super Shoes Económicas: As Melhores Opções Abaixo de 150€', category: 'Equipamento' },
  { slug: 'melhores-camisolas-tecnicas-verao-corrida', title: 'Melhores Camisolas Técnicas de Verão para Corrida', category: 'Equipamento' },
  { slug: 'melhores-calcoes-corrida-sem-atrito', title: 'Melhores Calções de Corrida Sem Atrito Interno', category: 'Equipamento' },
  { slug: 'melhores-leggings-corrida-inverno-mulher', title: 'Melhores Leggings de Corrida de Inverno para Mulher', category: 'Equipamento' },
  { slug: 'melhores-soutiens-desportivos-alto-impacto', title: 'Melhores Soutiens Desportivos de Alto Impacto para Corrida', category: 'Equipamento' },
  { slug: 'melhores-mochilas-trail-curtas-distancias', title: 'Melhores Mochilas de Trail para Distâncias Curtas (menos de 5L)', category: 'Equipamento' },
  { slug: 'melhores-relogios-solares-corrida-autonomia', title: 'Melhores Relógios Solares para Corrida: Autonomia Sem Fim', category: 'Equipamento' },
  { slug: 'onde-comprar-sapatilhas-corrida-desconto-outlets', title: 'Onde Comprar Sapatilhas de Corrida com Desconto: Guia de Outlets', category: 'Equipamento' },
  { slug: 'melhores-basculas-impedancia-corredores', title: 'Melhores Básculas de Bioimpedância para Acompanhar a Composição Corporal', category: 'Equipamento' },
  { slug: 'melhores-rolos-gelo-crioterapia-portateis', title: 'Melhores Rolos de Gelo Portáteis para Crioterapia Local', category: 'Equipamento' },
  { slug: 'melhores-dispositivos-massagem-percussao-portateis', title: 'Melhores Dispositivos de Massagem por Percussão Portáteis', category: 'Equipamento' },
  { slug: 'botas-compressao-pneumatica-vale-a-pena', title: 'Botas de Compressão Pneumática: Valem o Investimento para Amadores?', category: 'Equipamento' },
  { slug: 'melhores-garrafas-termicas-corrida-inverno', title: 'Melhores Garrafas Térmicas para Levar na Corrida de Inverno', category: 'Equipamento' },
  { slug: 'melhores-porta-documentos-impermeaveis-corrida', title: 'Melhores Porta-Documentos à Prova de Água para Correr', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-corrida-pes-sensiveis', title: 'Sapatilhas de Corrida Recomendadas para Pés Sensíveis', category: 'Equipamento' },
  { slug: 'melhores-plataformas-coaching-online-corredores', title: 'Melhores Plataformas de Coaching Online para Corredores', category: 'Equipamento' },
  { slug: 'melhores-relogios-gps-jovens-atletas', title: 'Relógios GPS para Jovens Atletas: Guia de Escolha', category: 'Equipamento' },
  { slug: 'tendas-hipoxicas-domesticas-vale-a-pena', title: 'Tendas Hipóxicas Domésticas: Vale a Pena o Investimento?', category: 'Equipamento' },
  { slug: 'melhores-camaras-acao-registar-treinos-trail', title: 'Melhores Câmaras de Ação para Registar Treinos de Trail', category: 'Equipamento' },
  { slug: 'melhores-carregadores-portateis-relogio-gps', title: 'Melhores Carregadores Portáteis Compatíveis com Relógios GPS', category: 'Equipamento' },
  { slug: 'melhores-tapetes-mobilidade-compactos-viagem', title: 'Melhores Tapetes de Mobilidade Compactos para Levar em Viagem', category: 'Equipamento' },
  { slug: 'melhores-elasticos-resistencia-forca-corredores', title: 'Melhores Elásticos de Resistência para Treino de Força de Corredores', category: 'Equipamento' },
  { slug: 'melhores-foam-rollers-compactos-viagem', title: 'Melhores Foam Rollers Compactos para Levar em Viagem', category: 'Equipamento' },
  { slug: 'mantas-compressao-termica-nova-tendencia', title: 'Mantas de Compressão Térmica: A Nova Tendência de Recuperação', category: 'Equipamento' },
  { slug: 'melhores-acessorios-reflectantes-corrida-noturna', title: 'Melhores Acessórios Reflectantes para Correr ao Fim do Dia', category: 'Equipamento' },
  { slug: 'braceletes-identificacao-medica-corredores', title: 'Braceletes de Identificação Médica para Corredores: Porque São Essenciais', category: 'Equipamento' },
  { slug: 'melhores-apitos-seguranca-trail-solo', title: 'Apitos de Segurança para Trail a Solo: Guia de Compra', category: 'Equipamento' },
  { slug: 'sapatilhas-recomendadas-reabilitacao-pos-lesao', title: 'Sapatilhas Recomendadas na Fase de Reabilitação Pós-Lesão', category: 'Equipamento' },
  { slug: 'melhores-kits-primeiros-socorros-trail-ultra', title: 'Kit de Primeiros Socorros para Trail e Ultra: O Que Levar', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-ginasio-forca-corredores', title: 'Melhores Sapatilhas de Ginásio para o Treino de Força de Corredores', category: 'Equipamento' },
  // ── LOTE 2026-09-18 — reposição do banco comercial esgotado ──────────────
  { slug: 'melhores-sapatilhas-trail-longa-distancia', title: 'Melhores Sapatilhas de Trail para Longa Distância', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-ultra-trail-2026', title: 'Melhores Sapatilhas para Ultra Trail 2026', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-trail-lama-grip', title: 'Melhores Sapatilhas de Trail para Lama', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-pes-estreitos', title: 'Sapatilhas para Pés Estreitos: As Melhores', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-joanetes-corredores', title: 'Sapatilhas para Quem Tem Joanetes', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-fascite-plantar', title: 'Melhores Sapatilhas para Fascite Plantar', category: 'Equipamento' },
  { slug: 'melhores-sapatilhas-corredores-veteranos', title: 'Sapatilhas de Corrida para Veteranos', category: 'Equipamento' },
  { slug: 'sapatilhas-segunda-mao-vale-a-pena', title: 'Sapatilhas em Segunda Mão: Vale a Pena?', category: 'Equipamento' },
  { slug: 'quantos-pares-sapatilhas-rotacao', title: 'Quantos Pares de Sapatilhas Precisas?', category: 'Equipamento' },
  { slug: 'melhores-super-shoes-2026-comparativo', title: 'Super Shoes 2026: Comparativo Completo', category: 'Equipamento' },
  { slug: 'garmin-forerunner-qual-modelo-escolher', title: 'Garmin Forerunner: Qual Modelo Escolher', category: 'Equipamento' },
  { slug: 'coros-pace-vs-apex-qual-escolher', title: 'COROS Pace vs Apex: Qual Escolher', category: 'Equipamento' },
  { slug: 'relogios-suunto-trail-guia-compra', title: 'Relógios Suunto para Trail: Guia', category: 'Equipamento' },
  { slug: 'relogios-polar-corrida-vale-a-pena', title: 'Relógios Polar: Valem a Pena em 2026?', category: 'Equipamento' },
  { slug: 'apple-watch-para-corredores-vale', title: 'Apple Watch para Corredores: Vale?', category: 'Equipamento' },
  { slug: 'relogios-corrida-pulso-pequeno', title: 'Relógios de Corrida para Pulso Pequeno', category: 'Equipamento' },
  { slug: 'melhores-bandas-peitorais-frequencia-cardiaca', title: 'Melhores Bandas Peitorais de FC', category: 'Equipamento' },
  { slug: 'sensores-potencia-stryd-comparativo', title: 'Sensores de Potência: Stryd vs Alternativas', category: 'Equipamento' },
  { slug: 'melhores-aneis-inteligentes-recuperacao', title: 'Anéis Inteligentes: Oura vs Alternativas', category: 'Equipamento' },
  { slug: 'balancas-bioimpedancia-atletas-guia', title: 'Balanças de Bioimpedância: Guia de Compra', category: 'Equipamento' },
  { slug: 'bicicletas-estaticas-treino-cruzado', title: 'Bicicletas Estáticas para Treino Cruzado', category: 'Equipamento' },
  { slug: 'maquinas-remo-para-corredores', title: 'Máquinas de Remo para Corredores', category: 'Equipamento' },
  { slug: 'elipticas-treino-cruzado-corredores', title: 'Elípticas para Treino Cruzado', category: 'Equipamento' },
  { slug: 'bandas-elasticas-guia-corredores', title: 'Bandas Elásticas: Guia para Corredores', category: 'Equipamento' },
  { slug: 'kettlebells-halteres-para-corredores', title: 'Kettlebells e Halteres para Corredores', category: 'Equipamento' },
  { slug: 'material-pliometria-para-casa', title: 'Material de Pliometria para Casa', category: 'Equipamento' },
  { slug: 'melhores-bolas-massagem-trigger-point', title: 'Bolas de Massagem: As Melhores Opções', category: 'Equipamento' },
  { slug: 'eletroestimuladores-recuperacao-guia', title: 'Eletroestimuladores para Recuperação', category: 'Equipamento' },
  { slug: 'crioterapia-em-casa-que-material', title: 'Crioterapia em Casa: Que Material', category: 'Equipamento' },
  { slug: 'saunas-portateis-corredores-vale', title: 'Saunas Portáteis: Valem o Investimento?', category: 'Equipamento' },
  { slug: 'melhores-calcoes-corrida-homem', title: 'Melhores Calções de Corrida para Homem', category: 'Equipamento' },
  { slug: 'melhores-calcoes-corrida-mulher', title: 'Melhores Calções de Corrida para Mulher', category: 'Equipamento' },
  { slug: 'melhores-corta-ventos-leves-corrida', title: 'Melhores Corta-Ventos Leves para Correr', category: 'Equipamento' },
  { slug: 'melhores-calcas-corrida-inverno', title: 'Melhores Calças de Corrida para o Inverno', category: 'Equipamento' },
  { slug: 'coletes-refletores-correr-visivel', title: 'Coletes Refletores: Correr Visível', category: 'Equipamento' },
  { slug: 'melhores-luzes-led-corrida-noturna', title: 'Luzes LED para Corrida Noturna', category: 'Equipamento' },
  { slug: 'polainas-trail-gaiters-quais-escolher', title: 'Polainas de Trail: Quais Escolher', category: 'Equipamento' },
  { slug: 'mochilas-hidratacao-para-mulher', title: 'Mochilas de Hidratação para Mulher', category: 'Equipamento' },
  { slug: 'garrafas-filtro-agua-trail', title: 'Garrafas com Filtro para Trail', category: 'Equipamento' },
  { slug: 'pastilhas-sais-eletroliticos-comparativo', title: 'Pastilhas de Sais: Comparativo', category: 'Equipamento' },
  { slug: 'geis-energeticos-sem-cafeina', title: 'Géis Energéticos Sem Cafeína', category: 'Equipamento' },
  { slug: 'alternativas-naturais-aos-geis', title: 'Alternativas Naturais aos Géis', category: 'Equipamento' },
  { slug: 'melhores-isotonicos-em-po', title: 'Melhores Isotónicos em Pó', category: 'Equipamento' },
  { slug: 'melhores-proteinas-whey-corredores', title: 'Melhores Proteínas Whey para Corredores', category: 'Equipamento' },
  { slug: 'suplementos-ferro-corredores-guia', title: 'Suplementos de Ferro: Guia de Compra', category: 'Equipamento' },
  { slug: 'multivitaminicos-para-atletas-guia', title: 'Multivitamínicos para Atletas: Guia', category: 'Equipamento' },
  { slug: 'suplementos-magnesio-caibras-guia', title: 'Suplementos de Magnésio para Cãibras', category: 'Equipamento' },
  { slug: 'melhores-barras-proteicas-corredores', title: 'Melhores Barras Proteicas', category: 'Equipamento' },
  { slug: 'oculos-fotocromaticos-para-correr', title: 'Óculos Fotocromáticos para Correr', category: 'Equipamento' },
  { slug: 'relogios-altimetro-barometro-trail', title: 'Relógios com Altímetro para Trail', category: 'Equipamento' },
  { slug: 'melhores-apps-gratuitas-corrida-2026', title: 'Melhores Apps Gratuitas de Corrida', category: 'Equipamento' },
  { slug: 'melhores-livros-sobre-corrida-treino', title: 'Melhores Livros Sobre Corrida e Treino', category: 'Equipamento' },
  { slug: 'auscultadores-conducao-ossea-guia', title: 'Auscultadores de Condução Óssea', category: 'Equipamento' },
  { slug: 'bracadeiras-porta-telemovel-guia', title: 'Braçadeiras Porta-Telemóvel: Guia', category: 'Equipamento' },
  { slug: 'cintos-porta-objetos-para-correr', title: 'Cintos Porta-Objetos para Correr', category: 'Equipamento' },
  { slug: 'toalhas-arrefecimento-para-o-calor', title: 'Toalhas de Arrefecimento para o Calor', category: 'Equipamento' },
  { slug: 'cremes-aquecimento-muscular-guia', title: 'Cremes de Aquecimento Muscular', category: 'Equipamento' },
  { slug: 'sacos-desporto-para-treino', title: 'Sacos de Desporto para Treino', category: 'Equipamento' },
  { slug: 'como-lavar-cuidar-sapatilhas', title: 'Como Lavar e Cuidar das Sapatilhas', category: 'Equipamento' },
  { slug: 'presentes-natal-corredores-2026', title: 'Presentes de Natal para Corredores', category: 'Equipamento' },
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
      'Joyner, M. J., & Coyle, E. F. (2008). Endurance exercise performance: the physiology of champions. The Journal of Physiology, 586(1), 35-44. https://doi.org/10.1113/jphysiol.2007.143834',
    'Lorenzo, S., Halliwill, J. R., Sawka, M. N., & Minson, C. T. (2010). Heat acclimation improves exercise performance. Journal of Applied Physiology, 109(4), 1140-1147. https://doi.org/10.1152/japplphysiol.00495.2010',
    'Maunder, E., Seiler, S., Mildenhall, M. J., Kilding, A. E., & Plews, D. J. (2021). The importance of \'durability\' in the physiological profiling of endurance athletes. Sports Medicine, 51(8), 1619-1628. https://doi.org/10.1007/s40279-021-01459-0',
  ],
  'Treino': [
    'Seiler, S. (2010). What is best practice for training intensity and duration distribution in endurance athletes? International Journal of Sports Physiology and Performance, 5(3), 276-291. https://doi.org/10.1123/ijspp.5.3.276',
    'Laursen, P. B. (2010). Training for intense exercise performance: high-intensity or high-volume training? Scandinavian Journal of Medicine & Science in Sports, 20(s2), 1-10. https://doi.org/10.1111/j.1600-0838.2010.01184.x',
    'Buchheit, M., & Laursen, P. B. (2013). High-intensity interval training, solutions to the programming puzzle. Sports Medicine, 43(5), 313-338. https://doi.org/10.1007/s40279-013-0029-x',
    'Bompa, T. O., & Buzzichelli, C. (2018). Periodization: Theory and Methodology of Training (6th ed.). Human Kinetics.',
      'Bosquet, L., Montpetit, J., Arvisais, D., & Mujika, I. (2007). Effects of tapering on performance: a meta-analysis. Medicine & Science in Sports & Exercise, 39(8), 1358-1365. https://doi.org/10.1249/mss.0b013e31806010e0',
    'Blagrove, R. C., Howatson, G., & Hayes, P. R. (2018). Effects of strength training on the physiological determinants of middle- and long-distance running performance: a systematic review. Sports Medicine, 48(5), 1117-1149. https://doi.org/10.1007/s40279-017-0835-7',
      'Zanini, M., Folland, J. P., Wu, H., & Blagrove, R. C. (2025). Strength training improves running economy durability and fatigued high-intensity performance in well-trained male runners: a randomized control trial. Medicine & Science in Sports & Exercise, 57(7), 1546-1558. https://doi.org/10.1249/MSS.0000000000003685',
    'Dudagoitia Barrio, E., Fernández-Landa, J., Negra, Y., Ramirez-Campillo, R., & García de Alcaraz, A. (2023). Effects of plyometric jump training on running economy in endurance runners. Kinesiology, 55(2), 270-281. https://doi.org/10.26582/k.55.2.11',
],
  'Nutrição': [
    'Jeukendrup, A. E. (2014). A step towards personalized sports nutrition: carbohydrate intake during exercise. Sports Medicine, 44(Suppl 1), 25-33. https://doi.org/10.1007/s40279-014-0148-z',
    'Burke, L. M., Hawley, J. A., Wong, S. H., & Jeukendrup, A. E. (2011). Carbohydrates for training and competition. Journal of Sports Sciences, 29(sup1), S17-S27. https://doi.org/10.1080/02640414.2011.585473',
    'Thomas, D. T., Erdman, K. A., & Burke, L. M. (2016). American College of Sports Medicine Joint Position Statement: Nutrition and Athletic Performance. Medicine & Science in Sports & Exercise, 48(3), 543-568. https://doi.org/10.1249/MSS.0000000000000852',
    'Maughan, R. J., & Shirreffs, S. M. (2010). Dehydration and rehydration in competitive sport. Scandinavian Journal of Medicine & Science in Sports, 20(s3), 40-47. https://doi.org/10.1111/j.1600-0838.2010.01207.x',
      'Podlogar, T., & Wallis, G. A. (2022). New horizons in carbohydrate research and application for endurance athletes. Sports Medicine, 52(Suppl 1), 5-23. https://doi.org/10.1007/s40279-022-01757-1',
    'Burke, L. M., Ross, M. L., Garvican-Lewis, L. A., et al. (2017). Low carbohydrate, high fat diet impairs exercise economy and negates the performance benefit from intensified training in elite race walkers. The Journal of Physiology, 595(9), 2785-2807. https://doi.org/10.1113/JP273230',
    'Areta, J. L., Burke, L. M., Ross, M. L., et al. (2013). Timing and distribution of protein ingestion during prolonged recovery from resistance exercise alters myofibrillar protein synthesis. The Journal of Physiology, 591(9), 2319-2331. https://doi.org/10.1113/jphysiol.2012.244897',
    'Jones, A. M. (2014). Dietary nitrate supplementation and exercise performance. Sports Medicine, 44(Suppl 1), S35-S45. https://doi.org/10.1007/s40279-014-0149-y',
    'Guest, N. S., VanDusseldorp, T. A., Nelson, M. T., et al. (2021). International Society of Sports Nutrition position stand: caffeine and exercise performance. Journal of the International Society of Sports Nutrition, 18(1), 1. https://doi.org/10.1186/s12970-020-00383-4',
    'Costa, R. J. S., Snipe, R. M. J., Kitic, C. M., & Gibson, P. R. (2017). Systematic review: exercise-induced gastrointestinal syndrome - implications for health and intestinal disease. Alimentary Pharmacology & Therapeutics, 46(3), 246-265. https://doi.org/10.1111/apt.14157',
    'Mountjoy, M., Ackerman, K. E., Bailey, D. M., et al. (2023). 2023 International Olympic Committee\'s (IOC) consensus statement on Relative Energy Deficiency in Sport (REDs). British Journal of Sports Medicine, 57(17), 1073-1098. https://doi.org/10.1136/bjsports-2023-106994',
      'Grgic, J., Pedisic, Z., Saunders, B., Artioli, G. G., Schoenfeld, B. J., & McKenna, M. J. (2021). International Society of Sports Nutrition position stand: sodium bicarbonate and exercise performance. Journal of the International Society of Sports Nutrition, 18(1). https://doi.org/10.1186/s12970-021-00458-w',
    'Grgic, J., Grgic, I., Del Coso, J., Schoenfeld, B. J., & Pedisic, Z. (2021). Effects of sodium bicarbonate supplementation on exercise performance: an umbrella review. Journal of the International Society of Sports Nutrition, 18(1). https://doi.org/10.1186/s12970-021-00469-7',
    'Wang, Z., Qiu, B., Gao, J., & Del Coso, J. (2022). Effects of caffeine intake on endurance running performance and time to exhaustion: a systematic review and meta-analysis. Nutrients, 15(1), 148. https://doi.org/10.3390/nu15010148',
],
  'Biomecânica': [
    'Moore, I. S. (2016). Is there an economical running technique? A review of modifiable biomechanical factors affecting running economy. Sports Medicine, 46(6), 793-807. https://doi.org/10.1007/s40279-016-0474-4',
    'Lieberman, D. E., Venkadesan, M., Werbel, W. A., Daoud, A. I., D\'Andrea, S., Davis, I. S., Mang\'eni, R. O., & Pitsiladis, Y. (2010). Foot strike patterns and collision forces in habitually barefoot versus shod runners. Nature, 463(7280), 531-535. https://doi.org/10.1038/nature08723',
    'Daoud, A. I., Geissler, G. J., Wang, F., Saretsky, J., Daoud, Y. A., & Lieberman, D. E. (2012). Foot strike and injury rates in endurance runners: a retrospective study. Medicine & Science in Sports & Exercise, 44(7), 1325-1334. https://doi.org/10.1249/MSS.0b013e3182465115',
    'Novacheck, T. F. (1998). The biomechanics of running. Gait & Posture, 7(1), 77-95. https://doi.org/10.1016/S0966-6362(97)00038-6',
      'Heiderscheit, B. C., Chumanov, E. S., Michalski, M. P., Wille, C. M., & Ryan, M. B. (2011). Effects of step rate manipulation on joint mechanics during running. Medicine & Science in Sports & Exercise, 43(2), 296-302. https://doi.org/10.1249/MSS.0b013e3181ebedf4',
    'Lenhart, R. L., Thelen, D. G., Wille, C. M., Chumanov, E. S., & Heiderscheit, B. C. (2014). Increasing running step rate reduces patellofemoral joint forces. Medicine & Science in Sports & Exercise, 46(3), 557-564. https://doi.org/10.1249/MSS.0b013e3182a78c3a',
    'Schücker, L., & Parrington, L. (2019). Thinking about your running movement makes you less efficient: attentional focus effects on running economy and kinematics. Journal of Sports Sciences, 37(6), 638-646. https://doi.org/10.1080/02640414.2018.1522697',
],
  'Recuperação': [
    'Kellmann, M., Bertollo, M., Bosquet, L., et al. (2018). Recovery and Performance in Sport: Consensus Statement. International Journal of Sports Physiology and Performance, 13(2), 240-245. https://doi.org/10.1123/ijspp.2017-0759',
    'Halson, S. L. (2014). Monitoring training load to understand fatigue in athletes. Sports Medicine, 44(Suppl 2), 139-147. https://doi.org/10.1007/s40279-014-0253-z',
    'Bishop, P. A., Jones, E., & Woods, A. K. (2008). Recovery from training: a brief review. Journal of Strength and Conditioning Research, 22(3), 1015-1024. https://doi.org/10.1519/JSC.0b013e31816eb518',
    'Vitale, K. C., Owens, R., Hopkins, S. R., & Malhotra, A. (2019). Sleep hygiene for optimizing recovery in athletes: review and recommendations. International Journal of Sports Medicine, 40(8), 535-543. https://doi.org/10.1055/a-0905-3103',
      'Roberts, L. A., Raastad, T., Markworth, J. F., et al. (2015). Post-exercise cold water immersion attenuates acute anabolic signalling and long-term adaptations in muscle to strength training. The Journal of Physiology, 593(18), 4285-4301. https://doi.org/10.1113/JP270570',
    'Mah, C. D., Mah, K. E., Kezirian, E. J., & Dement, W. C. (2011). The effects of sleep extension on the athletic performance of collegiate basketball players. Sleep, 34(7), 943-950. https://doi.org/10.5665/SLEEP.1132',
    'Walsh, N. P., Halson, S. L., Sargent, C., et al. (2021). Sleep and the athlete: narrative review and 2021 expert consensus recommendations. British Journal of Sports Medicine, 55(7), 356-368. https://doi.org/10.1136/bjsports-2020-102025',
    'Dupuy, O., Douzi, W., Theurot, D., Bosquet, L., & Dugue, B. (2018). An evidence-based approach for choosing post-exercise recovery techniques to reduce markers of muscle damage, soreness, fatigue, and inflammation: a systematic review with meta-analysis. Frontiers in Physiology, 9, 403. https://doi.org/10.3389/fphys.2018.00403',
    'Howatson, G., McHugh, M. P., Hill, J. A., et al. (2010). Influence of tart cherry juice on indices of recovery following marathon running. Scandinavian Journal of Medicine & Science in Sports, 20(6), 843-852. https://doi.org/10.1111/j.1600-0838.2009.01005.x',
      'Brown, F., Gissane, C., Howatson, G., van Someren, K., Pedlar, C., & Hill, J. (2017). Compression garments and recovery from exercise: a meta-analysis. Sports Medicine, 47(11), 2245-2267. https://doi.org/10.1007/s40279-017-0728-9',
],
  'Lesões': [
    'van Gent, R. N., Siem, D., van Middelkoop, M., van Os, A. G., Bierma-Zeinstra, S. M. A., & Koes, B. W. (2007). Incidence and determinants of lower extremity running injuries in long distance runners. British Journal of Sports Medicine, 41(8), 469-480. https://doi.org/10.1136/bjsm.2006.033548',
    'Lopes, A. D., Hespanhol Júnior, L. C., Yeung, S. S., & Costa, L. O. P. (2012). What are the main running-related musculoskeletal injuries? Sports Medicine, 42(10), 891-905. https://doi.org/10.1007/BF03262301',
    'Warden, S. J., Davis, I. S., & Fredericson, M. (2014). Management and prevention of bone stress injuries in long-distance runners. Journal of Orthopaedic & Sports Physical Therapy, 44(10), 749-765. https://doi.org/10.2519/jospt.2014.5334',
    'Taunton, J. E., Ryan, M. B., Clement, D. B., McKenzie, D. C., Lloyd-Smith, D. R., & Zumbo, B. D. (2002). A retrospective case-control analysis of 2002 running injuries. British Journal of Sports Medicine, 36(2), 95-101. https://doi.org/10.1136/bjsm.36.2.95',
      'Beyer, R., Kongsgaard, M., Hougs Kjær, B., Øhlenschlæger, T., Kjær, M., & Magnusson, S. P. (2015). Heavy slow resistance versus eccentric training as treatment for Achilles tendinopathy. The American Journal of Sports Medicine, 43(7), 1704-1711. https://doi.org/10.1177/0363546515584760',
    'Ceyssens, L., Vanelderen, R., Barton, C., Malliaras, P., & Dingenen, B. (2019). Biomechanical risk factors associated with running-related injuries: A systematic review. Sports Medicine, 49(7), 1095-1115. https://doi.org/10.1007/s40279-019-01110-z',
    'Gabbett, T. J. (2016). The training-injury prevention paradox: should athletes be training smarter and harder? British Journal of Sports Medicine, 50(5), 273-280. https://doi.org/10.1136/bjsports-2015-095788',
    'Yagi, S., Muneta, T., & Sekiya, I. (2013). Incidence and risk factors for medial tibial stress syndrome and tibial stress fracture in high school runners. Knee Surgery, Sports Traumatology, Arthroscopy, 21(3), 556-563. https://doi.org/10.1007/s00167-012-2160-x',
    'Foch, E., Aubol, K., & Milner, C. E. (2020). Relationship between iliotibial band syndrome and hip neuromechanics in women runners. Gait & Posture, 77, 64-68. https://doi.org/10.1016/j.gaitpost.2019.12.021',
],
  'Psicologia': [
    'Brick, N., MacIntyre, T., & Campbell, M. (2014). Attentional focus in endurance activity: new paradigms and future directions. International Review of Sport and Exercise Psychology, 7(1), 106-134. https://doi.org/10.1080/1750984X.2014.885554',
    'Tenenbaum, G., & Eklund, R. C. (Eds.). (2007). Handbook of Sport Psychology (3rd ed.). John Wiley & Sons.',
    'Noakes, T. D. (2012). Fatigue is a brain-derived emotion that regulates the exercise behavior to ensure the protection of whole body homeostasis. Frontiers in Physiology, 3, 82. https://doi.org/10.3389/fphys.2012.00082',
    'McCormick, A., Meijen, C., & Marcora, S. (2015). Psychological determinants of whole-body endurance performance. Sports Medicine, 45(7), 997-1015. https://doi.org/10.1007/s40279-015-0319-6',
      'Blanchfield, A. W., Hardy, J., de Morree, H. M., Staiano, W., & Marcora, S. M. (2014). Talking yourself out of exhaustion. Medicine & Science in Sports & Exercise, 46(5), 998-1007. https://doi.org/10.1249/MSS.0000000000000184',
    'Marcora, S. M., Staiano, W., & Manning, V. (2009). Mental fatigue impairs physical performance in humans. Journal of Applied Physiology, 106(3), 857-864. https://doi.org/10.1152/japplphysiol.91324.2008',
    'Smith, M. R., Coutts, A. J., Merlini, M., Deprez, D., Lenoir, M., & Marcora, S. M. (2016). Mental fatigue impairs soccer-specific physical and technical performance. Medicine & Science in Sports & Exercise, 48(2), 267-276. https://doi.org/10.1249/MSS.0000000000000762',
],
  'Trail Running': [
    'Vernillo, G., Giandolini, M., Edwards, W. B., Morin, J. B., Samozino, P., Horvais, N., & Millet, G. Y. (2017). Biomechanics and physiology of uphill and downhill running. Sports Medicine, 47(4), 615-629. https://doi.org/10.1007/s40279-016-0605-y',
    'Millet, G. Y., Tomazin, K., Verges, S., et al. (2011). Neuromuscular consequences of an extreme mountain ultra-marathon. PLoS ONE, 6(2), e17059. https://doi.org/10.1371/journal.pone.0017059',
    'Scheer, V., Basset, P., Giovanelli, N., Vernillo, G., Millet, G. P., & Costa, R. J. S. (2020). Defining off-road running: a position statement. Sports Medicine, 50(3), 1-13. https://doi.org/10.1007/s40279-019-01237-0',
    'Balducci, P., Clémençon, M., Trama, R., Blache, Y., & Hautier, C. (2017). Performance factors in a mountain ultramarathon. International Journal of Sports Medicine, 38(11), 819-825. https://doi.org/10.1055/s-0043-112339',
      'Saugy, J., Place, N., Millet, G. Y., Degache, F., Schena, F., & Millet, G. P. (2013). Alterations of neuromuscular function after the world\'s most challenging mountain ultra-marathon. PLoS ONE, 8(6), e65596. https://doi.org/10.1371/journal.pone.0065596',
    'Lazzer, S., Salvadego, D., Taboga, P., Rejc, E., Giovanelli, N., & di Prampero, P. E. (2015). Effects of the Etna uphill ultramarathon on energy cost and mechanics of running. International Journal of Sports Physiology and Performance, 10(2), 238-247. https://doi.org/10.1123/ijspp.2014-0057',
    'Gottschall, J. S., & Kram, R. (2005). Ground reaction forces during downhill and uphill running. Journal of Biomechanics, 38(3), 445-452. https://doi.org/10.1016/j.jbiomech.2004.04.023',
    'Takayama, F., Aoyagi, A., & Nabekura, Y. (2016). Pacing strategy in a 24-hour ultramarathon race. International Journal of Performance Analysis in Sport, 16(2), 498-507. https://doi.org/10.1080/24748668.2016.11868904',
    'Tiller, N. B., & Illidi, C. R. (2024). Sex differences in ultramarathon performance in races with comparable numbers of males and females. Applied Physiology, Nutrition, and Metabolism, 49(8), 1129-1136. https://doi.org/10.1139/apnm-2024-0051',
    'Hoffman, M. D., Hew-Butler, T., & Stuempfle, K. J. (2013). Exercise-associated hyponatremia and hydration status in 161-km ultramarathoners. Medicine & Science in Sports & Exercise, 45(4), 784-791. https://doi.org/10.1249/MSS.0b013e31827985a8',
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

// Remove acentos/diacríticos (NFD + remove combining marks) — mesma lógica
// usada em app/blog/[slug]/page.tsx e middleware.ts para normalizar slugs.
// Sem isto, "bolhas-pés-..." e "bolhas-pes-..." são tratados como tópicos
// DIFERENTES pela deduplicação abaixo, e a automação publica o mesmo tema
// outra vez com um slug ligeiramente diferente — ver
// [[project_duplicados_slugs_acentuados]] (descoberto 2026-08-15,
// confirmado a acontecer de novo em 2026-08-16 com pelo menos 2 dos "3
// artigos novos" do dia a serem duplicados disfarçados).
function deaccent(value) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function getExistingSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true })
    return new Set()
  }
  return new Set(
    fs.readdirSync(ARTICLES_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => deaccent(f.replace('.md', '')))
  )
}

// Conta quantos artigos já têm a data de hoje no frontmatter, separados por
// tipo (comercial = categoria "Equipamento", técnico = todas as outras).
//
// Usado como trava de idempotência: se o workflow for disparado mais do que
// uma vez no mesmo dia (ex: o cron original atrasado + a rede de segurança da
// Vercel a disparar via workflow_dispatch), a segunda execução NÃO pode voltar
// a tentar gerar TECHNICAL_PER_RUN + COMMERCIAL_PER_RUN do zero — isso somaria
// aos artigos já publicados e produziria dias com 4-8 artigos em vez de 3
// (foi exatamente o que aconteceu em 2026-07-04/07-05: um disparo duplicado
// gerou um artigo comercial quase-repetido que teve de ser removido à mão).
// Em vez disso, cada execução calcula quantos técnicos/comerciais FALTAM para
// chegar a 3, e só gera esses — nunca mais do que isso, seja qual for o
// número de disparos nesse dia.
function countTodayByType(today) {
  let technical = 0
  let commercial = 0
  if (!fs.existsSync(ARTICLES_DIR)) return { technical, commercial }
  for (const f of fs.readdirSync(ARTICLES_DIR)) {
    if (!f.endsWith('.md')) continue
    const content = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')
    const dateMatch = content.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)
    if (!dateMatch || dateMatch[1] !== today) continue
    const catMatch = content.match(/^category:\s*['"]?([^'"\n]+)/m)
    if (catMatch && catMatch[1].trim() === 'Equipamento') commercial++
    else technical++
  }
  return { technical, commercial }
}

// Baralha um array (Fisher-Yates) sem alterar o original.
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Reordena os tópicos por categoria em "ronda-robin" (um de cada categoria
// de cada vez, em vez de esgotar uma categoria inteira antes de passar à
// seguinte). O ALL_TOPICS está agrupado por categoria (Treino, Fisiologia,
// Nutrição, ... Trail Running, ...) e generateFromQueue consome a fila pela
// ordem em que chega — sem isto, uma categoria só "aparece" depois de todas
// as anteriores no array estarem esgotadas, o que produz dias inteiros só
// com uma categoria (ex: 2026-08-10 a 2026-08-12 só saíram artigos de Trail
// Running, porque Psicologia tinha acabado de esgotar mesmo antes). Com o
// round-robin, cada categoria contribui com um tópico por "volta", pelo que
// os artigos de um mesmo dia (e de dias consecutivos) ficam distribuídos
// por categorias diferentes.
function interleaveByCategory(topics) {
  const groups = {}
  for (const t of topics) {
    ;(groups[t.category] ??= []).push(t)
  }
  const categories = shuffle(Object.keys(groups))
  for (const c of categories) groups[c] = shuffle(groups[c])

  const result = []
  let added = true
  while (added) {
    added = false
    for (const c of categories) {
      if (groups[c].length > 0) {
        result.push(groups[c].shift())
        added = true
      }
    }
  }
  return result
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
      model: 'openai/gpt-oss-20b',
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

// ── Validação: o artigo cita mesmo as referências do banco? ──────────────────
// O modelo ignora com alguma frequência a regra "cita pelo menos N referências
// da lista" e devolve um artigo sem secção de referências nenhuma. Antes desta
// verificação o script publicava à mesma: a 2026-09-18 havia 13 dos últimos 30
// artigos abaixo do mínimo, vários com ZERO referências — o que contraria a
// premissa do site (conteúdo baseado em estudos reais). Agora contamos as
// referências do banco que aparecem mesmo no texto e repetimos a geração se
// ficarem abaixo do mínimo; se continuar a falhar, o tópico é saltado e NÃO é
// publicado (melhor não publicar do que publicar sem fundamento científico).
function extractDoiFromRef(ref) {
  const m = ref.match(/https:\/\/doi\.org\/(\S+)\s*$/)
  return m ? m[1].toLowerCase() : null
}

function countBankReferences(content, refsBank) {
  const texto = content.toLowerCase()
  let n = 0
  for (const ref of refsBank) {
    const doi = extractDoiFromRef(ref)
    if (doi) {
      if (texto.includes(doi)) n++
      continue
    }
    // Referências sem DOI (position stands, livros): casa por 1.º autor + ano.
    const autor = (ref.match(/^([A-Za-zÀ-ÿ'-]+)/) || [])[1]
    const ano = (ref.match(/\((\d{4})\)/) || [])[1]
    if (autor && ano && texto.includes(autor.toLowerCase()) && texto.includes(ano)) n++
  }
  return n
}

// Regras partilhadas pelos dois prompts, criadas em 2026-09-21 depois de uma
// auditoria aos 326 artigos publicados encontrar o problema mais grave do
// site: referências científicas coladas a afirmações que os estudos não
// fazem (ex: Hoogkamer 2018, que é sobre sapatilhas Vaporfly, usado para
// justificar a "eficiência energética" de um relógio GPS; Nigg, biomecânica
// de calçado, usado para falhas do sensor de pulsação), especificações de
// produto inventadas (IP57 atribuído ao COROS Pace, que é 5ATM; "sensor de
// ≥200 Hz"; "resistência a impactos de 2,4 m") e funcionalidades que a marca
// não tem ("sincroniza com a nossa app dedicada"). Isto é pior do que não ter
// referências nenhumas: dá aparência de rigor sem rigor, precisamente ao
// contrário da promessa do site, e nos artigos de equipamento (que têm links
// de afiliado) pode levar alguém a comprar com base num número errado.
const REGRAS_ANTI_INVENCAO = `
REGRAS DE VERACIDADE (as mais importantes de todas — um artigo que as viole é inútil):
- NUNCA inventes especificações técnicas de produtos: peso, autonomia de bateria, certificações (IP__, __ATM), resistência a impactos, frequências de sensor, alcance, materiais. Se não tens a certeza absoluta de um número, NÃO o escrevas — descreve a característica em termos qualitativos ("autonomia longa, suficiente para um ultra de um dia").
- NUNCA atribuas a um estudo uma conclusão que ele não tem. Só cita uma referência quando o estudo é mesmo sobre o assunto da frase. É PROIBIDO usar um estudo sobre calçado, fisiologia ou treino para sustentar uma afirmação sobre eletrónica, relógios, sensores ou acessórios — nesses casos escreve a frase sem referência nenhuma.
- NUNCA inventes nomes de apps, ferramentas, protocolos, marcas ou modelos. Usa apenas produtos e ferramentas que existem mesmo e que reconheces com segurança.
- NUNCA atribuas ao Performance Running serviços que não existem: não há app própria, não há loja, não há laboratório de testes, não há programa de coaching presencial.
- Prefere sempre a afirmação mais cautelosa: "varia conforme o atleta" é melhor do que um número inventado com aparência de precisão.
- Português de Portugal SEMPRE. Palavras proibidas (são brasileirismos): "você", "vocês", "treinamento", "panturrilha", "esteira", "esportivo", "esporte", "celular", "time", "acadêmico", "econômico", "eletrônico", "fenômeno", "tênis", "goniômetro", "controle" (usa "controlo"), "gerúndio" à brasileira ("está correndo" — escreve "está a correr").`

const REFORCO_REFERENCIAS = `

ATENÇÃO — a resposta anterior foi REJEITADA por não cumprir a regra das referências. Reescreve o artigo COMPLETO e garante que a secção final de referências cita, copiadas LETRA A LETRA da lista fornecida acima (incluindo o URL https://doi.org/...), pelo menos o número mínimo exigido. Não inventes referências, não alteres autores, títulos ou DOIs, e não cites nada que não esteja na lista.`

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
8. OBRIGATÓRIO — logo antes da secção de Referências, inclui uma secção "## Perguntas Frequentes" com EXATAMENTE 3 pares pergunta/resposta, no formato exato abaixo (cada resposta com 1-3 frases diretas e objetivas, sem introduções tipo "Boa pergunta"):

## Perguntas Frequentes

**Pergunta 1 completa, terminada em ponto de interrogação?**
Resposta direta e objetiva, 1-3 frases.

**Pergunta 2 completa, terminada em ponto de interrogação?**
Resposta direta e objetiva, 1-3 frases.

**Pergunta 3 completa, terminada em ponto de interrogação?**
Resposta direta e objetiva, 1-3 frases.

REFERÊNCIAS DISPONÍVEIS (escolhe no mínimo 4, podes usar todas se fizer sentido):
${refsList}

${REGRAS_ANTI_INVENCAO}

Começa a resposta com UMA linha exatamente neste formato, antes de qualquer outra coisa:
META: <descrição para o Google, 120 a 158 caracteres, frase completa e apelativa que diga o que o leitor ganha ao ler — NÃO é o primeiro parágrafo copiado, NÃO acaba em reticências>

Depois dessa linha, responde com o conteúdo markdown do artigo (sem frontmatter, começa diretamente com o corpo, incluindo as secções finais de Perguntas Frequentes e Referências Científicas, por esta ordem).
O PRIMEIRO parágrafo (sem cabeçalho) tem de responder de forma direta e objetiva à pergunta implícita no título, em 1-2 frases claras, antes de desenvolver — isto é importante para o artigo poder ser citado por assistentes de IA (ChatGPT, Gemini, Copilot) que extraem respostas diretas. Depois desse parágrafo de abertura, continua com mais 1-2 parágrafos de contexto, e só depois usa ## para as secções principais.`
}

// Nem todos os artigos comerciais têm literatura científica aplicável, e foi
// daí que veio o pior problema de credibilidade do site: o prompt exigia 3
// referências do banco a TODOS os artigos de Equipamento, incluindo os de
// relógios, sensores e acessórios. Sem estudos sobre eletrónica no banco, o
// modelo agarrava no que havia — Hoogkamer (sapatilhas de competição), Nigg
// (biomecânica de calçado) — e colava-o a afirmações sobre GPS e sensores de
// pulsação. Agora só se exigem referências científicas quando o tema é mesmo
// coberto por literatura (calçado, palmilhas, compressão, nutrição,
// hidratação); nos restantes, o artigo termina numa secção de Fontes que
// aponta para as páginas oficiais dos fabricantes, que é a fonte honesta para
// especificações de produto.
const TEMAS_COM_LITERATURA = /sapatilh|calcado|calçado|palmilha|drop|amortec|placa|carbono|meias|compress|nutric|nutrição|gel|gél|hidrat|bebida|barrita|creatina|cafein|cafeín|proteina|proteína/i

function precisaReferenciasCientificas(topic) {
  return TEMAS_COM_LITERATURA.test(`${topic.slug} ${topic.title}`)
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
7. ${precisaReferenciasCientificas(topic)
    ? 'OBRIGATÓRIO — termina SEMPRE com uma secção "## Referências" citando PELO MENOS 3 das referências da lista abaixo, e SÓ onde forem mesmo aplicáveis ao que a frase afirma. Copia a referência EXATAMENTE como está fornecida, não alteres nem inventes autores, títulos, revistas ou DOIs. NUNCA acrescentes uma referência que não esteja nesta lista.'
    : 'OBRIGATÓRIO — este tema (eletrónica, acessórios) NÃO tem literatura científica aplicável, por isso NÃO cites estudos nenhuns: seria desonesto colar ciência do desporto a especificações de produto. Em vez disso, termina com uma secção "## Fontes" com 2-4 linhas a dizer ao leitor onde confirmar a informação — páginas oficiais dos fabricantes dos produtos mencionados e a ficha do revendedor — e a lembrar que preços e especificações mudam a cada geração.'}
8. OBRIGATÓRIO — logo antes da secção de Referências, inclui uma secção "## Perguntas Frequentes" com EXATAMENTE 3 pares pergunta/resposta, no formato exato abaixo (cada resposta com 1-3 frases diretas e objetivas, sem introduções tipo "Boa pergunta"):

## Perguntas Frequentes

**Pergunta 1 completa, terminada em ponto de interrogação?**
Resposta direta e objetiva, 1-3 frases.

**Pergunta 2 completa, terminada em ponto de interrogação?**
Resposta direta e objetiva, 1-3 frases.

**Pergunta 3 completa, terminada em ponto de interrogação?**
Resposta direta e objetiva, 1-3 frases.

${precisaReferenciasCientificas(topic) ? `REFERÊNCIAS DISPONÍVEIS (escolhe no mínimo 3, só onde forem aplicáveis):
${refsList}` : 'NÃO uses referências científicas neste artigo — ver regra 7.'}

${REGRAS_ANTI_INVENCAO}

Começa a resposta com UMA linha exatamente neste formato, antes de qualquer outra coisa:
META: <descrição para o Google, 120 a 158 caracteres, frase completa e apelativa que diga o que o leitor ganha ao ler — NÃO é o primeiro parágrafo copiado, NÃO acaba em reticências>

Depois dessa linha, responde com o conteúdo markdown do artigo (sem frontmatter, começa diretamente com o corpo, incluindo as secções finais de Perguntas Frequentes e Referências, por esta ordem).
O parágrafo de introdução (sem cabeçalho) tem de responder de forma direta ao que o leitor procura no título em 1-2 frases claras antes de desenvolver — importante para o artigo poder ser citado por assistentes de IA.`
}

// A meta description do artigo. Antes disto devolvia os primeiros 200
// caracteres do 1.º parágrafo + '…' — resultado: 228 dos 326 artigos
// publicados tinham a descrição cortada a meio de uma frase, o Google
// truncava-a outra vez, e isso alimentava o problema de CTR já identificado
// na auditoria de 2026-08-26. Agora usa-se a linha META: que o modelo é
// obrigado a escrever; só se ela faltar é que se recorre ao texto, e mesmo
// aí corta-se sempre no fim de uma frase, nunca a meio de uma palavra.
function extractExcerpt(content) {
  const meta = content.match(/^\s*META:\s*(.+)$/m)
  if (meta) {
    const limpa = meta[1].trim().replace(/^["']|["']$/g, '')
    if (limpa.length >= 80 && limpa.length <= 180) return limpa.replace(/"/g, '\\"')
  }
  return fraseCompletaAte(stripMetaLine(content), 158).replace(/"/g, '\\"')
}

// Remove a linha META: do conteúdo, para não aparecer no corpo do artigo.
function stripMetaLine(content) {
  return content.replace(/^\s*META:.*$/m, '').trimStart()
}

// Devolve texto até ao limite, sempre terminado numa frase completa.
function fraseCompletaAte(content, limite) {
  const lines = content.split('\n')
  for (const line of lines) {
    const clean = line.replace(/[#*_`>👉]/g, '').trim()
    if (clean.length > 80) {
      if (clean.length <= limite) return clean
      const corte = clean.slice(0, limite)
      const fim = Math.max(corte.lastIndexOf('. '), corte.lastIndexOf('! '), corte.lastIndexOf('? '))
      if (fim > 60) return corte.slice(0, fim + 1).trim()
      const espaco = corte.lastIndexOf(' ')
      return (espaco > 60 ? corte.slice(0, espaco) : corte).trim() + '.'
    }
  }
  return ''
}

function estimateReadTime(content) {
  const words = content.split(/\s+/).length
  return Math.max(4, Math.round(words / 200))
}

// Extrai os pares pergunta/resposta da secção "## Perguntas Frequentes" que o
// prompt agora exige em todos os artigos (ver buildTechnicalPrompt /
// buildCommercialPrompt) — pedido do Pedro para melhorar o canal "AI
// Assistant" no GA4: assistentes de IA (ChatGPT, Gemini, Copilot) tendem a
// citar conteúdo com respostas diretas em formato pergunta/resposta, e isto
// também alimenta o schema FAQPage (JSON-LD) na página do artigo — ver
// app/blog/[slug]/page.tsx. Devolve [] se o modelo não seguiu o formato
// pedido (não bloqueia a publicação — degrada graciosamente).
function extractFaqs(content) {
  const match = content.match(/##\s*Perguntas Frequentes\s*\n([\s\S]*?)(?=\n##\s|$)/i)
  if (!match) return { faqs: [], contentWithoutFaqs: content }

  const block = match[1]
  const pairRe = /\*\*(.+?)\?\*\*\s*\n+([^\n]+(?:\n(?!\*\*)[^\n]+)*)/g
  const faqs = []
  let m
  while ((m = pairRe.exec(block)) !== null) {
    const q = m[1].trim().replace(/\s+/g, ' ') + '?'
    const a = m[2].trim().replace(/\s+/g, ' ')
    if (q.length > 5 && a.length > 5) faqs.push({ q, a })
  }

  // Remove a secção do corpo — as FAQs são renderizadas à parte na página
  // (secção dedicada + schema), não faz sentido duplicá-las no texto corrido.
  const contentWithoutFaqs = content.replace(match[0], '').trim()

  return { faqs: faqs.slice(0, 3), contentWithoutFaqs }
}

function yamlFaqs(faqs) {
  if (!faqs.length) return ''
  const esc = (s) => s.replace(/"/g, '\\"')
  const lines = faqs.map(
    (f) => `  - q: "${esc(f.q)}"\n    a: "${esc(f.a)}"`
  )
  return `faqs:\n${lines.join('\n')}\n`
}

// Porta de qualidade — criada em 2026-09-21. Até aqui o script publicava o
// que a Groq devolvesse desde que citasse N referências do banco: foi assim
// que entrou no site um artigo COMPLETAMENTE VAZIO
// (melhores-carregadores-portateis-relogio-gps, 18/09, zero palavras de
// corpo), 24 artigos sem secção de referências e dezenas com brasileirismos.
// Com três artigos por dia, cada defeito que passa fica no site para sempre,
// e a política de "scaled content abuse" do Google mira exatamente páginas
// publicadas em massa sem supervisão editorial. Um artigo reprovado aqui NÃO
// é publicado: o gerador salta para o tópico seguinte da fila, por isso a
// regra dos 3 artigos por dia continua a ser cumprida com outro tema.
// ATENÇÃO à fronteira de palavra: o \b do JavaScript só conhece [A-Za-z0-9_],
// por isso /\bvocê\b/ NUNCA encontra "você" (o "ê" final não é word char e
// não cria fronteira com o espaço seguinte). Foi exatamente esse o erro na
// primeira versão desta lista — os 26 artigos com "você" passavam incólumes.
// Daí as fronteiras explícitas abaixo, que incluem o intervalo dos acentuados.
const NB = '[^\\wÀ-ÖØ-öø-ÿ]'
const br = (corpo) => new RegExp(`(?<=^|${NB})(?:${corpo})(?=${NB}|$)`, 'i')
const BRASILEIRISMOS = [
  br('vocês?'), br('treinamento'), br('panturrilhas?'), br('esteiras?'),
  br('esportiv[oa]s?'), br('esportes?'), br('celular'), br('acadêmic[oa]s?'),
  br('econômic[oa]s?'), br('eletrônic[oa]s?'), br('fenômenos?'),
  br('goniômetros?'), br('tênis'), br('umidade'), br('bunda'),
  br('(?:está|estás|estão|estava|estavam)\\s+[a-zà-ÿ]+ndo'),
]

// Corretor automático de brasileirismos — 2026-09-22.
//
// A primeira versão da porta de qualidade (2026-09-21) REPROVAVA o artigo
// inteiro se encontrasse um único brasileirismo. Resultado no dia seguinte:
// a run das 03:07 publicou 1 artigo em vez de 3, e a rede de segurança da
// Vercel disparou uma segunda run que reprovou 4 tópicos seguidos (13
// anotações = 4 tópicos × 3 avisos), bateu no MAX_SKIPPED, terminou com
// zero artigos e fez o job falhar. Rejeitar um texto de 900 palavras por
// causa de um "você" é desproporcionado quando a substituição é trivial e
// determinística — as mesmas substituições limparam 479 ocorrências em 152
// artigos publicados sem um único falso positivo.
//
// Agora o texto é corrigido ANTES de ser validado, e a validação só barra o
// que não se corrige sozinho (artigo vazio/curto, sem referências, sem FAQ).
const CORRECOES_PT = [
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])treinamentos(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'treinos'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])treinamento(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'treino'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])panturrilhas(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'barrigas das pernas'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])panturrilha(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'barriga da perna'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])esteiras(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'passadeiras'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])esteira(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'passadeira'],
  [/goniômetr/gi, 'goniómetr'],
  [/econômic/gi, 'económic'],
  [/eletrônic/gi, 'eletrónic'],
  [/acadêmic/gi, 'académic'],
  [/fenômen/gi, 'fenómen'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])tênis(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'ténis'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])esportiv([oa]s?)(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'desportiv$1'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])esporte(s?)(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'desporto$1'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])celular(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'telemóvel'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])umidade(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'humidade'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])projetad([oa]s?)(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'concebid$1'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])vazamento(s?)(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, 'fuga$1'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])(o|do|de|um|no|ao|seu|este|esse|melhor|maior)\s+controle(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi, '$1 controlo'],
  // "você" e companhia — a ordem importa: primeiro as formas com verbo,
  // senão sobra um "tu" com verbo na 3.ª pessoa ("tu pode"), que é pior do
  // que o brasileirismo original.
  [/[Ss]e você é(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'Se és'],
  [/[Ss]e você tem(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'Se tens'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])Você pode(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'Podes'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])você pode(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'podes'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])você deve(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'deves'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])você tem(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'tens'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])você quer(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'queres'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])você está(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'estás'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])você vai(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'vais'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])você precisa(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'precisas'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])você precisará(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'vais precisar'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])você terá(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'terás'],
  [/que você possa(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'que possas'],
  [/que você se concentre(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'que te concentres'],
  [/que você veja(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'que vejas'],
  [/para você(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'para ti'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])a você(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'a ti'],
  [/(?<=^|[^\wÀ-ÖØ-öø-ÿ])de você(?=[^\wÀ-ÖØ-öø-ÿ]|$)/g, 'de ti'],
]

// "está correndo" -> "está a correr" (o gerúndio é a marca mais persistente)
function corrigirGerundio(texto) {
  return texto.replace(
    /(?<=^|[^\wÀ-ÖØ-öø-ÿ])(está|estás|estão|estava|estavam|estou|estamos|esteja|estejas|estejam)\s+([a-zà-ÿ]+ndo)(?=[^\wÀ-ÖØ-öø-ÿ]|$)/gi,
    (todo, aux, ger) => {
      const inf = ger.endsWith('ando') ? ger.slice(0, -4) + 'ar'
        : ger.endsWith('endo') ? ger.slice(0, -4) + 'er'
        : ger.endsWith('indo') ? ger.slice(0, -4) + 'ir'
        : null
      return inf ? `${aux} a ${inf}` : todo
    }
  )
}

// Rede final para os "você" que escapam às formas listadas acima (ex:
// "Para você ter resultados"). Em português o sujeito é opcional, por isso
// deixar cair o pronome é sempre gramatical e elimina o brasileirismo sem
// arriscar concordâncias erradas — ao contrário de trocar "você" por "tu",
// que obrigaria a reconjugar o verbo ("tu pode" seria pior do que o
// original).
function largarPronome(texto) {
  return texto
    // Início de frase: "Você precisa de X" -> "Precisa de X" (com a
    // maiúscula a passar para o verbo, senão a frase fica a começar em
    // minúscula).
    .replace(/(^|[.!?:]\s+|\n)Vocês?\s+([a-zà-ÿ])/g, (m, antes, letra) => antes + letra.toUpperCase())
    // Restantes casos, a meio da frase
    .replace(/(?<=^|[^\wÀ-ÖØ-öø-ÿ])vocês?\s+/gi, '')
}

function corrigirBrasileirismos(texto) {
  let out = texto
  for (const [re, sub] of CORRECOES_PT) out = out.replace(re, sub)
  out = corrigirGerundio(out)
  return largarPronome(out)
}

function validarArtigo(content, topic) {
  const problemas = []
  const corpo = stripMetaLine(content)
  const palavras = corpo.split(/\s+/).filter(Boolean).length

  if (palavras < 500) problemas.push(`corpo com só ${palavras} palavras (mínimo 500)`)
  if (!/##\s*(Referências|Fontes)/i.test(corpo)) problemas.push('sem secção de Referências nem de Fontes')
  if (!/##\s*Perguntas Frequentes/i.test(corpo)) problemas.push('sem secção de Perguntas Frequentes')

  const excerpt = extractExcerpt(content)
  if (!excerpt || excerpt.length < 80) problemas.push('sem meta description utilizável')
  if (/…\s*"?$/.test(excerpt)) problemas.push('meta description cortada em reticências')

  const brs = BRASILEIRISMOS.filter(re => re.test(corpo)).map(re => String(re))
  if (brs.length) problemas.push(`brasileirismos detetados (${brs.length}): ${brs.slice(0, 3).join(', ')}`)

  return problemas
}

function buildMdx(topic, content, date) {
  const { faqs, contentWithoutFaqs } = extractFaqs(stripMetaLine(content))
  return `---
title: "${topic.title.replace(/"/g, '\\"')}"
date: '${date}'
category: "${topic.category}"
excerpt: "${extractExcerpt(content)}"
readTime: ${estimateReadTime(content)}
${yamlFaqs(faqs)}---

${contentWithoutFaqs.trim()}
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

  const { technical: todayTechnical, commercial: todayCommercial } = countTodayByType(today)
  const alreadyToday = todayTechnical + todayCommercial
  const NEEDED_PER_DAY = TECHNICAL_PER_RUN + COMMERCIAL_PER_RUN
  // Faltam para hoje, por tipo — NUNCA os valores fixos de novo, para que um
  // segundo disparo no mesmo dia (rede de segurança da Vercel, retry manual,
  // etc.) só complete o que falta em vez de duplicar o que já foi publicado.
  const neededTechnical = Math.max(0, TECHNICAL_PER_RUN - todayTechnical)
  const neededCommercial = Math.max(0, COMMERCIAL_PER_RUN - todayCommercial)
  console.log(`📰 Artigos já publicados hoje: ${alreadyToday}/${NEEDED_PER_DAY} (técnicos: ${todayTechnical}/${TECHNICAL_PER_RUN}, comerciais: ${todayCommercial}/${COMMERCIAL_PER_RUN})`)
  if (neededTechnical === 0 && neededCommercial === 0) {
    console.log('✅ Hoje já tem os artigos todos publicados — a sair sem gerar mais (evita duplicar entre disparos).')
    process.exit(0)
  }

  // Round-robin por categoria (técnicos) e ordem aleatória (comerciais) —
  // evita que dias seguidos publiquem sempre a mesma categoria só porque o
  // array ALL_TOPICS está agrupado por assunto. Ver interleaveByCategory.
  const remainingTechnical = interleaveByCategory(ALL_TOPICS.filter(t => !existingSlugs.has(deaccent(t.slug))))
  const remainingCommercial = shuffle(COMMERCIAL_TOPICS.filter(t => !existingSlugs.has(deaccent(t.slug))))

  console.log(`📋 Tópicos técnicos disponíveis: ${remainingTechnical.length}`)
  console.log(`🛒 Tópicos comerciais disponíveis: ${remainingCommercial.length}`)

  // Aviso antecipado e bem visível (aparece destacado no resumo da run do
  // GitHub Actions, não só enterrado no log em bruto) quando um banco de
  // tópicos está a ficar curto — reintroduzido em 2026-08-15 depois de o
  // banco comercial ter esgotado silenciosamente outra vez (ver memória
  // "Reserva de Tópicos Comerciais Baixa"). Isto tem de disparar em TODOS os
  // dias em que o pool estiver baixo, não só nos dias em que essa categoria
  // é necessária, para dar semanas de antecedência antes do esgotamento.
  const LOW_POOL_THRESHOLD = 20
  if (remainingTechnical.length <= LOW_POOL_THRESHOLD) {
    console.log(`::warning::Banco de tópicos TÉCNICOS com apenas ${remainingTechnical.length} tópicos por publicar — adiciona mais a ALL_TOPICS em scripts/generate-articles.mjs.`)
  }
  if (remainingCommercial.length <= LOW_POOL_THRESHOLD) {
    console.log(`::warning::Banco de tópicos COMERCIAIS com apenas ${remainingCommercial.length} tópicos por publicar — adiciona mais a COMMERCIAL_TOPICS em scripts/generate-articles.mjs.`)
  }

  if (remainingTechnical.length === 0 && remainingCommercial.length === 0) {
    console.log('⚠️  Todos os tópicos já foram publicados. Adiciona mais aos arrays.')
    process.exit(0)
  }

  // Pausa generosa entre chamadas à Groq — a conta gratuita tem um limite de
  // tokens/minuto (TPM) baixo, e os prompts com banco de referências usam
  // bastante margem desse limite numa só chamada. Esperar aqui em vez de só
  // confiar no retry reduz a probabilidade de sequer bater no rate limit.
  const PAUSE_BETWEEN_CALLS_MS = 25000

  // Tentativas por tópico até o artigo cumprir o mínimo de referências do
  // banco, e quantos tópicos seguidos podem ser saltados antes de desistir.
  const MAX_REF_ATTEMPTS = 2
  const MAX_SKIPPED = 8

  let lastIndex = counter.lastIndex
  let lastSlug = counter.lastSlug
  const publishedTitles = []
  let isFirstCall = true

  // Gera um artigo de uma "fila" de candidatos, avançando para o próximo
  // candidato se um tópico falhar mesmo depois do retry em callGroq — isto
  // garante que continuamos a tentar chegar aos 3 artigos do dia em vez de
  // abortar a publicação inteira por causa de UM tópico problemático.
  // Disjuntor: se a Groq estiver sistemicamente incapaz de responder (ex:
  // model_not_found por um ID de modelo descontinuado, chave inválida, outage
  // da API) cada tópico falhava e o loop continuava a tentar TODOS os
  // restantes — com 25s de pausa entre chamadas, isso significa percorrer a
  // fila inteira (60+ tópicos) e queimar quase 1h antes de desistir. Isso
  // aconteceu em 2026-08-18 (llama-3.1-8b-instant foi descontinuado pela
  // Groq) e bloqueou também o disparo manual de recuperação, porque o
  // workflow usa um lock de concorrência que só liberta quando esta run
  // termina. Agora: se FAILURE_CIRCUIT_BREAKER falhas seguidas acontecerem
  // (sem nenhum sucesso a interromper a sequência), a fila desiste de
  // imediato em vez de continuar a tentar tópico a tópico.
  const FAILURE_CIRCUIT_BREAKER = 3

  async function generateFromQueue(queue, kind, countNeeded) {
    let generated = 0
    let queueIndex = 0
    let consecutiveFailures = 0
    let skipped = 0

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
        // O tipo de prompt segue sempre a categoria REAL do tópico (não o
        // "kind" da fila) — importante para a fila de compensação abaixo,
        // que mistura tópicos técnicos e comerciais numa só fila.
        const prompt = topic.category === 'Equipamento'
          ? buildCommercialPrompt(topic, relatedSlugs)
          : buildTechnicalPrompt(topic)

        const refsBank = topic.category === 'Equipamento'
          ? COMMERCIAL_REFERENCE_BANK
          : (REFERENCE_BANK[topic.category] || REFERENCE_BANK['Treino'])
        const minRefs = topic.category === 'Equipamento'
          ? (precisaReferenciasCientificas(topic) ? 3 : 0)
          : 4

        let content = null
        let ultimosProblemas = []
        for (let tentativa = 1; tentativa <= MAX_REF_ATTEMPTS; tentativa++) {
          // Corrigir primeiro, validar depois: o que é corrigível não deve
          // custar um artigo inteiro (ver comentário em corrigirBrasileirismos).
          const candidato = corrigirBrasileirismos(
            await callGroq(tentativa === 1 ? prompt : prompt + REFORCO_REFERENCIAS)
          )
          const citadas = countBankReferences(candidato, refsBank)
          // Porta de qualidade: referências do banco E as restantes regras
          // (dimensão, secções, meta description, português de Portugal).
          ultimosProblemas = validarArtigo(candidato, topic)
          if (citadas >= minRefs && ultimosProblemas.length === 0) {
            content = candidato
            break
          }
          if (ultimosProblemas.length) {
            console.log(`  ⚠️  Tentativa ${tentativa}/${MAX_REF_ATTEMPTS} reprovada na qualidade: ${ultimosProblemas.join('; ')}`)
          }
          if (citadas < minRefs) console.log(`  ⚠️  Tentativa ${tentativa}/${MAX_REF_ATTEMPTS}: só ${citadas} de ${minRefs} referências do banco citadas.`)
          if (tentativa < MAX_REF_ATTEMPTS) {
            console.log(`  ⏸  A aguardar ${PAUSE_BETWEEN_CALLS_MS / 1000}s antes de repetir...`)
            await new Promise(r => setTimeout(r, PAUSE_BETWEEN_CALLS_MS))
          }
        }

        if (!content) {
          skipped++
          console.log(`::warning::Tópico "${topic.title}" NÃO publicado após ${MAX_REF_ATTEMPTS} tentativas${ultimosProblemas.length ? ` — problemas de qualidade: ${ultimosProblemas.join('; ')}` : ': não citou o mínimo de ' + minRefs + ' referências do banco'}. Se um tópico falhar sempre, é sinal de que não tem literatura correspondente no REFERENCE_BANK — acrescenta referências dessa categoria ou remove o tópico.`)
          if (skipped >= MAX_SKIPPED) {
            console.log(`::warning::${skipped} tópicos seguidos saltados por falta de referências — a parar esta fila.`)
            break
          }
          continue
        }
        skipped = 0

        const { faqs: faqsGeradas } = extractFaqs(content)
        if (faqsGeradas.length < 3) {
          console.log(`::warning::"${topic.title}" publicado com apenas ${faqsGeradas.length} FAQ (o prompt pede 3) — schema FAQPage fica incompleto.`)
        }

        const mdx = buildMdx(topic, content, today)
        // Slug do FICHEIRO sempre ASCII, mesmo que topic.slug em ALL_TOPICS/
        // COMMERCIAL_TOPICS tenha acentos por engano — garante que a URL
        // do artigo nunca fica presa atrás do redirect do middleware.
        const fileSlug = deaccent(topic.slug)
        const filePath = path.join(ARTICLES_DIR, `${fileSlug}.md`)

        fs.writeFileSync(filePath, mdx, 'utf8')
        console.log(`✅ Guardado: ${filePath}`)

        lastIndex++
        lastSlug = fileSlug
        publishedTitles.push(topic.title)
        existingSlugs.add(fileSlug) // evita reutilizar como "relacionado" duplicado
        generated++
        consecutiveFailures = 0
      } catch (err) {
        console.error(`❌ Erro ao gerar ${topic.slug} (a saltar para o próximo tópico):`, err.message)
        consecutiveFailures++
        if (consecutiveFailures >= FAILURE_CIRCUIT_BREAKER) {
          console.error(`::error::${consecutiveFailures} falhas seguidas na Groq — a desistir desta fila em vez de percorrer os restantes ${queue.length - queueIndex} tópicos. Verifica a GROQ_API_KEY e se o modelo configurado ainda existe (https://console.groq.com/docs/models).`)
          break
        }
      }
    }

    return generated
  }

  const technicalDone = await generateFromQueue(remainingTechnical, 'technical', neededTechnical)
  const commercialDone = await generateFromQueue(remainingCommercial, 'commercial', neededCommercial)
  let totalDone = technicalDone + commercialDone
  const totalNeeded = neededTechnical + neededCommercial

  // FALLBACK ENTRE BANCOS — reintroduzido em 2026-08-15 (tinha sido perdido
  // numa reescrita manual do script a 2026-08-14). Se um dos dois bancos não
  // tiver tópicos suficientes para a SUA quota (ex: comercial esgotado), o
  // outro banco compensa a diferença, para que o alvo real seja sempre
  // "3 artigos/dia no total" e nunca fique preso em 2/3 só porque UM banco
  // esgotou. Usa o que sobrar de qualquer um dos dois bancos, ignorando a
  // separação técnico/comercial nesta fase de compensação.
  if (totalDone < totalNeeded) {
    const shortfall = totalNeeded - totalDone
    const compensationPool = shuffle([
      ...ALL_TOPICS.filter(t => !existingSlugs.has(deaccent(t.slug))),
      ...COMMERCIAL_TOPICS.filter(t => !existingSlugs.has(deaccent(t.slug))),
    ])
    if (compensationPool.length > 0) {
      console.log(`\n🔁 Faltam ${shortfall} artigo(s) para o total do dia — a compensar com o outro banco de tópicos (${compensationPool.length} candidatos disponíveis).`)
      const compensated = await generateFromQueue(compensationPool, 'compensação', shortfall)
      totalDone += compensated
    }
  }

  saveCounter(lastIndex, today, lastSlug)

  if (totalDone < totalNeeded) {
    console.log(`\n⚠️  Só foi possível gerar ${totalDone} de ${totalNeeded} artigos em falta hoje (falhas repetidas na Groq). Publicados nesta execução: ${publishedTitles.join(', ') || '(nenhum)'}`)
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
