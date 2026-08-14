# Guião — Vídeo de Apresentação (Avatar) para a Homepage

## Onde vai aparecer
Um cartão de vídeo no hero da homepage (a primeira coisa visível ao abrir o site), com uma miniatura e botão de play. Ao clicar, abre em modal com som. Não é um popup automático — o visitante decide ativar.

## Especificações técnicas para a ferramenta de avatar (Synthesia / HeyGen / D-ID)
- **Duração alvo:** 35–45 segundos
- **Formato de exportação:** MP4, H.264
- **Orientação:** horizontal (16:9), ex. 1920x1080 ou 1280x720
- **Idioma da voz:** Português de Portugal (PT-PT) — confirmar na ferramenta que a voz escolhida é rotulada "Portuguese (Portugal)" e não "Portuguese (Brazil)"
- **Tom:** profissional, direto, confiante — como um treinador de elite, não um vendedor

## Guião (ler em voz alta para confirmar o tempo — ronda os 40 segundos a ritmo normal)

> Olá. Bem-vindo à Performance Running — o maior espaço em português dedicado à ciência da corrida.
>
> Aqui encontras artigos novos todos os dias sobre fisiologia, biomecânica, nutrição e treino — mais de 150 já publicados, sempre gratuitos.
>
> Tens metodologias específicas para cada distância, do 5 km ao ultra trail, ferramentas para calcular o teu ritmo e zonas de treino, e equipamento testado por nós, sem patrocínios a influenciar as opiniões.
>
> Se procuras um plano à tua medida, o acompanhamento personalizado está a um clique.
>
> Explora. Aprende. E corre com ciência — não com achismos.

**Nota:** se a ferramenta de avatar tiver um nome ou persona já definida (ex. "Treinador André" ou similar), substitui "Bem-vindo à Performance Running" por uma apresentação pessoal — não defini um nome porque isso é uma decisão de marca tua, não técnica.

## Alternativa mais curta (~25s, se preferires algo mais direto)

> Olá. Isto é a Performance Running: ciência aplicada à corrida, em português.
>
> Artigos diários sobre treino, fisiologia e nutrição, metodologias por distância, ferramentas de cálculo e equipamento testado — tudo gratuito.
>
> Queres um plano à tua medida? O acompanhamento personalizado está aqui ao lado.
>
> Corre com ciência. Não com achismos.

## Depois de teres o vídeo — como o colocar no site

1. Exporta o vídeo final como `apresentacao-avatar.mp4`.
2. Extrai um frame para usar como miniatura (poster) — com `ffmpeg` instalado, corre:
   ```
   ffmpeg -i apresentacao-avatar.mp4 -ss 00:00:02 -frames:v 1 apresentacao-avatar-poster.jpg
   ```
   (ajusta `00:00:02` para o segundo do vídeo que tiver melhor enquadramento do avatar)
3. Coloca os dois ficheiros em `public/videos/` no repositório:
   - `public/videos/apresentacao-avatar.mp4`
   - `public/videos/apresentacao-avatar-poster.jpg`
4. Faz commit e push. **Não é preciso mexer em mais nada** — o código já está preparado para detetar estes ficheiros automaticamente e mostrar o cartão de vídeo no hero assim que existirem. Enquanto não existirem, a homepage continua exatamente como está hoje, sem espaços em branco nem elementos partidos.
