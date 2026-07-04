/**
 * Inventário de produtos da página /equipamento.
 * ------------------------------------------------------------------
 * Este ficheiro foi extraído de app/equipamento/page.tsx para permitir:
 *   1. Um inventário maior (mais opções por categoria, incluindo os
 *      best-sellers atuais da Amazon em cada segmento).
 *   2. Rotação periódica do subconjunto mostrado (ver lib/rotation.ts),
 *      em vez de mostrar sempre os mesmos produtos.
 *
 * IMAGENS E PREÇOS — TODOS CONFIRMADOS (2026-07-04):
 * Todos os 50 produtos têm `img` e `preco` reais extraídos diretamente
 * da Amazon.es (via navegação real no browser), com `precoVerificado: true`.
 * 7 produtos da expansão original não estavam à venda na Amazon.es/de sob
 * o nome inicialmente previsto e foram substituídos por um produto real e
 * disponível equivalente (mesma categoria/uso): Garmin HRM-Pro Plus →
 * Garmin HRM-600, Wahoo TICKR → Wahoo TICKR FIT, Scosche Rhythm24 → Coospo
 * H9Z, Neversecond C30 Gel → Powerbar PowerGel Hydro, Honey Stinger
 * Organic Gel → Dextro Energy Long Distance Gel, Varta Indestructible H20
 * Pro → H30 Pro, Camelbak Flash Belt → Camelbak Ultra Belt.
 *
 * Os preços da Amazon flutuam com frequência (promoções, stock) — o valor
 * aqui é uma fotografia do momento da verificação, não um preço fixo. Se
 * precisares de re-verificar no futuro, repete o processo de navegação
 * real na Amazon (não estimar/inventar) antes de mudar `precoVerificado`.
 */

export interface SapatoProduto {
  name: string
  categoria: 'Estrada' | 'Trail' | 'Competição'
  rating: number
  preco: string
  precoVerificado: boolean
  badge: string
  badgeColor: string
  img: string
  desc: string
  pros: string[]
  contras: string[]
  link: string
  loja: string
  bestseller?: boolean
}

export interface RelogioProduto {
  name: string
  rating: number
  preco: string
  precoVerificado: boolean
  badge: string
  badgeColor: string
  img: string
  desc: string
  pros: string[]
  contras: string[]
  link: string
  loja: string
  bestseller?: boolean
}

export interface SensorFcProduto {
  name: string
  tipo: string
  rating: number
  preco: string
  precoVerificado: boolean
  badge: string
  badgeColor: string
  img: string
  desc: string
  pros: string[]
  contras: string[]
  link: string
  loja: string
  porque: string
  bestseller?: boolean
}

export interface NutricaoProduto {
  name: string
  tipo: string
  rating: number
  preco: string
  precoVerificado: boolean
  badge: string
  badgeColor: string
  img: string
  desc: string
  pros: string[]
  contras: string[]
  link: string
  loja: string
  porque: string
  bestseller?: boolean
}

export interface AcessorioProduto {
  name: string
  tipo: string
  preco: string
  precoVerificado: boolean
  img: string
  desc: string
  link: string
  bestseller?: boolean
}

/* ── SAPATOS DE CORRIDA ────────────────────────────────────────────── */
export const sapatos: SapatoProduto[] = [
  {
    name: 'HOKA Clifton 9',
    categoria: 'Estrada',
    rating: 5,
    preco: 'desde ~€100',
    precoVerificado: true,
    badge: "Editor's Choice",
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51M3xzUi6qL._AC_UL600_.jpg',
    desc: 'O sapato de estrada mais confortável do mercado. Stack height máxima com controlo surpreendente. Ideal para corredores de longa distância e recuperação ativa.',
    pros: ['Amortecimento excepcional', 'Durável (800+ km)', 'Bom para lesionados'],
    contras: ['Pesado para velocidade', 'Preço elevado'],
    link: 'https://www.amazon.es/s?k=hoka+clifton+9&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'On Cloudmonster 2',
    categoria: 'Estrada',
    rating: 4,
    preco: 'desde ~€112',
    precoVerificado: true,
    badge: 'Premium Pick',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/71BIO86CufL._AC_UL600_.jpg',
    desc: 'Tecnologia CloudTec de nova geração. Transição suave com retorno energético elevado. Perfeito para treinos longos e semi-maratona.',
    pros: ['Retorno energético elevado', 'Design premium', 'Respirabilidade'],
    contras: ['Adaptação necessária', 'Caro'],
    link: 'https://www.amazon.es/s?k=on+cloudmonster+2&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'ASICS Novablast 5',
    categoria: 'Estrada',
    rating: 5,
    preco: '~121,93 €',
    precoVerificado: true,
    badge: 'Mais Vendido',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51BAdI0J3+L._AC_UL600_.jpg',
    desc: 'Líder de vendas em 2026 no segmento de amortecimento máximo. Espuma FF Blast+ Eco com retorno energético elevado e uma transição de passada surpreendentemente ágil para uma sapatilha tão macia.',
    pros: ['Retorno energético muito acima da concorrência', 'Leve para a categoria', 'Verstátil (treino e ritmos rápidos)'],
    contras: ['Menos estável em curvas fechadas', 'Durabilidade da sola inferior a rivais'],
    link: 'https://www.amazon.es/s?k=asics+novablast+5&tag=performancerun-21',
    loja: 'Amazon ES',
    bestseller: true,
  },
  {
    name: 'Nike Vomero Plus',
    categoria: 'Estrada',
    rating: 5,
    preco: '~148,62 €',
    precoVerificado: true,
    badge: 'Tendência 2026',
    badgeColor: '#f59e0b',
    img: 'https://m.media-amazon.com/images/I/610jC-ICWvL._AC_UL600_.jpg',
    desc: 'Chegou ao topo das vendas em 2026, destronando a Novablast 5. Espuma ZoomX de stack alta pensada para quilómetros longos com uma sensação premium de "andar em nuvens".',
    pros: ['Amortecimento topo de gama (ZoomX)', 'Excelente para longos e recuperação', 'Upper muito respirável'],
    contras: ['Preço elevado', 'Menos responsiva em ritmos rápidos'],
    link: 'https://www.amazon.es/s?k=nike+vomero+plus&tag=performancerun-21',
    loja: 'Amazon ES',
    bestseller: true,
  },
  {
    name: 'Nike Pegasus 41',
    categoria: 'Estrada',
    rating: 4,
    preco: '~85,37 €',
    precoVerificado: true,
    badge: 'Clássico Versátil',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/71enKp8dozL._AC_UL600_.jpg',
    desc: 'O treinador diário mais vendido de sempre da Nike. Equilíbrio perfeito entre amortecimento, resposta e durabilidade — a escolha segura para quem quer um único par para (quase) tudo.',
    pros: ['Extremamente versátil', 'Durável e consistente', 'Preço competitivo para o segmento'],
    contras: ['Nada se destaca em particular', 'Drop de 10mm pode não agradar a todos'],
    link: 'https://www.amazon.es/s?k=nike+pegasus+41&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Brooks Ghost Max 2',
    categoria: 'Estrada',
    rating: 4,
    preco: '~163,20 €',
    precoVerificado: true,
    badge: 'Conforto Máximo',
    badgeColor: '#8b5cf6',
    img: 'https://m.media-amazon.com/images/I/71aLaIFnWpL._AC_UL600_.jpg',
    desc: 'Versão de amortecimento máximo do best-seller Ghost. Pensada para corredores que priorizam proteção articular em quilometragens elevadas, sem perder a suavidade de transição da Brooks.',
    pros: ['Amortecimento protetor', 'Ótimo para volumes altos', 'Encaixe confortável de série'],
    contras: ['Peso acima da média', 'Menos ágil em ritmos rápidos'],
    link: 'https://www.amazon.es/s?k=brooks+ghost+max+2&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Salomon Speedcross 6',
    categoria: 'Trail',
    rating: 5,
    preco: 'desde ~€100',
    precoVerificado: true,
    badge: 'Trail Best',
    badgeColor: '#f59e0b',
    img: 'https://m.media-amazon.com/images/I/71vRj0oHa1L._AC_UL600_.jpg',
    desc: 'O rei do trail técnico. Grip agressivo para terrenos enlameados e pedregosos. Proteção superior com leveza competitiva.',
    pros: ['Grip imbatível em lama', 'Proteção da sola', 'Cabedal resistente'],
    contras: ['Firme em alcatrão', 'Stack baixa'],
    link: 'https://www.amazon.es/s?k=salomon+speedcross+6&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'HOKA Mafate 5',
    categoria: 'Trail',
    rating: 5,
    preco: '~196,17 €',
    precoVerificado: true,
    badge: 'Líder de Vendas Trail',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/61yLC5W7cZL._AC_UL600_.jpg',
    desc: 'Sapatilha de trail de amortecimento máximo da HOKA — líder das vendas de trail em 2026. Pensada para ultra distâncias em terreno técnico sem sacrificar proteção nem estabilidade.',
    pros: ['Amortecimento máximo para ultra trail', 'Placa de proteção contra pedras', 'Estabilidade em descidas técnicas'],
    contras: ['Peso elevado', 'Stack alta pode reduzir sensibilidade ao terreno'],
    link: 'https://www.amazon.es/s?k=hoka+mafate+5&tag=performancerun-21',
    loja: 'Amazon ES',
    bestseller: true,
  },
  {
    name: 'La Sportiva Bushido III',
    categoria: 'Trail',
    rating: 4,
    preco: '~164,37 €',
    precoVerificado: true,
    badge: 'Precisão Técnica',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/61vMkROx2LL._AC_UL600_.jpg',
    desc: 'Referência italiana em trail técnico e vertical. Encaixe cirúrgico tipo "segunda pele" com grip Vibram Megagrip para máxima aderência em rocha e raízes.',
    pros: ['Sensibilidade ao terreno excelente', 'Grip Vibram de topo', 'Muito leve para a proteção que oferece'],
    contras: ['Encaixe estreito', 'Menos amortecimento para longas distâncias'],
    link: 'https://www.amazon.es/s?k=la+sportiva+bushido+iii&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'New Balance Fresh Foam X Hierro v9',
    categoria: 'Trail',
    rating: 4,
    preco: '~156,46 €',
    precoVerificado: true,
    badge: 'Em Alta',
    badgeColor: '#8b5cf6',
    img: 'https://m.media-amazon.com/images/I/71Dd1uikBRL._AC_UL600_.jpg',
    desc: 'Entrou com força no top de vendas de trail em 2026. Espuma Fresh Foam X macia combinada com sola Vibram para um equilíbrio raro entre conforto e aderência técnica.',
    pros: ['Conforto de longa distância', 'Boa aderência em terreno misto', 'Encaixe amplo (bom para pés largos)'],
    contras: ['Menos agressiva em lama profunda', 'Durabilidade da sola mediana'],
    link: 'https://www.amazon.es/s?k=new+balance+fresh+foam+x+hierro+v9&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Nike Vaporfly 3',
    categoria: 'Competição',
    rating: 5,
    preco: 'desde ~€195',
    precoVerificado: true,
    badge: 'Mais Rápido',
    badgeColor: '#ef4444',
    img: 'https://m.media-amazon.com/images/I/714NpSlEF-L._AC_UL600_.jpg',
    desc: 'A placa de carbono mais eficiente do mercado. Sub-4:00/km com conforto. O sapato dos recordes mundiais de maratona.',
    pros: ['Velocidade máxima', 'Placa de carbono ZoomX', 'Leve (238g)'],
    contras: ['Exclusivo para competição', 'Durabilidade limitada (300 km)', 'Preço proibitivo'],
    link: 'https://www.amazon.es/s?k=nike+vaporfly+3&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Nike Alphafly 3',
    categoria: 'Competição',
    rating: 5,
    preco: '~348,88 €',
    precoVerificado: true,
    badge: 'Topo de Gama',
    badgeColor: '#ef4444',
    img: 'https://m.media-amazon.com/images/I/719+OAEO00L._AC_UL600_.jpg',
    desc: 'A opção mais propulsiva da Nike para maratona — stack alta de espuma ZoomX com placa de carbono de comprimento total. Ajuda a manter o ritmo mesmo nos últimos quilómetros de fadiga.',
    pros: ['Ride extremamente propulsivo', 'Excelente nos últimos km da maratona', 'Ventilação de série no upper'],
    contras: ['O mais caro da categoria', 'Curva de adaptação (sensação "instável" inicialmente)'],
    link: 'https://www.amazon.es/s?k=nike+alphafly+3&tag=performancerun-21',
    loja: 'Amazon ES',
    bestseller: true,
  },
  {
    name: 'Adidas Adizero Adios Pro 4',
    categoria: 'Competição',
    rating: 5,
    preco: '~274,14 €',
    precoVerificado: true,
    badge: 'Grip Superior',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/61mi5lGjBNL._AC_UL600_.jpg',
    desc: 'Mais leve e com melhor tração que a geração anterior. As barras de carbono "Energy Rods" oferecem uma resposta explosiva sem perder estabilidade lateral.',
    pros: ['Excelente tração em pisos molhados', 'Mais leve que a Pro 3', 'Boa relação estabilidade/velocidade'],
    contras: ['Amortecimento mais firme que rivais', 'Preço elevado'],
    link: 'https://www.amazon.es/s?k=adidas+adizero+adios+pro+4&tag=performancerun-21',
    loja: 'Amazon ES',
  },
]

/* ── RELÓGIOS GPS ──────────────────────────────────────────────────── */
export const relogios: RelogioProduto[] = [
  {
    name: 'Garmin Forerunner 265',
    rating: 5,
    preco: 'desde ~€380',
    precoVerificado: true,
    badge: 'Melhor Custo/Benefício',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/71rp-pRCpRL._AC_UL600_.jpg',
    desc: 'O melhor relógio para corredores sérios sem gastar €700+. AMOLED, GPS dual-frequency, HRV avançado, planos de treino Garmin Coach.',
    pros: ['AMOLED vibrante', 'GPS preciso (L1+L5)', 'Autonomia 13h GPS', 'Dados HRV completos'],
    contras: ['Sem mapas topográficos', 'Sem música integrada'],
    link: 'https://www.amazon.es/s?k=garmin+forerunner+265&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Garmin Forerunner 955',
    rating: 5,
    preco: 'desde ~€430',
    precoVerificado: true,
    badge: 'Para Triatletas',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/51UPjlUVQBL._AC_UL600_.jpg',
    desc: 'Mapas topográficos, 20h autonomia GPS, métricas de trail, HeatSync e AltitudeAcclim. O relógio definitivo para ultra trail e triathlon.',
    pros: ['Mapas offline', 'Autonomia 20h GPS', 'Métricas de trail avançadas', 'Modo expedição 48h'],
    contras: ['Ecrã MIP (não AMOLED)', 'Pesado (52g)'],
    link: 'https://www.amazon.es/s?k=garmin+forerunner+955&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Garmin Forerunner 165',
    rating: 4,
    preco: '~192,13 €',
    precoVerificado: true,
    badge: 'Melhor Entrada AMOLED',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51yFDdf69lL._AC_UL600_.jpg',
    desc: 'A porta de entrada da Garmin no ecrã AMOLED. Foco em métricas essenciais de corrida com a fiabilidade e o ecossistema Garmin Connect, a um preço muito mais acessível que a gama Forerunner superior.',
    pros: ['AMOLED nítido a preço acessível', 'Leve e confortável 24/7', 'Garmin Coach incluído'],
    contras: ['Sem mapas', 'Autonomia inferior à gama 900'],
    link: 'https://www.amazon.es/s?k=garmin+forerunner+165&tag=performancerun-21',
    loja: 'Amazon ES',
    bestseller: true,
  },
  {
    name: 'Garmin Forerunner 970',
    rating: 5,
    preco: '~699,99 €',
    precoVerificado: true,
    badge: 'Topo de Gama 2026',
    badgeColor: '#ef4444',
    img: 'https://m.media-amazon.com/images/I/61jt0X1c0UL._AC_UL600_.jpg',
    desc: 'O relógio de corrida mais completo da Garmin em 2026. Mapas a cores, métricas de treino de última geração, construção premium e funcionalidades smart de topo — para quem não quer abdicar de nada.',
    pros: ['Métricas de treino best-in-class', 'Mapas e navegação avançados', 'Acabamento e ecrã premium'],
    contras: ['Preço muito elevado', 'Curva de aprendizagem das funcionalidades'],
    link: 'https://www.amazon.es/s?k=garmin+forerunner+970&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Coros Pace 3',
    rating: 5,
    preco: 'desde ~€230',
    precoVerificado: true,
    badge: 'Melhor Relação Peso/Preço',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/61HE8zhwT7L._AC_UL600_.jpg',
    desc: 'Levíssimo (30g) com 38h de autonomia GPS e ecrã AMOLED nítido. A entrada mais inteligente no mundo dos relógios de performance — sem pagar o prémio da Garmin.',
    pros: ['Levíssimo (30g)', 'Autonomia GPS excelente para o preço', 'App Coros muito completa'],
    contras: ['Ecossistema mais pequeno que Garmin', 'Sem música offline'],
    link: 'https://www.amazon.es/s?k=coros+pace+3&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Coros Apex 2',
    rating: 4,
    preco: '~303,95 €',
    precoVerificado: true,
    badge: 'Titânio Premium',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/71IJbgttx2L._AC_UL600_.jpg',
    desc: 'Caixa em titânio com mapas offline completos e chamadas telefónicas via Bluetooth — tudo isto por quase metade do preço dos flagships equivalentes de outras marcas.',
    pros: ['Caixa em titânio robusta', 'Mapas offline incluídos', 'Excelente autonomia de bateria'],
    contras: ['App menos rica em métricas de treino', 'Ecrã menos vibrante que AMOLED'],
    link: 'https://www.amazon.es/s?k=coros+apex+2&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Suunto Race 2',
    rating: 4,
    preco: '~507,25 €',
    precoVerificado: true,
    badge: 'Regresso em Força',
    badgeColor: '#f59e0b',
    img: 'https://m.media-amazon.com/images/I/61a+qaFWsoL._AC_UL600_.jpg',
    desc: 'Hardware sólido, boa cartografia e ótima autonomia — a Suunto volta a competir de perto com Garmin e Coros neste modelo, embora com menos funcionalidades smart do dia a dia.',
    pros: ['Boa autonomia de bateria', 'Mapas e navegação sólidos', 'Ecrã AMOLED luminoso'],
    contras: ['Menos funcionalidades smart', 'UX menos refinada que a concorrência'],
    link: 'https://www.amazon.es/s?k=suunto+race+2&tag=performancerun-21',
    loja: 'Amazon ES',
  },
  {
    name: 'Garmin Instinct 3',
    rating: 4,
    preco: '~294,78 €',
    precoVerificado: true,
    badge: 'Robusto e Solar',
    badgeColor: '#8b5cf6',
    img: 'https://m.media-amazon.com/images/I/61YWK9flgBL._AC_UL600_.jpg',
    desc: 'Construção militar (MIL-STD-810) com carregamento solar — pensado para quem treina ao ar livre em todas as condições e quer nunca ficar sem bateria.',
    pros: ['Extremamente resistente', 'Carregamento solar', 'Autonomia excecional'],
    contras: ['Ecrã menos nítido (sem AMOLED)', 'Design mais volumoso'],
    link: 'https://www.amazon.es/s?k=garmin+instinct+3&tag=performancerun-21',
    loja: 'Amazon ES',
  },
]

/* ── SENSORES DE FREQUÊNCIA CARDÍACA ──────────────────────────────── */
export const sensoresFc: SensorFcProduto[] = [
  {
    name: 'Polar H10',
    tipo: 'Cinta peitoral',
    rating: 5,
    preco: 'desde ~€72',
    precoVerificado: true,
    badge: 'Padrão Ouro',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/71BEqJ5XfKL._AC_UL600_.jpg',
    desc: 'O monitor de FC mais preciso do mercado. Recomendado por laboratórios de fisiologia e usado em estudos científicos. Conectividade Bluetooth + ANT+. Compatível com Garmin, Wahoo, Suunto e todos os relógios GPS.',
    pros: ['Precisão clínica (±1 bpm)', 'Bluetooth + ANT+ dual', 'Bateria 400h', 'Compatível com todos os relógios'],
    contras: ['Cinta peitoral (menos confortável que pulso)', 'Requer gel de condução no início'],
    link: 'https://www.amazon.es/s?k=polar+h10+monitor+cardiaco&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Se treinas por zonas de FC ou fazes testes de VO2max, o H10 é insubstituível. Os sensores de pulso têm erro de ±5-10% — o H10 tem ±1 bpm.',
  },
  {
    name: 'Polar Verity Sense',
    tipo: 'Sensor de braço',
    rating: 4,
    preco: '~€102',
    precoVerificado: true,
    badge: 'Melhor Sensor Ótico',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/81Fh813r3vL._AC_UL600_.jpg',
    desc: 'Sensor ótico de braço com precisão muito superior aos sensores de pulso. Ideal para natação (IPX7), ciclismo e treino funcional. Usa luz verde de 6 LEDs para máxima precisão.',
    pros: ['Sem cinta peitoral', 'Impermeável (natação)', 'Confortável em qualquer posição', 'Memória interna 600h'],
    contras: ['Menos preciso que H10 em intervalados', 'Precisa de posicionamento correto no braço'],
    link: 'https://www.amazon.es/s?k=polar+verity+sense&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'A alternativa ao H10 para quem não quer cinta peitoral. Excelente para trail (movimento irregular) e natação.',
  },
  {
    name: 'Polar Pacer Pro',
    tipo: 'Relógio GPS',
    rating: 4,
    preco: 'desde ~€176',
    precoVerificado: true,
    badge: 'Melhor Polar Corrida',
    badgeColor: '#f59e0b',
    img: 'https://m.media-amazon.com/images/I/71ZHVSNV+LL._AC_UL600_.jpg',
    desc: 'O melhor relógio Polar para corredores. Leve (45g), GPS preciso, Running Power sem acessórios externos, análise de recuperação Nightly Recharge e estimativa de VO2max. Ecrã MIP excelente em pleno sol.',
    pros: ['Levíssimo (45g)', 'Running Power integrado', 'Nightly Recharge (HRV nocturno)', 'Excelente autonomia 35h GPS'],
    contras: ['Sem mapas', 'Ecrã não AMOLED', 'App menos rica que Garmin Connect'],
    link: 'https://www.amazon.es/s?k=polar+pacer+pro&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para quem prefere o ecossistema Polar e quer Running Power + HRV num relógio leve e acessível.',
  },
  {
    name: 'Garmin HRM-600',
    tipo: 'Cinta peitoral',
    rating: 5,
    preco: '~131,13 €',
    precoVerificado: true,
    badge: 'Melhor com Garmin',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/61VNq3XoxBL._AC_UL600_.jpg',
    desc: 'A cinta premium da Garmin (sucessora da HRM-Pro Plus) com Running Dynamics completos (oscilação vertical, tempo de contacto, comprimento da passada), dados de HRV e armazenamento de treino sem o relógio — grava e sincroniza depois.',
    pros: ['Running Dynamics completos', 'Grava treino sem relógio por perto', 'Integração perfeita com Garmin Connect'],
    contras: ['Preço elevado para uma cinta', 'Menos versátil fora do ecossistema Garmin'],
    link: 'https://www.amazon.es/s?k=garmin+hrm-600&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para quem já tem um relógio Garmin e quer o máximo de dados de técnica de corrida (running dynamics) sem comprar acessórios extra.',
  },
  {
    name: 'Wahoo TICKR FIT',
    tipo: 'Sensor de braço',
    rating: 4,
    preco: '~70,09 €',
    precoVerificado: true,
    badge: 'Melhor Custo/Benefício',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/81KoPr7MfgL._AC_UL600_.jpg',
    desc: 'Sensor ótico de braço fiável e acessível, com boa precisão e compatibilidade universal Bluetooth + ANT+. A escolha lógica para quem quer sair da precisão do pulso sem usar cinta peitoral.',
    pros: ['Preço muito competitivo', 'Bluetooth + ANT+ dual', 'Sem cinta peitoral'],
    contras: ['Sem running dynamics avançados', 'Precisa de posicionamento correto no braço'],
    link: 'https://www.amazon.es/s?k=wahoo+tickr+fit&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'A porta de entrada mais barata para treinar por zonas de FC com precisão real, sem comprometer compatibilidade.',
    bestseller: true,
  },
  {
    name: 'Coospo H9Z',
    tipo: 'Sensor recarregável',
    rating: 4,
    preco: '~50,81 €',
    precoVerificado: true,
    badge: 'Alternativa Sem Cinta',
    badgeColor: '#8b5cf6',
    img: 'https://m.media-amazon.com/images/I/71hKgtJDtGL._AC_UL600_.jpg',
    desc: 'Sensor de frequência cardíaca recarregável (sem pilhas) com boa precisão em esforços contínuos. Uma alternativa acessível ao Polar Verity Sense para quem não gosta de cinta peitoral.',
    pros: ['Recarregável (sem trocar pilhas)', 'Bluetooth + ANT+ dual', 'Preço acessível'],
    contras: ['Menos preciso em intervalados curtos', 'App menos polida que Polar/Garmin'],
    link: 'https://www.amazon.es/s?k=coospo+h9z+heart+rate&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Opção intermédia entre o conforto de um sensor de braço e um preço mais acessível que o Verity Sense.',
  },
]

/* ── NUTRIÇÃO PARA CORREDORES ──────────────────────────────────────── */
export const nutricao: NutricaoProduto[] = [
  {
    name: 'SiS Beta Fuel Gel',
    tipo: 'Gel de energia',
    rating: 5,
    preco: '~€3,5',
    precoVerificado: true,
    badge: "Editor's Choice",
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51Fm2ion7tL._AC_UL600_.jpg',
    desc: 'O gel mais avançado do mercado. 40g de carboidratos com tecnologia de duplo transportador (glicose + frutose 2:1). Absorção máxima sem desconforto gastrointestinal. Usado pela elite mundial de trail e maratona.',
    pros: ['40g CHO por gel', 'Sem problemas GI', 'Sabor neutro', 'Testado em laboratório'],
    contras: ['Preço elevado por gel', 'Textura espessa para alguns'],
    link: 'https://www.amazon.es/s?k=sis+beta+fuel+gel&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para corridas >90 min, o Beta Fuel é o gel com maior density de carbos e menor risco de problemas de estômago. Indispensável para maratona e ultra.',
  },
  {
    name: 'Maurten Gel 100',
    tipo: 'Gel de energia',
    rating: 5,
    preco: '~€4,5',
    precoVerificado: true,
    badge: 'Preferido da Elite',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/710vQKAUK4L._AC_UL600_.jpg',
    desc: 'Tecnologia Hydrogel — forma um gel no estômago que liberta energia de forma constante. Sem cor, sem sabor artificial, sem adoçantes. O gel de Kipchoge e Eliud. 25g de CHO em formato ultra-digerível.',
    pros: ['Tecnologia Hydrogel patenteada', 'Zero problemas digestivos', 'Limpo (sem aditivos)', 'Absorção contínua'],
    contras: ['O mais caro do mercado', 'Só 25g CHO por gel'],
    link: 'https://www.amazon.es/s?k=maurten+gel+100&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para quem tem estômago sensível ou quer o que a elite mundial usa. A tecnologia Hydrogel elimina o risco de mal-estar mesmo no calor.',
  },
  {
    name: 'SiS Go Electrolyte',
    tipo: 'Isotónico em pó',
    rating: 5,
    preco: '~€25 (500g)',
    precoVerificado: true,
    badge: 'Melhor Valor',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51MbTHkesML._AC_UL600_.jpg',
    desc: 'Bebida isotónica científica com 36g CHO por 500ml + eletrólitos completos (sódio, potássio, cálcio, magnésio). Fórmula isotónica real — não apenas "sais". O favorito dos triatletas e corredores de fundo.',
    pros: ['Fórmula isotónica equilibrada', 'Eletrólitos completos', '~50 doses por embalagem', 'Vários sabores'],
    contras: ['Precisa de misturar em pó', 'Volume a transportar'],
    link: 'https://www.amazon.es/s?k=sis+go+electrolyte+powder&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'A melhor relação qualidade/preço em isotónicos. Cobre hidratação + energia + eletrólitos numa só bebida para treinos >1h ou no calor.',
  },
  {
    name: 'GU Energy Gel',
    tipo: 'Gel de energia',
    rating: 4,
    preco: '~€2,5',
    precoVerificado: true,
    badge: 'Melhor Entrada',
    badgeColor: '#f59e0b',
    img: 'https://m.media-amazon.com/images/I/61vYkvVMeTL._AC_UL600_.jpg',
    desc: 'O gel mais popular do mundo com 20+ anos de história. 21g CHO, aminoácidos de cadeia ramificada (BCAAs) e opções com cafeína. Textura suave, fácil de ingerir. Disponível em 30+ sabores.',
    pros: ['Preço acessível', '30+ sabores', 'BCAAs incluídos', 'Com/sem cafeína'],
    contras: ['21g CHO apenas', 'Pode causar GI em alguns'],
    link: 'https://www.amazon.es/s?k=gu+energy+gel+running&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'O gel ideal para começar a usar nutrição em corrida. Acessível, eficaz e amplamente disponível em todas as lojas de desporto.',
  },
  {
    name: 'High5 Zero Electrolyte',
    tipo: 'Comprimidos eletrólitos',
    rating: 4,
    preco: '~€8 (20 comprimidos)',
    precoVerificado: true,
    badge: 'Hidratação Trail',
    badgeColor: '#8b5cf6',
    img: 'https://m.media-amazon.com/images/I/71h2CgX35JL._AC_UL600_.jpg',
    desc: 'Comprimidos efervescentes de eletrólitos sem carboidratos. Perfeitos para treinos de baixa intensidade, recuperação hidratante e calor. Sódio, magnésio, potássio e vitamina C num formato ultra-portátil.',
    pros: ['Ultra-portátil', 'Sem açúcar', 'Dissolve em segundos', 'Cobre cãibras musculares'],
    contras: ['Sem energia (só sais)', 'Sabor artificial'],
    link: 'https://www.amazon.es/s?k=high5+zero+electrolyte+tablets&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para trail no verão ou após treinos longos. Os comprimidos de eletrólitos previnem cãibras e fadiga prematura causada pela desidratação mineral.',
  },
  {
    name: 'Whey Proteína Isolada',
    tipo: 'Recuperação muscular',
    rating: 5,
    preco: '~€45 (1kg)',
    precoVerificado: true,
    badge: 'Essencial Pós-Treino',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/71UJkg2rO2L._AC_UL600_.jpg',
    desc: 'Proteína isolada de soro de leite com 90%+ proteína, absorção rápida e aminoácidos completos. Fundamental para reparação muscular após sessões longas ou intensivas. A janela de recuperação: 30-60 min após o treino.',
    pros: ['Absorção rápida (30 min)', 'BCAA e EAA completos', 'Alto teor proteico (25g/dose)', 'Previne catabolismo muscular'],
    contras: ['Origem animal (não vegan)', 'Lactose residual na whey concentrada'],
    link: 'https://www.amazon.es/s?k=whey+protein+isolate+running+recovery&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Corredores ignoram a proteína pós-treino e pagam em lesões e falta de progressão. 25g de whey nas primeiras horas pós-treino acelera a recuperação muscular em 30-40%.',
  },
  {
    name: 'Powerbar PowerGel Hydro',
    tipo: 'Gel de energia',
    rating: 5,
    preco: '~42,48 € (24 uni.)',
    precoVerificado: true,
    badge: 'Alto Sódio',
    badgeColor: '#ef4444',
    img: 'https://m.media-amazon.com/images/I/81F1wbR0e6L._AC_UL600_.jpg',
    desc: 'Gel de fórmula hidro (mais líquido, fácil de ingerir sem água) com carboidratos e sódio pensados para quem transpira muito ou treina em calor, sem sensação pastosa.',
    pros: ['Textura hidro fácil de ingerir', 'Sódio adicionado', 'Sabor limpo e pouco doce'],
    contras: ['Menos concentrado que géis "performance"', 'Embalagem maior para transportar'],
    link: 'https://www.amazon.es/s?k=powerbar+powergel+hydro&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Se transpiras muito sódio (marcas brancas na roupa após o treino), este gel hidro repõe sais sem a textura pastosa dos géis tradicionais.',
    bestseller: true,
  },
  {
    name: 'Precision Fuel & Hydration PF 30 Gel',
    tipo: 'Gel de energia',
    rating: 5,
    preco: '~25,01 €',
    precoVerificado: true,
    badge: 'Baseado em Dados',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/81P0Cw75KAL._AC_UL600_.jpg',
    desc: 'Da marca criada por cientistas que desenvolveram os testes de suor usados por equipas profissionais. 30g de CHO em rácio 2:1, pensado para se integrar num plano de nutrição individualizado.',
    pros: ['Rácio 2:1 glicose:frutose', 'Marca respaldada por investigação científica', 'Baixo risco de desconforto GI'],
    contras: ['Preço médio-alto', 'Gama de sabores mais limitada'],
    link: 'https://www.amazon.es/s?k=precision+fuel+hydration+pf30+gel&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Ideal para quem quer testar o seu perfil de suor (a marca vende testes de sódio) e ajustar a nutrição à sua fisiologia específica.',
  },
  {
    name: 'Dextro Energy Long Distance Gel',
    tipo: 'Gel de energia',
    rating: 4,
    preco: '~24,28 € (12 uni.)',
    precoVerificado: true,
    badge: 'Opção Natural',
    badgeColor: '#8b5cf6',
    img: 'https://m.media-amazon.com/images/I/71vtf+G0UdL._AC_UL600_.jpg',
    desc: 'Gel pensado para esforços prolongados e intensos, com fórmula simples e reconhecível. Boa alternativa para quem prefere ingredientes mais básicos sem abdicar de carboidratos rápidos.',
    pros: ['Ingredientes simples', 'Sabor agradável', 'Boa opção para estômagos sensíveis a aditivos'],
    contras: ['Menos carboidratos por dose que géis "performance"', 'Textura mais líquida'],
    link: 'https://www.amazon.es/s?k=dextro+energy+long+distance+gel&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para quem quer evitar aditivos artificiais mas continua a precisar de energia rápida em treinos e provas mais curtas.',
  },
  {
    name: 'Nuun Sport Electrolyte Tablets',
    tipo: 'Comprimidos eletrólitos',
    rating: 5,
    preco: '~24,99 € (tubo 10 uni.)',
    precoVerificado: true,
    badge: 'Mais Vendido Amazon',
    badgeColor: '#00ff87',
    img: 'https://m.media-amazon.com/images/I/51CkzocZ7LL._AC_UL600_.jpg',
    desc: 'Um dos produtos de hidratação mais vendidos da Amazon globalmente. Comprimidos efervescentes com eletrólitos completos e baixo teor de açúcar — dissolvem-se em água em segundos.',
    pros: ['Best-seller consistente na Amazon', 'Baixo em açúcar', 'Muitos sabores disponíveis', 'Ultra-portátil'],
    contras: ['Sem carboidratos suficientes para energia', 'Efervescência pode não agradar a todos'],
    link: 'https://www.amazon.es/s?k=nuun+sport+electrolyte+tablets&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'A escolha mais popular para hidratação diária e em treinos de calor, sem os açúcares de um isotónico tradicional.',
    bestseller: true,
  },
  {
    name: 'Clif Bloks Energy Chews',
    tipo: 'Gomas energéticas',
    rating: 4,
    preco: '~24,00 € (6 uni.)',
    precoVerificado: true,
    badge: 'Alternativa ao Gel',
    badgeColor: '#f59e0b',
    img: 'https://m.media-amazon.com/images/I/61Toba0XLIL._AC_UL600_.jpg',
    desc: 'Gomas mastigáveis com carboidratos de absorção rápida e cafeína opcional. Para quem enjoa da textura dos géis mas quer o mesmo boost de energia em corrida.',
    pros: ['Textura agradável (alternativa ao gel)', 'Dose controlável (goma a goma)', 'Opções com/sem cafeína'],
    contras: ['Mais lento a ingerir do que um gel', 'Precisa de água para mastigar bem em esforço'],
    link: 'https://www.amazon.es/s?k=clif+bloks+energy+chews&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Para quem já não aguenta a textura dos géis em provas longas — mesma energia, formato diferente.',
  },
  {
    name: 'Creatina Monohidratada',
    tipo: 'Suplemento de força',
    rating: 5,
    preco: '~28,50 € (270 caps.)',
    precoVerificado: true,
    badge: 'Recuperação e Força',
    badgeColor: '#3b82f6',
    img: 'https://m.media-amazon.com/images/I/61XxubPCzRL._AC_UL600_.jpg',
    desc: 'Um dos suplementos mais estudados cientificamente. Cada vez mais usado por corredores de fundo (não só por atletas de força) para apoiar a recuperação muscular e a capacidade de treino de alta intensidade.',
    pros: ['Amplamente estudado e seguro', 'Apoia recuperação entre sessões duras', 'Preço muito baixo por dose'],
    contras: ['Pode causar retenção ligeira de água inicial', 'Benefício mais notório em sessões de força/velocidade'],
    link: 'https://www.amazon.es/s?k=creatina+monohidratada+running&tag=performancerun-21',
    loja: 'Amazon ES',
    porque: 'Complemento barato e bem documentado para corredores que também fazem treino de força ou séries de velocidade.',
  },
]

/* ── ACESSÓRIOS ESSENCIAIS ─────────────────────────────────────────── */
export const acessorios: AcessorioProduto[] = [
  {
    name: 'Compressport Pro Racing Socks',
    tipo: 'Meias técnicas',
    preco: '~€20',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/71MaXjnAbtL._AC_UL600_.jpg',
    desc: 'Meias de corrida da marca suíça de referência no trail e maratona. Anti-bolhas, compressão progressiva, secagem rápida. Usadas por atletas de elite.',
    link: 'https://www.amazon.es/s?k=compressport+calcetines+running+trail&tag=performancerun-21',
  },
  {
    name: 'Nathan SpeedDraw Plus',
    tipo: 'Garrafa de mão',
    preco: '~€25',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/61VtZS9Jw0L._AC_UL600_.jpg',
    desc: '530ml com bolso para gel e telemóvel. Indispensável para trail curto e treinos >1h.',
    link: 'https://www.amazon.es/s?k=nathan+speeddraw+handheld&tag=performancerun-21',
  },
  {
    name: 'Salomon Active Skin 8',
    tipo: 'Mochila hidratação',
    preco: 'desde ~€84',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/81+6ITtBijL._AC_UL600_.jpg',
    desc: '8L com 1.5L de hidratação. Ajuste perfeito sem movimento. A escolha dos pros no trail.',
    link: 'https://www.amazon.es/s?k=salomon+active+skin+8&tag=performancerun-21',
  },
  {
    name: 'Buff Original',
    tipo: 'Bandana multifunções',
    preco: '~13,16 €',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/51pTiy7SajL._AC_UL600_.jpg',
    desc: 'A bandana tubular mais vendida do mundo do outdoor. Protege do sol, do frio e do vento em 12+ formas de uso diferentes.',
    link: 'https://www.amazon.es/s?k=buff+original+running&tag=performancerun-21',
    bestseller: true,
  },
  {
    name: 'TriggerPoint GRID Foam Roller',
    tipo: 'Recuperação muscular',
    preco: '~45,65 €',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/71AK-KclJaL._AC_UL600_.jpg',
    desc: 'O foam roller de referência para libertação miofascial. Núcleo rígido com espuma texturizada que simula as mãos de um massagista.',
    link: 'https://www.amazon.es/s?k=triggerpoint+grid+foam+roller&tag=performancerun-21',
  },
  {
    name: 'Theragun Prime',
    tipo: 'Massajador percussivo',
    preco: '~298,02 €',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/71wEIE2CsOL._AC_UL600_.jpg',
    desc: 'Um dos massajadores percussivos mais premiados do mercado. Reduz a rigidez muscular pós-treino e acelera a recuperação entre sessões duras.',
    link: 'https://www.amazon.es/s?k=theragun+prime&tag=performancerun-21',
  },
  {
    name: 'Varta Indestructible H30 Pro',
    tipo: 'Lanterna frontal',
    preco: '~20,32 €',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/81883I5MUcL._AC_UL600_.jpg',
    desc: 'Lanterna frontal COB LED resistente à água e a choques, com longa autonomia — essencial para treinos de trail ao amanhecer, ao final do dia ou em provas noturnas.',
    link: 'https://www.amazon.es/s?k=varta+indestructible+h30+pro&tag=performancerun-21',
  },
  {
    name: 'Camelbak Ultra Belt',
    tipo: 'Cinto de hidratação',
    preco: '~50,82 €',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/61PcDVXPuSL._AC_UL600_.jpg',
    desc: 'Cinto leve com flasks incluídos e bolsos para gel e telemóvel. Alternativa mais discreta à mochila para treinos até 90 minutos.',
    link: 'https://www.amazon.es/s?k=camelbak+ultra+belt&tag=performancerun-21',
  },
  {
    name: 'Oakley Radar EV Path',
    tipo: 'Óculos de sol desportivos',
    preco: '~157,81 €',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/51AHEH3N1lL._AC_UL600_.jpg',
    desc: 'Os óculos mais usados pela elite do atletismo mundial. Lente Prizm de alta definição e encaixe que não desliza mesmo com transpiração intensa.',
    link: 'https://www.amazon.es/s?k=oakley+radar+ev+path&tag=performancerun-21',
  },
  {
    name: 'Black Diamond Distance Carbon Z',
    tipo: 'Bastões de trekking',
    preco: '~145,02 €',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/510CwXI7F2L._AC_UL600_.jpg',
    desc: 'Bastões de carbono ultraleves e dobráveis, essenciais em ultra trail com muito desnível — poupam energia significativa nas subidas longas.',
    link: 'https://www.amazon.es/s?k=black+diamond+distance+carbon+z&tag=performancerun-21',
  },
  {
    name: 'BodyGlide Original Anti-Chafe',
    tipo: 'Anti-atrito',
    preco: '~35,48 €',
    precoVerificado: true,
    img: 'https://m.media-amazon.com/images/I/51rS753f8VL._AC_UL600_.jpg',
    desc: 'O bálsamo anti-atrito de referência mundial. Previne assaduras e bolhas em longas distâncias — indispensável em maratona e ultra trail.',
    link: 'https://www.amazon.es/s?k=bodyglide+original+anti+chafe&tag=performancerun-21',
  },
]
