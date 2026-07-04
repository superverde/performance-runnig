/**
 * Calendário de provas de corrida e trail em Portugal.
 * ------------------------------------------------------------------
 * Lista curada manualmente (tal como lib/products.ts) — não existe uma
 * API fiável para calendários de provas em Portugal, por isso os dados
 * são pesquisados e confirmados um a um a partir de fontes reais
 * (sites organizadores, federações, notícias) em vez de gerados.
 *
 * COMO ATUALIZAR:
 *   1. Adicionar uma nova entrada ao array PROVAS abaixo (ou corrigir
 *      uma data/distância existente assim que sair informação oficial).
 *   2. Não é preciso remover provas passadas — a página /calendario
 *      filtra automaticamente por data atual.
 *   3. Nunca inventar datas ou distâncias — se não houver confirmação,
 *      deixar de fora até confirmar.
 *
 * Dados verificados via pesquisa em 2026-07-04. Datas podem sofrer
 * pequenos ajustes por parte da organização — o link oficial (quando
 * disponível) é sempre a fonte de verdade final.
 */

export type TipoProva = 'Estrada' | 'Trail' | 'Ultra Trail'

export interface Prova {
  /** Nome oficial (ou mais reconhecido) da prova */
  nome: string
  /** Data de início, formato ISO yyyy-mm-dd */
  dataInicio: string
  /** Data de fim, apenas para eventos multi-dia (ex: ultra trails) */
  dataFim?: string
  /** Localização (concelho/cidade) */
  local: string
  /** Distrito ou região, para filtros */
  regiao: string
  tipo: TipoProva
  /** Distâncias/provas disponíveis no evento, ex: ["42km", "21km", "10km"] */
  distancias: string[]
  /** Eventos-bandeira que merecem destaque visual */
  destaque?: boolean
  /** Link oficial, quando confirmado — nunca inventar */
  link?: string
  desc: string
}

export const PROVAS: Prova[] = [
  // ── Estrada ──
  {
    nome: 'Meia Maratona de Cascais',
    dataInicio: '2026-02-08',
    local: 'Cascais',
    regiao: 'Lisboa',
    tipo: 'Estrada',
    distancias: ['21km', '10km', '5km'],
    desc: 'Percurso costeiro entre Cascais e Guincho, uma das meias maratonas mais rápidas e populares do calendário nacional. Prova de crianças no sábado, provas principais no domingo.',
  },
  {
    nome: 'Hyundai Meia Maratona de Lisboa',
    dataInicio: '2026-03-08',
    local: 'Lisboa',
    regiao: 'Lisboa',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Meia maratona pelo centro histórico de Lisboa, organizada pelo mesmo grupo da Maratona de Lisboa.',
  },
  {
    nome: 'Lisbon Eco Marathon',
    dataInicio: '2026-04-12',
    local: 'Lisboa',
    regiao: 'Lisboa',
    tipo: 'Estrada',
    distancias: ['42km', '21km', '12km', 'Caminhada'],
    desc: 'Maratona com pegada reduzida e opções de meia distância e caminhada, pensada para toda a família.',
  },
  {
    nome: 'Meia Maratona de Vila Real',
    dataInicio: '2026-04-12',
    local: 'Vila Real',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Prova de referência na região de Trás-os-Montes, com percurso exigente pela cidade de Vila Real.',
  },
  {
    nome: 'BMCar Meia Maratona do Cávado',
    dataInicio: '2026-04-12',
    local: 'Barcelos',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Percurso ao longo do rio Cávado, uma das provas mais consolidadas do distrito de Braga.',
  },
  {
    nome: 'Maratona Filhos da Freita',
    dataInicio: '2026-04-18',
    local: 'Arouca',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['42km'],
    desc: 'Maratona de estrada na região de Arouca, com paisagem serrana como pano de fundo.',
  },
  {
    nome: 'Meia Maratona de Ponte de Sor',
    dataInicio: '2026-04-30',
    local: 'Ponte de Sor',
    regiao: 'Alentejo',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Prova de referência no Alentejo, percurso plano e rápido.',
  },
  {
    nome: 'Meia Maratona do Concelho de Santiago',
    dataInicio: '2026-05-03',
    local: 'Santiago do Cacém',
    regiao: 'Alentejo',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Prova que percorre o concelho de Santiago do Cacém, no distrito de Setúbal.',
  },
  {
    nome: 'Meia Maratona das Cantarinhas',
    dataInicio: '2026-05-10',
    local: 'Bragança',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Prova tradicional de Bragança, uma das mais antigas do interior norte.',
  },
  {
    nome: 'Meia Maratona de Cortegaça',
    dataInicio: '2026-05-10',
    local: 'Cortegaça, Ovar',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Prova costeira na região de Ovar, com bom ambiente de comunidade local.',
  },
  {
    nome: 'Meia Maratona de Almada',
    dataInicio: '2026-05-10',
    local: 'Almada',
    regiao: 'Lisboa',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Percurso com vista para o Tejo e Lisboa, na margem sul.',
  },
  {
    nome: 'Meia Maratona do Douro Vinhateiro',
    dataInicio: '2026-05-24',
    local: 'Peso da Régua',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Uma das provas mais cénicas do país, a correr entre vinhas do Douro classificado como Património da Humanidade.',
    destaque: true,
  },
  {
    nome: 'Meia Maratona Atlântico Ocidental',
    dataInicio: '2026-06-06',
    local: 'Ilha das Flores, Açores',
    regiao: 'Açores',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'A meia maratona mais a Ocidente da Europa, na ilha das Flores.',
  },
  {
    nome: 'Meia Maratona Douro Run',
    dataInicio: '2026-06-07',
    local: 'Gondomar',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Prova ribeirinha ao longo do Douro, na área metropolitana do Porto.',
  },
  {
    nome: 'Meia Maratona do Porto',
    dataInicio: '2026-09-13',
    local: 'Porto',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Uma das meias maratonas mais concorridas do Norte, em preparação direta para a Maratona do Porto de novembro.',
  },
  {
    nome: 'Meia Maratona de S. João das Lampas',
    dataInicio: '2026-09-13',
    local: 'Sintra',
    regiao: 'Lisboa',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Prova na região de Sintra, com percurso ondulado característico da zona.',
  },
  {
    nome: 'Meia Maratona do Concelho de Castro Marim',
    dataInicio: '2026-09-13',
    local: 'Castro Marim',
    regiao: 'Algarve',
    tipo: 'Estrada',
    distancias: ['21km'],
    desc: 'Prova algarvia junto à fronteira com Espanha, na Reserva Natural do Sapal.',
  },
  {
    nome: 'EstrelAçor Trail Ultra Endurance',
    dataInicio: '2026-10-02',
    local: 'Serra da Estrela',
    regiao: 'Centro',
    tipo: 'Ultra Trail',
    distancias: ['Ultra Endurance'],
    desc: 'Prova de ultra resistência na Serra da Estrela, para atletas experientes em provas de longa duração.',
  },
  {
    nome: 'EDP Maratona de Lisboa',
    dataInicio: '2026-10-10',
    local: 'Carcavelos → Lisboa',
    regiao: 'Lisboa',
    tipo: 'Estrada',
    distancias: ['42.195km'],
    destaque: true,
    desc: 'A maratona mais prestigiada de Portugal, com estatuto World Athletics Elite Label. Percurso de Carcavelos até à Praça do Comércio, junto ao Tejo. Partida às 8h00.',
  },
  {
    nome: 'Confluência Trail',
    dataInicio: '2026-11-21',
    dataFim: '2026-11-22',
    local: 'Norte de Portugal',
    regiao: 'Norte',
    tipo: 'Trail',
    distancias: ['Várias distâncias'],
    desc: 'Evento de trail em dois dias, com percursos de diferentes níveis de exigência.',
  },
  {
    nome: 'ALUT — Algarviana Ultra Trail',
    dataInicio: '2026-11-26',
    dataFim: '2026-11-29',
    local: 'Algarve',
    regiao: 'Algarve',
    tipo: 'Ultra Trail',
    distancias: ['Ultra multi-etapas'],
    desc: 'Ultra trail de vários dias ao longo da Via Algarviana, uma das travessias mais longas do país.',
    destaque: true,
  },
  {
    nome: 'Maratona do Porto',
    dataInicio: '2026-11-08',
    local: 'Porto',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['42km', '10km', '6km (mini-maratona)'],
    destaque: true,
    desc: 'Maratona com partida junto ao SEALIFE Porto e chegada no Queimódromo/Parque da Cidade. Partida às 8h00, com opções de 10km e mini-maratona de 6km para toda a família.',
  },
  {
    nome: 'São Silvestre de Lisboa',
    dataInicio: '2026-12-27',
    local: 'Lisboa',
    regiao: 'Lisboa',
    tipo: 'Estrada',
    distancias: ['10km'],
    desc: 'Tradicional corrida de fim de ano em Lisboa. Data exata sujeita a confirmação oficial mais próxima da data — consultar organização.',
  },
  {
    nome: 'São Silvestre do Porto',
    dataInicio: '2026-12-28',
    local: 'Porto',
    regiao: 'Norte',
    tipo: 'Estrada',
    distancias: ['10km'],
    desc: '31ª edição da tradicional corrida de passagem de ano no Porto. Início às 18h00.',
  },
  {
    nome: 'São Silvestre da Amadora',
    dataInicio: '2026-12-31',
    local: 'Amadora',
    regiao: 'Lisboa',
    tipo: 'Estrada',
    distancias: ['10km'],
    desc: 'Uma das poucas São Silvestres que mantém a data tradicional de 31 de dezembro. Início às 18h00.',
  },

  // ── Trail / Ultra Trail ──
  {
    nome: 'Circuito Nacional de Trail Ultra Endurance — 100K',
    dataInicio: '2026-03-27',
    local: 'A confirmar',
    regiao: 'Nacional',
    tipo: 'Ultra Trail',
    distancias: ['100km'],
    desc: 'Prova de ultra endurance de 100km integrada no circuito nacional.',
  },
  {
    nome: 'UTME — Ultra Trail',
    dataInicio: '2026-03-27',
    local: 'A confirmar',
    regiao: 'Nacional',
    tipo: 'Ultra Trail',
    distancias: ['120km'],
    desc: 'Uma das ultra trails mais longas do circuito nacional, 120km de exigência técnica.',
  },
  {
    nome: 'MIUT — Madeira Island Ultra Trail (Legend)',
    dataInicio: '2026-04-24',
    local: 'Ilha da Madeira',
    regiao: 'Madeira',
    tipo: 'Ultra Trail',
    distancias: ['110km'],
    destaque: true,
    desc: 'Uma das ultra trails mais icónicas da Europa, atravessando a Madeira de ponta a ponta com um perfil de desnível brutal.',
  },
  {
    nome: 'Estrela Grande Trail',
    dataInicio: '2026-05-08',
    dataFim: '2026-05-10',
    local: 'Manteigas, Serra da Estrela',
    regiao: 'Centro',
    tipo: 'Ultra Trail',
    distancias: ['105km (ultra)', '50km', '35km', '15km', '6km (subida)'],
    destaque: true,
    desc: 'Evento de trail de vários dias na Serra da Estrela, com opções desde a subida curta de 6km até ao ultra de 105km.',
  },
  {
    nome: 'TPG — Trail',
    dataInicio: '2026-05-02',
    local: 'A confirmar',
    regiao: 'Nacional',
    tipo: 'Ultra Trail',
    distancias: ['115km'],
    desc: 'Ultra trail de 115km integrada no calendário nacional de trail de longa distância.',
  },
  {
    nome: 'MCT — Circuito Nacional de Trail Ultra',
    dataInicio: '2026-06-05',
    local: 'A confirmar',
    regiao: 'Nacional',
    tipo: 'Ultra Trail',
    distancias: ['58km'],
    desc: 'Prova de ultra trail de 58km do circuito nacional.',
  },
  {
    nome: 'DMUT — Trail Ultra',
    dataInicio: '2026-06-07',
    local: 'A confirmar',
    regiao: 'Nacional',
    tipo: 'Ultra Trail',
    distancias: ['51km'],
    desc: 'Ultra trail de 51km do circuito nacional.',
  },
  {
    nome: 'CMT — Circuito Nacional de Trail',
    dataInicio: '2026-06-19',
    local: 'A confirmar',
    regiao: 'Nacional',
    tipo: 'Trail',
    distancias: ['35km'],
    desc: 'Prova de trail de 35km do circuito nacional.',
  },
  {
    nome: 'Trail Ultra Médio',
    dataInicio: '2026-06-19',
    local: 'A confirmar',
    regiao: 'Nacional',
    tipo: 'Ultra Trail',
    distancias: ['60km'],
    desc: 'Ultra trail de distância média (60km) do circuito nacional.',
  },
  {
    nome: 'Ultra Trail Vila de Mouros',
    dataInicio: '2026-06-21',
    local: 'Vila de Mouros',
    regiao: 'Norte',
    tipo: 'Ultra Trail',
    distancias: ['45km'],
    desc: 'Ultra trail com percurso técnico na região de Vila de Mouros.',
  },
  {
    nome: 'Trail Longo — Circuito Nacional',
    dataInicio: '2026-06-21',
    local: 'A confirmar',
    regiao: 'Nacional',
    tipo: 'Trail',
    distancias: ['42km'],
    desc: 'Trail de distância longa (42km) do circuito nacional.',
  },
  {
    nome: 'Trail e Ultra Trail Serra da Freita',
    dataInicio: '2026-06-27',
    dataFim: '2026-06-28',
    local: 'Arouca, Serra da Freita',
    regiao: 'Norte',
    tipo: 'Ultra Trail',
    distancias: ['Trail', 'Ultra Trail'],
    desc: 'Evento de dois dias na Serra da Freita, com opções de trail e ultra trail na região de Arouca (Geopark Arouca).',
  },
]

/** Devolve apenas as provas cuja data de início ainda não passou. */
export function provasFuturas(referencia: Date = new Date()): Prova[] {
  const hoje = new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate())
  return PROVAS
    .filter((p) => new Date(p.dataInicio) >= hoje)
    .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
}

/** Devolve todas as provas ordenadas cronologicamente (passadas e futuras). */
export function todasProvasOrdenadas(): Prova[] {
  return [...PROVAS].sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
}

export const REGIOES = [
  'Todas', 'Lisboa', 'Norte', 'Centro', 'Alentejo', 'Algarve', 'Açores', 'Madeira', 'Nacional',
] as const

export const TIPOS_PROVA = ['Todas', 'Estrada', 'Trail', 'Ultra Trail'] as const
