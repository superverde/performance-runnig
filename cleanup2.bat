@echo off
cd /d "C:\Users\PedroMiguelNunesAENS\Documents\Claude\Projects\Site atletismo"
del /f /q .git\index.lock 2>nul
del /f /q .git\refs\heads\main.lock 2>nul
del /f /q .git\HEAD.lock 2>nul
git rm fixfiles.bat
git add "content/blog/estrategias-pacing-maratona.md"
git add "content/blog/treino-altitude-adaptacoes-fisiologicas.md"
git commit -m "chore: remover fixfiles.bat e adicionar 2 novos artigos (pacing maratona, treino altitude)"
git push origin main
echo.
echo Done. Return code: %errorlevel%
pause
