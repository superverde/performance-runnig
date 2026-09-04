import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/pinterest-oauth-callback
 *
 * Endpoint de configuração ÚNICA (não faz parte do fluxo diário de
 * publicação). O Pinterest redireciona para aqui depois de o utilizador
 * autorizar a app no ecrã de consentimento OAuth, com um `code` de uso único
 * na query string. Esta rota troca esse `code` por um access_token +
 * refresh_token (scope pins:write) e devolve-os em JSON, junto com a lista
 * de boards disponíveis, para copiar para as environment variables do
 * Vercel (PINTEREST_APP_ID, PINTEREST_APP_SECRET, PINTEREST_REFRESH_TOKEN,
 * PINTEREST_BOARD_ID). Ver lib/pinterest.ts para o consumo normal destes
 * tokens pelos crons de publicação.
 *
 * Protegida por `state` para evitar que pedidos aleatórios/replay a esta
 * rota desperdicem tentativas de troca — o valor tem de coincidir com o
 * gerado ao construir o link de autorização.
 */

const REDIRECT_URI = 'https://www.performancerunning.pt/api/pinterest-oauth-callback'
const EXPECTED_STATE = 'pr-pinterest-setup-2026-boardswrite'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const error = req.nextUrl.searchParams.get('error')

  if (error) {
    return NextResponse.json({ error, description: req.nextUrl.searchParams.get('error_description') }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: 'Sem "code" na query string. Este endpoint só deve ser chamado pelo redirect do Pinterest OAuth.' }, { status: 400 })
  }

  if (state !== EXPECTED_STATE) {
    return NextResponse.json({ error: 'state inválido ou em falta' }, { status: 400 })
  }

  const appId = process.env.PINTEREST_APP_ID
  const appSecret = process.env.PINTEREST_APP_SECRET
  if (!appId || !appSecret) {
    return NextResponse.json({ error: 'PINTEREST_APP_ID / PINTEREST_APP_SECRET não definidos no ambiente' }, { status: 500 })
  }

  const basicAuth = Buffer.from(`${appId}:${appSecret}`).toString('base64')

  const tokenRes = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  })
  const tokenData = await tokenRes.json()

  if (!tokenRes.ok) {
    return NextResponse.json({ step: 'token_exchange', status: tokenRes.status, error: tokenData }, { status: 502 })
  }

  const refreshToken: string = tokenData.refresh_token ?? ''
  const scope: string = tokenData.scope ?? ''
  const temBoardsWrite = scope.includes('boards:write')

  // Pagina HTML em vez de JSON cru: a resposta JSON do Pinterest e uma parede
  // de texto onde access_token (pina_...) e refresh_token (pinr_...) sao quase
  // indistinguiveis -- copiar o campo errado ja custou uma volta inteira de
  // deploy + reautorizacao. Aqui aparece so o valor certo, com botao de copiar.
  const esc = (v: string) =>
    v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const html = `<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pinterest ligado · Performance Running</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet">
<style>
  :root{
    --preto:#0A0A0A; --carvao:#141414; --linha:#242424;
    --branco:#FAFAFA; --cinza:#8A8A8A;
    --azul:#0B2A4A; --azul-luz:#2E7DD1; --verde:#1F4B3F; --verde-luz:#3DDC84;
    color-scheme:dark;
  }
  *{box-sizing:border-box}
  body{
    margin:0; min-height:100vh; padding:64px 24px;
    background:
      radial-gradient(900px 500px at 15% -10%, rgba(11,42,74,.55), transparent 60%),
      radial-gradient(700px 400px at 95% 10%, rgba(31,75,63,.35), transparent 60%),
      var(--preto);
    color:var(--branco);
    font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .wrap{max-width:680px;margin:0 auto}
  .kicker{
    font-size:11px; font-weight:600; letter-spacing:.22em; text-transform:uppercase;
    color:var(--cinza); margin:0 0 18px;
  }
  h1{
    font-size:clamp(34px,6vw,52px); font-weight:800; letter-spacing:-.03em;
    line-height:1.04; margin:0 0 18px;
  }
  h1 em{font-style:normal;color:var(--verde-luz)}
  .lead{font-size:17px;line-height:1.6;color:#B9B9B9;margin:0 0 40px;max-width:52ch}
  .badge{
    display:inline-flex;align-items:center;gap:9px;padding:8px 15px;border-radius:999px;
    font-size:13px;font-weight:600;margin-bottom:34px;border:1px solid;
  }
  .badge.ok{background:rgba(61,220,132,.09);border-color:rgba(61,220,132,.32);color:var(--verde-luz)}
  .badge.bad{background:rgba(255,107,107,.09);border-color:rgba(255,107,107,.32);color:#FF8B8B}
  .badge span{width:7px;height:7px;border-radius:50%;background:currentColor}
  .card{
    background:linear-gradient(180deg,var(--carvao),#101010);
    border:1px solid var(--linha); border-radius:18px; padding:28px; margin-bottom:20px;
  }
  .card h2{
    font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;
    color:var(--cinza);margin:0 0 16px;
  }
  textarea{
    width:100%;height:104px;resize:vertical;padding:16px;
    background:#080808;color:#CFE3FF;border:1px solid var(--linha);border-radius:12px;
    font:13px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace;word-break:break-all;
  }
  textarea:focus{outline:none;border-color:var(--azul-luz)}
  button{
    margin-top:16px;padding:15px 26px;width:100%;
    font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;
    color:#fff;background:linear-gradient(135deg,var(--azul),var(--azul-luz));
    border:none;border-radius:12px;transition:transform .12s ease,filter .12s ease;
  }
  button:hover{filter:brightness(1.12)} button:active{transform:translateY(1px)}
  button.feito{background:linear-gradient(135deg,var(--verde),var(--verde-luz));color:#06210F}
  ol{margin:0;padding-left:0;list-style:none;counter-reset:passo}
  ol li{
    counter-increment:passo;position:relative;padding-left:44px;
    margin-bottom:18px;font-size:15px;line-height:1.55;color:#C9C9C9;
  }
  ol li:last-child{margin-bottom:0}
  ol li::before{
    content:counter(passo);position:absolute;left:0;top:-1px;
    width:28px;height:28px;border-radius:50%;
    display:grid;place-items:center;font-size:12px;font-weight:700;
    background:rgba(46,125,209,.14);border:1px solid rgba(46,125,209,.32);color:#9CC8FF;
  }
  a{color:#8FC0FF;text-decoration:none;border-bottom:1px solid rgba(143,192,255,.3)}
  a:hover{border-bottom-color:#8FC0FF}
  code{background:#080808;border:1px solid var(--linha);padding:2px 7px;border-radius:6px;font-size:13px}
  .rodape{margin-top:36px;font-size:13px;color:#666;line-height:1.6}
</style>
</head>
<body>
<div class="wrap">
  <p class="kicker">Performance Running · Ligação Pinterest</p>
  <h1>Autorização <em>concluída</em></h1>
  <p class="lead">Falta um passo manual: guardar o token no Vercel. É o único valor que precisas de copiar — está isolado aqui em baixo.</p>

  ${temBoardsWrite
    ? '<div class="badge ok"><span></span>boards:write incluído — era isto que faltava para publicar pins</div>'
    : '<div class="badge bad"><span></span>Falta boards:write — repete a autorização com esse scope, senão os pins continuam a ser recusados</div>'}

  <div class="card">
    <h2>Refresh token</h2>
    <textarea id="tok" readonly onclick="this.select()">${esc(refreshToken)}</textarea>
    <button id="btn" onclick="copiar()">Copiar refresh token</button>
  </div>

  <div class="card">
    <h2>A seguir</h2>
    <ol>
      <li>Abre <a href="https://vercel.com/pn4/performance-runnig/settings/environment-variables" target="_blank" rel="noopener">Environment Variables</a> no Vercel</li>
      <li>Edita <code>PINTEREST_REFRESH_TOKEN</code> e cola o valor — sem aspas nem espaços</li>
      <li>Grava e faz <strong style="color:#E8E8E8">Redeploy</strong>: as variáveis só chegam às funções num deployment novo</li>
    </ol>
  </div>

  <p class="rodape">Permissões concedidas: <code>${esc(scope)}</code><br>
  Página temporária de configuração — é removida assim que a publicação automática estiver confirmada.</p>
</div>
<script>
function copiar(){
  var t=document.getElementById('tok'), b=document.getElementById('btn');
  t.select(); t.setSelectionRange(0,999999);
  function feito(){ b.textContent='Copiado \\u2713'; b.classList.add('feito');
    setTimeout(function(){ b.textContent='Copiar refresh token'; b.classList.remove('feito'); },2600); }
  if(navigator.clipboard){ navigator.clipboard.writeText(t.value).then(feito,function(){ document.execCommand('copy'); feito(); }); }
  else { document.execCommand('copy'); feito(); }
}
</script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
