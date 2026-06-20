@echo off
cd /d "C:\Users\PedroMiguelNunesAENS\Documents\Claude\Projects\Site atletismo"
del /f /q .git\index.lock 2>nul
del /f /q .git\refs\heads\main.lock 2>nul
del /f /q .git\HEAD.lock 2>nul
git checkout ef3567b -- app/page.tsx app/sitemap.ts app/contacto/page.tsx app/metodologias/page.tsx app/sobre/page.tsx components/BlogClient.tsx components/Footer.tsx components/Navbar.tsx
git add -A
git commit -m "fix: restaurar ficheiros truncados — sitemap, page, contacto, metodologias, sobre, components"
git push origin main
echo Done. Return code: %errorlevel%
