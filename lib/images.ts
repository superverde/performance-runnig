/**
 * Pool centralizado de imagens de capa para publicações (Facebook, Instagram,
 * Threads, X, Pinterest) e conteúdo social genérico (dica do meio-dia, etc.).
 *
 * ANTES: 4 ficheiros diferentes (social-post, evening-social, midday-tip,
 * pinterest-pin) tinham cada um o seu próprio mapa de "1 imagem fixa por
 * categoria" — resultado: todos os posts de "Treino", por exemplo, mostravam
 * sempre a mesma foto, há meses, em todas as redes. Este ficheiro substitui
 * essa lógica: cada categoria tem uma pool de 5-6 imagens (50 no total, todas
 * já validadas em produção noutras partes do site), e a escolha dentro da
 * pool é determinística por artigo (via `seed`, normalmente o slug) — o
 * mesmo artigo mostra sempre a mesma imagem em todas as plataformas onde é
 * publicado, mas artigos diferentes da mesma categoria já não colidem.
 */

export const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  'Treino': [
    'photo-1571019614242-c5c5dee9f50b',
    'photo-1534438327276-14e5300c3a48',
    'photo-1571019613454-1cb2f99b2d8b',
    'photo-1549896869-ca27eeffe4fb',
    'photo-1533560904424-a0c61dc306fc',
    'photo-1512621776951-a57141f2eefd',
  ],
  'Fisiologia': [
    'photo-1727094141271-9bea5bc8c757',
    'photo-1613936360976-8f35cf0e5461',
    'photo-1557800636-894a64c1696f',
    'photo-1559757148-5c350d0d3c56',
    'photo-1559757175-5700dde675bc',
    'photo-1518611012118-696072aa579a',
  ],
  'Nutrição': [
    'photo-1490645935967-10de6ba17061',
    'photo-1547592180-85f173990554',
    'photo-1467453678174-768ec283a940',
    'photo-1506126613408-eca07ce68773',
    'photo-1490818387583-1baba5e638af',
    'photo-1452626038306-9aae5e071dd3',
  ],
  'Biomecânica': [
    'photo-1476480862126-209bfaa8edc8',
    'photo-1461897104016-0b3b00cc81ee',
    'photo-1524646349956-1590eacfa324',
    'photo-1529516548873-9ce57c8f155e',
    'photo-1502904550040-7534597429ae',
  ],
  'Recuperação': [
    'photo-1571008887538-b36bb32f4571',
    'photo-1541781774459-bb2af2f05b55',
    'photo-1544367567-0f2fcb009e0b',
    'photo-1519315901367-f34ff9154487',
    'photo-1560347876-aeef00ee58a1',
    'photo-1567427018141-0584cfcbf1b8',
  ],
  'Trail Running': [
    'photo-1504025468847-0e438279542c',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1456613820599-bfe244172af5',
    'photo-1530026405186-ed1f139313f8',
    'photo-1590012314607-cda9d9b699ae',
    'photo-1610832958506-aa56368176cf',
  ],
  'Lesões': [
    'photo-1562771379-eafdca7a02f8',
    'photo-1543051932-6ef9fecfbc80',
    'photo-1470252649378-9c29740c9fa8',
    'photo-1567598508481-65985588e295',
    'photo-1461896836934-ffe607ba8211',
  ],
  'Psicologia': [
    'photo-1552674605-db6ffd4facb5',
    'photo-1513593771513-7b58b6c4af38',
    'photo-1551632811-561732d1e306',
    'photo-1434682881908-b43d0467b798',
    'photo-1595950653106-6c9ebd614d3a',
  ],
  'VO2max': [
    'photo-1541534741688-6078c6bfb5c5',
    'photo-1648995361141-30676a75fd27',
    'photo-1542291026-7eec264c27ff',
    'photo-1538481199705-c710c4e965fc',
    'photo-1600334089648-b0d9d3028eb2',
  ],
}

// Categorias sem pool própria (ex: "Equipamento") caem aqui — mistura
// Treino + VO2max, que são as mais neutras/genéricas visualmente.
const FALLBACK_POOL = [
  ...CATEGORY_IMAGE_POOLS['Treino'],
  ...CATEGORY_IMAGE_POOLS['VO2max'],
]

const DEFAULT_IMAGE = 'photo-1571008887538-b36bb32f4571'

/** Hash simples e determinístico de uma string para um inteiro positivo. */
function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

/**
 * Escolhe uma imagem da pool da categoria, de forma determinística por
 * `seed` (usar o slug do artigo). O mesmo `seed` devolve sempre a mesma
 * imagem — importante para que o mesmo artigo não mude de imagem entre
 * Facebook, Instagram, Threads e Pinterest — mas artigos diferentes da
 * mesma categoria já não colidem sempre na mesma foto.
 *
 * @param category categoria do artigo (ex: "Treino", "Nutrição")
 * @param seed normalmente o slug do artigo; pode ser qualquer string estável
 * @param size largura pedida ao Unsplash (w=...) — cada rede tem o seu ideal
 */
export function pickCategoryImage(category: string, seed: string, size = 1080): string {
  const pool = CATEGORY_IMAGE_POOLS[category] ?? FALLBACK_POOL
  const photoId = pool.length > 0
    ? pool[hashString(seed) % pool.length]
    : DEFAULT_IMAGE
  return `https://images.unsplash.com/${photoId}?w=${size}&q=80`
}

/** Todas as imagens da pool, achatadas — útil para rotação por dia/índice sem repetir a mesma sequência todos os dias. */
export function allPoolImages(size = 1080): string[] {
  const ids = Object.values(CATEGORY_IMAGE_POOLS).flat()
  return ids.map((id) => `https://images.unsplash.com/${id}?w=${size}&q=80`)
}
