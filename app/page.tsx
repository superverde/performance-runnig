export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getLatestArticles, getAllArticles, getTodayArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/ArticleCard'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { ArrowRight, ArrowUpRight, Zap } from 'lucide-react'
import { getLocaleFromCookie, getMessages } from '@/lib/locale-server'
import type { Metadata } from 'next'

// Canonical próprio — o canonical global no layout foi removido porque fazia
// TODAS as páginas sem canonical próprio (ex: /blog) apontar para a homepage,
// o que diz ao Google para as ignorar como duplicados.
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.performancerunning.pt' },
}

// Cada URL abaixo foi carregada e confirmada visualmente (via browser) antes
// de entrar aqui — o código antigo tinha vários IDs do Unsplash com
// comentários que não correspondiam ao conteúdo real da foto (ex: um ID
// "trail running" que era na verdade uma foto de fruta, ou "mountain trail"
// que era dois corredores numa estrada ao pôr do sol). Índices 2, 3 e 7
// foram corrigidos numa segunda verificação: o índice 2 devolvia um 404
// real (imagem partida em produção), o índice 3 era uma estrada rural sem
// nenhum corredor, e o índice 7 era uma foto de microscópio.
const topicImages = [
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=70',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=70',
  'https://images.unsplash.com/photo-1613936360976-8f35cf0e5461?w=600&q=70',
  'https://images.unsplash.com/photo-1519703936-c4a3b3eb88e4?w=600&q=70',
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=70',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=70',
  'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=600&q=70',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=70',
]

const categoryNames = ['Treino', 'Fisiologia', 'Nutrição', 'Biomecânica', 'Recuperação', 'Psicologia', 'Trail Running', 'Lesões']

export default async function HomePage() {
  const locale = getLocaleFromCookie()
  const messages = await getMessages(locale)
  const t = (section: string, key: string) => (messages as Record<string, Record<string, string>>)?.[section]?.[key] ?? key

  const articles = await getLatestArticles(7)
  const allArticles = getAllArticles()
  const totalArticles = allArticles.length
  const todayArticles = getTodayArticles()

  const [featured, ...rest] = articles
  const sideArticles = rest.slice(0, 2)
  const moreArticles = rest.slice(2, 6)

  const categories = categoryNames.map((name) => ({
    name,
    count: allArticles.filter((a) => a.category === name).length,
  }))

  const dateLocale = locale === 'zh' ? 'zh-CN' : locale === 'pt' ? 'pt-PT' : locale === 'es' ? 'es-ES' : locale === 'fr' ? 'fr-FR' : locale === 'de' ? 'de-DE' : 'en-GB'
  const todayLabel = new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })

  const topicLocales: Record<string, { topics: string[]; tags: string[] }> = {
    pt: { topics: ['5 km','10 km','Meia Maratona','Maratona','Trail Running','Ultra Trail','Corrida Montanha','Meio Fundo'], tags: ['Velocidade','Resistência','21 km','42 km','Montanha','> 60 km','Vertical','Pista'] },
    en: { topics: ['5 km','10 km','Half Marathon','Marathon','Trail Running','Ultra Trail','Mountain Running','Middle Distance'], tags: ['Speed','Endurance','21 km','42 km','Mountain','> 60 km','Vertical','Track'] },
    es: { topics: ['5 km','10 km','Media Maratón','Maratón','Trail Running','Ultra Trail','Carrera Montaña','Medio Fondo'], tags: ['Velocidad','Resistencia','21 km','42 km','Montaña','> 60 km','Vertical','Pista'] },
    fr: { topics: ['5 km','10 km','Semi-Marathon','Marathon','Trail Running','Ultra Trail','Course Montagne','Demi-Fond'], tags: ['Vitesse','Endurance','21 km','42 km','Montagne','> 60 km','Vertical','Piste'] },
    de: { topics: ['5 km','10 km','Halbmarathon','Marathon','Trail Running','Ultra Trail','Berglauf','Mittelstrecke'], tags: ['Geschwindigkeit','Ausdauer','21 km','42 km','Berg','> 60 km','Vertikal','Bahn'] },
    zh: { topics: ['5公里','10公里','半程马拉松','马拉松','越野跑','超级越野','山地跑','中长跑'], tags: ['速度','耐力','21公里','42公里','山地','> 60公里','垂直','田径'] },
  }
  const tl = topicLocales[locale] ?? topicLocales['en']
  // Slugs das páginas dedicadas /modalidades/<slug> — mesma ordem dos topics
  const topicSlugs = ['5km', '10km', 'meia-maratona', 'maratona', 'trail-running', 'ultra-trail', 'corrida-montanha', 'meio-fundo']
  const topics = tl.topics.map((name, i) => ({ name, tag: tl.tags[i], num: String(i + 1).padStart(2, '0'), img: topicImages[i], slug: topicSlugs[i] }))

  return (
    <>
      {/* HERO — backgroundColor garante que nunca aparece branco enquanto a imagem carrega.
          Imagem trocada de "corredor em estrada" para corredor de trail em
          crista de montanha (confirmada visualmente: atleta com colete de
          hidratação, trilho rochoso, pico nevado ao fundo) — o site cobre
          estrada, trail e montanha com o mesmo peso, mas a primeira impressão só
          mostrava estrada. */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ backgroundColor: '#0a0a0a', backgroundImage: 'url(https://images.unsplash.com/photo-1504025468847-0e438279542c?w=1920&q=85)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-green/25 to-transparent hidden lg:block" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-24 w-full">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-brand-green/20 bg-brand-green/8 mb-10 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-dot" />
            <span className="text-brand-green text-xs font-mono font-bold tracking-[0.15em] uppercase">
              {t('hp', 'badge_updated').replace('{n}', String(totalArticles))}
            </span>
          </div>

          <h1 className="font-display text-white mb-8 animate-fade-up delay-100" style={{ opacity: 0 }}>
            <span className="block text-[clamp(3rem,10vw,8.5rem)] leading-none">{t('hp', 'headline1')}</span>
            <span className="block text-[clamp(3rem,10vw,8.5rem)] leading-none" style={{ WebkitTextStroke: '1px #00C896', color: 'transparent' }}>{t('hp', 'headline2')}</span>
            <span className="block text-[clamp(3rem,10vw,8.5rem)] leading-none text-brand-green">{t('hp', 'headline3')}</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-lg mb-10 animate-fade-up delay-200" style={{ opacity: 0 }}>
            {t('hp', 'subtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-300" style={{ opacity: 0 }}>
            <Link href="/blog" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all hover:gap-3">
              {t('hp', 'cta_today')} <ArrowRight size={15} />
            </Link>
            <Link href="/modalidades" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white/60 text-sm font-semibold rounded-full hover:border-white/30 hover:text-white transition-all">
              {t('hp', 'cta_methodologies')}
            </Link>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-8 animate-fade-up delay-400" style={{ opacity: 0 }}>
            {[
              { value: `${totalArticles}`, label: t('hp', 'stat_articles') },
              { value: '3/dia', label: t('hp', 'stat_publish') },
              { value: '9', label: t('hp', 'stat_categories') },
              { value: '100%', label: t('hp', 'stat_free') },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-brand-green leading-none mb-1" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>{s.value}</div>
                <div className="text-[10px] text-white/35 uppercase tracking-[0.15em] font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER — movida para logo a seguir ao hero, antes do resto do
          conteúdo, para captar subscritores enquanto a atenção ainda está
          alta (pedido do Pedro: "devia estar logo na 1ª página"). */}
      <section className="py-20 sm:py-28 border-t border-white/5 bg-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <NewsletterSignup variant="hero" />
        </div>
      </section>

      {/* PUBLICADOS HOJE */}
      {todayArticles.length > 0 && (
        <section className="relative py-16 sm:py-20 border-t border-white/5 overflow-hidden"
          style={{ backgroundColor: '#0a0a0a', backgroundImage: 'url(https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
          <div className="absolute inset-0 bg-black/95" />
          <div className="absolute inset-0 bg-brand-green/[0.02]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10" data-reveal>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-dot" />
                  <Zap size={10} className="text-brand-green" />
                </div>
                <div>
                  <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>{t('hp', 'today_section')}</h2>
                  <p className="text-white/55 text-[11px] font-mono mt-0.5 capitalize">{todayLabel}</p>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {todayArticles.map((article, i) => (
                <Link key={article.slug} href={`/blog/${article.slug}`} data-reveal data-delay={String(i * 80)}
                  className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-white/10 bg-white/[0.06] hover:border-brand-green/40 hover:bg-white/[0.09] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-brand-green border border-brand-green/30 bg-brand-green/10">{article.category}</span>
                    <span className="text-[10px] font-mono text-white/50">{article.readTime} min</span>
                  </div>
                  <h3 className="text-sm font-black text-white group-hover:text-brand-green transition-colors leading-snug line-clamp-2">{article.title}</h3>
                  <p className="text-[12px] text-white/65 leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-white/45 group-hover:text-brand-green transition-colors uppercase tracking-widest mt-1">
                    {t('hp', 'read_article')} <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ÚLTIMOS ARTIGOS */}
      {articles.length > 0 && (
        <section className="relative py-24 sm:py-32 overflow-hidden"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center 20%', backgroundAttachment: 'scroll' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/98 via-black/93 to-black/98" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12" data-reveal>
              <div>
                <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">{t('hp', 'recent_label')}</p>
                <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>{t('hp', 'recent_section')}</h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-white/35 hover:text-brand-green transition-colors uppercase tracking-widest">
                {t('hp', 'see_archive')} <ArrowUpRight size={12} />
              </Link>
            </div>

            {featured && (
              <div className="grid lg:grid-cols-[3fr_2fr] gap-4 mb-4">
                <div data-reveal><ArticleCard article={featured} featured /></div>
                <div className="flex flex-col gap-4">
                  {sideArticles.map((a, i) => (
                    <div key={a.slug} data-reveal data-delay={String((i + 1) * 100)}><ArticleCard article={a} /></div>
                  ))}
                </div>
              </div>
            )}

            {moreArticles.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {moreArticles.map((a, i) => (
                  <div key={a.slug} data-reveal data-delay={String((i + 3) * 100)}><ArticleCard article={a} /></div>
                ))}
              </div>
            )}

            <div className="mt-10 text-center" data-reveal>
              <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/10 text-white/55 text-sm font-bold rounded-full hover:border-brand-green/40 hover:text-white transition-all">
                {t('hp', 'see_all').replace('{n}', String(totalArticles))} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIAS */}
      <section className="relative py-20 border-t border-white/5 overflow-hidden"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/96 via-black/90 to-black/95" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10" data-reveal>
            <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">{t('hp', 'categories_label')}</p>
            <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>{t('hp', 'categories_section')}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categories.map((c, i) => (
              <Link key={c.name} href={`/blog?category=${encodeURIComponent(c.name)}`} data-reveal data-delay={String(Math.min(i * 50, 400))}
                className="group relative flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-brand-green/25 bg-white/[0.015] hover:bg-brand-green/5 transition-all">
                <span className="text-sm font-bold text-white/65 group-hover:text-white transition-colors">{c.name}</span>
                <span className="text-xs font-mono text-white/20 group-hover:text-brand-green transition-colors">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MODALIDADES */}
      <section className="py-24 sm:py-32 bg-[#0a0a0a] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12" data-reveal>
            <div>
              <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">{t('hp', 'methods_label')}</p>
              <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                {t('hp', 'methods_section')}<br />
                <span className="text-white/25">{t('hp', 'methods_sub')}</span>
              </h2>
            </div>
            <Link href="/metodologias" className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-white/35 hover:text-brand-green transition-colors uppercase tracking-widest">
              {t('hp', 'see_all_methods')} <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topics.map((m, i) => (
              <Link key={m.name} href={`/modalidades/${m.slug}`} data-reveal data-delay={String(Math.min(i * 50, 400))}
                className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all card-hover" style={{ aspectRatio: '3/4' }}>
                <div className="absolute inset-0 photo-card-img" style={{ backgroundImage: `url(${m.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/8 transition-colors duration-500" />
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-mono text-white/30">{m.num}</span>
                    <ArrowUpRight size={14} className="text-white/0 group-hover:text-brand-green transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-brand-green/70 group-hover:text-brand-green transition-colors">{m.tag}</span>
                    <h3 className="text-sm font-black text-white leading-tight mt-1">{m.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL — a foto anterior (photo-1590012314607) era, confirmado
          visualmente, uma cerimónia de formatura académica — não tinha
          nenhuma relação com corrida. Substituída por corredores ao
          pôr do sol, também confirmada visualmente. */}
      <section className="py-24 sm:py-32 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-white/5 p-10 sm:p-16 lg:p-20"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            data-reveal>
            <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/88 to-black/85" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-green/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative text-center">
              <p className="text-brand-green text-[10px] font-mono font-bold tracking-[0.3em] uppercase mb-6">{t('hp', 'cta_label')}</p>
              <h2 className="font-display text-white leading-none mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
                {totalArticles} {t('hp', 'stat_articles').toUpperCase()}.<br />
                <span className="text-brand-green">{t('hp', 'cta_section_free')}</span>
              </h2>
              <p className="text-white/40 max-w-md mx-auto mb-10 text-sm leading-relaxed">{t('hp', 'cta_desc')}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/blog" className="inline-flex items-center gap-2 px-9 py-4 bg-brand-green text-black text-sm font-black rounded-full hover:bg-white transition-all hover:gap-3">
                  {t('hp', 'cta_access')} <ArrowRight size={15} />
                </Link>
                <Link href="/consulta" className="inline-flex items-center gap-2 px-9 py-4 border border-white/15 text-white text-sm font-black rounded-full hover:border-brand-green hover:text-brand-green transition-all">
                  {t('hp', 'cta_consult')} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
