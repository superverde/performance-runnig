/**
 * Sondagens de uma pergunta, no fim de cada artigo.
 *
 * O objetivo NAO e engagement decorativo — com o trafego atual uma sondagem
 * junta poucos votos por dia. O objetivo e acumular, ao longo de meses, dados
 * originais sobre corredores de lingua portuguesa: quantos treinam sem plano,
 * quanto gastam em sapatilhas, quantas lesoes tiveram. Esses numeros sao
 * material que nenhum site de conteudo gerado consegue inventar, e sao o tipo
 * de conteudo que outros sites citam e linkam.
 *
 * Nao ha registo, nao ha dados pessoais, nao ha moderacao: so contadores.
 */

export interface Sondagem {
  id: string
  pergunta: string
  opcoes: string[]
}

/** Uma sondagem por categoria de artigo. */
export const SONDAGENS: Record<string, Sondagem> = {
  'Treino': {
    id: 'treino-frequencia',
    pergunta: 'Quantas vezes por semana treinas, em média?',
    opcoes: ['1 a 2', '3 a 4', '5 a 6', 'Todos os dias'],
  },
  'Fisiologia': {
    id: 'fisiologia-plano',
    pergunta: 'Segues um plano de treino estruturado?',
    opcoes: ['Sim, feito por um treinador', 'Sim, feito por mim', 'Sigo um plano genérico', 'Corro sem plano'],
  },
  'Nutrição': {
    id: 'nutricao-geis',
    pergunta: 'Levas géis ou alimento em treinos acima de 90 minutos?',
    opcoes: ['Sempre', 'Às vezes', 'Nunca', 'Nunca corri 90 min'],
  },
  'Biomecânica': {
    id: 'biomecanica-video',
    pergunta: 'Já viste a tua técnica de corrida em vídeo?',
    opcoes: ['Sim, com análise profissional', 'Sim, gravei-me a mim próprio', 'Nunca', 'Nem sabia que ajudava'],
  },
  'Recuperação': {
    id: 'recuperacao-sono',
    pergunta: 'Quantas horas dormes, em média, por noite?',
    opcoes: ['Menos de 6', '6 a 7', '7 a 8', 'Mais de 8'],
  },
  'Psicologia': {
    id: 'psicologia-desistir',
    pergunta: 'O que mais te faz falhar um treino planeado?',
    opcoes: ['Falta de tempo', 'Falta de vontade', 'Cansaço acumulado', 'Dor ou lesão'],
  },
  'Trail Running': {
    id: 'trail-distancia',
    pergunta: 'Qual é a maior distância que já fizeste em trail?',
    opcoes: ['Até 21 km', '21 a 42 km', '42 a 80 km', 'Mais de 80 km'],
  },
  'Lesões': {
    id: 'lesoes-12meses',
    pergunta: 'Quantas lesões te pararam nos últimos 12 meses?',
    opcoes: ['Nenhuma', 'Uma', 'Duas', 'Três ou mais'],
  },
  'VO2max': {
    id: 'vo2max-sabes',
    pergunta: 'Sabes o teu VO2max?',
    opcoes: ['Sim, medido em laboratório', 'Sim, estimado pelo relógio', 'Não faço ideia', 'Nunca ouvi falar'],
  },
  'Equipamento': {
    id: 'equipamento-preco',
    pergunta: 'Quanto costumas gastar num par de sapatilhas de corrida?',
    opcoes: ['Menos de 80 €', '80 a 120 €', '120 a 180 €', 'Mais de 180 €'],
  },
}

const FALLBACK = SONDAGENS['Treino']

export function sondagemParaCategoria(categoria: string): Sondagem {
  return SONDAGENS[categoria] ?? FALLBACK
}

export function sondagemPorId(id: string): Sondagem | null {
  return Object.values(SONDAGENS).find((s) => s.id === id) ?? null
}
