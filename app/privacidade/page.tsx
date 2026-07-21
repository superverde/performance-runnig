import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  alternates: { canonical: 'https://www.performancerunning.pt/privacidade' },
  description:
    'Política de privacidade do Performance Running: que dados recolhemos, para que os usamos e quais são os teus direitos ao abrigo do RGPD.',
}

export default function PrivacidadePage() {
  return (
    <section className="pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-brand-green text-xs font-mono font-bold tracking-[0.3em] uppercase mb-5">
          Legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
          Política de Privacidade
        </h1>
        <p className="text-white/60 mb-12">Última atualização: 21 de julho de 2026</p>

        <div className="space-y-10 text-white/75 leading-relaxed">
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-3">1. Quem somos</h2>
            <p>
              O Performance Running (www.performancerunning.pt) é uma publicação editorial
              independente sobre corrida, trail running e atletismo. Para questões de
              privacidade, contacta-nos através de{' '}
              <a href="mailto:newsletter@performancerunning.pt" className="text-brand-green hover:underline">
                newsletter@performancerunning.pt
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-white mb-3">2. Dados que recolhemos</h2>
            <p className="mb-3">Recolhemos o mínimo necessário para operar o site:</p>
            <p>
              <strong className="text-white">Newsletter:</strong> se subscreveres, guardamos o teu
              endereço de email, usado exclusivamente para enviar a newsletter. Podes cancelar a
              subscrição a qualquer momento através do link incluído em cada email.
            </p>
            <p className="mt-3">
              <strong className="text-white">Estatísticas de utilização:</strong> usamos métricas
              agregadas e anónimas (páginas visitadas, país, tipo de dispositivo) fornecidas pela
              plataforma de alojamento para compreender o uso do site. Não te identificam
              individualmente.
            </p>
            <p className="mt-3">
              <strong className="text-white">Ferramentas de cálculo:</strong> os valores que
              introduzes nas calculadoras (ritmos, tempos, VO2max) são processados no teu
              navegador e não são guardados nos nossos servidores.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-white mb-3">3. Cookies</h2>
            <p>
              O site não usa cookies de publicidade nem de rastreio entre sites. Podem existir
              cookies tecnicamente necessários ao funcionamento da plataforma de alojamento.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-white mb-3">4. Partilha de dados</h2>
            <p>
              Não vendemos nem cedemos os teus dados a terceiros. Os emails da newsletter são
              geridos através de fornecedores de email com quem temos acordos de tratamento de
              dados. Links de afiliados (ex.: Amazon) levam-te para sites externos com políticas
              de privacidade próprias.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-white mb-3">5. Redes sociais</h2>
            <p>
              Publicamos conteúdo editorial próprio nas nossas páginas de redes sociais
              (Facebook, Instagram, Threads, X, Pinterest). Essas plataformas tratam os teus
              dados de acordo com as políticas de privacidade delas; não recebemos delas dados
              pessoais dos seguidores, apenas estatísticas agregadas.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-white mb-3">6. Os teus direitos (RGPD)</h2>
            <p>
              Ao abrigo do Regulamento Geral de Proteção de Dados, tens direito de acesso,
              retificação, apagamento, limitação e portabilidade dos teus dados, bem como o
              direito de apresentar reclamação à CNPD (Comissão Nacional de Proteção de Dados).
              Para exercer qualquer destes direitos, escreve-nos para{' '}
              <a href="mailto:newsletter@performancerunning.pt" className="text-brand-green hover:underline">
                newsletter@performancerunning.pt
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-white mb-3">7. Alterações</h2>
            <p>
              Esta política pode ser atualizada; a data da última revisão está sempre indicada no
              topo. Alterações relevantes serão destacadas no site.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <Link href="/" className="text-brand-green hover:underline">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  )
}
