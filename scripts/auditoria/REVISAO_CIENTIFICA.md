<!-- Regras usadas na revisão científica de 2026-10-20 e na verificação semanal. -->
# Revisão científica dos artigos do Performance Running (performancerunning.pt)

Estás a rever e corrigir um lote de artigos do blog de um site português de corrida, atletismo e trail. O dono do site tem duas regras inegociáveis:

1. **Nunca inventar nada** — nem produtos, marcas, modelos, especificações, preços, estudos, autores, números, percentagens ou resultados.
2. **Tudo tem de ser científico** — cada afirmação técnica tem de estar de acordo com a evidência científica atual, e cada estudo citado tem de existir e dizer de facto aquilo que o artigo lhe atribui.

Uma auditoria automática já corrigiu o português e completou referências cortadas. O que falta é o conteúdo: muitos artigos foram gerados por um modelo pequeno e têm erros científicos (estudos citados para coisas que não dizem, números absurdos, protocolos perigosos ou desajustados, conceitos trocados), texto cortado a meio, artigos sem referências, e — nos de Equipamento — produtos inventados, modelos que não existem ou produtos da categoria errada.

## Onde estão os ficheiros

- Repositório: `superverde/performance-runnig` (raiz do clone)
- Artigos: `content/blog/<slug>.md` (Markdown com frontmatter YAML)
- Slugs válidos para links internos `/blog/<slug>`: ``ls content/blog/*.md` (o nome do ficheiro sem `.md` é o slug)`
- Outras páginas internas válidas: `/calendario`, `/equipamento`, `/ferramentas`, `/ferramentas/comparador-sapatilhas`, `/consulta`, `/metodologias`

Quando vários revisores trabalham ao mesmo tempo, cada um edita só os ficheiros do seu lote e não corre git — quem faz commit é o coordenador. Para editar texto com acentos, usa as ferramentas Read/Edit/Write (UTF-8); se usares Python, abre sempre com `encoding='utf-8'`.

## O que fazer em cada artigo

Lê o artigo inteiro e decide:

- **OK** — cientificamente correto, completo, bem referenciado. Só retoques mínimos se necessário.
- **CORRIGIDO** — no geral bom, com erros pontuais: corrige as afirmações erradas, troca ou remove citações mal atribuídas, completa o que estiver cortado.
- **REESCRITO** — erros graves ou generalizados (o mais comum nos artigos gerados): reescreve o corpo do artigo de raiz sobre o mesmo tema, mantendo o slug.

Ao corrigir ou reescrever:

### Ciência
- Cada afirmação quantitativa (percentagens, doses, ritmos, volumes, tempos, temperaturas, frequências) tem de vir da literatura ou ser uma prática de treino consensual e realista. Na dúvida, retira o número ou formula com prudência ("a evidência é limitada", "os estudos variam").
- Cita só estudos que conheces com segurança e que dizem de facto o que lhes atribuis. Prefere revisões sistemáticas, meta-análises, consensos e position stands (ACSM, IOC, ISSN, Racinais/consenso do calor, Mountjoy/REDs, Thomas/Erdman/Burke 2016, etc.).
- **Verifica as referências que não tens a certeza** com WebSearch (ex.: título + autor) ou WebFetch em `https://doi.org/<doi>` / PubMed. Se não conseguires confirmar que uma referência existe com aqueles autores, ano, revista e DOI, não a uses. Um DOI errado é pior do que nenhum DOI — se não confirmares o DOI, cita sem ele.
- Remove citações fora do tema (ex.: estudo de sapatilhas a sustentar algo sobre auscultadores ou protetor solar).
- Em temas de saúde (lesões, suplementos, AINEs, RED-S, saúde mental, calor, altitude), sê prudente, nunca dês doses médicas fora do consenso e recomenda médico/fisioterapeuta quando apropriado.
- Corredores amadores são o público principal: os planos e exemplos têm de ser realistas para eles (nada de 120 km/semana para uma maratona sub-4).

### Equipamento (artigos com produtos)
- Todos os produtos nomeados têm de **existir de facto** e estar à venda (ou ser modelos atuais/recentes) em 2026. Confirma com WebSearch os modelos e preços de que não tens a certeza (sites dos fabricantes, lojas como Amazon.es, Decathlon, Sport Zone, Running Warehouse).
- Nada de modelos inventados ("Pegasus 2026", "Garmin Venu 2 versão anel", "Whoop Ring", "Pioneer TrailBlow 2000"…). Usa os nomes reais e as versões atuais (ex.: Pegasus 41, Ghost 16/17, Forerunner 165/265/965/970, etc. — confirma).
- O produto tem de ser da categoria do artigo (um artigo de livros lista livros reais, um artigo de spikes lista spikes reais, um de fatos de triatlo lista fatos reais).
- Preços: só intervalos indicativos que confirmaste ("cerca de 30–40 €"), com a nota "Preços indicativos em outubro de 2026; confirma na loja antes de comprar." Nunca preços inventados.
- Especificações (peso, drop, autonomia, impermeabilização, etc.): só as que confirmaste no fabricante ou numa fonte fiável; caso contrário, não as indiques.
- Mantém o formato habitual: critérios de escolha → tabela "As Melhores Opções" (Produto | Para quem é | Pontos fortes | Pontos fracos | Preço indicativo) → veredicto → `## Fontes` com as páginas dos fabricantes que usaste (URLs reais que verificaste) → `## Referências Científicas` só se houver ciência relevante para o tema (ex.: estudos de calçado num artigo de sapatilhas; compressão num artigo de meias de compressão). Mantém a ligação para `/equipamento` se existir.
- Não inventes testes ("testámos", "na nossa experiência") — o site não testou os produtos.

### Forma
- **Português de Portugal, sempre**, tratando o leitor por **tu** ("mantém", "podes", "o teu treino"). Nunca brasileirismos (você, treinamento, carboidrato, estresse, contato, planejar, aplicativo, usuário, tela, trilha, time, academia, "em um", gerúndio "está correndo"…).
- Tom: treinador de alta performance — técnico, claro, credível, sem floreados genéricos.
- Corpo com pelo menos ~800 palavras quando reescreves (sem encher chouriços). Estrutura com `##`/`###`.
- Termina sempre com `## Referências Científicas` (ou `## Fontes` + opcionalmente referências, nos de equipamento), cada referência completa: Autores (ano). Título. *Revista*, volume(número), páginas. DOI se confirmado.
- Nenhum texto cortado a meio. Nenhuma frase sem sentido.

### Frontmatter (YAML entre `---`)
- **Não mudes**: o nome do ficheiro/slug, `date`, `category`, `keyword`, `keywords`, `seoTitle` (se existir).
- Podes ajustar `title` só se estiver errado ou enganador (mantém a palavra-chave).
- `excerpt`: frase(s) completa(s), 120–158 caracteres, sem reticências, coerente com o conteúdo.
- `readTime`: minutos ≈ palavras / 200, arredondado.
- `faqs`: mantém (ou cria) 3 FAQs em YAML no formato existente (`  - q: "..."` / `    a: "..."`), corretas e em PT-PT. Atenção às aspas: dentro do valor usa « » ou aspas simples, nunca aspas duplas por escapar.

### Links internos e secções a preservar
- Links `/blog/<slug>` só para slugs que existem em `slugs.txt`. Corrige ou remove os que não existem.
- Se o artigo tiver uma secção que refere o **RaceFinder** (racefinder.pt) ou **A Minha Corrida** (aminhacorrida.pt), mantém-na tal como está (são parcerias editoriais).

## No fim

1. Valida o YAML de todos os ficheiros alterados com `node scripts/auditoria/estrutura.js` (corre na raiz, com `NODE_PATH=$PWD/node_modules`) — não pode haver erros de YAML.
2. Faz um relatório com uma linha por artigo: `slug | OK/CORRIGIDO/REESCRITO | problemas | como verificaste`.
3. A tua resposta final ao coordenador: resumo curto (quantos OK/corrigidos/reescritos, problemas mais graves, dúvidas).
