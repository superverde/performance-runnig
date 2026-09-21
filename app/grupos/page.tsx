'use client'

import { useEffect, useState } from 'react'
import { Copy, Check, ExternalLink, Download } from 'lucide-react'

const GRUPOS = [
  { nome: 'Portugal Running', url: 'https://www.facebook.com/groups/93652494209/', membros: '' },
  { nome: 'Trail Running — Portugal', url: 'https://www.facebook.com/groups/1454687917950266/', membros: '' },
  { nome: 'Apaixonados por Corrida', url: 'https://www.facebook.com/groups/apaixonadosporcorridaoficial/', membros: '' },
  { nome: 'Maratona Clube de Portugal', url: 'https://www.facebook.com/groups/96171969973/', membros: '' },
  { nome: 'Correr Lisboa', url: 'https://www.facebook.com/groups/correrlisboa/', membros: '' },
  { nome: 'UP Running', url: 'https://www.facebook.com/groups/UPRunningCDUP/', membros: '' },
  { nome: 'Tutti Sporting — Corrida de Rua', url: 'https://www.facebook.com/groups/689316968306672/', membros: '' },
]

type Post = { slot: number; hora: string; titulo: string; texto: string; link: string; categoria: string; imagem: string }

// Converte a imagem (pool local é .jpg) para PNG num canvas, porque a
// Clipboard API (navigator.clipboard.write) tem suporte mais fiável a
// 'image/png' entre browsers do que a outros formatos de imagem — ver
// pedido do Pedro (2026-09-21): "quando faço copiar tem que estar tb a
// imagem", ou seja o botão Copiar deve pôr texto + imagem no clipboard
// juntos (não só o texto), para colar tudo de uma vez no grupo.
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
  const [copyState, setCopyState] = useState<'idle' | 'full' | 'text-only' | 'failed'>('idle')
  const [gruposConcluidos, setGruposConcluidos] = useState<Set<number>>(new Set())

  const handleCopy = async () => {
    let result: 'full' | 'text-only' | 'failed' = 'failed'
    try {
      if (!post.imagem || typeof window.ClipboardItem === 'undefined') {
        throw new Error('sem imagem ou browser sem suporte a ClipboardItem')
      }
      const pngBlob = await imageUrlToPngBlob(post.imagem)
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([post.texto], { type: 'text/plain' }),
          'image/png': pngBlob,
        }),
      ])
      result = 'full'
    } catch {
      // Fallback: browsers sem suporte a clipboard multi-formato, ou falha a
      // obter/converter a imagem — tenta pelo menos copiar o texto, como
      // sempre copiou antes desta funcionalidade.
      try {
        await navigator.clipboard.writeText(post.texto)
        result = 'text-only'
      } catch {
        // Os dois falharam (ex: permissão de clipboard bloqueada pelo
        // browser/SO) — nunca deixar isto por resolver em silêncio; o
        // aviso 'failed' diz a Pedro para copiar/guardar manualmente.
        result = 'failed'
      }
    }
    setCopyState(result)
    setTimeout(() => setCopyState('idle'), 2500)
  }

  const toggleGrupo = (i: number) => {
    setGruposConcluidos(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
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
          <a
            href={post.imagem}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[11px] font-mono bg-black/70 hover:bg-black/90 text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
          >
            <Download size={12} />Guardar imagem
          </a>
        </div>
      )}

      <div className="relative">
        <pre className="text-white/70 text-sm whitespace-pre-wrap font-sans leading-relaxed bg-black/30 rounded-xl p-4 pr-12 max-h-48 overflow-y-auto">
          {post.texto}
        </pre>
        <button
          onClick={handleCopy}
          title="Copiar texto + imagem"
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
        >
          {copyState === 'full' || copyState === 'text-only' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>

      {copyState === 'full' && (
        <p className="text-[11px] font-mono text-green-400/80">
          ✓ Copiado: texto + imagem — cola diretamente no grupo (Ctrl/Cmd+V)
        </p>
      )}
      {copyState === 'text-only' && (
        <p className="text-[11px] font-mono text-yellow-500/80">
          ✓ Copiado só o texto (este browser não suporta copiar imagem) — usa "Guardar imagem" acima e anexa à parte
        </p>
      )}
      {copyState === 'failed' && (
        <p className="text-[11px] font-mono text-red-400/80">
          ✗ Não foi possível copiar (permissão de clipboard bloqueada) — seleciona o texto manualmente e usa "Guardar imagem" acima
        </p>
      )}

      <a href={post.link} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs text-brand-green hover:underline font-mono">
        <ExternalLink size={12} />{post.link}
      </a>

      <div>
        <p className="text-white/40 text-xs font-mono mb-3 uppercase tracking-widest">
          Partilhar nos grupos · {gruposConcluidos.size}/{GRUPOS.length} feitos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GRUPOS.map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => toggleGrupo(i)}
                className={`w-5 h-5 rounded flex-shrink-0 border transition-all flex items-center justify-center ${
                  gruposConcluidos.has(i) ? 'bg-brand-green border-brand-green' : 'border-white/20 hover:border-brand-green/50'
                }`}
              >
                {gruposConcluidos.has(i) && <Check size={11} className="text-black" />}
              </button>
              <a href={g.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-white/60 hover:text-white transition-colors truncate">
                {g.nome}{g.membros && <span className="text-white/30 ml-1">·{g.membros}</span>}
              </a>
            </div>
          ))}
        </div>
      </div>

      {gruposConcluidos.size > 0 && (
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-brand-green transition-all duration-500"
            style={{ width: `${(gruposConcluidos.size / GRUPOS.length) * 100}%` }} />
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
            Copia cada texto e partilha nos grupos de corrida. 3 posts × 8 grupos = potencial de +120k corredores por dia.
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
            <li><span className="text-brand-green font-bold">1.</span> Clica "Copiar" no post da manhã (copia texto + imagem)</li>
            <li><span className="text-brand-green font-bold">2.</span> Abre cada grupo e cola (Ctrl/Cmd+V) — texto e imagem vêm juntos</li>
            <li><span className="text-brand-green font-bold">3.</span> Marca o grupo como ✓ concluído</li>
            <li><span className="text-brand-green font-bold">4.</span> Repete à tarde e à noite</li>
            <li><span className="text-brand-green font-bold">5.</span> Se o browser não copiar a imagem (aviso amarelo), usa "Guardar imagem" e anexa à parte</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
