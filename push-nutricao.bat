@echo off
cd /d "C:\Users\PedroMiguelNunesAENS\Documents\Claude\Projects\Site atletismo"
git add app\equipamento\page.tsx
git commit -m "feat: adicionar secção Nutrição — gels SiS, Maurten, GU, eletrólitos e proteína de recuperação"
git push origin main
echo.
echo Feito! Aguarda o Vercel (~2 min).
pause
