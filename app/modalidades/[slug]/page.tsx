import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getAllArticles } from '@/lib/articles'

const SITE_URL = 'https://www.performancerunning.pt'

interface Modalidade {
  slug: string
  name: string
  tag: string
  headline: string
  seoTitle: string
  seoDescription: string
  intro: string
  physiology: string
  zones: string[]
  trainings: string[]
  volume: string
  errors: string[]
  faq: { q: string; a: string }[]
  img: string
  category: string
}

const MODALIDADES: Modalidade[] = [
  {
    slug: 'maratona',
    name: 'Maratona',
    tag: 'PERIODIZAÇÃO',
    headline: 'Gestão de Energia e Resistência à Fadiga',
    seoTitle: 'Treino para Maratona — Metodologia Científica | Performance Running',
    seoDescription: 'Guia científico completo de treino para maratona. Fisiologia, zonas de treino, periodização, nutrição e os erros mais comuns. Baseado em investigação científica.',
    intro: 'A maratona é, fisiologicamente, a prova mais complexa do atletismo de estrada. Requer 3 a 5 horas de esforço contínuo — muito acima da capacidade de armazenamento de glicogénio muscular. A transição metabólica para a oxidação de gorduras, a resistência à fadiga central e a gestão do ritmo são os fatores determinantes entre cruzar a linha com um novo recorde pessoal ou enfrentar o temido "muro" dos 30-35 km. Entender a fisiologia da maratona é o primeiro passo para treinar de forma verdadeiramente inteligente.',
    physiology: 'A maratona é corrida a 75-85% do VO2max, ligeiramente abaixo do limiar anaeróbico. O glicogénio muscular e hepático começa a esgotar-se por volta do km 28-32 em atletas não adaptados. A partir daí, o organismo recorre crescentemente à oxidação de ácidos gordos — um processo mais lento e menos eficiente. A "fadiga central" — mediada por alterações nos neurotransmissores do sistema nervoso central, nomeadamente a serotonina — amplifica a percepção de esforço nos últimos quilómetros.',
    zones: [
      'Z1-Z2 (Base aeróbia): 60-70% do volume semanal total',
      'Ritmo de maratona específico: 15-20% do volume',
      'Z3-Z4 (Limiar): 10-15% do volume',
      'Z5 (VO2max): <5% — apenas em fases iniciais',
    ],
    trainings: [
      'Long run progressivo: 28-38 km com os últimos 8-12 km a ritmo de maratona',
      'Treino de maratona específico: 2×16 km ou 3×12 km a ritmo alvo',
      'Tempo runs de 10-16 km ligeiramente abaixo do ritmo de maratona',
      'Corridas de ativação metabólica em jejum (sob supervisão nutricional)',
      'Treino de força: agachamentos, deadlifts, exercícios de core — 2x/semana',
    ],
    volume: '80-120 km/semana no pico de treino para atletas de performance; 60-80 km/semana para atletas amadores com objetivo de completar a prova',
    errors: [
      'Aumentar o volume semanal mais de 10% por semana (Lei dos 10%)',
      'Ignorar a nutrição durante os long runs — simula sempre as condições de prova',
      'Correr todos os treinos a ritmo de maratona — a maioria deve ser em Z1-Z2',
      'Não incluir semanas de recuperação a cada 3-4 semanas de carga',
      'Abandonar o treino de força nas últimas semanas — é quando mais importa',
    ],
    faq: [
      { q: 'Quantas semanas demora um plano de treino para maratona?', a: 'Um plano científico de maratona tem entre 16 e 20 semanas para atletas com base aeróbia. Para iniciantes sem base, recomenda-se 24 semanas. A periodização divide-se em fase base (aeróbia), fase específica (ritmo de maratona) e taper (redução de 2-3 semanas antes da prova).' },
      { q: 'Qual é o ritmo ideal de treino para maratona?', a: 'O ritmo de maratona é determinado pelo limiar anaeróbico individual. Em termos práticos, corresponde a um ritmo onde consegues falar frases curtas mas sentes esforço claro. Testes de lactato ou testes de campo como o teste de 30 minutos permitem calibrar este ritmo com precisão.' },
      { q: 'Como evitar o "muro" nos 30 km?', a: 'O "muro" é uma realidade bioquímica causada pela depleção de glicogénio. Para o evitar: (1) não começar mais rápido do que o ritmo treino, (2) ingerir 60-90g de carboidratos por hora a partir do km 10, (3) treinar o organismo a usar mais gorduras com long runs em zona 2.' },
      { q: 'Quando devo fazer o taper antes da maratona?', a: 'O taper começa 2-3 semanas antes da prova. Na primeira semana de taper reduz 30-40% do volume; na segunda, 50-60%; na semana da prova, mantém apenas corridas curtas de ativação. Não reduza a intensidade, apenas o volume.' },
    ],
    img: 'https://www.performancerunning.pt/pool-images/photo-1543051932-6ef9fecfbc80.jpg',
    category: 'Treino',
  },
  {
    slug: 'meia-maratona',
    name: 'Meia Maratona',
    tag: 'EFICIÊNCIA',
    headline: 'Limiar Aeróbio e Economia de Corrida',
    seoTitle: 'Treino para Meia Maratona — Metodologia Científica | Performance Running',
    seoDescription: 'Guia completo de treino para meia maratona baseado em ciência. Fisiologia, zonas de treino, plano de preparação e os erros mais comuns nos 21 km.',
    intro: 'A meia maratona é a prova perfeita para corredores que querem desafiar os seus limites sem a exigência extrema da maratona. Corrida a 80-85% do VO2max, ligeiramente abaixo do limiar anaeróbico, exige uma combinação precisa de base aeróbia sólida e velocidade de limiar. A economia de corrida — a quantidade de oxigénio consumido a uma velocidade específica — torna-se um fator determinante para separar os atletas com a mesma capacidade aeróbia.',
    physiology: 'A meia maratona é corrida próximo do limiar anaeróbico, onde a produção e remoção de lactato estão em equilíbrio instável. O glicogénio muscular é o combustível dominante. A depleção parcial de reservas começa a manifestar-se após o km 16-18, tornando a nutrição uma variável importante mesmo numa prova de distância média.',
    zones: [
      'Z2 (Base aeróbia): 50-60% do volume semanal',
      'Z3-Z4 (Limiar): 25-30% do volume',
      'Ritmo de meia maratona específico: 10-15%',
      'Z5 (VO2max): 5-8% do volume',
    ],
    trainings: [
      'Long run de 18-26 km com secções a ritmo de meia maratona nos últimos 5-8 km',
      'Tempo runs de 10-14 km a ritmo de 10km/meia maratona',
      'Intervalos de 1-2 km em ritmo de 10km para desenvolver velocidade',
      'Treinos de economia: strides, drills de técnica de corrida',
      'Treino de força: foco em core e membros inferiores',
    ],
    volume: '60-90 km/semana para performance; 45-65 km/semana para atletas amadores',
    errors: [
      'Ignorar a nutrição e hidratação durante os long runs',
      'Long runs realizados demasiado lentamente sem variação de ritmo',
      'Ausência de trabalho de força complementar',
      'Demasiadas provas de competição durante a preparação',
      'Não simular as condições de prova (terreno, hora, equipamento)',
    ],
    faq: [
      { q: 'Quantas semanas de preparação são necessárias para uma meia maratona?', a: 'Para atletas com base de corrida de 30-40 km/semana, um plano de 12-16 semanas é suficiente. Para iniciantes que nunca correram mais de 10 km, recomenda-se 20-24 semanas de preparação progressiva.' },
      { q: 'Qual é o ritmo ideal para treinar para uma meia maratona?', a: 'Os treinos fáceis (Z2) devem ser feitos a um ritmo onde consegues manter uma conversa completa — geralmente 60-90 segundos/km mais lento do que o teu ritmo de competição de 10 km. Os treinos de limiar são feitos a ritmo de meia maratona ou ligeiramente mais rápido.' },
      { q: 'Preciso de comer durante uma meia maratona?', a: 'Para atletas que terminam abaixo de 1h45, a nutrição em corrida tem impacto limitado. Acima de 1h45-2h, recomendam-se 1-2 géis de carboidratos (30-60g) entre o km 8 e o km 15. A hidratação com água é importante em provas com temperaturas acima de 15°C.' },
    ],
    img: 'https://www.performancerunning.pt/pool-images/photo-1613936360976-8f35cf0e5461.jpg',
    category: 'Treino',
  },
  {
    slug: '10km',
    name: '10 km',
    tag: 'LIMIAR',
    headline: 'Equilíbrio entre Potência e Resistência',
    seoTitle: 'Treino para 10km — Metodologia Científica | Performance Running',
    seoDescription: 'Guia científico de treino para os 10 km. Fisiologia do limiar anaeróbico, zonas de treino, tipos de sessão e como melhorar o teu tempo nos 10 km.',
    intro: 'O 10 km representa o ponto de equilíbrio perfeito entre velocidade e resistência. É corrido a 85-92% do VO2max, próximo do limiar anaeróbico — o ponto onde a produção de lactato começa a superar a sua remoção. Dominar este limiar é talvez o investimento mais rentável em qualquer modalidade de corrida, pois os ganhos no 10 km transferem-se diretamente para melhorias na maratona, meia maratona e no 5 km.',
    physiology: 'O ritmo de 10 km corresponde a 85-92% do VO2max para a maioria dos atletas. O limiar anaeróbico (MLSS — Maximal Lactate Steady State) é o principal fator limitante. Atletas de elite correm o 10 km exatamente no seu ritmo de limiar — o ponto onde o lactato produzido é igual ao lactato removido.',
    zones: [
      'Z2 (Base aeróbia): 40-50% do volume semanal',
      'Z3 (Limiar inferior): 20-30% do volume',
      'Z4 (Limiar superior/ritmo 10km): 15-20% do volume',
      'Z5 (VO2max): 5-10% do volume',
    ],
    trainings: [
      'Tempo runs de 4-8 km em ritmo de 10 km (ritmo de limiar)',
      'Progressivos de 8-12 km com aceleração gradual',
      'Fartlek: 8-10 × 1min rápido / 1min recuperação',
      'Long run de 14-18 km em Z2',
      'Intervalos de 1000m em ritmo de 5 km para desenvolver VO2max',
    ],
    volume: '50-80 km/semana para performance; 35-55 km/semana para atletas amadores',
    errors: [
      'Correr os treinos fáceis demasiado rápido (o erro mais comum)',
      'Não desenvolver o trabalho de limiar específico em Z3-Z4',
      'Excesso de competições sem periodização adequada',
      'Ignorar o treino de força — reduz a economia de corrida',
      'Volume semanal demasiado baixo para desenvolver a base aeróbia',
    ],
    faq: [
      { q: 'Como melhorar o tempo nos 10 km?', a: 'Os dois fatores mais determináveis por treino são o limiar anaeróbico e a economia de corrida. Inclui 1-2 sessões de limiar por semana (tempo runs), mantém 70-80% dos treinos em Z2, e adiciona treino de força 2x/semana. Em 12-16 semanas de treino consistente, a maioria dos atletas melhora 1-3 minutos.' },
      { q: 'Qual é a cadência ideal para correr 10 km?', a: 'A cadência ótima situa-se entre 170-180 passos por minuto para a maioria dos corredores a ritmo de 10 km. Cadências baixas (abaixo de 160) aumentam o risco de lesão e reduzem a economia de corrida. Aumentar a cadência gradualmente (5-10% por semana) é uma das intervenções biomecânicas com melhor evidência científica.' },
    ],
    img: 'https://www.performancerunning.pt/pool-images/photo-1476480862126-209bfaa8edc8.jpg',
    category: 'Treino',
  },
  {
    slug: '5km',
    name: '5 km',
    tag: 'VELOCIDADE',
    headline: 'Máxima Potência Aeróbia',
    seoTitle: 'Treino para 5km — Metodologia Científica | Performance Running',
    seoDescription: 'Guia científico de treino para o 5 km. VO2max, zonas de intensidade, tipos de sessão e como melhorar o teu tempo nos 5 km de forma baseada em ciência.',
    intro: 'O 5 km é a prova que mais exige do VO2max e da capacidade láctica. Um corredor de 5 km precisa de sustentar entre 95-100% do VO2max durante 15 a 25 minutos — o que requer uma base aeróbia sólida combinada com sessões de alta intensidade bem periodizadas. É também a prova mais popular em Portugal, com provas em todos os concelhos durante todo o ano.',
    physiology: 'O 5 km tem predominância aeróbia (85-90%) com contribuição anaeróbia significativa (10-15%). A produção de lactato excede a capacidade de remoção nos últimos quilómetros. O VO2max é o principal fator limitante, mas a capacidade de tolerar altas concentrações de lactato determina quem aguenta o ritmo até à linha de chegada.',
    zones: [
      'Z2 (Base aeróbia): 35-45% do volume semanal',
      'Z4 (Limiar): 35-45% do volume',
      'Z5 (VO2max): 10-15% do volume',
      'Z6 (Anaeróbio/velocidade): 5% do volume',
    ],
    trainings: [
      'Intervalos de 800m a 1000m em ritmo de competição de 5 km',
      'Tempo runs de 20-30 min a ritmo de 10 km',
      'Repetições de 200-400 m para desenvolver velocidade e economia',
      'Long run de 12-16 km em Z2 para manter a base aeróbia',
      'Strides: 4-6 × 80-100m no fim dos treinos fáceis',
    ],
    volume: '40-70 km/semana conforme nível',
    errors: [
      'Negligenciar a base aeróbia de Z2 — a maioria dos ganhos no 5 km vem da base, não da velocidade',
      'Demasiadas sessões de alta intensidade sem recuperação adequada',
      'Ignorar o trabalho de força e biomecânica',
      'Competir com demasiada frequência — cada prova é um estímulo de alta intensidade',
    ],
    faq: [
      { q: 'Quanto tempo demora a melhorar significativamente o 5 km?', a: 'Com treino consistente e bem estruturado, a maioria dos atletas vê melhorias mensuráveis em 8-12 semanas. Uma melhoria de 30 segundos a 1 minuto por cada bloco de 12 semanas é realista para corredores com bases entre 25-45 min.' },
      { q: 'É melhor fazer muitos treinos de velocidade ou focar na base aeróbia?', a: 'A investigação científica é clara: 80% do treino deve ser em zona 2 (fácil/conversa) e apenas 20% em alta intensidade. O modelo polarizado — base + velocidade, com pouco trabalho de limiar — é o que melhor resultados produz para os 5 km segundo a literatura atual.' },
    ],
    img: 'https://www.performancerunning.pt/pool-images/photo-1552674605-db6ffd4facb5.jpg',
    category: 'Treino',
  },
  {
    slug: 'trail-running',
    name: 'Trail Running',
    tag: 'TÉCNICA',
    headline: 'Técnica de Montanha e Adaptação ao Terreno',
    seoTitle: 'Trail Running — Metodologia Científica de Treino | Performance Running',
    seoDescription: 'Guia completo de treino para trail running. Técnica de montanha, desnível, zonas de treino, força específica e preparação para provas de trail baseados em ciência.',
    intro: 'O trail running exige uma combinação única de capacidade aeróbia, força muscular excêntrica, técnica de corrida em terreno variável e resistência mental. Ao contrário da corrida de estrada, o desnível cria picos contínuos de intensidade que tornam as métricas de pace irrelevantes. O treino em trail requer uma abordagem diferente — medida em desnível, tempo e esforço percebido, não em quilómetros por hora.',
    physiology: 'As variações de desnível criam picos de intensidade contínuos. As subidas recrutam predominantemente glúteos e quadricípites em modo concêntrico; as descidas impõem contrações excêntricas intensas que causam mais dano muscular do que qualquer outra forma de treino. O EFD (Equivalent Flat Distance) — que considera desnível positivo e negativo — é a métrica correta para quantificar o esforço real.',
    zones: [
      'Z1-Z2 com variações de desnível: 50-60% do volume',
      'Subidas intensas (Z4-Z5): 15-20% do volume',
      'Trabalho técnico de descida: 10-15% do volume',
      'Força específica: 2-3 sessões por semana',
    ],
    trainings: [
      'Subidas repetidas (uphill repeats): 6-10 × 3-8 min a intensidade elevada',
      'Descidas técnicas controladas em superfícies variadas',
      'Long trail com desnível progressivo, treinando caminhada estratégica nas subidas',
      'Força específica: lunges, step-ups, single-leg deadlifts',
      'Back-to-back em preparação para ultras: long trail sábado + long trail domingo',
    ],
    volume: 'Medido em desnível: 2000-5000m+ por semana conforme objetivo e nível',
    errors: [
      'Ignorar o treino de força específica — é a diferença entre progressão e lesão',
      'Negligenciar a técnica de descida — a principal causa de quedas e lesões no trail',
      'Não treinar com o equipamento de corrida que usará na prova',
      'Usar pace por km como métrica de esforço em vez de frequência cardíaca ou esforço percebido',
    ],
    faq: [
      { q: 'Como treinar as subidas para trail running?', a: 'As subidas intensas (uphill repeats) são o exercício mais eficaz para desenvolver a capacidade de subida. 6-10 repetições de 3-8 minutos a ritmo de esforço elevado (Z4-Z5), com descida em recuperação ativa. Adiciona treino de força — especialmente glúteos e quadricípites — 2-3 vezes por semana.' },
      { q: 'O desnível conta para o volume semanal?', a: 'Sim, e de forma muito significativa. A regra mais utilizada na literatura é adicionar 1 km por cada 100m de desnível positivo (e 0.5 km por cada 100m de negativo). Assim, 10 km com 1000m D+ equivalem a cerca de 20 km de corrida plana em termos de carga.' },
    ],
    img: 'https://www.performancerunning.pt/pool-images/photo-1504025468847-0e438279542c.jpg',
    category: 'Trail Running',
  },
  {
    slug: 'ultra-trail',
    name: 'Ultra Trail',
    tag: 'MENTAL',
    headline: 'Preparação Mental, Logística e Nutrição',
    seoTitle: 'Ultra Trail — Metodologia Científica de Preparação | Performance Running',
    seoDescription: 'Guia completo de preparação para ultra trail. Fisiologia do esforço prolongado, nutrição, gestão mental, treino e estratégias de prova baseados em ciência.',
    intro: 'Provas de ultra trail (42 km+) entram num território fisiológico único: digestão em movimento a intensidade moderada, potencial privação de sono, danos musculares acumulados e tomada de decisão sob fadiga extrema. A preparação para um ultra vai muito além do treino físico — é uma disciplina logística, nutricional e psicológica. Os problemas gastrointestinais são a causa número 1 de abandono em ultras, não a fadiga muscular.',
    physiology: 'Após 6-8 horas de esforço contínuo, o organismo entra num estado catabólico progressivo. A capacidade de absorver e metabolizar nutrientes sólidos durante o esforço torna-se crítica. O sistema nervoso central começa a aumentar a percepção de esforço de forma desproporcional à fadiga muscular real — um mecanismo de proteção do organismo estudado extensivamente pela ciência.',
    zones: [
      'Z1-Z2 (conversa/caminhada): 70-80% do tempo de prova',
      'Caminhada estratégica nas subidas: fundamental acima de 10-15% de declive',
      'Nunca exceder Z4 exceto em subidas curtas e pontuais',
      'Gestão cardíaca conservadora nos primeiros 40% da prova',
    ],
    trainings: [
      'Back-to-back: long trail sábado (4-6h) + long trail domingo (2-4h)',
      'Sessões noturnas para adaptar o organismo à privação de sono',
      'Simulação de prova: testar nutrição, equipamento e estratégia durante o treino',
      'Uphill hiking: treinar a caminhada de subida rápida e eficiente',
      'Força excêntrica: descidas longas para preparar o dano muscular controlado',
    ],
    volume: 'Medido em tempo e desnível, não em km: 10-15 horas por semana no pico de treino',
    errors: [
      'Começar demasiado rápido — a prova começa verdadeiramente a partir de metade',
      'Não testar a nutrição e hidratação durante o treino exactamente como na prova',
      'Negligenciar a recuperação entre semanas de carga elevada',
      'Ignorar os sinais de overtraining — o ultra exige meses de preparação sem atalhos',
    ],
    faq: [
      { q: 'Como escolher o primeiro ultra trail?', a: 'Para um primeiro ultra, escolhe uma prova com 50-65 km e desnível máximo de 2500-3500m D+. Garante que tens pelo menos um ano de experiência em trail running e que já completaste provas de 25-35 km. O primeiro ultra deve ser de finalização, não de performance.' },
      { q: 'O que comer durante um ultra trail?', a: 'A regra científica é ingerir 60-90g de carboidratos por hora a partir das 2-3 primeiras horas. Em ultras acima de 8-10h, incluir alimentos sólidos é essencial — banana, batata cozida, frutos secos, arroz. Testar TUDO durante o treino é obrigatório, pois o sistema digestivo comporta-se de forma diferente sob fadiga extrema.' },
    ],
    img: 'https://www.performancerunning.pt/pool-images/photo-1513593771513-7b58b6c4af38.jpg',
    category: 'Trail Running',
  },
  {
    slug: 'corrida-montanha',
    name: 'Corrida de Montanha',
    tag: 'FORÇA',
    headline: 'Explosividade, Técnica e Força Específica',
    seoTitle: 'Corrida de Montanha — Metodologia Científica | Performance Running',
    seoDescription: 'Treino científico para corrida de montanha e sky running. Força específica, técnica de subida, preparação para vertical kilometer e sky races.',
    intro: 'A corrida de montanha combina a velocidade do atletismo com os desafios técnicos do trail running. Provas como o Vertical Kilometer, Sky Races e corridas de montanha em Portugal exigem uma capacidade aeróbia de elite combinada com força muscular específica nos membros inferiores. A relação peso/potência (Watts/kg) é o fator mais determinante — corredores mais leves e potentes têm vantagem natural nas subidas.',
    physiology: 'Nas subidas acentuadas, a frequência cardíaca sobe rapidamente para Z4-Z5. O consumo de oxigénio por unidade de tempo é máximo. A biomecânica da subida a alta intensidade é muito diferente da corrida plana — o tronco inclina-se para a frente, os braços trabalham mais, e os passos são mais curtos e mais frequentes.',
    zones: [
      'Subidas intensas Z4-Z5: 30-40% do volume de treino',
      'Corrida plana de base Z2: 40-50%',
      'Força muscular: treino complementar obrigatório, 2-3x/semana',
    ],
    trainings: [
      'Vertical repeats: 8-12 subidas de 5-10 minutos a intensidade máxima',
      'Hill sprints: 8-15 × 10-30 segundos em subida íngreme',
      'Musculação específica: agachamentos unilaterais, lunges, step-ups com carga',
      'Corrida plana de base para manter VO2max sem desgaste excêntrico',
    ],
    volume: '50-80 km/semana de corrida + sessões de força dedicadas',
    errors: [
      'Ignorar o treino de força muscular específica',
      'Não desenvolver a técnica de descida — igualmente crítica nas sky races',
      'Volume demasiado alto sem qualidade — melhor menos quilómetros com mais desnível',
    ],
    faq: [
      { q: 'Como treinar para um Vertical Kilometer?', a: 'O VK exige especificidade máxima: treina as subidas a alta intensidade. 10-15 semanas de preparação com uphill repeats progressivos (de 4 min a 10+ min), força de membros inferiores 3x/semana, e corridas de base para manter a capacidade aeróbia. Na semana da prova, reduz 60% do volume mas mantém 1-2 sessões de intensidade curta.' },
    ],
    img: 'https://www.performancerunning.pt/pool-images/photo-1461897104016-0b3b00cc81ee.jpg',
    category: 'Trail Running',
  },
  {
    slug: 'meio-fundo',
    name: 'Meio Fundo',
    tag: 'VO2MAX',
    headline: 'Potência Aeróbia Máxima e Velocidade',
    seoTitle: 'Treino de Meio Fundo — Metodologia Científica | Performance Running',
    seoDescription: 'Guia científico de treino para meio fundo (800m, 1500m, 3000m). VO2max, capacidade láctica, periodização e tipos de sessão baseados em investigação científica.',
    intro: 'O meio fundo (800m-3000m) é a modalidade que mais exige do sistema cardiovascular em termos de intensidade relativa. O 800m é uma das provas mais fisiologicamente complexas do atletismo — envolve contribuição anaeróbia de 35-45% e aeróbia de 55-65%. O 1500m e 3000m são predominantemente aeróbios mas exigem taxas de consumo de oxigénio próximas do VO2max durante toda a prova.',
    physiology: 'O VO2max é o principal fator limitante no meio fundo. A capacidade de tolerar e remover lactato permite manter velocidades supramaximais por mais tempo. No 1500m, os atletas de elite correm a 100-105% do VO2max. A potência neuromuscular — a capacidade de produzir força rapidamente — é igualmente crítica para a velocidade terminal.',
    zones: [
      'Z2 (Base aeróbia): 50-55% do volume semanal',
      'Z4 (Limiar): 25-30% do volume',
      'Z5 (VO2max): 10-15% do volume — o diferenciador no meio fundo',
      'Z6-Z7 (Velocidade/Anaeróbio): 5% do volume',
    ],
    trainings: [
      'Intervalos de 400m e 600m em ritmo de prova ou ligeiramente mais rápido',
      '1000m-1500m em ritmo de 3000m para desenvolver resistência de velocidade',
      'Tempo runs de 15-25 min para desenvolver base de limiar',
      'Treino de velocidade: 100-200m em condicionamento neuro-muscular',
      'Long run de 14-18 km para manter base aeróbia',
    ],
    volume: '50-80 km/semana para atletismo de pista',
    errors: [
      'Excesso de corridas lentas e volume insuficiente de trabalho específico de velocidade',
      'Negligenciar o trabalho técnico e de flexibilidade (aquecimento insuficiente)',
      'Falta de periodização anual com pico para as provas-alvo',
      'Competir demasiado fora da época competitiva principal',
    ],
    faq: [
      { q: 'Como melhorar o VO2max para o meio fundo?', a: 'Os intervalos de alta intensidade (Z5) a 95-105% do VO2max são o estímulo mais eficaz: 5-8 × 1000m a ritmo de 5 km, ou 6-10 × 800m. Reduz o descanso progressivamente ao longo do mesociclo. A melhoria do VO2max é mais rápida em atletas menos treinados — iniciantes podem ver ganhos de 15-20% em 8-12 semanas.' },
    ],
    img: 'https://www.performancerunning.pt/pool-images/photo-1567427018141-0584cfcbf1b8.jpg',
    category: 'Treino',
  },
]

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return MODALIDADES.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = MODALIDADES.find((x) => x.slug === params.slug)
  if (!m) return {}
  return {
    title: m.seoTitle,
    description: m.seoDescription,
    openGraph: {
      title: m.seoTitle,
      description: m.seoDescription,
      images: [{ url: m.img, width: 1200, height: 630 }],
    },
    alternates: { canonical: `${SITE_URL}/modalidades/${m.slug}` },
  }
}

export default function ModalidadePage({ params }: Props) {
  const m = MODALIDADES.find((x) => x.slug === params.slug)
  if (!m) notFound()

  const related = getAllArticles()
    .filter((a) => a.category === m.category)
    .slice(0, 4)

  // JSON-LD FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: m.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ backgroundImage: `url(${m.img})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/modalidades" className="inline-flex items-center gap-1.5 text-[11px] text-white/35 hover:text-brand-green transition-colors mb-8 font-mono uppercase tracking-widest">
            <ArrowLeft size={11} /> Todas as Modalidades
          </Link>
          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest text-brand-green border border-brand-green/25 bg-brand-green/10 mb-5">
            {m.tag}
          </span>
          <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
            {m.name.toUpperCase()}
          </h1>
          <p className="text-brand-green font-semibold text-lg mb-4">{m.headline}</p>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">{m.seoDescription}</p>
        </div>
      </section>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Introdução */}
        <section>
          <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-4">Visão Geral</p>
          <p className="text-white/65 leading-relaxed text-base">{m.intro}</p>
        </section>

        {/* Fisiologia */}
        <section className="relative rounded-2xl overflow-hidden border border-white/8"
          style={{ backgroundImage: `url(${m.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black/88" />
          <div className="relative p-8">
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">Fisiologia</p>
            <h2 className="font-display text-white text-3xl leading-none mb-4">BASE CIENTÍFICA</h2>
            <p className="text-white/60 leading-relaxed">{m.physiology}</p>
          </div>
        </section>

        {/* Grid: zonas + treinos */}
        <div className="grid sm:grid-cols-2 gap-5">
          <section className="p-6 rounded-xl border border-white/8 bg-white/[0.02]">
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-4">Zonas de Intensidade</p>
            <ul className="space-y-3">
              {m.zones.map((z) => (
                <li key={z} className="flex items-start gap-2.5 text-sm text-white/60">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                  {z}
                </li>
              ))}
            </ul>
          </section>

          <section className="p-6 rounded-xl border border-white/8 bg-white/[0.02]">
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-4">Tipos de Treino</p>
            <ul className="space-y-3">
              {m.trainings.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-white/60">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-white/5 text-xs text-white/40">
              <span className="text-white/60 font-semibold">Volume: </span>{m.volume}
            </div>
          </section>

          {/* Erros comuns */}
          <section className="p-6 rounded-xl border border-red-500/10 bg-red-500/[0.02] sm:col-span-2">
            <p className="text-red-400 text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-4">Erros Comuns</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {m.errors.map((e) => (
                <div key={e} className="flex items-start gap-2.5 text-sm text-white/55">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {e}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FAQ */}
        {m.faq.length > 0 && (
          <section>
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-6">Perguntas Frequentes</p>
            <div className="space-y-4">
              {m.faq.map((f) => (
                <div key={f.q} className="p-6 rounded-xl border border-white/8 bg-white/[0.015]">
                  <h3 className="text-white font-bold text-sm mb-3">{f.q}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Artigos relacionados */}
        {related.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-1">Aprofunda o Conhecimento</p>
                <h2 className="font-display text-white text-3xl leading-none">ARTIGOS RELACIONADOS</h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-white/30 hover:text-brand-green transition-colors uppercase tracking-widest">
                Ver todos <ArrowRight size={10} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-white/5 hover:border-brand-green/20 bg-white/[0.01] hover:bg-brand-green/[0.03] transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-brand-green/60 uppercase tracking-wider block mb-1">
                      {a.category} · {a.readTime} min
                    </span>
                    <h3 className="text-sm font-bold text-white/70 group-hover:text-white transition-colors leading-snug line-clamp-2">{a.title}</h3>
                  </div>
                  <ArrowRight size={13} className="text-white/20 group-hover:text-brand-green transition-colors shrink-0 mt-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Nav para outras modalidades */}
        <section className="pt-8 border-t border-white/5">
          <Link href="/modalidades" className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-brand-green transition-colors font-medium">
            <ArrowLeft size={13} /> Ver todas as modalidades
          </Link>
        </section>
      </div>
    </div>
  )
}
