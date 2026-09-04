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
<title>Pinterest ligado — copiar refresh token</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; padding:40px 20px; background:#0d0d0d; color:#f2f2f2;
         font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
  .wrap { max-width:760px; margin:0 auto; }
  h1 { font-size:24px; margin:0 0 8px; }
  .sub { color:#9a9a9a; margin:0 0 28px; }
  .ok { color:#3ddc84; } .bad { color:#ff6b6b; }
  .card { background:#171717; border:1px solid #2a2a2a; border-radius:12px; padding:20px; margin-bottom:20px; }
  label { display:block; font-size:13px; text-transform:uppercase; letter-spacing:.08em; color:#9a9a9a; margin-bottom:10px; }
  textarea { width:100%; box-sizing:border-box; height:110px; resize:vertical; padding:12px;
             background:#0d0d0d; color:#f2f2f2; border:1px solid #333; border-radius:8px;
             font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace; word-break:break-all; }
  button { margin-top:12px; padding:12px 20px; font-size:15px; font-weight:600; cursor:pointer;
           background:#0B2A4A; color:#fff; border:none; border-radius:8px; }
  button:hover { background:#12406f; }
  ol { padding-left:20px; } li { margin-bottom:8px; }
  a { color:#6ba8ff; }
  code { background:#0d0d0d; padding:2px 6px; border-radius:4px; font-size:14px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Pinterest autorizado</h1>
  <p class="sub">Permissões recebidas: <code>${esc(scope)}</code><br>
  ${temBoardsWrite
    ? '<span class="ok">boards:write incluído — é o que faltava para publicar pins.</span>'
    : '<span class="bad">Falta boards:write! Repete a autorização com esse scope, senão os pins continuam a ser recusados.</span>'}</p>

  <div class="card">
    <label>Refresh token — é este o valor a copiar</label>
    <textarea id="tok" readonly onclick="this.select()">${esc(refreshToken)}</textarea>
    <button onclick="copiar()">Copiar refresh token</button>
    <span id="msg" style="margin-left:12px;color:#3ddc84"></span>
  </div>

  <div class="card">
    <label>O que fazer a seguir</label>
    <ol>
      <li>Abre <a href="https://vercel.com/pn4/performance-runnig/settings/environment-variables" target="_blank" rel="noopener">as Environment Variables do Vercel</a></li>
      <li>Edita <code>PINTEREST_REFRESH_TOKEN</code> e cola o valor acima (sem aspas nem espaços)</li>
      <li>Grava e faz <strong>Redeploy</strong> — as variáveis só chegam às funções num deployment novo</li>
    </ol>
  </div>
</div>
<script>
function copiar() {
  var t = document.getElementById('tok');
  t.select(); t.setSelectionRange(0, 999999);
  navigator.clipboard.writeText(t.value).then(function () {
    document.getElementById('msg').textContent = 'Copiado!';
  }, function () {
    document.execCommand('copy');
    document.getElementById('msg').textContent = 'Copiado!';
  });
}
</script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
