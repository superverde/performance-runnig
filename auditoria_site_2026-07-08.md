# Auditoria Visual — Performance Running (8 julho 2026)

## Estrutura

A homepage tinha um bug real que já foi corrigido e publicado (commit `cf527e4`): o quarto artigo da secção "Últimos Artigos" usava o mesmo componente de cartão pensado para colunas estreitas (proporção 4:3), mas era renderizado a largura total do ecrã — o que criava um cartão de quase 1000 pixels de altura, quase todo vazio, dando a sensação de um grande espaço preto morto a meio da página. A correção busca mais artigos e mostra-os numa grelha de várias colunas em vez de um cartão solto.

Também encontrei uma página fantasma: `/servicos` estava listada no sitemap (por isso submetida ao Google) mas nunca chegou a ser criada — devolvia 404. O conteúdo equivalente já existe em `/consulta` (e `/planos` redireciona para lá). Removi a entrada morta do sitemap (commit `781ea3f`). Isto é o tipo de coisa que o Google penaliza silenciosamente: um sitemap com URLs que não existem mina a confiança do crawler no resto do ficheiro.

Fora estes dois pontos, as restantes páginas principais (arquivo, modalidades, metodologias, equipamento, calendário, sobre, patrocínios, ferramentas, testemunhos) têm estrutura sólida — sem outros buracos ou secções partidas. Uma nota menor: a página `/reviews` (Testemunhos) está bem construída mas usa o título genérico do site em vez de um título e meta descrição próprios — perde alguma oportunidade de SEO específico para essa página.

## Cores

A paleta está bem definida no `tailwind.config.ts` e é exatamente a do briefing: verde `#00C896`, azul profundo `#0066FF`, preto `#0A0A0A`, cinzas de apoio. O problema é que só o verde é realmente usado em todo o site — o azul profundo, que devia ser a segunda cor de assinatura da marca, está definido mas praticamente invisível na prática.

Mais grave: o componente `ArticleCard`, que decide a cor de destaque de cada categoria (a cor do badge e do brilho ao passar o rato), usa uma paleta de oito cores completamente à parte da marca — índigo, azul claro, âmbar, laranja, rosa, verde-claro, vermelho e roxo. Isto faz o arquivo de artigos parecer mais um painel de gestão de conteúdo genérico do que uma marca premium de uma cor. Nenhuma das referências do briefing (Nike Running, Salomon, Strava, NN Running Team) usa esta lógica de "uma cor por categoria" — todas mantêm uma paleta muito contida e usam tipografia, não cor, para diferenciar secções. Isto é uma correção pequena e cirúrgica (um ficheiro, uma constante) com impacto desproporcional na percepção de qualidade.

## Imagens

Encontrei 18 ficheiros diferentes no código com listas de imagens do Unsplash escritas à mão — a homepage, o cartão de artigo, a página de cada modalidade, o calendário, a página sobre, patrocínios, contacto, reviews, feed RSS, entre outros. Não há uma única fonte de verdade para as imagens do site (o `lib/images.ts`, criado há pouco, resolveu isto só para as publicações em redes sociais — o site em si nunca foi atualizado para o usar).

O efeito prático: a mesma fotografia genérica de stock aparece repetida em contextos diferentes (por exemplo, a mesma foto de pôr do sol usada no hero da homepage reaparece como imagem de categoria "Treino" no feed RSS e como fallback do cartão de artigo). E é tudo fotografia de stock do Unsplash, sem nenhuma imagem própria ou tratamento visual distintivo — o que é exatamente o oposto do "premium, cinematográfico, diferenciado" pedido no briefing. Um site ao nível da Salomon ou da NN Running Team não pode ser feito só de stock genérico; mesmo mantendo Unsplash como fonte, há espaço para curadoria mais forte (menos repetição, mais imagens de trail/montanha para equilibrar o foco atual em estrada) e, no médio prazo, para imagens geradas por IA com direção de arte consistente com a marca.

## Prioridades sugeridas

1. Cores do `ArticleCard` — trocar as oito cores genéricas por variações dentro da paleta da marca (verde, azul profundo, branco/cinza, talvez um dourado/âmbar único como destaque raro). Baixo esforço, alto impacto visual imediato.
2. Consolidar imagens do site em `lib/images.ts` (já existe, só falta o site usá-lo) — elimina repetição e permite curadoria central, incluindo mais trail/montanha.
3. Título e meta descrição próprios para `/reviews`.
4. A médio prazo: repensar a imagem principal da homepage (já discutido) para representar estrada, trail e montanha, não só estrada.
