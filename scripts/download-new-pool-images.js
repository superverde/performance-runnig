// Descarrega as fotos novas do pool de categorias (lib/images.ts, secção
// "NOVAS 2026-09-18") para public/pool-images/ — mesmo padrão v3 já usado
// pelas fotos antigas (cópia local, nunca hotlink direto ao Unsplash: ver
// comentário no topo de lib/images.ts sobre IDs do Unsplash que desapareceram
// no passado). Corre uma vez com: node scripts/download-new-pool-images.js
//
// As fotos foram escolhidas e confirmadas visualmente (via browser, grelha de
// resultados do Unsplash + texto alternativo gerado a partir da própria
// imagem) numa sessão de curadoria em 2026-09-18, pedida pelo Pedro para dar
// mais variedade e fotos mais atrativas/coerentes por categoria (o pool
// antigo tinha só 5-6 fotos repetidas por 30+ artigos cada, e algumas nem
// combinavam com o tema — ex. "Treino"/"VO2max" com fotos de ginásio).

const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, '..', 'public', 'pool-images')

// { id: photo-<unsplash-id>, mesmo formato usado em lib/images.ts }
const NEW_IMAGES = [
  // Treino
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
  // Fisiologia
  'photo-1774050021301-831282cfc3a4',
  'photo-1774050021147-a264e14a70e4',
  'photo-1774050021270-c52bc454ba40',
  'photo-1774050021229-feca39f78855',
  'photo-1774050021155-f2c0fa1a9658',
  'photo-1774050021349-d2024626b531',
  'photo-1774050021668-51cb8d8b4537',
  'photo-1775400787974-548ca79ad3f0',
  'photo-1659366100463-9e29a63adcc2',
  // Nutrição
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
  // Biomecânica
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
  // Recuperação
  'photo-1593431763017-c689a61b729a',
  'photo-1761839257789-20147513121a',
  'photo-1770012905139-713758ded6ec',
  'photo-1531403939386-c08a16cd7eef',
  'photo-1640262653851-103cbaf802d5',
  // Trail Running
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
  // Lesões
  'photo-1758684051090-bc83bb0af184',
  'photo-1619684736572-cf0a43823d87',
  'photo-1783698156307-8e2910a36a21',
  'photo-1777911045224-8d82bba2e607',
  'photo-1746806942507-a7e93fdd6dd4',
  'photo-1746842419697-03234f5ff03e',
  'photo-1746806942505-7215c07810ae',
  // Psicologia
  'photo-1516398810565-0cb4310bb8ea',
  'photo-1502224562085-639556652f33',
  'photo-1644456654239-3c036c0c28fe',
  'photo-1581889470536-467bdbe30cd0',
  'photo-1774050021045-ef4643e7b61d',
  'photo-1769867627903-ca4c13b80701',
  // VO2max
  'photo-1709601415546-dcd24c912e56',
  'photo-1709601414313-17217448a9fd',
  'photo-1709601414405-db08d323a87a',
  'photo-1623285512376-4a67139e83cf',
  'photo-1633394782240-f81aba3f850d',
  'photo-1646072508563-3e6debc0fb11',
  'photo-1738524107920-777b97fda911',
]

function sourceUrl(id) {
  return `https://images.unsplash.com/${id}?w=1200&q=75&fit=crop&fm=jpg`
}

async function downloadOne(id, index, total) {
  const dest = path.join(OUT_DIR, `${id}.jpg`)
  if (fs.existsSync(dest)) {
    console.log(`[${index}/${total}] já existe, a saltar: ${id}.jpg`)
    return
  }
  const url = sourceUrl(id)
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ao descarregar ${id}`)
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buffer)
  console.log(`[${index}/${total}] ok: ${id}.jpg (${(buffer.length / 1024).toFixed(0)} KB)`)
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  const unique = [...new Set(NEW_IMAGES)]
  console.log(`A descarregar ${unique.length} fotos novas para ${OUT_DIR}...\n`)

  const failed = []
  for (let i = 0; i < unique.length; i++) {
    try {
      await downloadOne(unique[i], i + 1, unique.length)
    } catch (err) {
      console.error(`[${i + 1}/${unique.length}] FALHOU: ${unique[i]} — ${err.message}`)
      failed.push(unique[i])
    }
  }

  console.log(`\nConcluído. ${unique.length - failed.length}/${unique.length} descarregadas com sucesso.`)
  if (failed.length > 0) {
    console.log('Falharam (corre o script outra vez para tentar de novo, só estas ficam em falta):')
    failed.forEach((id) => console.log(`  - ${id}`))
    process.exitCode = 1
  }
}

main()
