/**
 * Inventário de produtos da página /equipamento, do comparador de
 * sapatilhas e dos blocos de parceiro i-Run.
 * ------------------------------------------------------------------
 * 2026-11-18 — TUDO DA i-RUN (decisão do Pedro: nada da Amazon).
 * Cada produto tem um deep link gerado no painel publisher.kwanko.com
 * (campanha i-Run PT P79921, site SA580541) em `linkIrun` (e `link`).
 * Preços e imagens lidos a 18/11/2026 na ficha real de cada produto no
 * i-run.pt (preço do modelo que abre por defeito; "desde" quando varia com
 * a cor ou a versão). Os produtos que a i-Run não vende foram substituídos
 * por equivalentes da i-Run, confirmados no feed de produtos da Kwanko.
 * Os preços mudam (promoções, stock): voltar a confirmar na i-Run antes de
 * mudar `preco`, nunca estimar.
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
  /** Deep link i-Run gerado no painel Kwanko (campanha i-Run PT P79921). Quando existe, passa a ser o único botão de compra. */
  linkIrun?: string
  /** Desconto mostrado pela própria i-Run na ficha ("Está a poupar N%"), lido a 2026-11-18. Só preencher com o valor da i-Run. */
  desconto?: number
  /** Preço de venda recomendado pela marca, em €, tal como aparece na ficha da i-Run (2026-11-18). */
  pvp?: number
  loja: string
  bestseller?: boolean
  /**
   * Marca este sapato como elegível para o bloco "Novidade do Dia" da
   * página /equipamento — lançamentos ou modelos em forte tendência em
   * 2026 (ver função getNovidadeDoDia em app/equipamento/page.tsx).
   * O texto é a etiqueta curta mostrada no hero (ex: "Lançamento 2026").
   */
  novidade?: string
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
  /** Deep link i-Run gerado no painel Kwanko (campanha i-Run PT P79921). Quando existe, passa a ser o único botão de compra. */
  linkIrun?: string
  /** Desconto mostrado pela própria i-Run na ficha ("Está a poupar N%"), lido a 2026-11-18. Só preencher com o valor da i-Run. */
  desconto?: number
  /** Preço de venda recomendado pela marca, em €, tal como aparece na ficha da i-Run (2026-11-18). */
  pvp?: number
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
  /** Deep link i-Run gerado no painel Kwanko (campanha i-Run PT P79921). Quando existe, passa a ser o único botão de compra. */
  linkIrun?: string
  /** Desconto mostrado pela própria i-Run na ficha ("Está a poupar N%"), lido a 2026-11-18. Só preencher com o valor da i-Run. */
  desconto?: number
  /** Preço de venda recomendado pela marca, em €, tal como aparece na ficha da i-Run (2026-11-18). */
  pvp?: number
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
  /** Deep link i-Run gerado no painel Kwanko (campanha i-Run PT P79921). Quando existe, passa a ser o único botão de compra. */
  linkIrun?: string
  /** Desconto mostrado pela própria i-Run na ficha ("Está a poupar N%"), lido a 2026-11-18. Só preencher com o valor da i-Run. */
  desconto?: number
  /** Preço de venda recomendado pela marca, em €, tal como aparece na ficha da i-Run (2026-11-18). */
  pvp?: number
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
  /** Deep link i-Run gerado no painel Kwanko (campanha i-Run PT P79921). Quando existe, passa a ser o único botão de compra. */
  linkIrun?: string
  /** Desconto mostrado pela própria i-Run na ficha ("Está a poupar N%"), lido a 2026-11-18. Só preencher com o valor da i-Run. */
  desconto?: number
  /** Preço de venda recomendado pela marca, em €, tal como aparece na ficha da i-Run (2026-11-18). */
  pvp?: number
  bestseller?: boolean
}

/* ── SAPATOS DE CORRIDA ────────────────────────────────────────────── */
export const sapatos: SapatoProduto[] = [
  {
    name: 'HOKA Clifton 10',
    categoria: 'Estrada',
    rating: 5,
    preco: 'desde ~118 €',
    precoVerificado: true,
    badge: 'Editor\'s Choice',
    badgeColor: '#00ff87',
    img: 'https://photo.i-run.fr/hoka-one-one-clifton-10-chaussures-homme-840098-1-z.jpg',
    desc: 'A 10.ª edição da sapatilha de treino diário mais popular da HOKA. Amortecimento leve e muito confortável para rodagens de todas as distâncias; na ficha da i-Run aparece com 260 g (homem).',
    pros: ['Amortecimento confortável e leve', 'Serve para todas as distâncias', 'Polivalente para treino diário'],
    contras: ['Pouco reativa para séries rápidas', 'Preço varia com a cor e o tamanho'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fhoka%2FClifton-10_fiche_144262.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fhoka%2FClifton-10_fiche_144262.html',
    loja: 'i-Run',
    desconto: 26,
    pvp: 160,
  },
  {
    name: 'On Cloudmonster 2',
    categoria: 'Estrada',
    rating: 4,
    preco: '~115,00 €',
    precoVerificado: true,
    badge: 'Premium Pick',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/on-running-cloudmonster-2-chaussures-homme-759535-1-z.jpg',
    desc: 'Tecnologia CloudTec de nova geração. Transição suave com retorno energético elevado. Perfeito para treinos longos e semi-maratona.',
    pros: ['Retorno energético elevado', 'Design premium', 'Respirabilidade'],
    contras: ['Adaptação necessária', 'Caro'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fon-running%2FCloudmonster-2_fiche_136633.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fon-running%2FCloudmonster-2_fiche_136633.html',
    loja: 'i-Run',
    desconto: 39,
    pvp: 190,
  },
  {
    name: 'ASICS Novablast 5',
    categoria: 'Estrada',
    rating: 5,
    preco: '~125,00 €',
    precoVerificado: true,
    badge: 'Mais Vendido',
    badgeColor: '#00ff87',
    img: 'https://photo.i-run.fr/asics-novablast-5-chaussures-homme-854332-1-z.jpg',
    desc: 'Líder de vendas em 2026 no segmento de amortecimento máximo. Espuma FF Blast+ Eco com retorno energético elevado e uma transição de passada surpreendentemente ágil para uma sapatilha tão macia.',
    pros: ['Retorno energético muito acima da concorrência', 'Leve para a categoria', 'Verstátil (treino e ritmos rápidos)'],
    contras: ['Menos estável em curvas fechadas', 'Durabilidade da sola inferior a rivais'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fasics%2FNovablast-5_fiche_142960.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fasics%2FNovablast-5_fiche_142960.html',
    loja: 'i-Run',
    bestseller: true,
    novidade: 'Mais Vendido 2026',
    desconto: 16,
    pvp: 150,
  },
  {
    name: 'Nike Vomero Plus',
    categoria: 'Estrada',
    rating: 5,
    preco: '~130,00 €',
    precoVerificado: true,
    badge: 'Tendência 2026',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/nike-vomero-plus-chaussures-homme-882002-1-z.jpg',
    desc: 'Chegou ao topo das vendas em 2026, destronando a Novablast 5. Espuma ZoomX de stack alta pensada para quilómetros longos com uma sensação premium de "andar em nuvens".',
    pros: ['Amortecimento topo de gama (ZoomX)', 'Excelente para longos e recuperação', 'Upper muito respirável'],
    contras: ['Preço elevado', 'Menos responsiva em ritmos rápidos'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FVomero-Plus_fiche_145032.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FVomero-Plus_fiche_145032.html',
    loja: 'i-Run',
    bestseller: true,
    novidade: 'Lançamento 2026',
    desconto: 27,
    pvp: 180,
  },
  {
    name: 'Nike Pegasus 41',
    categoria: 'Estrada',
    rating: 4,
    preco: '~112,00 €',
    precoVerificado: true,
    badge: 'Clássico Versátil',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/nike-pegasus-41-chaussures-homme-733731-1-z.jpg',
    desc: 'O treinador diário mais vendido de sempre da Nike. Equilíbrio perfeito entre amortecimento, resposta e durabilidade — a escolha segura para quem quer um único par para (quase) tudo.',
    pros: ['Extremamente versátil', 'Durável e consistente', 'Preço competitivo para o segmento'],
    contras: ['Nada se destaca em particular', 'Drop de 10mm pode não agradar a todos'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FPegasus-41_fiche_141717.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FPegasus-41_fiche_141717.html',
    loja: 'i-Run',
    desconto: 20,
    pvp: 140,
  },
  {
    name: 'Salomon Speedcross 6',
    categoria: 'Trail',
    rating: 5,
    preco: '~120,00 €',
    precoVerificado: true,
    badge: 'Trail Best',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/salomon-speedcross-6-chaussures-homme-837684-1-z.jpg',
    desc: 'O rei do trail técnico. Grip agressivo para terrenos enlameados e pedregosos. Proteção superior com leveza competitiva.',
    pros: ['Grip imbatível em lama', 'Proteção da sola', 'Cabedal resistente'],
    contras: ['Firme em alcatrão', 'Stack baixa'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fsalomon%2FSpeedcross-6_fiche_141202.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fsalomon%2FSpeedcross-6_fiche_141202.html',
    loja: 'i-Run',
    desconto: 20,
    pvp: 150,
  },
  {
    name: 'HOKA Mafate 5',
    categoria: 'Trail',
    rating: 5,
    preco: '~130,00 €',
    precoVerificado: true,
    badge: 'Líder de Vendas Trail',
    badgeColor: '#00ff87',
    img: 'https://photo.i-run.fr/hoka-one-one-mafate--5-chaussures-homme-879076-1-z.jpg',
    desc: 'Sapatilha de trail de amortecimento máximo da HOKA — líder das vendas de trail em 2026. Pensada para ultra distâncias em terreno técnico sem sacrificar proteção nem estabilidade.',
    pros: ['Amortecimento máximo para ultra trail', 'Placa de proteção contra pedras', 'Estabilidade em descidas técnicas'],
    contras: ['Peso elevado', 'Stack alta pode reduzir sensibilidade ao terreno'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fhoka%2FMafate-5_fiche_144983.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fhoka%2FMafate-5_fiche_144983.html',
    loja: 'i-Run',
    bestseller: true,
    novidade: 'Líder Trail 2026',
    desconto: 31,
    pvp: 190,
  },
  {
    name: 'La Sportiva Bushido III',
    categoria: 'Trail',
    rating: 4,
    preco: '~140,00 €',
    precoVerificado: true,
    badge: 'Precisão Técnica',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/la-sportiva-bushido-iii-chaussures-de-sport-femme-885245-1-z.jpg',
    desc: 'Referência italiana em trail técnico e vertical. Encaixe cirúrgico tipo "segunda pele" com grip Vibram Megagrip para máxima aderência em rocha e raízes.',
    pros: ['Sensibilidade ao terreno excelente', 'Grip Vibram de topo', 'Muito leve para a proteção que oferece'],
    contras: ['Encaixe estreito', 'Menos amortecimento para longas distâncias'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fmulher%2Fcalcados%2Ftrail-running%2Fla-sportiva%2FBushido-III_fiche_139117.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fmulher%2Fcalcados%2Ftrail-running%2Fla-sportiva%2FBushido-III_fiche_139117.html',
    loja: 'i-Run',
    desconto: 20,
    pvp: 175,
  },
  {
    name: 'New Balance Fresh Foam X Hierro v9',
    categoria: 'Trail',
    rating: 4,
    preco: '~118,00 €',
    precoVerificado: true,
    badge: 'Em Alta',
    badgeColor: '#8b5cf6',
    img: 'https://photo.i-run.fr/new-balance-fresh-foam-x-hierro-v9-chaussures-homme-846705-1-z.jpg',
    desc: 'Entrou com força no top de vendas de trail em 2026. Espuma Fresh Foam X macia combinada com sola Vibram para um equilíbrio raro entre conforto e aderência técnica.',
    pros: ['Conforto de longa distância', 'Boa aderência em terreno misto', 'Encaixe amplo (bom para pés largos)'],
    contras: ['Menos agressiva em lama profunda', 'Durabilidade da sola mediana'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fnew-balance%2FFresh-Foam-X-Hierro-V9_fiche_143489.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fnew-balance%2FFresh-Foam-X-Hierro-V9_fiche_143489.html',
    loja: 'i-Run',
    novidade: 'Em Alta 2026',
    desconto: 26,
    pvp: 160,
  },
  {
    name: 'Nike Vaporfly 3',
    categoria: 'Competição',
    rating: 5,
    preco: '~135,00 €',
    precoVerificado: true,
    badge: 'Mais Rápido',
    badgeColor: '#ef4444',
    img: 'https://photo.i-run.fr/nike-zoomx-vaporfly-next-3-chaussures-homme-724224-1-z.jpg',
    desc: 'A placa de carbono mais eficiente do mercado. Sub-4:00/km com conforto. O sapato dos recordes mundiais de maratona.',
    pros: ['Velocidade máxima', 'Placa de carbono ZoomX', 'Leve (238g)'],
    contras: ['Exclusivo para competição', 'Durabilidade limitada (300 km)', 'Preço proibitivo'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FZoomX-Vaporfly-Next--3_fiche_139772.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FZoomX-Vaporfly-Next--3_fiche_139772.html',
    loja: 'i-Run',
    desconto: 48,
    pvp: 260,
  },
  {
    name: 'Nike Alphafly 3',
    categoria: 'Competição',
    rating: 5,
    preco: '~220,00 €',
    precoVerificado: true,
    badge: 'Topo de Gama',
    badgeColor: '#ef4444',
    img: 'https://photo.i-run.fr/nike-air-zoom-alphafly-next--3-chaussures-homme-874565-1-z.jpg',
    desc: 'A opção mais propulsiva da Nike para maratona — stack alta de espuma ZoomX com placa de carbono de comprimento total. Ajuda a manter o ritmo mesmo nos últimos quilómetros de fadiga.',
    pros: ['Ride extremamente propulsivo', 'Excelente nos últimos km da maratona', 'Ventilação de série no upper'],
    contras: ['O mais caro da categoria', 'Curva de adaptação (sensação "instável" inicialmente)'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FAir-Zoom-Alphafly-Next--3_fiche_138328.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FAir-Zoom-Alphafly-Next--3_fiche_138328.html',
    loja: 'i-Run',
    bestseller: true,
    novidade: 'Topo de Gama 2026',
    desconto: 29,
    pvp: 310,
  },
  {
    name: 'Adidas Adizero Adios Pro 4',
    categoria: 'Competição',
    rating: 5,
    preco: '~179,00 €',
    precoVerificado: true,
    badge: 'Grip Superior',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/adidas-adizero-adios-pro-4-chaussures-homme-834603-1-z.jpg',
    desc: 'Mais leve e com melhor tração que a geração anterior. As barras de carbono "Energy Rods" oferecem uma resposta explosiva sem perder estabilidade lateral.',
    pros: ['Excelente tração em pisos molhados', 'Mais leve que a Pro 3', 'Boa relação estabilidade/velocidade'],
    contras: ['Amortecimento mais firme que rivais', 'Preço elevado'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fadidas%2Fadizero-Adios-Pro-4_fiche_142982.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fadidas%2Fadizero-Adios-Pro-4_fiche_142982.html',
    loja: 'i-Run',
    novidade: 'Nova Geração 2026',
    desconto: 28,
    pvp: 250,
  },
  {
    name: 'ASICS Novablast 6',
    categoria: 'Estrada',
    rating: 5,
    preco: '~125,00 €',
    precoVerificado: true,
    badge: 'Novo 2026',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/asics-novablast-6-chaussures-homme-885508-1-z.jpg',
    desc: 'O lançamento mais aguardado do verão de 2026. Sucede à Novablast 5 (líder de vendas) com espuma FF Blast MAX mais macia e reativa, e geometria refinada para transições ainda mais fluidas.',
    pros: ['Espuma nova geração (FF Blast MAX)', 'Sucessora do best-seller de 2026', 'Versátil: treino diário e ritmos'],
    contras: ['Preço de lançamento elevado', 'Entrega pode demorar (stock inicial)'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fasics%2FNovablast-6_fiche_147450.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fasics%2FNovablast-6_fiche_147450.html',
    loja: 'i-Run',
    desconto: 21,
    pvp: 160,
  },
  {
    name: 'Nike Pegasus 42',
    categoria: 'Estrada',
    rating: 4,
    preco: '~140,00 €',
    precoVerificado: true,
    badge: 'Novo 2026',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/nike-pegasus-42-chaussures-homme-893832-1-z.jpg',
    desc: 'A 42ª geração do treinador diário mais vendido de sempre, lançada em março de 2026. ReactX no midsole com dupla unidade Air Zoom — o Pegasus mais amortecido até hoje sem perder o carácter ágil.',
    pros: ['Espuma ReactX mais durável', 'Fiabilidade lendária do Pegasus', 'Bom preço para a categoria'],
    contras: ['Mais pesado que rivais diretos', 'Sem grandes revoluções vs. 41'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FPegasus-42_fiche_146443.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fnike%2FPegasus-42_fiche_146443.html',
    loja: 'i-Run',
  },
  {
    name: 'ASICS Gel-Nimbus 28',
    categoria: 'Estrada',
    rating: 5,
    preco: '~135,00 €',
    precoVerificado: true,
    badge: 'Novo 2026',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/asics-gel-nimbus-28-chaussures-homme-847208-1-z.jpg',
    desc: 'O topo de gama de conforto da ASICS, renovado em janeiro de 2026. FF Blast PLUS ECO e PureGEL para amortecimento máximo em quilómetros longos e recuperação — referência da categoria maximalista.',
    pros: ['Conforto de referência da categoria', 'Estabilidade excelente para stack alto', 'Durabilidade acima da média'],
    contras: ['Pesada para ritmos rápidos', 'Preço premium'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fasics%2FGel-Nimbus-28_fiche_145675.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fasics%2FGel-Nimbus-28_fiche_145675.html',
    loja: 'i-Run',
    desconto: 32,
    pvp: 200,
  },
  {
    name: 'On Cloudmonster 3',
    categoria: 'Estrada',
    rating: 4,
    preco: '~143,00 €',
    precoVerificado: true,
    badge: 'Novo 2026',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/on-running-cloudmonster-3-chaussures-homme-844492-1-z.jpg',
    desc: 'Terceira geração do "monstro" da On, lançada em março de 2026. CloudTec de células maiores com espuma Helion mais leve — máximo retorno energético da marca suíça para treinos longos.',
    pros: ['Retorno energético topo da marca', 'Design premium inconfundível', 'Rocker agressivo ajuda em longos'],
    contras: ['Preço muito elevado', 'Estética divisiva'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fon-running%2FCloudmonster-3_fiche_146463.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fon-running%2FCloudmonster-3_fiche_146463.html',
    loja: 'i-Run',
    desconto: 28,
    pvp: 200,
  },
  {
    name: 'HOKA Speedgoat 7',
    categoria: 'Trail',
    rating: 5,
    preco: '~120,00 €',
    precoVerificado: true,
    badge: 'Novo 2026',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/hoka-one-one-speedgoat-7-chaussures-homme-879095-1-z.jpg',
    desc: 'A sapatilha de trail mais vendida do mundo, renovada em fevereiro de 2026. Vibram Megagrip com lugs de 5mm, upper mais resistente e espuma CMEVA revista — a referência para ultra e montanha.',
    pros: ['Tração Vibram de referência', 'Amortecimento generoso para ultras', 'Historial comprovado em UTMB'],
    contras: ['Menos ágil em trilhos técnicos rápidos', 'Largura pode ser justa para alguns pés'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fhoka%2FSpeedgoat-7_fiche_146376.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fhoka%2FSpeedgoat-7_fiche_146376.html',
    loja: 'i-Run',
    desconto: 27,
    pvp: 165,
  },
  {
    name: 'Saucony Peregrine 16',
    categoria: 'Trail',
    rating: 4,
    preco: '~112,00 €',
    precoVerificado: true,
    badge: 'Novo 2026',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/saucony-peregrine-16-chaussures-homme-878494-1-z.jpg',
    desc: 'Lançada em janeiro de 2026, a 16ª Peregrine mantém a receita vencedora: leve, aderente e versátil em qualquer terreno. PWRRUN mais macia e lugs de 5mm para lama e rocha.',
    pros: ['Leveza rara na categoria', 'Aderência excelente em lama', 'Preço justo face a rivais'],
    contras: ['Proteção limitada para ultra distância', 'Durabilidade média da sola'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fsaucony%2FPeregrine-16_fiche_145819.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Ftrail-running%2Fsaucony%2FPeregrine-16_fiche_145819.html',
    loja: 'i-Run',
    desconto: 30,
    pvp: 160,
  },
  {
    name: 'Saucony Endorphin Pro 5',
    categoria: 'Competição',
    rating: 5,
    preco: '~189,00 €',
    precoVerificado: true,
    badge: 'Novo 2026',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/saucony-endorphin-pro-5-chaussures-homme-883394-1-z.jpg',
    desc: 'A super shoe da Saucony renovada em fevereiro de 2026. Placa de carbono com espuma PWRRUN HG mais leve e reativa — alternativa séria a Vaporfly e Alphafly por menos dinheiro.',
    pros: ['Excelente relação preço/performance nas super shoes', 'Espuma PWRRUN HG topo de gama', 'Estável para uma placa de carbono'],
    contras: ['Menos explosiva que Alphafly', 'Durabilidade típica de super shoe (~300 km)'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fsaucony%2FEndorphin-Pro-5_fiche_146484.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fsaucony%2FEndorphin-Pro-5_fiche_146484.html',
    loja: 'i-Run',
    desconto: 30,
    pvp: 270,
  },
  {
    name: 'Brooks Ghost Max 3',
    categoria: 'Estrada',
    rating: 4,
    preco: 'desde ~118 €',
    precoVerificado: true,
    badge: 'Conforto Máximo',
    badgeColor: '#8b5cf6',
    img: 'https://photo.i-run.fr/brooks-ghost-max-3-chaussures-homme-826035-1-z.jpg',
    desc: 'Versão de amortecimento máximo da Ghost. Pensada para quem quer proteção em quilometragens altas, com a transição suave típica da Brooks; 294 g (homem) segundo a ficha da i-Run.',
    pros: ['Amortecimento protetor', 'Boa para volumes altos e corredores pesados', 'Transição suave'],
    contras: ['Peso acima da média', 'Menos ágil em ritmos rápidos'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fbrooks%2FGhost-Max-3_fiche_145046.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fhomem%2Fcalcados%2Fcorrida%2Fbrooks%2FGhost-Max-3_fiche_145046.html',
    loja: 'i-Run',
    desconto: 26,
    pvp: 160,
  },
]

/* ── RELÓGIOS GPS ──────────────────────────────────────────────────── */
export const relogios: RelogioProduto[] = [
  {
    name: 'Coros Pace 3',
    rating: 5,
    preco: '~229,00 €',
    precoVerificado: true,
    badge: 'Melhor Relação Peso/Preço',
    badgeColor: '#00ff87',
    img: 'https://photo.i-run.fr/coros-pace-3-electronique-817326-1-z.jpg',
    desc: 'Levíssimo (30g) com 38h de autonomia GPS e ecrã AMOLED nítido. A entrada mais inteligente no mundo dos relógios de performance — sem pagar o prémio da Garmin.',
    pros: ['Levíssimo (30g)', 'Autonomia GPS excelente para o preço', 'App Coros muito completa'],
    contras: ['Ecossistema mais pequeno que Garmin', 'Sem música offline'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fcoros%2FPace-3_fiche_133690.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fcoros%2FPace-3_fiche_133690.html',
    loja: 'i-Run',
    desconto: 8,
    pvp: 249,
  },
  {
    name: 'Coros Apex 2',
    rating: 4,
    preco: '~299,00 €',
    precoVerificado: true,
    badge: 'Titânio Premium',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/coros-apex-2-electronique-817327-1-z.jpg',
    desc: 'Caixa em titânio com mapas offline completos e chamadas telefónicas via Bluetooth — tudo isto por quase metade do preço dos flagships equivalentes de outras marcas.',
    pros: ['Caixa em titânio robusta', 'Mapas offline incluídos', 'Excelente autonomia de bateria'],
    contras: ['App menos rica em métricas de treino', 'Ecrã menos vibrante que AMOLED'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fcoros%2FApex-2_fiche_124643.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fcoros%2FApex-2_fiche_124643.html',
    loja: 'i-Run',
    desconto: 25,
    pvp: 399,
  },
  {
    name: 'Garmin Forerunner 55',
    rating: 4,
    preco: '~159 €',
    precoVerificado: true,
    badge: 'Entrada Garmin',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/garmin-forerunner-55-electronique-483653-1-z.jpg',
    desc: 'O relógio GPS de corrida mais simples da Garmin: GPS, frequência cardíaca no pulso e sugestões de treino diárias. Ideal para quem está a começar e quer o ecossistema Garmin Connect.',
    pros: ['Simples de usar', 'Ecossistema Garmin Connect', 'Preço de entrada'],
    contras: ['Ecrã básico (sem AMOLED)', 'Menos métricas avançadas que a gama 200/900'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fgarmin%2FForerunner-55_fiche_107704.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fgarmin%2FForerunner-55_fiche_107704.html',
    loja: 'i-Run',
    desconto: 20,
    pvp: 199,
  },
  {
    name: 'COROS Pace 4',
    rating: 5,
    preco: '~269 €',
    precoVerificado: true,
    badge: 'Novo',
    badgeColor: '#00ff87',
    img: 'https://photo.i-run.fr/coros-pace-4-electronique-826418-1-z.jpg',
    desc: 'O sucessor do Pace 3: leve e versátil, e agora com cartografia. Para corredores de estrada e trail que querem um relógio de treino completo sem pagar preço de topo de gama.',
    pros: ['Leve', 'Passa a ter mapas', 'App COROS muito completa'],
    contras: ['Ecossistema mais pequeno que o da Garmin', 'Algumas versões de edição especial custam mais'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fcoros%2FPace-4_fiche_146077.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fcoros%2FPace-4_fiche_146077.html',
    loja: 'i-Run',
  },
  {
    name: 'Polar Vantage M3',
    rating: 4,
    preco: '~299 €',
    precoVerificado: true,
    badge: 'Treino Completo',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/polar-vantage-m3-electronique-817369-1-z.jpg',
    desc: 'Relógio multidesporto compacto e leve da Polar, com as ferramentas de treino e recuperação da marca. Uma boa opção para quem treina por frequência cardíaca e quer análise da carga de treino.',
    pros: ['Compacto e leve', 'Ferramentas de treino e recuperação da Polar', 'Multidesporto'],
    contras: ['App menos popular que Garmin Connect', 'Preço acima dos modelos de entrada'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fpolar%2FVantage-M3_fiche_142790.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fpolar%2FVantage-M3_fiche_142790.html',
    loja: 'i-Run',
    desconto: 25,
    pvp: 399,
  },
  {
    name: 'Polar Grit X2',
    rating: 4,
    preco: '~359 €',
    precoVerificado: true,
    badge: 'Outdoor',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/polar-grit-x2-electronique-817364-1-z.jpg',
    desc: 'Relógio outdoor resistente e compacto da Polar para trail e montanha, com ferramentas para analisar o corpo e a recuperação. Para quem passa muitas horas nos trilhos.',
    pros: ['Construção resistente', 'Pensado para trail e montanha', 'Análise de recuperação Polar'],
    contras: ['Mais caro que um relógio de estrada', 'Maior do que precisa quem só corre em estrada'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fpolar%2FGrit-X2_fiche_144870.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fpolar%2FGrit-X2_fiche_144870.html',
    loja: 'i-Run',
    desconto: 25,
    pvp: 479,
  },
  {
    name: 'COROS Apex 4',
    rating: 5,
    preco: 'desde ~449 €',
    precoVerificado: true,
    badge: 'Ultra Trail',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/coros-apex-4-electronique-819625-1-z.jpg',
    desc: 'Relógio da COROS para alta montanha e trilhos remotos, com chip GNSS All-Satellite para um GPS fiável em zonas isoladas. Existe em 42 mm e 46 mm (o de 46 mm custa mais).',
    pros: ['GPS fiável em zonas isoladas', 'Feito para trail e caminhada de montanha', 'Duas medidas de caixa'],
    contras: ['Preço elevado', 'Excessivo para quem só corre em estrada'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fcoros%2FApex-4_fiche_145805.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fcoros%2FApex-4_fiche_145805.html',
    loja: 'i-Run',
  },
]

/* ── SENSORES DE FREQUÊNCIA CARDÍACA ──────────────────────────────── */
export const sensoresFc: SensorFcProduto[] = [
  {
    name: 'Polar H10',
    tipo: 'Cinta peitoral',
    rating: 5,
    preco: '~79,00 €',
    precoVerificado: true,
    badge: 'Padrão Ouro',
    badgeColor: '#00ff87',
    img: 'https://photo.i-run.fr/polar-h10-m-xxl-electronique-308349-1-z.jpg',
    desc: 'O monitor de FC mais preciso do mercado. Recomendado por laboratórios de fisiologia e usado em estudos científicos. Conectividade Bluetooth + ANT+. Compatível com Garmin, Wahoo, Suunto e todos os relógios GPS.',
    pros: ['Precisão clínica (±1 bpm)', 'Bluetooth + ANT+ dual', 'Bateria 400h', 'Compatível com todos os relógios'],
    contras: ['Cinta peitoral (menos confortável que pulso)', 'Requer gel de condução no início'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Fcintos-cardio%2Fpolar%2FH10-M-XXL_fiche_86142.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Fcintos-cardio%2Fpolar%2FH10-M-XXL_fiche_86142.html',
    loja: 'i-Run',
    porque: 'Se treinas por zonas de FC ou fazes testes de VO2max, o H10 é insubstituível. Os sensores de pulso têm erro de ±5-10% — o H10 tem ±1 bpm.',
    desconto: 20,
    pvp: 99,
  },
  {
    name: 'Polar Verity Sense',
    tipo: 'Sensor de braço',
    rating: 4,
    preco: '~89,00 €',
    precoVerificado: true,
    badge: 'Melhor Sensor Ótico',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/polar-verity-sense-electronique-641164-1-z.jpg',
    desc: 'Sensor ótico de braço com precisão muito superior aos sensores de pulso. Ideal para natação (IPX7), ciclismo e treino funcional. Usa luz verde de 6 LEDs para máxima precisão.',
    pros: ['Sem cinta peitoral', 'Impermeável (natação)', 'Confortável em qualquer posição', 'Memória interna 600h'],
    contras: ['Menos preciso que H10 em intervalados', 'Precisa de posicionamento correto no braço'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Fsensores%2Fpolar%2FVerity-Sense_fiche_131635.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Fsensores%2Fpolar%2FVerity-Sense_fiche_131635.html',
    loja: 'i-Run',
    porque: 'A alternativa ao H10 para quem não quer cinta peitoral. Excelente para trail (movimento irregular) e natação.',
    desconto: 10,
    pvp: 99,
  },
  {
    name: 'Polar Pacer Pro',
    tipo: 'Relógio GPS',
    rating: 4,
    preco: '~199,00 €',
    precoVerificado: true,
    badge: 'Melhor Polar Corrida',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/polar-pacer-pro-electronique-817365-1-z.jpg',
    desc: 'O melhor relógio Polar para corredores. Leve (45g), GPS preciso, Running Power sem acessórios externos, análise de recuperação Nightly Recharge e estimativa de VO2max. Ecrã MIP excelente em pleno sol.',
    pros: ['Levíssimo (45g)', 'Running Power integrado', 'Nightly Recharge (HRV nocturno)', 'Excelente autonomia 35h GPS'],
    contras: ['Sem mapas', 'Ecrã não AMOLED', 'App menos rica que Garmin Connect'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fpolar%2FPacer-Pro_fiche_116503.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frelogios%2Fpolar%2FPacer-Pro_fiche_116503.html',
    loja: 'i-Run',
    porque: 'Para quem prefere o ecossistema Polar e quer Running Power + HRV num relógio leve e acessível.',
    desconto: 42,
    pvp: 349,
  },
  {
    name: 'COROS Sensor de frequência cardíaca',
    tipo: 'Braçadeira ótica',
    rating: 4,
    preco: 'desde ~89 €',
    precoVerificado: true,
    badge: 'Sem Cinta no Peito',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/coros-capteur-de-frequence-cardiaque-electronique-860670-1-z.jpg',
    desc: 'Sensor ótico multicanal usado no braço. Liga e desliga sozinho quando o pões e tiras, e emparelha com até três dispositivos Bluetooth ao mesmo tempo.',
    pros: ['Confortável (no braço, sem cinta)', 'Liga e desliga automaticamente', 'Até 3 dispositivos Bluetooth'],
    contras: ['Ótico: menos preciso que cinta peitoral em intervalos curtos', 'A edição especial custa mais'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Fcintos-cardio%2Fcoros%2FSensor-de-frequencia-cardiaca_fiche_134725.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Fcintos-cardio%2Fcoros%2FSensor-de-frequencia-cardiaca_fiche_134725.html',
    loja: 'i-Run',
    porque: 'Para quem não tolera a cinta no peito mas quer dados de frequência cardíaca mais estáveis do que os do pulso.',
  },
]

/* ── NUTRIÇÃO PARA CORREDORES ──────────────────────────────────────── */
export const nutricao: NutricaoProduto[] = [
  {
    name: 'Maurten Gel 100',
    tipo: 'Gel de energia',
    rating: 5,
    preco: '~3,70 € / un.',
    precoVerificado: true,
    badge: 'Preferido da Elite',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/maurten-gel-100-dietetique-du-sport-816737-1-z.jpg',
    desc: 'Tecnologia Hydrogel — forma um gel no estômago que liberta energia de forma constante. Sem cor, sem sabor artificial, sem adoçantes. O gel de Kipchoge e Eliud. 25g de CHO em formato ultra-digerível.',
    pros: ['Tecnologia Hydrogel patenteada', 'Zero problemas digestivos', 'Limpo (sem aditivos)', 'Absorção contínua'],
    contras: ['O mais caro do mercado', 'Só 25g CHO por gel'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Fmaurten%2FGel-100_fiche_90959.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Fmaurten%2FGel-100_fiche_90959.html',
    loja: 'i-Run',
    porque: 'Para quem tem estômago sensível ou quer o que a elite mundial usa. A tecnologia Hydrogel elimina o risco de mal-estar mesmo no calor.',
  },
  {
    name: 'Maurten Gel 160',
    tipo: 'Gel de energia',
    rating: 5,
    preco: '~5 € / un.',
    precoVerificado: true,
    badge: 'Longas Distâncias',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/maurten-gel-160-dietetique-du-sport-816763-1-z.jpg',
    desc: 'A versão mais concentrada do gel Maurten, com tecnologia Hydrogel. Pensada para sessões longas em que precisas de mais hidratos de carbono por toma.',
    pros: ['Mais hidratos de carbono por gel', 'Tecnologia Hydrogel', 'Sabor neutro'],
    contras: ['Caro por unidade', 'Mais volume para engolir'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Fmaurten%2FGel-160_fiche_134440.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Fmaurten%2FGel-160_fiche_134440.html',
    loja: 'i-Run',
    porque: 'Para maratona e ultra, quando queres atingir doses altas de hidratos por hora com menos tomas.',
  },
  {
    name: 'Maurten Drink Mix 160',
    tipo: 'Bebida energética',
    rating: 5,
    preco: '~2,50 € / saqueta',
    precoVerificado: true,
    badge: 'Hidratação + Energia',
    badgeColor: '#00ff87',
    img: 'https://photo.i-run.fr/maurten-drink-mix-160-dietetique-du-sport-816777-1-z.jpg',
    desc: 'Mistura para bebida com tecnologia Hydrogel, à base de maltodextrina e frutose. Junta hidratação e energia no mesmo bidão.',
    pros: ['Energia e líquido ao mesmo tempo', 'Tecnologia Hydrogel', 'Fácil de dosear'],
    contras: ['Caro por saqueta', 'Precisas de levar líquido'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbebidas%2Fmaurten%2FMistura-para-Bebida-160_fiche_90822.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbebidas%2Fmaurten%2FMistura-para-Bebida-160_fiche_90822.html',
    loja: 'i-Run',
    porque: 'Para treinos longos e provas em que queres resolver hidratação e energia com o bidão, sem depender só de géis.',
  },
  {
    name: 'Maurten Drink Mix 320',
    tipo: 'Bebida energética',
    rating: 4,
    preco: '~3,65 € / saqueta',
    precoVerificado: true,
    badge: 'Dose Alta',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/maurten-drink-mix-320-dietetique-du-sport-852375-1-z.jpg',
    desc: 'A versão mais concentrada da bebida Maurten: o dobro da 160 por saqueta. Para provas longas e atletas que já treinaram o intestino para doses altas.',
    pros: ['Muito energia por bidão', 'Tecnologia Hydrogel', 'Menos géis necessários'],
    contras: ['Exige treino do intestino', 'Caro'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbebidas%2Fmaurten%2FBebida-Mix-320_fiche_90830.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbebidas%2Fmaurten%2FBebida-Mix-320_fiche_90830.html',
    loja: 'i-Run',
    porque: 'Para maratona e ultra, quando precisas de muitos hidratos por hora e já testaste doses altas em treino.',
  },
  {
    name: 'OVERSTIMS Gel Energix',
    tipo: 'Gel de energia',
    rating: 4,
    preco: '~2,50 € / un.',
    precoVerificado: true,
    badge: 'Bom Preço',
    badgeColor: '#00ff87',
    img: 'https://photo.i-run.fr/overstims-gel-energix---citron-dietetique-du-sport-690364-1-z.jpg',
    desc: 'Gel francês para esforços longos, com hidratos de carbono, vitaminas e minerais. Uma opção mais barata que os géis premium.',
    pros: ['Preço acessível', 'Vários sabores', 'Vitaminas e minerais'],
    contras: ['Textura mais espessa', 'Testar antes de usar em prova'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Foverstims%2FGel-Energix---Limao_fiche_137359.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Foverstims%2FGel-Energix---Limao_fiche_137359.html',
    loja: 'i-Run',
    porque: 'Para quem consome muitos géis em treino e quer reduzir o custo sem abdicar de um gel pensado para endurance.',
  },
  {
    name: 'Apurna Energia Longas Distâncias',
    tipo: 'Gel de energia',
    rating: 4,
    preco: '~2,50 € / un.',
    precoVerificado: true,
    badge: '+2 Horas',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/apurna-energie-longues-distances-agrumes-dietetique-du-sport-225419-1-z.jpg',
    desc: 'Gel para treinos e provas com mais de 2 horas. Junta hidratos de carbono e BCAA.',
    pros: ['Pensado para esforços longos', 'Preço acessível', 'Com BCAA'],
    contras: ['Menos conhecido que as marcas premium', 'Testar a tolerância em treino'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Fapurna%2FEnergia-Longuas-Distancias---Citrinos_fiche_72513.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Fapurna%2FEnergia-Longuas-Distancias---Citrinos_fiche_72513.html',
    loja: 'i-Run',
    porque: 'Para trail e ultra, quando o esforço passa as 2 horas.',
  },
  {
    name: 'Naak Gel Ultra Energy',
    tipo: 'Gel de energia',
    rating: 4,
    preco: '~3,50 € / un.',
    precoVerificado: true,
    badge: 'Ultra Trail',
    badgeColor: '#f59e0b',
    img: 'https://photo.i-run.fr/naak-gel-ultra-energy---sirop-d-erable-sale-dietetique-du-sport-883601-1-z.jpg',
    desc: 'Gel com hidratos de carbono simples e complexos, BCAA e proteína, com sabor a xarope de ácer salgado. Pensado para sessões longas de resistência.',
    pros: ['Sabor salgado (alternativa aos doces)', 'Hidratos simples e complexos', 'Com BCAA e proteína'],
    contras: ['Mais caro que géis básicos', 'Sabor não agrada a todos'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Fnaak%2FGel-Ultra-Energy---xarope-de-acer-salgado_fiche_140834.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fgeis%2Fnaak%2FGel-Ultra-Energy---xarope-de-acer-salgado_fiche_140834.html',
    loja: 'i-Run',
    porque: 'Para ultras e treinos muito longos, quando os sabores doces começam a enjoar.',
  },
  {
    name: 'Ta Energy Comprimidos de Eletrólitos',
    tipo: 'Eletrólitos',
    rating: 4,
    preco: '~9,90 €',
    precoVerificado: true,
    badge: 'Hidratação',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/ta-energy-electrolytes-tabs---citron-dietetique-du-sport-538713-1-z.jpg',
    desc: 'Pastilhas efervescentes com sódio, potássio, magnésio e cálcio, e vitaminas C e B. Para repor minerais depois de esforços intensos e no dia a dia.',
    pros: ['Práticas de transportar', 'Sódio, potássio, magnésio e cálcio', 'Baixas calorias'],
    contras: ['Não dão energia (só eletrólitos)', 'Preço por embalagem'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbebidas%2Fta-energy%2FComprimidos-de-Eletrolitos---Limao_fiche_115292.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbebidas%2Fta-energy%2FComprimidos-de-Eletrolitos---Limao_fiche_115292.html',
    loja: 'i-Run',
    porque: 'Para dias de calor e treinos com muito suor, quando a água sozinha não chega para repor o sódio.',
  },
  {
    name: 'Ta Energy Gomas Energéticas',
    tipo: 'Gomas de energia',
    rating: 4,
    preco: '~2 € / un.',
    precoVerificado: true,
    badge: 'Alternativa ao Gel',
    badgeColor: '#00ff87',
    img: 'https://photo.i-run.fr/ta-energy-energie-gommes---cola-dietetique-du-sport-606904-1-z.jpg',
    desc: 'Gomas para comer durante o esforço, com hidratos de carbono, potássio e sódio. A versão de cola tem cafeína.',
    pros: ['Mais fáceis de dosear que um gel', 'Com sódio e potássio', 'Versão com cafeína'],
    contras: ['Mastigar a ritmo alto custa', 'Atenção à cafeína se fores sensível'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbarras%2Fta-energy%2FGomas-Energeticas---Cola_fiche_116878.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbarras%2Fta-energy%2FGomas-Energeticas---Cola_fiche_116878.html',
    loja: 'i-Run',
    porque: 'Para quem não gosta da textura dos géis e prefere algo para mastigar.',
  },
  {
    name: 'Apurna Whey Proteína',
    tipo: 'Proteína',
    rating: 4,
    preco: '~28,50 € (720 g)',
    precoVerificado: true,
    badge: 'Recuperação',
    badgeColor: '#8b5cf6',
    img: 'https://photo.i-run.fr/apurna-whey-proteines-vanille-720-g-dietetique-du-sport-406488-1-z.jpg',
    desc: 'Proteína whey sabor baunilha, com vitamina B6 e vitaminas C e E. Ajuda a atingir a dose de proteína no pós-treino.',
    pros: ['Prática no pós-treino', 'Vários sabores', 'Formato de 720 g'],
    contras: ['Não substitui uma refeição completa', 'Escolhe o sabor antes de comprar'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fproteinas%2Fapurna%2FProteinas-Whey-Baunilha---720-g_fiche_96912.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fproteinas%2Fapurna%2FProteinas-Whey-Baunilha---720-g_fiche_96912.html',
    loja: 'i-Run',
    porque: 'Quando não consegues comer proteína suficiente nas refeições a seguir aos treinos.',
  },
  {
    name: 'SANTAMADRE Creatina Monohidratada',
    tipo: 'Creatina',
    rating: 4,
    preco: '~25,90 €',
    precoVerificado: true,
    badge: 'Força',
    badgeColor: '#8b5cf6',
    img: 'https://photo.i-run.fr/santamadre-creatine-100--monohydrate-dietetique-du-sport-855434-1-z.jpg',
    desc: 'Creatina monohidratada, o suplemento com mais evidência para esforços curtos e intensos repetidos, como séries, sprints e trabalho de força.',
    pros: ['Forma de creatina mais estudada', 'Útil no treino de força e séries curtas', 'Preço acessível'],
    contras: ['Pode aumentar ligeiramente o peso (água)', 'Efeito pequeno em esforços longos e contínuos'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fcomplementos%2Fsantamadre%2FCreatina-100--Monohidratada_fiche_147361.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fcomplementos%2Fsantamadre%2FCreatina-100--Monohidratada_fiche_147361.html',
    loja: 'i-Run',
    porque: 'Para corredores que fazem treino de força ou séries curtas e querem melhorar a qualidade dessas sessões.',
  },
  {
    name: 'Apurna Eletrólitos',
    tipo: 'Eletrólitos',
    rating: 4,
    preco: '~6,50 €',
    precoVerificado: true,
    badge: 'Sabor Neutro',
    badgeColor: '#3b82f6',
    img: 'https://photo.i-run.fr/apurna-electrolytes-neutre-dietetique-du-sport-488122-1-z.jpg',
    desc: 'Bebida de eletrólitos com sabor neutro, com magnésio e potássio. Para repor minerais em esforços intensos, em qualquer desporto.',
    pros: ['Sabor neutro', 'Magnésio e potássio', 'Preço baixo'],
    contras: ['Não dá energia', 'Precisas de levar líquido'],
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbebidas%2Fapurna%2FEletrolitos---Neutro_fiche_108082.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Fnutricao-desportiva%2Fbebidas%2Fapurna%2FEletrolitos---Neutro_fiche_108082.html',
    loja: 'i-Run',
    porque: 'Para quem quer repor minerais sem açúcar nem sabor forte, sobretudo em treinos longos com calor.',
  },
]

/* ── ACESSÓRIOS ESSENCIAIS ─────────────────────────────────────────── */
export const acessorios: AcessorioProduto[] = [
  {
    name: 'Salomon Active Skin 8',
    tipo: 'Mochila hidratação',
    preco: '~80,00 €',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/salomon-active-skin-8-accessoires-692619-1-z.jpg',
    desc: '8L com 1.5L de hidratação. Ajuste perfeito sem movimento. A escolha dos pros no trail.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fmochilas-de-hidratacao%2Fsalomon%2FActive-Skin-8_fiche_137827.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fmochilas-de-hidratacao%2Fsalomon%2FActive-Skin-8_fiche_137827.html',
    desconto: 30,
    pvp: 115,
  },
  {
    name: 'Buff Original',
    tipo: 'Bandana multifunções',
    preco: '~12,00 €',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/buff-original-accessoires-597549-1-z.jpg',
    desc: 'A bandana tubular mais vendida do mundo do outdoor. Protege do sol, do frio e do vento em 12+ formas de uso diferentes.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fgolas%2Fbuff%2FOriginal_fiche_124521.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fgolas%2Fbuff%2FOriginal_fiche_124521.html',
    bestseller: true,
    desconto: 33,
    pvp: 18,
  },
  {
    name: 'Oakley Radar EV Path',
    tipo: 'Óculos de sol desportivos',
    preco: '~171,00 €',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/oakley-lunettes-radar-ev-path-prizm-road-accessoires-242700-1-z.jpg',
    desc: 'Os óculos mais usados pela elite do atletismo mundial. Lente Prizm de alta definição e encaixe que não desliza mesmo com transpiração intensa.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Foculos%2Foakley%2FOculos-Radar-EV-Path-Prizm-Road_fiche_55909.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Foculos%2Foakley%2FOculos-Radar-EV-Path-Prizm-Road_fiche_55909.html',
    desconto: 20,
    pvp: 214,
  },
  {
    name: 'Black Diamond Distance Carbon Z',
    tipo: 'Bastões de trekking',
    preco: '~144,00 €',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/black-diamond-distance-carbon-z-accessoires-770567-1-z.jpg',
    desc: 'Bastões de carbono ultraleves e dobráveis, essenciais em ultra trail com muito desnível — poupam energia significativa nas subidas longas.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fbastoes-de-caminhada%2Fblack-diamond%2FDistance-Carbon-Z_fiche_144035.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fbastoes-de-caminhada%2Fblack-diamond%2FDistance-Carbon-Z_fiche_144035.html',
    desconto: 10,
    pvp: 160,
  },
  {
    name: 'Compressport Pro Racing V4.0 Run High',
    tipo: 'Meias de corrida',
    preco: '~13 €',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/compressport-pro-racing-v-4-0-run-high-accessoires-530627-1-z.jpg',
    desc: 'Meias técnicas de corrida da Compressport, com reforço na respirabilidade. As preferidas de muitos corredores para treinos longos e provas.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fmeias%2Fcompressport%2FPro-Racing-V-4.0-Run-High_fiche_113946.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fmeias%2Fcompressport%2FPro-Racing-V-4.0-Run-High_fiche_113946.html',
    desconto: 35,
    pvp: 20,
  },
  {
    name: 'Therabody Wave Roller',
    tipo: 'Rolo vibratório',
    preco: '~119 €',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/therabody-wave-roller-electronique-452382-1-z.jpg',
    desc: 'Rolo de espuma de alta densidade com vibração e superfície em ondas. Para libertação miofascial no aquecimento e na recuperação.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frecuperacao-muscular%2Ftherabody%2FWave-Roller_fiche_103284.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frecuperacao-muscular%2Ftherabody%2FWave-Roller_fiche_103284.html',
    desconto: 20,
    pvp: 149,
  },
  {
    name: 'Therabody Theragun Prime Plus',
    tipo: 'Massajador percussivo',
    preco: '~339 €',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/therabody-theragun-prime-plus-electronique-758010-1-z.jpg',
    desc: 'Massajador percussivo da Theragun que junta percussão e calor, com vários acessórios. Para soltar a musculatura antes do treino e acelerar a recuperação depois.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frecuperacao-muscular%2Ftherabody%2FTheragun-Prime-Plus_fiche_143369.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Frecuperacao-muscular%2Ftherabody%2FTheragun-Prime-Plus_fiche_143369.html',
    desconto: 19,
    pvp: 419,
  },
  {
    name: 'Petzl Iko Core',
    tipo: 'Lanterna frontal',
    preco: '~54 €',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/petzl-iko-core-electronique-833554-1-z.jpg',
    desc: 'Lanterna frontal com a fita AirFit da Petzl, semi-rígida e muito fina, que fica estável na cabeça. Para treinos de trail ao amanhecer, ao fim do dia e provas noturnas.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Flanternas-frontais%2Fpetzl%2FIko-Core_fiche_97060.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Feletronica%2Flanternas-frontais%2Fpetzl%2FIko-Core_fiche_97060.html',
    desconto: 40,
    pvp: 90,
  },
  {
    name: 'Salomon Pulse',
    tipo: 'Cinto de corrida',
    preco: '~28 €',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/salomon-pulse-accessoires-786253-1-z.jpg',
    desc: 'Cinto de trail leve, em malha perfurada e tecido elástico em quatro direções, para levar telemóvel, géis e chaves sem saltar.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fcintos%2Fsalomon%2FPulse_fiche_137763.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fcintos%2Fsalomon%2FPulse_fiche_137763.html',
    desconto: 20,
    pvp: 35,
  },
  {
    name: 'Sidas Creme anti-fricção',
    tipo: 'Anti-atrito',
    preco: '~15 € (75 ml)',
    precoVerificado: true,
    img: 'https://photo.i-run.fr/sidas-creme-anti-frottements-75ml-accessoires-152606-1-z.jpg',
    desc: 'Creme preventivo com manteiga de karité, colagénio marinho e óleos essenciais. Aplicado antes do esforço, ajuda a proteger a pele das bolhas e do atrito.',
    link: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fprotecao-muscular-articular%2Fsidas%2FCreme-anti-friccao---75ml_fiche_59648.html',
    linkIrun: 'https://sln.i-run.pt/?P51383158DBBD1F1&redir=https%3A%2F%2Fwww.i-run.pt%2Facessorios%2Fprotecao-muscular-articular%2Fsidas%2FCreme-anti-friccao---75ml_fiche_59648.html',
  },
]

/* ── LOJA PRINCIPAL ────────────────────────────────────────────────── */
/**
 * 2026-11-11 — a i-Run (programa de afiliados via Kwanko, 15% CPA, cookie de
 * 30 dias) passa a ser a loja principal do site.
 *
 * - `linkIrun` tem de ser um deep link gerado no painel publisher.kwanko.com
 *   (campanha i-Run PT, P79921) — nunca um link copiado de um anúncio, que
 *   traz o tracking de outro afiliado e não nos paga nada.
 * - Quando um produto tem `linkIrun`, é o único botão de compra mostrado
 *   (atualizar também `preco` para o preço confirmado no i-run.pt).
 * - 2026-11-18: decisão do Pedro — nada da Amazon no site, tudo da i-Run.
 *   Todos os produtos têm `linkIrun` (e `link` aponta para o mesmo deep
 *   link). Produto que deixe de existir na i-Run sai do inventário em vez de
 *   cair para outra loja.
 */
export interface LinkCompra {
  url: string
  loja: string
  afiliado: boolean
  rel: string
}

export function linkCompra(p: { link: string; loja?: string; linkIrun?: string }): LinkCompra {
  return { url: p.linkIrun || p.link, loja: 'i-Run', afiliado: true, rel: 'noopener noreferrer sponsored' }
}
