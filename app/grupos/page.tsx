'use client'

import { useEffect, useState } from 'react'
import { Copy, Check, ExternalLink, Download } from 'lucide-react'

// Pedro está em 50 grupos de corrida no Facebook, mas cada partilha só
// deixa escolher 9 grupos de uma vez — por isso cada publicação é partilhada
// em 6 rondas (9+9+9+9+9+5). Até 18/09/2026 fazia isto e o site tinha picos
// de 40+ visitantes/dia vindos do Facebook; ao reduzir para uma só ronda
// (9 grupos) as visitas caíram para menos de metade. Esta secção organiza
// as 6 rondas, com duas proteções contra o filtro de spam do Facebook:
//  - cada ronda tem uma frase de abertura diferente (o texto nunca sai
//    100% igual em rondas seguidas);
//  - mostra quanto tempo passou desde a última ronda e sugere um intervalo
//    mínimo entre rondas (aviso, não bloqueio — a decisão é do Pedro).
const TOTAL_GRUPOS = 50
const GRUPOS_POR_RONDA = 9
const NUM_RONDAS = Math.ceil(TOTAL_GRUPOS / GRUPOS_POR_RONDA) // 6
const INTERVALO_MIN_MINUTOS = 15

// Frase de abertura por ronda. A ronda 1 usa o texto original tal como está.
const ABERTURAS = [
  '',
  '👟 Para quem anda a treinar a sério:',
  'Partilho porque pode ajudar alguém aqui do grupo 👇',
  '🏃 Leitura rápida antes do próximo treino:',
  'Isto mudou a forma como vejo o treino — vale a pena 👇',
  '📌 Guardem para ler com calma:',
]

function textoDaRonda(texto: string, ronda: number): string {
  const abertura = ABERTURAS[ronda % ABERTURAS.length]
  return abertura ? `${abertura}\n\n${texto}` : texto
}

function gruposNaRonda(ronda: number): number {
  return Math.min(GRUPOS_POR_RONDA, TOTAL_GRUPOS - ronda * GRUPOS_POR_RONDA)
}

// Estado das rondas guardado no browser (por dia e por artigo), para não se
// perder ao recarregar a página entre rondas. localStorage pode não existir
// ou lançar erro (modo privado, dados bloqueados) — nesse caso a página
// funciona na mesma, só não se lembra das marcas depois de recarregar.
function chaveRondas(link: string): string {
  return `grupos-rondas:${new Date().toISOString().slice(0, 10)}:${link}`
}

function lerRondas(link: string): (number | null)[] {
  try {
    const raw = window.localStorage.getItem(chaveRondas(link))
    const arr = raw ? JSON.parse(raw) : null
    if (Array.isArray(arr) && arr.length === NUM_RONDAS) return arr
  } catch {
    /* sem storage — começa vazio */
  }
  return Array(NUM_RONDAS).fill(null)
}

function gravarRondas(link: string, rondas: (number | null)[]) {
  try {
    window.localStorage.setItem(chaveRondas(link), JSON.stringify(rondas))
  } catch {
    /* sem storage — ignora */
  }
}

type Post = { slot: number; hora: string; titulo: string; texto: string; link: string; categoria: string; imagem: string }

// Dispara o download de uma imagem sem navegar para fora da página —
// serve de alternativa quando o browser não suporta escrever imagem no
// clipboard (ver copyImage abaixo).
function triggerImageDownload(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

// Converte a imagem para um data URI base64, para poder ser EMBUTIDA
// dentro do HTML copiado (<img src="data:image/...">) em vez de ir como
// ficheiro solto no clipboard. Pedido do Pedro (2026-09-21): "insere a
// imagem dentro do texto". A diferença é decisiva: quando o clipboard tem
// um ficheiro de imagem, o Facebook trata a colagem inteira como "anexar
// foto" e deita fora o texto; quando recebe HTML com a imagem lá dentro,
// segue o caminho normal de colagem de texto formatado — se o sanitizador
// do Facebook preservar a <img>, vem tudo numa única colagem.
function imageUrlToDataUri(url: string): Promise<string> {
  return fetch(url)
    .then((r) => r.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(new Error('falha a ler a imagem como data URI'))
          reader.readAsDataURL(blob)
        })
    )
}

// Escapa o texto para poder ir dentro do HTML sem partir a marcação, e
// converte as quebras de linha em <br> para o post manter os parágrafos.
function textoParaHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

// Converte a imagem (pool local é .jpg) para PNG num canvas — a Clipboard
// API tem suporte mais fiável a 'image/png' entre browsers do que a
// outros formatos. Usada só pelo botão "Copiar imagem", que copia a
// imagem SOZINHA para o clipboard: é o caminho que faz o Facebook anexar
// mesmo a foto (à custa de descartar qualquer texto), e serve de recurso
// quando a imagem embutida no HTML não sobrevive à colagem.
function imageUrlToPngBlob(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob)
        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('sem contexto 2d de canvas'))
            return
          }
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((pngBlob) => {
            URL.revokeObjectURL(objectUrl)
            if (pngBlob) resolve(pngBlob)
            else reject(new Error('canvas.toBlob devolveu null'))
          }, 'image/png')
        }
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl)
          reject(new Error('falha a carregar a imagem no canvas'))
        }
        img.src = objectUrl
      })
      .catch(reject)
  })
}

function PostCard({ post }: { post: Post }) {
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'failed'>('idle')
  const [imgCopyState, setImgCopyState] = useState<'idle' | 'done' | 'failed'>('idle')
  const [linkCopyState, setLinkCopyState] = useState<'idle' | 'done' | 'failed'>('idle')
  // Timestamp (ms) de quando cada ronda foi marcada como feita; null = por fazer.
  const [rondas, setRondas] = useState<(number | null)[]>(() => Array(NUM_RONDAS).fill(null))
  const [rondaCopiada, setRondaCopiada] = useState<number | null>(null)
  const [agora, setAgora] = useState(() => Date.now())

  // Carrega as marcas guardadas (só no browser) e atualiza o relógio a cada
  // 30 s para o contador "última ronda há X min" se manter certo.
  useEffect(() => {
    setRondas(lerRondas(post.link))
    const t = setInterval(() => setAgora(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [post.link])

  // Copia o texto COM a imagem embutida dentro dele (text/html), para uma
  // única colagem levar as duas coisas. Não escrevemos aqui nenhuma
  // representação 'image/png': é precisamente essa que faz o Facebook
  // tratar a colagem como "anexar foto" e descartar o texto. Com HTML, a
  // colagem segue o caminho de texto formatado — se o Facebook preservar a
  // <img>, vem tudo junto; se a remover, fica pelo menos o texto completo
  // (nunca fica pior do que copiar só texto). Para anexar a foto à força,
  // continua a existir o botão "Copiar imagem" ao lado da imagem.
  // Devolve true se copiou (com ou sem imagem), false se o clipboard falhou.
  const copiarTexto = async (texto: string): Promise<boolean> => {
    try {
      const html = post.imagem
        ? `<div><img src="${await imageUrlToDataUri(post.imagem)}" width="500"><br><br>${textoParaHtml(texto)}</div>`
        : `<div>${textoParaHtml(texto)}</div>`
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([texto], { type: 'text/plain' }),
        }),
      ])
      return true
    } catch {
      // Browser sem suporte a clipboard multi-formato, ou falha a obter a
      // imagem — copia pelo menos o texto, como sempre funcionou.
      try {
        await navigator.clipboard.writeText(texto)
        return true
      } catch {
        // Clipboard bloqueado (ex: permissão negada pelo browser/SO) —
        // nunca deixar isto por resolver em silêncio.
        return false
      }
    }
  }

  const handleCopy = async () => {
    setCopyState((await copiarTexto(post.texto)) ? 'done' : 'failed')
    setTimeout(() => setCopyState('idle'), 3000)
  }

  const copiarRonda = async (i: number) => {
    const ok = await copiarTexto(textoDaRonda(post.texto, i))
    setRondaCopiada(ok ? i : -1)
    setTimeout(() => setRondaCopiada(null), 3000)
  }

  const toggleRonda = (i: number) => {
    setRondas(prev => {
      const next = [...prev]
      next[i] = next[i] ? null : Date.now()
      gravarRondas(post.link, next)
      return next
    })
  }

  const feitas = rondas.filter(Boolean).length
  const gruposFeitos = rondas.reduce<number>((n, r, i) => (r ? n + gruposNaRonda(i) : n), 0)
  const ultimaRonda = rondas.reduce<number>((m, r) => (r && r > m ? r : m), 0)
  const minDesdeUltima = ultimaRonda ? Math.floor((agora - ultimaRonda) / 60_000) : null
  const esperar = minDesdeUltima !== null && feitas < NUM_RONDAS && minDesdeUltima < INTERVALO_MIN_MINUTOS

  // Copia só a IMAGEM para o clipboard, para colar diretamente como anexo
  // no Facebook (Ctrl/Cmd+V) — exatamente o fluxo que já funcionava antes.
  // Pedro confirmou (2026-09-21) que juntar texto+imagem no mesmo
  // clipboard não funciona porque o Facebook, ao ver imagem, descarta o
  // texto — por isso texto e imagem são agora duas ações independentes:
  // cola a imagem primeiro (Ctrl/Cmd+V anexa a foto), depois cola o texto
  // por cima (segunda vez que copiares o texto) na caixa de legenda.
  const copyImage = async () => {
    try {
      if (!post.imagem || typeof window.ClipboardItem === 'undefined') {
        throw new Error('sem imagem ou browser sem suporte a ClipboardItem')
      }
      const pngBlob = await imageUrlToPngBlob(post.imagem)
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })])
      setImgCopyState('done')
    } catch {
      // Browser sem suporte a copiar imagem para o clipboard (ou falha a
      // obter/converter) — fallback para download, que sempre funciona.
      const ext = post.imagem.endsWith('.png') ? 'png' : 'jpg'
      triggerImageDownload(post.imagem, `performance-running-${post.slot}.${ext}`)
      setImgCopyState('failed')
    }
    setTimeout(() => setImgCopyState('idle'), 3000)
  }

  // Copia só o link do artigo, para colar no PRIMEIRO COMENTÁRIO em vez do
  // corpo da publicação. Motivo (pesquisa de 2026-09-21): o Facebook reduz o
  // alcance de publicações com links externos (≈0,06% de engagement contra
  // ≈0,24% nas de imagem) e limita páginas e perfis em Modo Profissional a
  // duas publicações orgânicas com link por mês — foi esse limite que levou
  // Pedro a mandar tirar os links dos textos dos grupos a 2026-09-02. A
  // orientação atual do próprio Facebook é pôr o link no primeiro comentário:
  // a publicação não leva penalização e o link continua acessível.
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(post.link)
      setLinkCopyState('done')
    } catch {
      setLinkCopyState('failed')
    }
    setTimeout(() => setLinkCopyState('idle'), 3000)
  }

  const slots = ['🌅 Manhã', '☀️ Tarde', '🌙 Noite', '📬 Newsletter']
  const cores = ['border-yellow-500/40', 'border-blue-500/40', 'border-purple-500/40', 'border-brand-green/40']

  return (
    <div className={`bg-white/5 border ${cores[post.slot]} rounded-2xl p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest">
          {slots[post.slot]} · {post.hora}
        </span>
        <span className="text-xs bg-white/10 text-white/60 px-3 py-1 rounded-full">{post.categoria}</span>
      </div>

      <h3 className="text-white font-bold text-lg leading-snug">{post.titulo}</h3>

      {post.imagem && (
        <div className="relative group rounded-xl overflow-hidden bg-black/30">
          <img
            src={post.imagem}
            alt={post.titulo}
            loading="lazy"
            className="w-full h-40 object-cover"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <button
              onClick={copyImage}
              title="Copiar imagem (cola diretamente como anexo no Facebook)"
              className="flex items-center gap-1.5 text-[11px] font-mono bg-black/70 hover:bg-black/90 text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
            >
              {imgCopyState === 'done' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              Copiar imagem
            </button>
            <a
              href={post.imagem}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-mono bg-black/70 hover:bg-black/90 text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
            >
              <Download size={12} />Guardar
            </a>
          </div>
        </div>
      )}

      {imgCopyState === 'done' && (
        <p className="text-[11px] font-mono text-green-400/80">
          ✓ Imagem copiada — cola diretamente no Facebook (Ctrl/Cmd+V anexa a foto)
        </p>
      )}
      {imgCopyState === 'failed' && (
        <p className="text-[11px] font-mono text-yellow-500/80">
          ✓ Imagem descarregada (este browser não suporta copiar imagem) — anexa o ficheiro manualmente
        </p>
      )}

      <div className="relative">
        <pre className="text-white/70 text-sm whitespace-pre-wrap font-sans leading-relaxed bg-black/30 rounded-xl p-4 pr-12 max-h-48 overflow-y-auto">
          {post.texto}
        </pre>
        <button
          onClick={handleCopy}
          title="Copiar texto com a imagem lá dentro"
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
        >
          {copyState === 'done' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>

      {copyState === 'done' && (
        <p className="text-[11px] font-mono text-green-400/80">
          ✓ Copiado com a imagem dentro do texto — cola no grupo (Ctrl/Cmd+V). Se a imagem não aparecer, usa "Copiar imagem" acima e cola outra vez.
        </p>
      )}
      {copyState === 'failed' && (
        <p className="text-[11px] font-mono text-red-400/80">
          ✗ Não foi possível copiar o texto (permissão de clipboard bloqueada) — seleciona-o manualmente
        </p>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <a href={post.link} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-brand-green hover:underline font-mono">
          <ExternalLink size={12} />{post.link}
        </a>
        <button
          onClick={copyLink}
          title="Copiar o link para colar no primeiro comentário (sem penalizar o alcance)"
          className="flex items-center gap-1.5 text-[11px] font-mono bg-white/10 hover:bg-white/20 text-white/70 hover:text-white px-2.5 py-1 rounded-lg transition-all"
        >
          {linkCopyState === 'done' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          Copiar link para 1.º comentário
        </button>
      </div>

      {linkCopyState === 'done' && (
        <p className="text-[11px] font-mono text-green-400/80">
          ✓ Link copiado — publica primeiro o post sem link e cola isto no primeiro comentário
        </p>
      )}
      {linkCopyState === 'failed' && (
        <p className="text-[11px] font-mono text-red-400/80">
          ✗ Não foi possível copiar o link — copia-o à mão a partir do endereço acima
        </p>
      )}

      <div>
        <p className="text-white/40 text-xs font-mono mb-1 uppercase tracking-widest">
          Partilhar nos {TOTAL_GRUPOS} grupos · {feitas}/{NUM_RONDAS} rondas · {gruposFeitos}/{TOTAL_GRUPOS} grupos
        </p>
        <p className="text-white/30 text-[11px] mb-3">
          Cada ronda = até {GRUPOS_POR_RONDA} grupos escolhidos na partilha do Facebook. Cada ronda tem uma abertura
          diferente, para o texto não sair igual. Deixa ~{INTERVALO_MIN_MINUTOS} min entre rondas.
        </p>

        {minDesdeUltima !== null && feitas < NUM_RONDAS && (
          <p className={`text-[11px] font-mono mb-3 ${esperar ? 'text-yellow-500/80' : 'text-green-400/80'}`}>
            {esperar
              ? `⏳ Última ronda há ${minDesdeUltima} min — espera mais ~${INTERVALO_MIN_MINUTOS - minDesdeUltima} min antes da próxima`
              : `✓ Última ronda há ${minDesdeUltima} min — podes avançar para a próxima`}
          </p>
        )}

        <div className="space-y-2">
          {rondas.map((feitaEm, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 border transition-all ${
                feitaEm ? 'bg-brand-green/10 border-brand-green/30' : 'bg-black/20 border-white/10'
              }`}
            >
              <button
                onClick={() => toggleRonda(i)}
                aria-label={`Marcar ronda ${i + 1} como ${feitaEm ? 'por fazer' : 'feita'}`}
                className={`w-5 h-5 rounded flex-shrink-0 border transition-all flex items-center justify-center ${
                  feitaEm ? 'bg-brand-green border-brand-green' : 'border-white/20 hover:border-brand-green/50'
                }`}
              >
                {feitaEm && <Check size={11} className="text-black" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 font-bold">
                  Ronda {i + 1} · {gruposNaRonda(i)} grupos
                  {feitaEm && (
                    <span className="text-white/40 font-normal ml-2">
                      feita às {new Date(feitaEm).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-white/40 truncate">
                  {ABERTURAS[i % ABERTURAS.length] || 'Texto original'}
                </p>
              </div>
              <button
                onClick={() => copiarRonda(i)}
                title={`Copiar o texto da ronda ${i + 1}`}
                className="flex items-center gap-1.5 text-[11px] font-mono bg-white/10 hover:bg-white/20 text-white/70 hover:text-white px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0"
              >
                {rondaCopiada === i ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {rondaCopiada === i ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          ))}
        </div>

        {rondaCopiada === -1 && (
          <p className="text-[11px] font-mono text-red-400/80 mt-2">
            ✗ Não foi possível copiar (permissão de clipboard bloqueada) — seleciona o texto manualmente
          </p>
        )}
      </div>

      {feitas > 0 && (
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-brand-green transition-all duration-500"
            style={{ width: `${(gruposFeitos / TOTAL_GRUPOS) * 100}%` }} />
        </div>
      )}
    </div>
  )
}

export default function GruposPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hoje, setHoje] = useState('')

  useEffect(() => {
    setHoje(new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }))
    fetch('/api/grupos-posts')
      .then(r => r.json())
      .then(data => { setPosts(data.posts ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">
            Painel de grupos · {hoje}
          </p>
          <h1 className="font-display text-5xl font-black text-white mb-3">
            GRUPOS<br /><span className="text-brand-green">DO DIA.</span>
          </h1>
          <p className="text-white/40 text-sm max-w-lg">
            Cada post é partilhado em 6 rondas de até 9 grupos, para chegar aos 50 grupos de corrida. Cada ronda tem uma abertura diferente.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/30 text-sm font-mono">A carregar posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm font-mono">Sem posts disponíveis</div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, i) => <PostCard key={i} post={post} />)}
          </div>
        )}

        <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/60 text-xs font-mono uppercase tracking-widest mb-3">Como usar · 5 min/dia</p>
          <ol className="space-y-2 text-sm text-white/50">
            <li><span className="text-brand-green font-bold">1.</span> Em cada post, clica "Copiar" na <strong className="text-white/70">Ronda 1</strong> — leva o texto com a imagem lá dentro</li>
            <li><span className="text-brand-green font-bold">2.</span> No Facebook, partilha e escolhe 9 grupos; cola o texto (Ctrl/Cmd+V). Se a imagem não vier, usa "Copiar imagem" e cola outra vez</li>
            <li><span className="text-brand-green font-bold">3.</span> Cola o link no primeiro comentário ("Copiar link")</li>
            <li><span className="text-brand-green font-bold">4.</span> Marca a ronda como ✓ feita</li>
            <li><span className="text-brand-green font-bold">5.</span> Espera ~15 min e repete com a Ronda 2 (outra abertura, outros 9 grupos) — até à Ronda 6</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
