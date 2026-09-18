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

// Pedido do Pedro (2026-09-18): pool antigo tinha só 5-6 fotos por categoria,
// repetidas por 30+ artigos cada, e algumas nem combinavam com o tema (ex:
// "Treino"/"VO2max" mostravam cenas de ginásio/musculação, "Recuperação"
// mostrava alguém a correr a alta velocidade). As fotos novas abaixo (secção
// "NOVAS 2026-09-18") foram escolhidas no Unsplash com pesquisa temática por
// categoria e confirmadas uma a uma pelo texto alternativo gerado a partir da
// própria imagem (nunca só pelo ID) antes de entrarem aqui — mesma disciplina
// que already se aplicava às fotos da homepage (ver comentário em
// app/page.tsx). Os ficheiros ainda têm de ser descarregados para
// public/pool-images/ — ver scripts/download-new-pool-images.js.
export const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  'Treino': [
    'photo-1571019614242-c5c5dee9f50b',
    'photo-1534438327276-14e5300c3a48',
    'photo-1571019613454-1cb2f99b2d8b',
    'photo-1549896869-ca27eeffe4fb',
    'photo-1533560904424-a0c61dc306fc',
    'photo-1512621776951-a57141f2eefd',
    // NOVAS 2026-09-18
    'photo-1584415942461-0b87dda9cc2b',
    'photo-1526676537331-7747bf8278fc',
    'photo-1547941126-3d5322b218b0',
    'photo-1526676317768-d9b14f15615a',
    'photo-1744060204728-f68e434a3edf',
    'photo-1759674861540-afed9f86f94a',
    'photo-1744868646521-2620c945a1fe',
    'photo-1759674804375-3d0c038a0a6a',
    'photo-1607962837359-5e7e89f86776',
    'photo-1728532483490-708f6562b738',
    'photo-1744706908605-ac30eb45f98c',
    'photo-1540539234-c14a20fb7c7b',
    'photo-1590333748338-d629e4564ad9',
  ],
  'Fisiologia': [
    'photo-1727094141271-9bea5bc8c757',
    'photo-1613936360976-8f35cf0e5461',
    'photo-1557800636-894a64c1696f',
    'photo-1559757148-5c350d0d3c56',
    'photo-1559757175-5700dde675bc',
    'photo-1518611012118-696072aa579a',
    // NOVAS 2026-09-18
    'photo-1774050021301-831282cfc3a4',
    'photo-1774050021147-a264e14a70e4',
    'photo-1774050021270-c52bc454ba40',
    'photo-1774050021229-feca39f78855',
    'photo-1774050021155-f2c0fa1a9658',
    'photo-1774050021349-d2024626b531',
    'photo-1774050021668-51cb8d8b4537',
    'photo-1775400787974-548ca79ad3f0',
    'photo-1659366100463-9e29a63adcc2',
  ],
  'Nutrição': [
    'photo-1490645935967-10de6ba17061',
    'photo-1547592180-85f173990554',
    'photo-1467453678174-768ec283a940',
    'photo-1506126613408-eca07ce68773',
    'photo-1490818387583-1baba5e638af',
    'photo-1452626038306-9aae5e071dd3',
    // NOVAS 2026-09-18
    'photo-1587996597484-04743eeb56b4',
    'photo-1587996616596-b714c1c54146',
    'photo-1587996580981-bd03dde74843',
    'photo-1590914148955-88fb72990eea',
    'photo-1619255492313-8a0540e138c2',
    'photo-1640767485112-02da9fd009c6',
    'photo-1752139925154-7bc359368d7d',
    'photo-1615478503562-ec2d8aa0e24e',
    'photo-1621797350488-fb28c9217e3b',
    'photo-1553530666-ba11a7da3888',
    'photo-1514995669114-6081e934b693',
    'photo-1589733955941-5eeaf752f6dd',
  ],
  'Biomecânica': [
    'photo-1476480862126-209bfaa8edc8',
    'photo-1461897104016-0b3b00cc81ee',
    'photo-1524646349956-1590eacfa324',
    'photo-1529516548873-9ce57c8f155e',
    'photo-1502904550040-7534597429ae',
    // NOVAS 2026-09-18
    'photo-1597892657493-6847b9640bac',
    'photo-1639843093167-ed40b985c01e',
    'photo-1670970426602-8eb825ec23f9',
    'photo-1766970096320-c62c49517226',
    'photo-1746698100169-a8e3fc9cd123',
    'photo-1509833903111-9cb142f644e4',
    'photo-1598702631024-b282c0fd96b2',
    'photo-1587587448924-b5a1db520d29',
    'photo-1766970096430-204f27f6e247',
    'photo-1766970096346-937852c7d350',
  ],
  'Recuperação': [
    'photo-1571008887538-b36bb32f4571',
    'photo-1541781774459-bb2af2f05b55',
    'photo-1544367567-0f2fcb009e0b',
    'photo-1519315901367-f34ff9154487',
    'photo-1560347876-aeef00ee58a1',
    'photo-1567427018141-0584cfcbf1b8',
    // NOVAS 2026-09-18
    'photo-1593431763017-c689a61b729a',
    'photo-1761839257789-20147513121a',
    'photo-1770012905139-713758ded6ec',
    'photo-1531403939386-c08a16cd7eef',
    'photo-1640262653851-103cbaf802d5',
  ],
  'Trail Running': [
    'photo-1504025468847-0e438279542c',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1456613820599-bfe244172af5',
    'photo-1530026405186-ed1f139313f8',
    'photo-1590012314607-cda9d9b699ae',
    'photo-1610832958506-aa56368176cf',
    // NOVAS 2026-09-18
    'photo-1781696566918-82c911dfbe26',
    'photo-1781696337747-c575462a97ba',
    'photo-1781696195464-7600b30c5ab2',
    'photo-1781696594088-2e8f82073bb4',
    'photo-1789121418155-32c361aeeab9',
    'photo-1789126414499-31060ef38b27',
    'photo-1781696533719-cfae0216197b',
    'photo-1789122345816-97099eb56acd',
    'photo-1789121417969-c5dac6d1fb16',
    'photo-1594882645126-14020914d58d',
    'photo-1522040942177-269680274214',
  ],
  'Lesões': [
    'photo-1562771379-eafdca7a02f8',
    'photo-1543051932-6ef9fecfbc80',
    'photo-1470252649378-9c29740c9fa8',
    'photo-1567598508481-65985588e295',
    'photo-1461896836934-ffe607ba8211',
    // NOVAS 2026-09-18
    'photo-1758684051090-bc83bb0af184',
    'photo-1619684736572-cf0a43823d87',
    'photo-1783698156307-8e2910a36a21',
    'photo-1777911045224-8d82bba2e607',
    'photo-1746806942507-a7e93fdd6dd4',
    'photo-1746842419697-03234f5ff03e',
    'photo-1746806942505-7215c07810ae',
  ],
  'Psicologia': [
    'photo-1552674605-db6ffd4facb5',
    'photo-1513593771513-7b58b6c4af38',
    'photo-1551632811-561732d1e306',
    'photo-1434682881908-b43d0467b798',
    'photo-1595950653106-6c9ebd614d3a',
    // NOVAS 2026-09-18
    'photo-1516398810565-0cb4310bb8ea',
    'photo-1502224562085-639556652f33',
    'photo-1644456654239-3c036c0c28fe',
    'photo-1581889470536-467bdbe30cd0',
    'photo-1774050021045-ef4643e7b61d',
    'photo-1769867627903-ca4c13b80701',
  ],
  'VO2max': [
    'photo-1541534741688-6078c6bfb5c5',
    'photo-1648995361141-30676a75fd27',
    'photo-1542291026-7eec264c27ff',
    'photo-1538481199705-c710c4e965fc',
    'photo-1600334089648-b0d9d3028eb2',
    // NOVAS 2026-09-18
    'photo-1709601415546-dcd24c912e56',
    'photo-1709601414313-17217448a9fd',
    'photo-1709601414405-db08d323a87a',
    'photo-1623285512376-4a67139e83cf',
    'photo-1633394782240-f81aba3f850d',
    'photo-1646072508563-3e6debc0fb11',
    'photo-1738524107920-777b97fda911',
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
 * `seed` (usar o slug do artigo). O mesmo `seed` devolve sempre a mesma
 * imagem — importante para que o mesmo artigo não mude de imagem entre
 * Facebook, Instagram, Threads e Pinterest — mas artigos diferentes da
 * mesma categoria já não colidem sempre na mesma foto.
 *
 * @param category categoria do artigo (ex: "Treino", "Nutrição")
 * @param seed normalmente o slug do artigo; pode ser qualquer string estável
 * @param size vestigial (largura antes pedida ao Unsplash via `?w=`); a
 *   cópia local é servida a uma única resolução fixa (1200px), por isso
 *   este parâmetro já não tem efeito. Mantido só para não partir os
 *   call-sites existentes — pode ser removido numa limpeza futura.
 */
export function pickCategoryImage(category: string, seed: string, size = 1080): string {
  const pool = CATEGORY_IMAGE_POOLS[category] ?? FALLBACK_POOL
  const photoId = pool.length > 0
    ? pool[hashString(seed) % pool.length]
    : DEFAULT_IMAGE
  return localImageUrl(photoId)
}

/** Todas as imagens da pool, achatadas — útil para rotação por dia/índice sem repetir a mesma sequência todos os dias. */
export function allPoolImages(size = 1080): string[] {
  const ids = Object.values(CATEGORY_IMAGE_POOLS).flat()
  return ids.map(localImageUrl)
}
