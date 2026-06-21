@echo off
:: ════════════════════════════════════════════════════════════════
:: publicar-artigo.bat
:: Uso: publicar-artigo.bat "slug-do-artigo" "Titulo" "Categoria"
:: Exemplo: publicar-artigo.bat "vo2max-como-melhorar" "Como Melhorar o VO2max" "Fisiologia"
:: ════════════════════════════════════════════════════════════════
cd /d "C:\Users\PedroMiguelNunesAENS\Documents\Claude\Projects\Site atletismo"

set SLUG=%~1
set TITULO=%~2
set CATEGORIA=%~3
set SITE=https://www.performancerunning.pt
set INTERNAL_KEY=

:: Verifica se a chave INTERNAL_API_KEY está definida no .env.local
for /f "tokens=2 delims==" %%a in ('findstr "INTERNAL_API_KEY" .env.local 2^>nul') do set INTERNAL_KEY=%%a

if "%SLUG%"=="" (
  echo Uso: publicar-artigo.bat "slug" "Titulo" "Categoria"
  pause
  exit /b 1
)

echo.
echo ════════════════════════════════════════
echo  Publicar: %TITULO%
echo  Slug:     %SLUG%
echo ════════════════════════════════════════
echo.

:: 1. Git push do artigo
echo [1/3] A fazer git push...
git add content\blog\%SLUG%.md content\blog\_topic_counter.json
git commit -m "feat(artigo): %TITULO%"
git push origin main
if errorlevel 1 (
  echo ERRO no git push. Verifica a ligação.
  pause
  exit /b 1
)
echo     OK

:: 2. Aguarda deploy Vercel (~90s)
echo.
echo [2/3] A aguardar deploy Vercel (90 segundos)...
timeout /t 90 /nobreak
echo     OK

:: 3. Publicar nas redes sociais via API
echo.
echo [3/3] A publicar nas redes sociais...

:: Lê o excerpt do ficheiro md (linha após o frontmatter excerpt:)
for /f "tokens=2 delims=:" %%a in ('findstr "excerpt:" content\blog\%SLUG%.md 2^>nul') do set EXCERPT=%%a

curl -s -X POST "%SITE%/api/social-post" ^
  -H "Content-Type: application/json" ^
  -H "x-internal-key: %INTERNAL_KEY%" ^
  -d "{\"title\":\"%TITULO%\",\"excerpt\":\"%EXCERPT%\",\"slug\":\"%SLUG%\",\"category\":\"%CATEGORIA%\"}" ^
  > social_result.json 2>&1

type social_result.json
del social_result.json

echo.
echo ════════════════════════════════════════
echo  Artigo publicado e partilhado!
echo  URL: %SITE%/blog/%SLUG%
echo ════════════════════════════════════════
echo.
pause
