/**
 * Publica artigos a partir da fila (content/fila/) — 2026-10-20.
 *
 * Porquê: o gerador automático (modelo gratuito na Groq) inventava produtos,
 * números e referências. O Pedro decidiu ter uma reserva de artigos escritos
 * e verificados com antecedência, publicados à cadência de 3 por dia. Este
 * script corre ANTES do gerador na tarefa diária (.github/workflows/
 * daily-articles.yml): tira da fila os artigos que faltam para chegar aos 3 do
 * dia, põe-lhes a data de hoje e move-os para content/blog/. O gerador corre a
 * seguir e só escreve alguma coisa se a fila não tiver chegado (rede de
 * segurança para nunca falhar um dia).
 *
 * Formato da fila:
 *   content/fila/NNN-<slug>.md   (NNN = ordem de publicação, ex.: 001, 002…)
 *   Frontmatter completo, com `date: 'PENDENTE'` — a data é posta na
 *   publicação. O ficheiro publicado chama-se <slug>.md (sem o prefixo).
 *
 * Não depende do Claude nem do computador do Pedro: só Node e o repositório.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BLOG_DIR = path.join(ROOT, 'content', 'blog')
const FILA_DIR = path.join(ROOT, 'content', 'fila')
const POR_DIA = 3
const AVISO_RESERVA = 20

// Mesma data que o gerador usa (UTC), para os dois contarem o mesmo "hoje".
const hoje = new Date().toISOString().slice(0, 10)

function artigosDeHoje() {
  let n = 0
  for (const f of fs.readdirSync(BLOG_DIR)) {
    if (!f.endsWith('.md')) continue
    const txt = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8')
    const m = txt.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)
    if (m && m[1] === hoje) n++
  }
  return n
}

// Verificação mínima antes de publicar — a qualidade de fundo é garantida
// quando o artigo entra na fila; isto só impede publicar um ficheiro partido.
function problemas(txt) {
  const p = []
  const fm = txt.match(/^---\n([\s\S]*?)\n---\n/)
  if (!fm) return ['sem frontmatter']
  const cab = fm[1]
  for (const campo of ['title', 'category', 'excerpt']) {
    if (!new RegExp(`^${campo}:\\s*\\S`, 'm').test(cab)) p.push(`sem ${campo}`)
  }
  if (!/^date:\s*['"]?PENDENTE['"]?\s*$/m.test(cab)) p.push("date não é 'PENDENTE'")
  const corpo = txt.slice(fm[0].length)
  if (corpo.split(/\s+/).filter(Boolean).length < 500) p.push('corpo com menos de 500 palavras')
  if (!/^##\s*(Referências|Fontes)/mi.test(corpo)) p.push('sem secção de Referências/Fontes')
  return p
}

function main() {
  if (!fs.existsSync(FILA_DIR)) {
    console.log('ℹ️  Sem pasta content/fila — nada a publicar da fila.')
    return
  }
  const fila = fs.readdirSync(FILA_DIR).filter(f => /^\d+-.+\.md$/.test(f)).sort()
  const jaHoje = artigosDeHoje()
  const faltam = Math.max(0, POR_DIA - jaHoje)
  console.log(`📅 ${hoje} — já publicados hoje: ${jaHoje}/${POR_DIA}; na fila: ${fila.length}`)

  let publicados = 0
  for (const f of fila) {
    if (publicados >= faltam) break
    const slug = f.replace(/^\d+-/, '').replace(/\.md$/, '')
    const destino = path.join(BLOG_DIR, `${slug}.md`)
    const origem = path.join(FILA_DIR, f)
    if (fs.existsSync(destino)) {
      console.log(`::warning::"${slug}" já existe em content/blog — fica na fila por publicar; remove-o ou muda-lhe o slug.`)
      continue
    }
    const txt = fs.readFileSync(origem, 'utf8')
    const erros = problemas(txt)
    if (erros.length) {
      console.log(`::warning::"${f}" não publicado: ${erros.join('; ')}`)
      continue
    }
    fs.writeFileSync(destino, txt.replace(/^date:\s*['"]?PENDENTE['"]?\s*$/m, `date: '${hoje}'`), 'utf8')
    fs.unlinkSync(origem)
    publicados++
    console.log(`✅ Publicado da fila: ${slug}`)
  }

  const restam = fila.length - publicados
  console.log(`📦 Publicados da fila nesta execução: ${publicados}. Restam na fila: ${restam} (~${Math.floor(restam / POR_DIA)} dias).`)
  if (restam < AVISO_RESERVA) {
    console.log(`::warning::Reserva de artigos baixa: só ${restam} na fila (~${Math.floor(restam / POR_DIA)} dias). Quando esvaziar, o gerador automático volta a escrever os artigos do dia.`)
  }
}

main()
