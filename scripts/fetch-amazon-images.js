/**
 * fetch-amazon-images.js
 * ──────────────────────
 * PROCESSO OBRIGATÓRIO ao adicionar um produto novo à página /equipamento:
 *
 *   1. Adiciona o produto ao array PRODUTOS abaixo
 *   2. Corre: node scripts/fetch-amazon-images.js
 *   3. Verifica que o TÍTULO impresso corresponde ao produto correto
 *   4. Só depois copia o URL de imagem para o page.tsx
 *
 * ⚠️  NUNCA uses a imagem sem confirmar o título — a pesquisa pode retornar
 *     produtos de outras marcas com nomes parecidos.
 *
 * PRODUTOS ATUALMENTE NA PÁGINA (imagens confirmadas — não alterar sem reverificar):
 * ──────────────────────────────────────────────────────────────────────────────────
 * HOKA Clifton 9         51M3xzUi6qL  ✅ confirmado
 * On Cloudmonster 2      71BIO86CufL  ✅ confirmado
 * Salomon Speedcross 6   71vRj0oHa1L  ✅ confirmado
 * Nike Vaporfly 3        714NpSlEF-L  ✅ confirmado
 * Garmin Forerunner 265  71rp-pRCpRL  ✅ confirmado
 * Garmin Forerunner 955  51UPjlUVQBL  ✅ confirmado
 * Polar H10              71BEqJ5XfKL  ✅ confirmado
 * Polar Verity Sense     81Fh813r3vL  ✅ confirmado
 * Polar Pacer Pro        71ZHVSNV+LL  ✅ confirmado
 * SiS Beta Fuel Gel      51Fm2ion7tL  ✅ confirmado
 * Maurten Gel 100        710vQKAUK4L  ✅ confirmado (via Amazon.co.uk)
 * SiS Go Electrolyte     51MbTHkesML  ✅ confirmado
 * GU Energy Gel          61vYkvVMeTL  ✅ confirmado
 * High5 Zero Electrolyte 71h2CgX35JL  ✅ confirmado
 * Optimum Nutrition Whey 71UJkg2rO2L  ✅ confirmado
 * Coros Pace 3           61HE8zhwT7L  ✅ confirmado
 * Compressport Socks     71MaXjnAbtL  ✅ confirmado
 * Nathan SpeedDraw Plus  61VtZS9Jw0L  ✅ confirmado
 * Salomon Active Skin 8  81+6ITtBijL  ✅ confirmado
 */

// ── ADICIONA NOVOS PRODUTOS AQUI ──────────────────────────────────────────────
// Lista gerada ao expandir o inventário de lib/products.ts (rotação de produtos).
// Corre `node scripts/fetch-amazon-images.js`, confirma cada título, e cola os
// URLs de imagem confirmados nos campos `img: ''` correspondentes em lib/products.ts.
const NOVOS_PRODUTOS = [
  // Sapatos
  { nome: 'ASICS Novablast 5', q: 'asics+novablast+5+running', marketplace: 'es' },
  { nome: 'Nike Vomero Plus', q: 'nike+vomero+plus+running', marketplace: 'es' },
  { nome: 'Nike Pegasus 41', q: 'nike+pegasus+41+running', marketplace: 'es' },
  { nome: 'Brooks Ghost Max 2', q: 'brooks+ghost+max+2+running', marketplace: 'es' },
  { nome: 'HOKA Mafate 5', q: 'hoka+mafate+5+trail', marketplace: 'es' },
  { nome: 'La Sportiva Bushido III', q: 'la+sportiva+bushido+3+trail', marketplace: 'es' },
  { nome: 'New Balance Fresh Foam X Hierro v9', q: 'new+balance+fresh+foam+x+hierro+v9', marketplace: 'es' },
  { nome: 'Nike Alphafly 3', q: 'nike+alphafly+3+running', marketplace: 'es' },
  { nome: 'Adidas Adizero Adios Pro 4', q: 'adidas+adizero+adios+pro+4', marketplace: 'es' },
  // Relógios
  { nome: 'Garmin Forerunner 165', q: 'garmin+forerunner+165+gps+running', marketplace: 'es' },
  { nome: 'Garmin Forerunner 970', q: 'garmin+forerunner+970+gps+running', marketplace: 'es' },
  { nome: 'Coros Apex 2', q: 'coros+apex+2+gps+watch', marketplace: 'es' },
  { nome: 'Suunto Race 2', q: 'suunto+race+2+gps+watch', marketplace: 'es' },
  { nome: 'Garmin Instinct 3', q: 'garmin+instinct+3+gps+watch', marketplace: 'es' },
  // Sensores FC
  { nome: 'Garmin HRM-Pro Plus', q: 'garmin+hrm-pro+plus+heart+rate', marketplace: 'es' },
  { nome: 'Wahoo TICKR', q: 'wahoo+tickr+heart+rate', marketplace: 'es' },
  { nome: 'Scosche Rhythm24', q: 'scosche+rhythm24+heart+rate', marketplace: 'es' },
  // Nutrição
  { nome: 'Neversecond C30 Gel', q: 'neversecond+c30+energy+gel', marketplace: 'es' },
  { nome: 'Precision Fuel & Hydration PF 30 Gel', q: 'precision+fuel+hydration+pf30+gel', marketplace: 'es' },
  { nome: 'Honey Stinger Organic Gel', q: 'honey+stinger+organic+energy+gel', marketplace: 'es' },
  { nome: 'Nuun Sport Electrolyte Tablets', q: 'nuun+sport+electrolyte+tablets', marketplace: 'es' },
  { nome: 'Clif Bloks Energy Chews', q: 'clif+bloks+energy+chews', marketplace: 'es' },
  { nome: 'Creatina Monohidratada', q: 'creatina+monohidratada+running', marketplace: 'es' },
  // Acessórios
  { nome: 'Buff Original', q: 'buff+original+running', marketplace: 'es' },
  { nome: 'TriggerPoint GRID Foam Roller', q: 'triggerpoint+grid+foam+roller', marketplace: 'es' },
  { nome: 'Theragun Prime Plus', q: 'theragun+prime+plus', marketplace: 'es' },
  { nome: 'Varta Indestructible H20 Pro', q: 'varta+indestructible+h20+pro+lanterna', marketplace: 'es' },
  { nome: 'Camelbak Flash Belt', q: 'camelbak+flash+belt+running', marketplace: 'es' },
  { nome: 'Oakley Radar EV Path', q: 'oakley+radar+ev+path', marketplace: 'es' },
  { nome: 'Black Diamond Distance Carbon Z', q: 'black+diamond+distance+carbon+z', marketplace: 'es' },
  { nome: 'BodyGlide Original Anti-Chafe', q: 'bodyglide+original+anti+chafe', marketplace: 'es' },
]
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAmazonImage(q, marketplace = 'es') {
  const url = `https://www.amazon.${marketplace}/s?k=${q}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'Accept-Language': 'pt-PT,pt;q=0.9',
      Accept: 'text/html',
    },
  })
  const html = await res.text()

  // Extrair os primeiros 3 resultados com título + imagem
  const titleRe = /class="a-size-medium[^>]*>([^<]{5,100})</g
  const imgRe = /s-image[^>]+src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g

  const titles = [...html.matchAll(titleRe)].map(m => m[1].trim()).slice(0, 3)
  const imgs = [...html.matchAll(imgRe)].map(m => m[1].replace(/_AC_UL\d+_/, '_AC_UL600_')).slice(0, 3)

  return imgs.map((img, i) => ({ title: titles[i] ?? '(título não lido)', img }))
}

async function main() {
  if (NOVOS_PRODUTOS.length === 0) {
    console.log('\n✅ Nenhum produto novo para verificar.')
    console.log('   Adiciona produtos ao array NOVOS_PRODUTOS e corre novamente.\n')
    return
  }

  console.log('\n🔍 A verificar imagens na Amazon...\n')

  for (const p of NOVOS_PRODUTOS) {
    console.log(`\n══ ${p.nome} ══`)
    try {
      const results = await fetchAmazonImage(p.q, p.marketplace ?? 'es')
      results.forEach((r, i) => {
        console.log(`  [${i + 1}] Título: ${r.title}`)
        console.log(`       img: '${r.img}',`)
      })
      console.log()
      console.log('  ⚠️  Confirma que o título [1] corresponde ao produto antes de usar a imagem!')
    } catch (e) {
      console.log(`  ❌ Erro: ${e.message}`)
      console.log('  → Tenta com marketplace: "co.uk" ou "de"')
    }
    await new Promise(r => setTimeout(r, 800))
  }

  console.log('\n──────────────────────────────────────────────')
  console.log('Feito. Copia o URL da imagem confirmada para app/equipamento/page.tsx')
  console.log('e atualiza também a lista de produtos confirmados neste ficheiro.\n')
}

main()
