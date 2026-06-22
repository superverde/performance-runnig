/**
 * fetch-amazon-images.js
 * ─────────────────────
 * Sempre que adicionares um novo produto à página /equipamento,
 * adiciona-o ao array PRODUTOS abaixo e corre:
 *
 *   node scripts/fetch-amazon-images.js
 *
 * O script imprime o URL da imagem real da Amazon para cada produto.
 * Cola o URL no campo `img:` do produto em app/equipamento/page.tsx.
 */

const PRODUTOS = [
  // Sapatos
  { nome: 'HOKA Clifton 9',        q: 'hoka+clifton+9' },
  { nome: 'On Cloudmonster 2',     q: 'on+cloudmonster+2+running' },
  { nome: 'Salomon Speedcross 6',  q: 'salomon+speedcross+6' },
  { nome: 'Nike Vaporfly 3',       q: 'nike+vaporfly+3' },
  // Relógios
  { nome: 'Garmin Forerunner 265', q: 'garmin+forerunner+265' },
  { nome: 'Garmin Forerunner 955', q: 'garmin+forerunner+955' },
  // Sensores FC
  { nome: 'Polar H10',             q: 'polar+h10+monitor+cardiaco' },
  { nome: 'Polar Verity Sense',    q: 'polar+verity+sense' },
  { nome: 'Polar Pacer Pro',       q: 'polar+pacer+pro' },
  // Nutrição
  { nome: 'SiS Beta Fuel Gel',     q: 'sis+beta+fuel+gel' },
  { nome: 'Maurten Gel 100',       q: 'maurten+gel+100' },
  { nome: 'SiS Go Electrolyte',    q: 'sis+go+electrolyte+powder' },
  { nome: 'GU Energy Gel',         q: 'gu+energy+gel+running' },
  { nome: 'High5 Zero Electrolyte',q: 'high5+zero+electrolyte+tablets' },
  { nome: 'Whey Proteína Isolada', q: 'whey+protein+isolate+running+recovery' },
  // Acessórios
  { nome: 'Coros Pace 3',          q: 'coros+pace+3' },
  { nome: 'Craft ADV Endurance',   q: 'craft+running+socks' },
  { nome: 'Nathan SpeedDraw Plus', q: 'nathan+speeddraw+handheld' },
  { nome: 'Salomon Active Skin 8', q: 'salomon+active+skin+8' },

  // ── ADICIONA NOVOS PRODUTOS AQUI ──────────────────────────────────
  // { nome: 'Nome do Produto', q: 'nome+do+produto+amazon' },
  // ──────────────────────────────────────────────────────────────────
]

async function fetchAmazonImage(q) {
  const url = `https://www.amazon.es/s?k=${q}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'pt-PT,pt;q=0.9',
      'Accept': 'text/html',
    },
  })
  const html = await res.text()
  const match = html.match(/s-image[^>]+src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/)
  if (!match) return null
  // Usa tamanho 600px — bom equilíbrio qualidade/velocidade
  return match[1].replace(/_AC_UL\d+_/, '_AC_UL600_')
}

async function main() {
  console.log('\n📦 A buscar imagens reais da Amazon...\n')
  for (const p of PRODUTOS) {
    try {
      const img = await fetchAmazonImage(p.q)
      if (img) {
        console.log(`✅ ${p.nome}`)
        console.log(`   img: '${img}',\n`)
      } else {
        console.log(`❌ ${p.nome} — imagem não encontrada. Tenta ajustar a query.\n`)
      }
    } catch (e) {
      console.log(`💥 ${p.nome} — erro: ${e.message}\n`)
    }
    // Pequena pausa para não sobrecarregar a Amazon
    await new Promise(r => setTimeout(r, 800))
  }
  console.log('Concluído. Cola os URLs acima no app/equipamento/page.tsx.\n')
}

main()
