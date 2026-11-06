'use client'

import { useEffect, useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'

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

// A foto deixou de aparecer nesta página (pedido do Pedro, 2026-11-06): ao
// colar só o texto com o link, o Facebook gera sozinho o cartão com a foto
// clicável; anexar uma foto à parte escondia esse cartão.
function PostCard({ post }: { post: Post }) {
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'failed'>('idle')
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

  // Copia só o TEXTO simples, com o link do artigo lá dentro. Até
  // 2026-09-21 embutia-se a imagem no HTML copiado para poupar um passo —
  // mas isso arrisca o Facebook tratar a colagem como "anexar foto", o que
  // esconde a pré-visualização automática do link. É essa pré-visualização
  // (gerada pelo próprio Facebook a partir do link no texto) que torna a
  // FOTO clicável e leva ao artigo — pedido do Pedro (2026-09-26): "o link
  // estava na foto". Por isso a cópia volta a ser só texto: ao colar, o
  // Facebook deteta o link e gera sozinho a pré-visualização com imagem.
  // Os botões "Copiar imagem" / "Guardar" foram removidos em 2026-11-06:
  // anexar uma foto substitui a pré-visualização clicável por uma foto normal.
  const copiarTexto = async (texto: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(texto)
      return true
    } catch {
      // Clipboard bloqueado (ex: permissão negada pelo browser/SO) —
      // nunca deixar isto por resolver em silêncio.
      return false
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

  // 2026-09-26: o link voltou a ir dentro do texto do post (pedido do
  // Pedro — os resultados eram melhores com o link direto), por isso já
  // não é preciso colá-lo à parte no primeiro comentário.

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


      <div className="relative">
        <pre className="text-white/70 text-sm whitespace-pre-wrap font-sans leading-relaxed bg-black/30 rounded-xl p-4 pr-12 max-h-48 overflow-y-auto">
          {post.texto}
        </pre>
        <button
          onClick={handleCopy}
          title="Copiar texto (com o link do artigo)"
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
        >
          {copyState === 'done' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>

      {copyState === 'done' && (
        <p className="text-[11px] font-mono text-green-400/80">
          ✓ Copiado — cola no grupo (Ctrl/Cmd+V) e espera 2-3 s: o Facebook mostra sozinho o cartão do artigo com foto clicável. Não anexes imagem.
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
      </div>

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
            <li><span className="text-brand-green font-bold">1.</span> Em cada post, clica "Copiar" na <strong className="text-white/70">Ronda 1</strong> — leva o texto com o link do artigo</li>
            <li><span className="text-brand-green font-bold">2.</span> No Facebook, partilha e escolhe 9 grupos; cola o texto (Ctrl/Cmd+V) — o Facebook mostra sozinho a pré-visualização do artigo com foto, a partir do link</li>
            <li><span className="text-brand-green font-bold">3.</span> Marca a ronda como ✓ feita</li>
            <li><span className="text-brand-green font-bold">4.</span> Espera ~15 min e repete com a Ronda 2 (outra abertura, outros 9 grupos) — até à Ronda 6</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
