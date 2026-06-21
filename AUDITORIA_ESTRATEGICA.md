# AUDITORIA ESTRATÉGICA TOTAL — PERFORMANCE RUNNING
**Análise de nível de agência premium · Junho 2026**

---

# PARTE 1 — DIAGNÓSTICO GERAL

## Avaliação honesta

O site tem uma base técnica sólida e um visual moderno que ultrapassa a média portuguesa no nicho de corrida. A escolha do stack (Next.js + Tailwind + Vercel), a fonte display Barlow Condensed italic, a paleta preto/verde e o ritmo de publicação de 3 artigos/dia são decisões acertadas. Porém, há um abismo entre o visual e a conversão. O site parece premium mas não converte nada — não captura emails, não tem prova social, não tem autor visível, não tem lead magnet. É como ter uma montra espetacular com uma porta invisível.

## Pontos fortes reais
- Visual dark premium com tipografia display forte
- Publicação diária automática (3 artigos/dia) — vantagem competitiva real
- Estrutura técnica SEO já com metadados, sitemap, JSON-LD
- Hero da homepage com impacto visual imediato
- Domínio .pt ativo com Google Search Console verificado

## Fraquezas críticas (as que mais custam)
1. **Zero captação de emails** — não existe newsletter, lead magnet, nem formulário de subscrição em nenhuma página
2. **Zero prova social** — sem número de leitores, sem testemunhos, sem "X subscritores", sem artigos publicados contabilizados em destaque
3. **Sem autor identificado** — o Google valoriza E-E-A-T (Experience, Expertise, Authoritativeness, Trust). Um site anónimo não rankeia bem em temas de saúde/desporto
4. **Bug crítico de performance mobile** — `backgroundAttachment: 'fixed'` não funciona em iOS Safari e causa rendering quebrado em iPhone/iPad (afeta Sobre, Contacto e secções da homepage)
5. **Blog é 100% client-side** — o componente BlogClient usa `'use client'`, o que significa que o Google indexa a página sem artigos filtrados. Perda de SEO nas categorias
6. **Sem páginas individuais por modalidade** — `/metodologias/maratona`, `/metodologias/trail` não existem. São páginas de alto volume de pesquisa que o site está a perder
7. **Sem interligação interna entre artigos** — os artigos não se ligam entre si, desperdiçando link equity e tempo de permanência
8. **Página /planos redireciona para /blog** — URL desperdiçada que devia ter conteúdo

## Notas por área (0-10)

| Área | Nota | Comentário |
|------|------|-----------|
| Design | 7.5 | Moderno mas inconsistente. Muitos overlays idênticos tornam-no repetitivo |
| Copy | 5.5 | Headlines fortes, corpo fraco, CTAs genéricos, zero urgência |
| Estrutura | 6.0 | Páginas base existem mas faltam páginas críticas (newsletter, glossário, calculadoras, modalidades individuais) |
| SEO técnico | 7.0 | Metadados OK, sitemap OK, JSON-LD OK — mas sem pillar pages, sem interligação, sem FAQ schema |
| SEO conteúdo | 4.0 | Artigos auto-gerados sem referências reais, sem autor, sem profundidade suficiente para rankear keywords competitivas |
| Autoridade | 2.5 | Sem autor, sem credenciais, sem prova social, sem parceiros, sem press |
| Conversão | 2.0 | Não existe um único mecanismo de captura de lead em todo o site |
| Mobile | 5.0 | Bug crítico de iOS com fixed backgrounds. Secções pesadas para mobile |

---

# PARTE 2 — REESTRUTURAÇÃO COMPLETA

## Menu principal ideal

**Atual:** Metodologias | Arquivo | Sobre *(+ botão "Ler Artigos")*

**Problema:** "Arquivo" é frio e não diz nada ao utilizador casual. "Sobre" não tem peso suficiente para o menu principal.

**Novo menu proposto:**
```
PERFORMANCE RUNNING [logo]    |    Treino    Ciência    Modalidades    Calculadoras    |    [Newsletter CTA]
```
- **Treino** → dropdown: Por distância, Por intensidade, Planos semanais
- **Ciência** → o arquivo de artigos (ex-"Arquivo"), mais apelativo
- **Modalidades** → a página de metodologias atual
- **Calculadoras** → nova página com ferramentas interativas
- **[Newsletter]** → botão verde "Receber artigos" em vez de "Ler Artigos"

## Páginas que faltam (críticas)

### Prioridade 1 — Faltam e custam tráfego agora
| Página | URL | Justificação |
|--------|-----|-------------|
| Newsletter/Subscrição | /newsletter | Captura de email — a prioridade máxima |
| Modalidade: Maratona | /modalidades/maratona | "treino maratona" — 4.400 pesquisas/mês PT |
| Modalidade: Trail Running | /modalidades/trail-running | "trail running portugal" — 2.900/mês |
| Modalidade: Meia Maratona | /modalidades/meia-maratona | "treino meia maratona" — 1.600/mês |
| Calculadora de Pace | /calculadoras/pace | Ferramenta = tráfego recorrente + backlinks |
| Calculadora VO2max | /calculadoras/vo2max | Alta intenção de pesquisa |
| Glossário de Corrida | /glossario | 50+ termos = 50+ URLs que rankeiam |

### Prioridade 2 — Constroem autoridade
| Página | URL | Justificação |
|--------|-----|-------------|
| Sobre o Autor | /sobre/autor | E-E-A-T — obrigatório para Google Health |
| Política de Privacidade | /privacidade | Legal + confiança |
| Termos de Uso | /termos | Legal |
| Parceiros/Imprensa | /imprensa | Prova social futura |

## Estrutura ideal da homepage (secção a secção)

```
1. HERO — Impacto máximo. Proposta de valor + CTA duplo (artigos + newsletter)
2. PROVA SOCIAL — Números em tempo real: X artigos, X subscritores, X categorias
3. PUBLICADOS HOJE — Artigos do dia (existe, manter)
4. CATEGORIAS — Acesso rápido por tema
5. ARTIGOS EM DESTAQUE — Os 3 melhores de sempre / mais lidos
6. NEWSLETTER CAPTURE — Secção dedicada com lead magnet
7. MODALIDADES — Grid de metodologias (existe, manter)
8. POR QUÊ CONFIAR — Metodologia editorial, fontes, rigor científico
9. ÚLTIMOS ARTIGOS — Feed recente
10. CTA FINAL — Forte, com urgência
```

**O que deve sair:**
- Marquee (BIOMECÂNICA · VO2MAX · ...) → decorativo, não acrescenta valor, ocupa espaço, distrai

---

# PARTE 3 — NOVA HOMEPAGE

## Bloco 1 — HERO (reformulado)

**Headline atual:** "O CONHECIMENTO QUE TE FAZ CORRER MELHOR."
**Problema:** Genérica. Qualquer site de corrida podia ter esta headline.

**Nova headline:**
```
CORRE COM
CIÊNCIA.
NÃO COM ACHISMOS.
```
**Subtítulo atual:** "A maior base de conhecimento científico sobre corrida em português. Fisiologia, treino, nutrição e biomecânica."
**Novo subtítulo:**
```
Todos os dias publicamos 3 novos artigos baseados em investigação científica real.
Fisiologia, biomecânica, nutrição e treino — escritos para corredores,
não para académicos. Gratuito. Para sempre.
```

**CTAs:**
- Principal: `Explorar [X] Artigos →` (número dinâmico)
- Secundário: `Receber artigos por email` (newsletter)

**Badge live:**
```
● [X] artigos publicados esta semana
```

---

## Bloco 2 — PROVA SOCIAL (secção nova, obrigatória)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[120+]          [3/dia]         [9]           [0€]
Artigos         Publicados      Categorias    Custo
publicados      diariamente     de ciência    para sempre
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
*(números atualizados dinamicamente do código)*

---

## Bloco 3 — NEWSLETTER CAPTURE (secção nova, crítica)

Título: `CIÊNCIA DIRETO PARA O TEU EMAIL`
Subtítulo: `Todos os dias às 7h, os 3 melhores artigos do dia na tua caixa de entrada. Sem spam. Cancela quando quiseres.`
Campo: `[email@exemplo.com]  [Quero receber →]`
Micro-copy: `Junta-te a [X] corredores que já recebem.`

**Lead magnet sugerido:**
`📄 Descarrega grátis: "Guia de Zonas de Treino — Do 5km ao Ultra Trail" (PDF 12 páginas)`

---

## Bloco 4 — POR QUÊ CONFIAR (secção nova)

```
COMO TRABALHAMOS

[ícone] Baseado em ciência          Cada artigo cita estudos reais de revistas peer-reviewed.
[ícone] Publicado todos os dias     3 artigos novos às 6h. Sem falhas. Sem conteúdo de enchimento.
[ícone] Escrito para corredores     Não para académicos. Linguagem clara, estrutura prática.
[ícone] 100% gratuito               Sempre foi. Sempre será. Sem paywall, sem subscrição paga.
```

---

# PARTE 4 — REESCRITA DE COPY

## Página Sobre

**Título atual:** "Ciência da Corrida Para Todos."
**Problema:** Fraco. Não diferencia. Não emociona.

**Novo título:**
```
FEITO PARA CORREDORES.
FUNDAMENTADO EM CIÊNCIA.
```

**Subtítulo atual:** "O Performance Running é uma base de conhecimento científico gratuita dedicada à corrida, trail running e atletismo."
**Novo subtítulo:**
```
Em Portugal, a maioria do conhecimento científico sobre corrida está fechado em inglês,
atrás de paywalls académicos, ou diluído em opiniões sem fundamento.
O Performance Running existe para mudar isso.
```

---

## Página Contacto/Sugestões

**Título atual:** "Sugere um Tema"
**Problema:** Fraco, passivo, não convida à ação.

**Novo:**
```
TENS UMA PERGUNTA
QUE A CIÊNCIA PODE RESPONDER?

Sugestões dos leitores transformam-se em artigos.
Se tens uma dúvida sobre treino, fisiologia ou nutrição,
escreve — publicamos sobre o tema em [X] dias.
```

---

## CTAs por todo o site

**Atual:** "Explorar Artigos" / "Ver todos os artigos"
**Fraco porque:** Passivo. Não cria urgência. Não diferencia.

**Novos CTAs por contexto:**
- Homepage hero: `Ler os artigos de hoje →`
- Após artigo: `Continuar a ler — ver artigos relacionados`
- Fim de página: `Receber 3 artigos de ciência por dia →`
- Metodologias: `Aprofundar: [Nome da Modalidade] →`
- Blog: `Encontrar artigos sobre [categoria]`

---

## Marquee (REMOVER)

**Atual:** Barra verde com "BIOMECÂNICA · VO2MAX · PERIODIZAÇÃO..."
**Problema:** Decorativo, não informativo. Ocupa espaço acima do fold em mobile. Não tem função UX. Parece agência genérica de 2021.
**Decisão:** Remover completamente. Substituir por prova social numérica.

---

# PARTE 5 — MELHORIAS DE DESIGN E UX

## Problema 1 — Overdose de overlays negros

**O que está a acontecer:** Todas as secções têm agora `bg-black/90-97` sobre fotos. O resultado é que todas as secções parecem visualmente iguais — preto com leve textura. Perde-se o impacto da foto e o site parece uma série de blocos escuros indistinguíveis.

**Solução:**
- Usar fotos apenas em 3-4 secções estratégicas (hero, 1 secção de destaque, footer)
- As restantes secções usam gradientes de cor sólida: `#080808`, `#0D0D0D`, `#111`
- Criar contraste entre secções alternando: muito escuro / ligeiramente menos escuro / verde accent

## Problema 2 — Bug crítico iOS: `backgroundAttachment: fixed`

**Ficheiros afetados:** `app/sobre/page.tsx` (2 secções), `app/contacto/page.tsx`, `app/page.tsx` (secção Últimos Artigos)

`backgroundAttachment: 'fixed'` não é suportado em iOS Safari e causa:
- Rendering incorreto da imagem
- Scroll jumpy
- Perda de performance
- Potencialmente a imagem nem aparece

**Correção obrigatória:** Remover `backgroundAttachment: 'fixed'` de todos os ficheiros.

## Problema 3 — Inconsistência tipográfica

**O que acontece:** Algumas páginas usam `font-display` (Barlow Condensed) nos headings, outras usam `font-black` sem display. O resultado é inconsistência visual entre páginas.

**Regra a aplicar:**
- H1 e H2 principais → sempre `font-display` (Barlow Condensed Italic)
- H3 e subtítulos → Inter `font-black`
- Corpo de texto → Inter regular, `text-white/50`
- Labels/etiquetas → JetBrains Mono `text-[10px] tracking-[0.25em] uppercase`

## Problema 4 — Marquee que não serve o utilizador

O marquee verde com keywords não diz nada ao leitor. Ocupa espaço precioso acima do fold em mobile (onde cada pixel conta). Deve ser removido ou substituído por uma barra de estatísticas ao vivo: `[X] artigos publicados · [X] categorias · Atualizado hoje`.

## Problema 5 — Secção "Publicados Hoje" vs "Últimos Artigos"

Quando há artigos de hoje, o utilizador vê dois feeds de artigos muito semelhantes logo a seguir. Difícil perceber a diferença visualmente.

**Solução:** Fundir as duas secções. Um único feed "Artigos Recentes" com badge "HOJE" nos artigos do dia atual.

## Mobile — melhorias específicas

- Hero headline: `clamp(3.5rem, 10vw, 8.5rem)` → começa demasiado pequeno em telemóveis antigos. Usar mínimo `2.8rem`
- Cards de modalidade em grid 2 colunas no mobile com `aspectRatio: 3/4` ficam muito altos. Mudar para `aspectRatio: 4/3` em mobile
- Navbar mobile: links em Barlow Condensed uppercase com `text-base` podem ser difíceis de tocar. Aumentar padding vertical para `py-4`
- Imagens de fundo com `backgroundAttachment: fixed` → **remover em mobile** (ver Problema 2)
- BlogClient: a barra de categorias sticky em mobile fica colada à navbar — verificar z-index e espaçamento

---

# PARTE 6 — SEO E CRESCIMENTO ORGÂNICO

## Problema crítico: Blog em client-side

O `BlogClient` usa `'use client'` e renderiza os artigos no browser. O Google pode não indexar conteúdo filtrado por categoria. Significa que as URLs `/blog?category=Fisiologia` não são indexadas.

**Solução:** Criar páginas estáticas por categoria:
```
/blog/treino        → lista artigos de Treino
/blog/fisiologia    → lista artigos de Fisiologia
/blog/nutricao      → lista artigos de Nutrição
... (1 página por categoria)
```
Cada uma com H1 próprio, meta description específica e conteúdo intro de 100 palavras.

## Páginas de modalidade individuais (oportunidade enorme)

Atualmente existe apenas `/metodologias` com tudo numa página. Deve ser:
```
/modalidades/maratona          → "treino maratona" (4.400 pesquisas/mês)
/modalidades/meia-maratona     → "treino meia maratona" (1.600/mês)
/modalidades/10km              → "plano treino 10km" (880/mês)
/modalidades/5km               → "treino 5km" (590/mês)
/modalidades/trail-running     → "trail running" (2.900/mês)
/modalidades/ultra-trail       → "ultra trail portugal" (1.300/mês)
```
Cada página: H1 otimizado, intro de 400 palavras, zonas de treino, plano exemplo, FAQ com schema, links para artigos relacionados.

## Clusters de conteúdo a criar

```
CLUSTER 1: VO2MAX
├── Pillar: /blog/guia-completo-vo2max
├── Sub: O que é o VO2max e como se mede
├── Sub: Como aumentar o VO2max
├── Sub: VO2max por idade e género
└── Sub: Testes de campo para estimar VO2max

CLUSTER 2: MARATONA
├── Pillar: /modalidades/maratona
├── Sub: Plano de treino 16 semanas
├── Sub: Nutrição para maratona
├── Sub: O "muro" dos 30km — o que é e como evitar
└── Sub: Ritmo de maratona — como calcular

CLUSTER 3: TRAIL RUNNING
├── Pillar: /modalidades/trail-running
├── Sub: Equipamento essencial para trail
├── Sub: Técnica de subida e descida
├── Sub: Desnível acumulado — como treinar
└── Sub: Os melhores trails em Portugal
```

## Interligação interna — regra a implementar

No final de cada artigo, adicionar:
```
ARTIGOS RELACIONADOS
[Card] [Card] [Card]
```
Ligados por categoria e tags. Aumenta tempo de permanência (atualmente: 0 links internos entre artigos).

## Glossário (oportunidade SEO fácil)

Criar `/glossario` com 60+ termos de corrida:
- VO2max, Limiar Anaeróbico, Frequência Cardíaca Máxima, MLSS, Fartlek, Tempo Run...
- Cada termo com definição de 150-300 palavras
- Link interno para artigos relacionados
- Schema FAQ em cada entrada
- Potencial: 60+ páginas que rankeiam keywords de cauda longa

## Calculadoras (tráfego recorrente garantido)

```
/calculadoras/pace           → Conversor pace/velocidade
/calculadoras/vo2max         → Estimativa de VO2max por teste de campo
/calculadoras/tempo-prova    → Previsão de tempo de prova por distância
/calculadoras/zonas-treino   → Zonas de FC personalizadas
/calculadoras/carga-semanal  → Volume semanal recomendado por nível
```
Ferramentas interativas geram **backlinks naturais** e **visitas recorrentes**.

---

# PARTE 7 — PLANO DE IMPLEMENTAÇÃO PRIORITÁRIO

## PRIORIDADE 1 — CRÍTICO (fazer esta semana)

| Tarefa | Impacto | Esforço |
|--------|---------|---------|
| Remover `backgroundAttachment: fixed` de todos os ficheiros | 🔴 Bug iOS crítico | 10 min |
| Remover marquee da homepage | Limpeza visual | 5 min |
| Adicionar secção de newsletter na homepage | Conversão | 2h |
| Integrar Brevo/Mailchimp para captura de emails | Conversão | 3h |
| Criar páginas de categoria do blog (/blog/treino, etc.) | SEO | 4h |
| Corrigir inconsistência tipográfica entre páginas | Design | 2h |

## PRIORIDADE 2 — ALTO IMPACTO (próximas 2 semanas)

| Tarefa | Impacto | Esforço |
|--------|---------|---------|
| Criar páginas individuais por modalidade | SEO enorme | 1 dia |
| Adicionar "Artigos Relacionados" no fim de cada artigo | Engagement | 3h |
| Criar página /sobre/autor com bio + credenciais | E-E-A-T / Autoridade | 2h |
| Criar glossário (/glossario) com 30 termos iniciais | SEO long-tail | 1 dia |
| Adicionar contadores reais (artigos, semanas) na homepage | Prova social | 2h |
| Criar /politica-de-privacidade e /termos | Legal + confiança | 1h |
| Reduzir overlays negros — restaurar contraste visual entre secções | Design | 3h |

## PRIORIDADE 3 — EXCELÊNCIA (próximo mês)

| Tarefa | Impacto | Esforço |
|--------|---------|---------|
| Criar 5 calculadoras interativas | Tráfego recorrente + backlinks | 3 dias |
| Implementar clusters de conteúdo (VO2max, Maratona, Trail) | SEO autoridade | contínuo |
| Adicionar schema Organization + BreadcrumbList + FAQ | SEO técnico | 4h |
| Criar lead magnet (PDF "Guia de Zonas de Treino") | Email capture | 1 dia |
| Newsletter automatizada (3 melhores artigos por semana) | Retenção | 3h |
| Adicionar "mais lidos" / "artigos em destaque" no Blog | Engagement | 2h |
| Sistema de tags cruzadas entre artigos | SEO + UX | 4h |

---

# VERSÃO IDEAL DO SITE

## Posicionamento
**"A referência científica de corrida em português."**
Não é um blog. Não é um site de coaching. É uma base de dados de conhecimento científico, rigorosa, gratuita e atualizada diariamente — o equivalente português do Running Science Journal, mas escrito para atletas, não para académicos.

## Estrutura
```
Homepage → converte email + mostra autoridade
Blog/Arquivo → indexado por categorias estáticas
Modalidades → uma página por distância com plano + FAQ + artigos
Calculadoras → ferramentas interativas que geram visitas recorrentes
Glossário → 60+ termos que rankeiam keywords de cauda longa
Sobre → autor real com credenciais + missão do projeto
Newsletter → lead magnet + sequência de boas-vindas automatizada
```

## Homepage
Hero que comunica em 3 segundos: **o quê** (base científica), **para quem** (corredores), **porquê confiar** (3 artigos/dia, baseados em estudos reais). Seguido de números reais, artigos do dia, captura de email com lead magnet, e modalidades.

## Estilo visual
Dark premium mas com **variação entre secções** — não todas com overlay preto. Seções alternadas: preto profundo / ligeiramente grafite / accent verde. Fotos de fundo apenas no hero principal e 1-2 secções de destaque. Barlow Condensed Italic consistente em **todos** os H1/H2 do site.

## Copy
Headlines com conflito ou surpresa. Subtítulos com especificidade. CTAs orientados à ação e benefício. Zero texto de enchimento. Tom: treinador de elite que explica ciência em linguagem humana.

## SEO
Pillar pages por modalidade + clusters de artigos. Categorias do blog como páginas estáticas indexáveis. Glossário com schema FAQ. Calculadoras como ímanes de backlinks. 3 artigos/dia mantidos. Interligação interna sistemática.

## Autoridade
Autor identificado com credenciais. Contadores reais (artigos, subscritores). Referências bibliográficas em todos os artigos. Metodologia editorial explicada. Parceiros futuros em destaque.

## Conversão
Funil: visita → newsletter → email diário → confiança → (futuro) patrocínio/produto.
Captura de email em 3 pontos: hero, secção dedicada, fim de cada artigo.
Lead magnet: PDF "Guia Científico de Zonas de Treino".

---

*Auditoria produzida por análise direta do código-fonte — Next.js 14, app router, Tailwind CSS, Vercel. Junho 2026.*
