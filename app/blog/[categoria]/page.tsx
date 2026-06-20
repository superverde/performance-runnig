import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArticles } from '@/lib/articles'
import { BlogClient } from '@/components/BlogClient'

/* Categorias suportadas + meta-info */
const CATEGORIAS: Record<string, { label: string; description: string; hero: string }> = {
  treino: {
    label: 'Treino',
    description: 'Metodologias científicas de treino para corrida — periodização, zonas de intensidade, volume semanal e tipos de sessão para todos os níveis.',
    hero: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80',
  },
  fisiologia: {
    label: 'Fisiologia',
    description: 'Fisiologia do exercício aplicada à corrida — VO2max, limiar anaeróbico, adaptações cardiovasculares e metabolismo energético.',
    hero: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1920&q=80',
  },
  nutricao: {
    label: 'Nutrição',
    description: 'Nutrição desportiva para corredores — estratégias de hidratação, carboidratos, proteína e suplementação baseadas em evidência científica.',
    hero: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80',
  },
  biomecanica: {
    label: 'Biomecânica',
    description: 'Biomecânica da corrida — técnica de passada, economia de corrida, cadência, apoio e como correr de forma mais eficiente e segura.',
    hero: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1920&q=80',
  },
  recuperacao: {
    label: 'Recuperação',
    description: 'Recuperação desportiva baseada em ciência — sono, nutrição pós-treino, terapias de recuperação e gestão da fadiga para corredores.',
    hero: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80',
  },
  psicologia: {
    label: 'Psicologia',
    description: 'Psicologia desportiva para corredores — mentalidade de performance, gestão da dor, motivação e estratégias cognitivas em prova.',
    hero: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=80',
  },
  'trail-running': {
    label: 'Trail Running',
    description: 'Tudo sobre trail running — técnica de montanha, preparação para provas de trail, equipamento e gestão de desnível.',
    hero: 'https://images.unsplash.com/photo-1504025468847-0e438279542c?w=1920&q=80',
  },
  lesoes: {
    label: 'Lesões',
    description: 'Prevenção e tratamento de lesões em corredores — causas, recuperação, exercícios de reforço e regresso ao treino baseados em evidência.',
    hero: 'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=1920&q=80',
  },
  vo2max: {
    label: 'VO2max',
    description: 'VO2max — o que é, como se mede, como melhorar e qual a sua relação com a performance em corrida de fundo e trail running.',
    hero: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1920&q=80',
  },
}

interface Props {
  params: { categoria: string }
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIAS).map((c) => ({ categoria: c }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = CATEGORIAS[params.categoria]
  if (!cat) return {}
  return {
    title: `Artigos de ${cat.label} | Performance Running`,
    description: cat.description,
    openGraph: {
      title: `${cat.label} — Base de Conhecimento Científico`,
      description: cat.description,
      images: [{ url: cat.hero, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://www.performancerunning.pt/blog/${params.categoria}`,
    },
  }
}

export default function CategoriaPage({ params }: Props) {
  const cat = CATEGORIAS[params.categoria]
  if (!cat) notFound()

  const allArticles = getAllArticles()
  // Filter articles by category (case-insensitive + normalize accents for URL)
  const categoryArticles = allArticles.filter(
    (a) => a.category.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-') === params.categoria
      || a.category.toLowerCase() === cat.label.toLowerCase()
  )

  return <BlogClient articles={categoryArticles} initialCategory={cat.label} heroTitle={cat.label} heroDescription={cat.description} heroBg={cat.hero} />
}
