import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GraduationCap, Timer, Flag, Mountain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre o Autor — Rui Cardoso',
  alternates: { canonical: 'https://www.performancerunning.pt/sobre/autor' },
  description:
    'Rui Cardoso, professor de Educação Física e corredor há 7 anos, é quem escreve e revê o conteúdo do Performance Running. Credenciais, percurso e resultados pessoais.',
}

const stats = [
  { label: '1 km', value: '3:28.4' },
  { label: '1 milha', value: '6:16.3' },
  { label: '5 km', value: '20:26' },
  { label: '10 km', value: '42:16' },
  { label: 'Meia maratona', value: '1:34:34' },
  { label: 'Maratona', value: '3:48:18' },
]

export default function AutorPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 pb-24 border-b border-white/5 overflow-hidden"
        style={{
          backgroundImage: 'url(https://www.performancerunning.pt/pool-images/photo-1519315901367-f34ff9154487.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/97 via-black/90 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-5">
              Quem Escreve
            </p>
            <h1
              className="font-display text-white leading-none mb-8"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
            >
              RUI CARDOSO.
            </h1>
            <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl mb-6">
              Escrevo e reviso o conteúdo do Performance Running como <strong className="text-white">professor de Educação Física</strong> (mestrado em Ensino de Educação Física em curso) e como corredor há <strong className="text-white">7 anos</strong>.
              Não sou nenhum atleta de elite — sou um praticante sério que trata a formação técnica e a evidência científica como parte do trabalho, não como acessório.
            </p>
            <p className="text-white/60 leading-relaxed max-w-2xl">
              &quot;Rui Cardoso&quot; é um nome profissional — escrevo aqui à parte da minha atividade como docente e prefiro manter as duas coisas separadas.
              As credenciais, o percurso e os resultados abaixo são reais.
            </p>
          </div>
        </div>
      </section>

      {/* Credenciais */}
      <section className="relative py-24 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-3">
                Formação
              </p>
              <h2
                className="font-display text-white leading-none mb-8"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
              >
                PROFESSOR,<br /><span className="text-white/35">NÃO SÓ CORREDOR.</span>
              </h2>
              <div className="space-y-6 text-white/70 leading-relaxed">
                <div className="flex gap-4">
                  <GraduationCap className="w-5 h-5 text-brand-green shrink-0 mt-1" />
                  <p>
                    Professor de Educação Física, atualmente a concluir o mestrado em Ensino de Educação Física.
                    É essa formação — ler estudos, avaliar metodologia, distinguir evidência forte de moda passageira — que aplico à triagem
                    e revisão de cada artigo publicado aqui, mesmo nos que não escrevo de raiz.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Timer className="w-5 h-5 text-brand-green shrink-0 mt-1" />
                  <p>
                    Corro há 7 anos, sem interrupção de época longa. Não é o mesmo que ter décadas de treino de alta competição,
                    e não finjo o contrário — mas é tempo suficiente para ter passado por lesões, planos mal feitos, e planos que finalmente resultaram.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-3">
                Resultados Pessoais
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-white/40 text-[11px] font-mono uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="font-display text-white text-2xl">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-3">
                  <Flag className="w-4 h-4 text-brand-green shrink-0" />
                  <div>
                    <p className="text-white/40 text-[11px] font-mono uppercase tracking-widest">Maratona de Lisboa</p>
                    <p className="text-white text-sm font-bold">2024 — 3h49 &nbsp;·&nbsp; 2025 — 3:48:18</p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-3">
                  <Mountain className="w-4 h-4 text-brand-green shrink-0" />
                  <div>
                    <p className="text-white/40 text-[11px] font-mono uppercase tracking-widest">Corrida mais longa</p>
                    <p className="text-white text-sm font-bold">42.58 km</p>
                  </div>
                </div>
              </div>
              <p className="text-white/40 text-xs mt-4 leading-relaxed">
                Tempos e distâncias autorreportados, atualizados manualmente — não há aqui nenhuma pretensão de nível de elite,
                só a transparência de mostrar quem escreve também aplica isto a si próprio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofia editorial */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(https://www.performancerunning.pt/pool-images/photo-1538481199705-c710c4e965fc.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll',
        }}
      >
        <div className="absolute inset-0 bg-black/94" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-3">
              Como Trabalho
            </p>
            <h2
              className="font-display text-white leading-none mb-8"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              CIÊNCIA PRIMEIRO,<br /><span className="text-white/35">OPINIÃO DEPOIS.</span>
            </h2>
            <div className="space-y-5 text-white/70 text-base leading-relaxed">
              <p>
                O Performance Running publica vários artigos por dia, o que só é possível com apoio de geração assistida por IA.
                Isso não substitui a supervisão editorial: as referências científicas usadas são verificadas, a estrutura e as
                afirmações técnicas são revistas, e os erros — quando aparecem, porque aparecem — são corrigidos assim que identificados,
                não escondidos.
              </p>
              <p>
                Prefiro dizer isto abertamente a fingir uma redação humana artigo a artigo que não existe. O que não abdico é do
                critério por trás: se uma afirmação não tem suporte em evidência razoável, não fica no artigo.
              </p>
            </div>

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-brand-green/90 transition-all hover:scale-105"
              >
                Explorar Artigos <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
