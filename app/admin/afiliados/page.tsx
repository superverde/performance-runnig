import { getAffiliateStats } from '@/lib/affiliate-stats'
import { AfiliadosClient } from './AfiliadosClient'

// Os numeros mudam a cada clique — nunca servir uma versao em cache.
export const dynamic = 'force-dynamic'

/**
 * Dashboard de cliques de afiliado.
 *
 * A versao anterior era um client component com a INTERNAL_API_KEY escrita no
 * codigo, o que a enviava dentro do JavaScript para o browser de qualquer
 * pessoa que abrisse esta pagina — e essa chave da acesso a endpoints com
 * consequencias (publicar nas redes sociais, entre outros). Agora os dados sao
 * lidos aqui, no servidor, e a chave e comparada do lado do servidor: nunca
 * chega ao browser.
 *
 * Acesso: /admin/afiliados?key=INTERNAL_API_KEY
 */
export default async function AfiliadosPage({
  searchParams,
}: {
  searchParams: { key?: string }
}) {
  const expected = process.env.INTERNAL_API_KEY
  if (!expected || searchParams.key !== expected) {
    return (
      <div style={{
        fontFamily: 'system-ui, sans-serif', background: '#0a0a0a', minHeight: '100vh',
        color: '#fff', padding: '2rem', display: 'grid', placeItems: 'center',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <h1 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem' }}>Acesso restrito</h1>
          <p style={{ color: '#777', fontSize: '0.85rem', margin: 0 }}>
            Esta página precisa da chave interna no endereço:
            <br />
            <code style={{ color: '#00ff87' }}>/admin/afiliados?key=…</code>
          </p>
        </div>
      </div>
    )
  }

  const data = await getAffiliateStats()
  return <AfiliadosClient data={data} />
}
