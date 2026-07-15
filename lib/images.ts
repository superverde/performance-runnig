/**
 * Pool centralizado de imagens de capa para publicações (Facebook, Instagram,
 * Threads, X, Pinterest), conteúdo social genérico (dica do meio-dia, etc.)
 * e páginas do próprio site (cards de artigo, hero, RSS).
 *
 * ANTES (v1): 4 ficheiros diferentes (social-post, evening-social, midday-tip,
 * pinterest-pin) tinham cada um o seu próprio mapa de "1 imagem fixa por
 * categoria" — resultado: todos os posts de "Treino", por exemplo, mostravam
 * sempre a mesma foto, há meses, em todas as redes. Ver [[project_imagens_publicacoes_pool_50]].
 *
 * ANTES (v2): cada categoria tinha uma pool de 5-6 imagens (50 no total)
 * apontando diretamente para `images.unsplash.com/<id>`. Em 2026-07-15
 * descobriu-se que 7 desses 50 IDs tinham deixado de existir no Unsplash
 * (404) — o Unsplash pode remover fotos a qualquer momento, sem aviso, e
 * isso mostrava cards pretos no site (não só nas redes sociais). Ver
 * [[project_imagens_unsplash_ids_mortos]].
 *
 * AGORA (v3): as imagens são uma cópia local, descarregada uma única vez
 * e commitada em `public/pool-images/<id>.jpg` — já não há dependência
 * nenhuma da disponibilidade do Unsplash a longo prazo. `pickCategoryImage`
 * devolve sempre um URL absoluto no próprio domínio (necessário porque o
 * mesmo valor é usado tanto em CSS `background-image` das páginas como em
 * `image_url` enviado às APIs do Facebook/Instagram/Pinterest, que exigem
 * um URL público).
 *
 * A escolha dentro da pool continua determinística por artigo (via `seed`,
 * normalmente o slug) — o mesmo artigo mostra sempre a mesma imagem em
 * todas as plataformas onde é publicado, mas artigos diferentes da mesma
 * categoria já não colidem sempre na mesma foto.
 */

const SITE_URL = 'https://www.performancerunning.pt'

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

/** Constrói o URL absoluto da cópia local de um ID da pool. */
function localImageUrl(photoId: string): string {
  return `${SITE_URL}/pool-images/${photoId}.jpg`
}

/**
 * Escolhe uma imagem da pool da categoria, de forma determinística por
 * `seed` (usar o slug do artigo). O mesmo `seed