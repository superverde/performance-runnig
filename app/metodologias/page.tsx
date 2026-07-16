import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Metodologias de Treino',
  alternates: { canonical: 'https://www.performancerunning.pt/metodologias' },
  description:
    'Metodologias científicas de treino para 5km, 10km, Meia Maratona, Maratona, Trail Running, Ultra Trail e mais. Fisiologia do exercício aplicada à corrida.',
}

const modalities = [
  {
    id: '5km',
    name: '5 km',
    tag: 'VELOCIDADE',
    headline: 'Máxima Potência Aeróbia',
    img: 'https://www.performancerunning.pt/pool-images/photo-1552674605-db6ffd4facb5.jpg',
    description:
      'O 5km é a distância que mais exige do VO2max e da capacidade láctica. Um corredor de 5km precisa de sustentar entre 95-100% do VO2max durante 15-25 minutos — o que requer uma base aeróbia sólida combinada com sessões de alta intensidade.',
    physiology: 'Predominância aeróbia com contribuição anaeróbia significativa (≈10-15%). A produção de lactato excede a capacidade de remoção nos últimos quilómetros.',
    zones: ['Z4 (Limiar): 40-50% do volume semanal', 'Z5 (VO2max): 10-15% do volume', 'Z2 (Base aeróbia): 35-45% do volume'],
    trainings: ['Intervalos 800m a 1000m em ritmo de competição', 'Tempo runs de 20-30min a ritmo de 10km', 'Repetições de 200-400m para desenvolver velocidade'],
    volume: '40-70 km/semana conforme nível',
    errors: ['Neglenciar a base aeróbia de Z2', 'Demasiadas sessões de alta intensidade sem recuperação adequada', 'Ignorar o trabalho de força e biomecânica'],
    color: 'from-yellow-500/10',
  },
  {
    id: '10km',
    name: '10 km',
    tag: 'LIMIAR',
    img: 'https://www.performancerunning.pt/pool-images/photo-1476480862126-209bfaa8edc8.jpg',
    headline: 'Equilíbrio entre Potência e Resistência',
    description:
      'O 10km representa o ponto de equilíbrio perfeito entre velocidade e resistência. É corrido próximo do limiar anaeróbio — o ponto onde a produção de lactato começa a superar a sua remoção. Dominar este limiar é o segredo para melhorar de 5km à maratona.',
    physiology: 'Ritmo de corrida a ≈85-92% do VO2max. O limiar anaeróbio (MLSS) é o principal fator limitante. Atletas de elite correm o 10km no seu ritmo de limiar.',
    zones: ['Z3 (Limiar inferior): 30-40% do volume', 'Z4 (Limiar superior): 20-25% do volume', 'Z2 (Base): 40-50% do volume'],
    trainings: ['Tempo runs de 4-8km em ritmo de 10km', 'Progressivos de 10-15km', 'Fartlek de variação de ritmo'],
    volume: '50-80 km/semana conforme nível',
    errors: ['Correr os treinos fáceis demasiado rápido', 'Não desenvolver o trabalho de limiar específico', 'Excesso de competições sem periodização'],
    color: 'from-orange-500/10',
  },
  {
    id: 'meia-maratona',
    img: 'https://www.performancerunning.pt/pool-images/photo-1613936360976-8f35cf0e5461.jpg',
    name: 'Meia Maratona',
    tag: 'EFICIÊNCIA',
    headline: 'Limiar Aeróbio e Economia de Corrida',
    description:
      'A meia maratona é corrida a ≈80-85% do VO2max, ligeiramente abaixo do limiar anaeróbio. A economia de corrida — a quantidade de oxigénio consumido a uma velocidade específica — torna-se um fator determinante. Atletas com a mesma capacidade aeróbia podem ter tempos muito diferentes devido à eficiência mecânica.',
    physiology: 'O glicogénio é o combustível dominante. A depleção parcial de reservas musculares começa a manifestar-se após o km 16-18, tornando a nutrição uma variável importante.',
    zones: ['Z2 (Base aeróbia): 50-60% do volume', 'Z3-Z4 (Limiar): 25-30% do volume', 'Z5 (VO2max): 8-10% do volume'],
    trainings: ['Long run de 18-24km com secções a ritmo de prova', 'Tempo runs de 10-14km', 'Treinos de economia: strides, drills de técnica'],
    volume: '60-90 km/semana para performance',
    errors: ['Negligenciar a nutrição e hidratação no treino', 'Long runs demasiado lentos sem variação de ritmo', 'Ausência de trabalho de força complementar'],
    color: 'from-blue-500/10',
  },
  {
    id: 'maratona',
    img: 'https://www.performancerunning.pt/pool-images/photo-1543051932-6ef9fecfbc80.jpg',
    name: 'Maratona',
    tag: 'PERIODIZAÇÃO',
    headline: 'Gestão de Energia e Resistência à Fadiga',
    description:
      'A maratona é, fisiologicamente, a prova mais complexa do atletismo de estrada. Requer 3-5 horas de esforço contínuo — muito acima da capacidade de armazenamento de glicogénio. A transição metabólica para a oxidação de gorduras e a resistência à fadiga central são determinantes. O "muro" dos 30-35km é uma realidade bioquímica, não apenas mental.',
    physiology: 'Depleção de glicogénio muscular e hepático após ≈30km. Contribuição crescente da oxidação de ácidos gordos. O córtex pré-frontal começa a aumentar a percepção de esforço — a "fadiga central" é real e bem documentada.',
    zones: ['Z2 (Base aeróbia): 60-70% do volume', 'Ritmo de maratona: 15-20% do volume total', 'Z3-Z4 (Limiar): 10-15%'],
    trainings: ['Long run progressivo até 35-38km', 'Treinos de maratona específicos (2x16km a ritmo alvo)', 'Corridas de ativação metabólica em jejum (com supervisão)'],
    volume: '80-120 km/semana no peak training',
    errors: ['Aumentar o volume demasiado rapidamente', 'Ignorar a nutrição durante o long run', 'Não simular as condições de prova nos treinos finais'],
    color: 'from-red-500/10',
  },
  {
    id: 'trail-running',
    img: 'https://www.performancerunning.pt/pool-images/photo-1504025468847-0e438279542c.jpg',
    name: 'Trail Running',
    tag: 'TÉCNICA',
    headline: 'Técnica de Montanha e Adaptação ao Terreno',
    description:
      'O trail running exige uma combinação única de capacidade aeróbia, força muscular excêntrica, técnica de corrida em terreno variável e resistência mental. As subidas ativam predominantemente os glúteos e quadricípites; as descidas solicitam intensamente os músculos excêntricos e o sistema nervoso.',
    physiology: 'As variações de desnível criam picos de intensidade contínuos, tornando as métricas de pace irrelevantes. O "Equivalent Flat Distance" (EFD) e o desnível acumulado são as métricas-chave.',
    zones: ['Z2 com variações: 50-60% do volume', 'Subidas intensas (Z4-Z5): 15-20%', 'Trabalho técnico de descida: 10-15%'],
    trainings: ['Corridas de subida: uphill repeats de 3-8min', 'Descidas técnicas em superfícies variadas', 'Long trail com desnível progressivo'],
    volume: 'Medido em desnível: 2000-5000m+/semana conforme objetivo',
    errors: ['Ignorar o treino de força específica (lunges, step-ups)', 'Negligenciar a técnica de descida — principal causa de lesões', 'Não treinar com o equipamento de corrida que usará na prova'],
    color: 'from-green-500/10',
  },
  {
    id: 'ultra-trail',
    img: 'https://www.performancerunning.pt/pool-images/photo-1513593771513-7b58b6c4af38.jpg',
    name: 'Ultra Trail',
    tag: 'MENTAL',
    headline: 'Preparação Mental, Logística e Nutrição',
    description:
      'Provas de ultra trail (42km+) entram num território fisiológico único: digestão a intensidade moderada, privação de sono, danos musculares acumulados e tomada de decisão sob fadiga extrema. A preparação mental é tão importante quanto a física. A estratégia de prova, a gestão de postos de apoio e a experiência acumulada fazem a diferença entre terminar e não terminar.',
    physiology: 'Após 6-8 horas, o organismo entra num estado catabólico. A capacidade de absorver e metabolizar nutrientes sólidos durante o esforço torna-se crítica. Os problemas gastrointestinais são a causa nº1 de abandonos em ultras.',
    zones: ['Z1-Z2 (conversação): 70-80% do tempo de prova', 'Caminhada estratégica nas subidas: fundamental', 'Nunca exceder Z4 exceto em subidas curtas'],
    trainings: ['Back-to-back: long run sábado + long run domingo', 'Noite training para adaptar ao corpo à privação de sono', 'Simulação de prova: testar nutrição e equipamento'],
    volume: 'Baseado em tempo e desnível, não km: 10-15h/semana no peak',
    errors: ['Começar demasiado rápido — a prova começa a meio', 'Não testar a nutrição e hidratação durante o treino', 'Negligenciar a recuperação entre semanas de carga'],
    color: 'from-purple-500/10',
  },
  {
    id: 'corrida-montanha',
    img: 'https://www.performancerunning.pt/pool-images/photo-1461897104016-0b3b00cc81ee.jpg',
    name: 'Corrida de Montanha',
    tag: 'FORÇA',
    headline: 'Explosividade, Técnica e Força Específica',
    description:
      'A corrida de montanha combina a velocidade do atletismo com os desafios técnicos do trail. Provas como o Vertical Kilometer ou as Sky Races exigem uma capacidade aeróbia de elite combinada com força específica nos membros inferiores. A biomecânica da subida a alta intensidade é muito diferente da corrida plana.',
    physiology: 'Nas subidas acentuadas, a frequência cardíaca sobe rapidamente para Z4-Z5. O consumo de oxigénio por unidade de tempo é máximo. A relação peso/potência (W/kg) é o fator mais determinante.',
    zones: ['Subidas intensas Z4-Z5: 30-40% do volume', 'Corrida plana de base Z2: 40-50%', 'Força muscular: treino complementar obrigatório'],
    trainings: ['Vertical repeats: subidas de 5-10min a intensidade máxima', 'Hill sprints de 10-30 segundos', 'Musculação: agachamentos, lunges, step-ups'],
    volume: '50-80 km/semana + sessões de força',
    errors: ['Ignorar o treino de força muscular', 'Não desenvolver a técnica de descida', 'Volume demasiado alto sem qualidade'],
    color: 'from-cyan-500/10',
  },
  {
    id: 'meio-fundo',
    img: 'https://www.performancerunning.pt/pool-images/photo-1567427018141-0584cfcbf1b8.jpg',
    name: 'Meio Fundo',
    tag: 'VO2MAX',
    headline: 'Potência Aeróbia Máxima e Velocidade',
    description:
      'O meio fundo (800m-3000m) é a modalidade que mais exige do sistema cardiovascular em termos de intensidade relativa. O 800m envolve uma componente anaeróbia de ≈40%; o 1500m e os 3000m são predominantemente aeróbios mas exigem taxas de consumo de oxigénio próximas do VO2max durante toda a prova.',
    physiology: 'O VO2max é o principal fator limitante. A capacidade de tolerar e remover lactato permite manter velocidades supramaximais. No 1500m e 3000m, o rendimento aeróbio pode representar 75-85% do total.',
    zones: ['Z5 (VO2max): 15-20% do volume — o diferenciador', 'Z4 (Limiar): 25-30%', 'Z2 (Base): 50-55%'],
    trainings: ['400m e 600m repetições em ritmo de prova ou mais rápido', '1000m a 1500m em ritmo de 3000m', 'Treino de velocidade: 100-200m em condicionamento neuro-muscular'],
    volume: '50-80 km/semana (atletismo pista)',
    errors: ['Excesso de corridas lentas e insuficiente trabalho de velocidade', 'Negligenciar o trabalho técnico e de flexibilidade', 'Falta de periodização anual com pico para as provas-alvo'],
    color: 'from-rose-500/10',
  },
  {
    id: 'jovens-atletas',
    img: 'https://www.performancerunning.pt/pool-images/photo-1571019614242-c5c5dee9f50b.jpg',
    name: 'Jovens Atletas',
    tag: 'DESENVOLVIMENTO',
    headline: 'Periodização a Longo Prazo para Jovens',
    description:
      'O treino de jovens atletas (12-18 anos) deve seguir os princípios do LTAD (Long Term Athlete Development). O foco deve ser no desenvolvimento multilateral, na técnica e na experiência motora, nunca na especialização precoce. Os erros cometidos nesta fase podem comprometer décadas de carreira desportiva.',
    physiology: 'O sistema cardiorrespiratório em desenvolvimento responde muito bem ao estímulo aeróbio. A maturação biológica (não a idade cronológica) deve guiar a intensidade do treino. Após o pico de crescimento, pode introduzir-se trabalho de força.',
    zones: ['Z2 (base aeróbia): 70-80% do volume', 'Jogos e atividades variadas: fundamentais', 'Alta intensidade: <10% do volume total'],
    trainings: ['Atletismo multimodal: saltos, lançamentos, corridas variadas', 'Jogos desportivos para desenvolvimento motor', 'Corridas fáceis de 15-30 min sem pressão de ritmo'],
    volume: 'Progressivo: 20-40 km/semana no início do desenvolvimento',
    errors: ['Especialização precoce antes dos 14-15 anos', 'Treino de alta intensidade excessivo antes da maturidade', 'Comparar jovens em diferentes estágios de maturação biológica'],
    color: 'from-teal-500/10',
  },
]

export default function MethodologiesPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: 'url(https://www.performancerunning.pt/pool-images/photo-1504025468847-0e438279542c.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/82 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        {/* Green ambient */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-brand-green/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-green text-xs font-mono font-bold tracking-[0.3em] uppercase mb-5">
            METODOLOGIAS
          </p>
          <h1
            className="font-display text-white leading-none mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            TREINO CIENTÍFICO<br />
            <span className="text-brand-green">PARA CADA DISTÂNCIA</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Da pista ao ultra trail — cada modalidade tem a sua fisiologia, zonas de intensidade
            e estratégia de treino. Aqui encontras a base científica para treinar de forma inteligente.
          </p>
        </div>
      </section>

      {/* Nav de modalidades */}
      <nav className="sticky top-16 z-40 bg-brand-dark/95 backdrop-blur border-b border-brand-border overflow-x-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3">
            {modalities.map((m) => (
              <a
                key={m.id}
                href={`#${m.id}`}
                className="whitespace-nowrap px-3 py-1.5 text-sm text-white/65 hover:text-brand-green hover:bg-brand-muted rounded-md transition-colors font-semibold"
              >
                {m.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Sections */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {modalities.map((m) => (
          <section key={m.id} id={m.id} className="scroll-mt-32">
            {/* Header */}
            <div
              className="relative rounded-2xl overflow-hidden border border-white/8 mb-8"
              style={{
                backgroundImage: `url(${m.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/92 to-black/88" />
              <div className="relative p-8 sm:p-10">
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest text-brand-green border border-brand-green/30 bg-brand-green/10 mb-4">
                  {m.tag}
                </span>
                <h2
                  className="font-display text-white leading-none mb-2"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                >
                  {m.name}
                </h2>
                <p className="text-brand-green font-semibold text-sm sm:text-base">{m.headline}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/75 leading-relaxed mb-8 text-base">{m.description}</p>

            {/* Grid: fisiologia + zonas + treinos + erros */}
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Fisiologia */}
              <div className="p-5 rounded-lg border border-brand-border bg-brand-muted">
                <h3 className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase mb-3">
                  FISIOLOGIA
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">{m.physiology}</p>
              </div>

              {/* Zonas */}
              <div className="p-5 rounded-lg border border-brand-border bg-brand-muted">
                <h3 className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase mb-3">
                  ZONAS DE INTENSIDADE
                </h3>
                <ul className="space-y-2">
                  {m.zones.map((z) => (
                    <li key={z} className="text-sm text-white/75 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                      {z}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treinos */}
              <div className="p-5 rounded-lg border border-brand-border bg-brand-muted">
                <h3 className="text-xs font-mono font-bold tracking-widest text-brand-green uppercase mb-3">
                  TIPOS DE TREINO
                </h3>
                <ul className="space-y-2">
                  {m.trainings.map((t) => (
                    <li key={t} className="text-sm text-white/75 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-brand-border text-sm text-white/65">
                  <span className="text-white font-semibold">Volume: </span>
                  {m.volume}
                </div>
              </div>

              {/* Erros comuns */}
              <div className="p-5 rounded-lg border border-brand-border bg-brand-muted">
                <h3 className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase mb-3">
                  ERROS COMUNS
                </h3>
                <ul className="space-y-2">
                  {m.errors.map((e) => (
                    <li key={e} className="text-sm text-white/75 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA — a foto anterior (photo-1590012314607) era, confirmado
          visualmente na sessão de correção da homepage, uma cerimónia de
          formatura académica, sem nenhuma relação com corrida. Trocada
          pela mesma foto já confirmada e usada no CTA final da homepage
          (corredores em silhueta ao pôr do sol). */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(https://www.performancerunning.pt/pool-images/photo-1513593771513-7b58b6c4af38.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/88 to-black/90" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-brand-green/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-green text-xs font-mono font-bold tracking-[0.3em] uppercase mb-5">Coaching Online</p>
          <h2
            className="font-display text-white leading-none mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            QUERES UM PLANO<br />
            <span className="text-brand-green">PERSONALIZADO?</span>
          </h2>
          <p className="text-white/60 mb-10 text-sm leading-relaxed">
            Coaching online com base na tua fisiologia, disponibilidade e objetivos.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-black font-black rounded-full hover:bg-white transition-all hover:gap-3 text-sm"
          >
            Contactar Treinador <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  )
}
