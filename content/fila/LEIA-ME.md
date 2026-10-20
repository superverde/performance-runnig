# Fila de artigos

Artigos já escritos e verificados (regras em `scripts/auditoria/REVISAO_CIENTIFICA.md`), à espera de publicação.

- Nome do ficheiro: `NNN-<slug>.md` — `NNN` define a ordem (001 sai primeiro).
- Frontmatter completo com `date: 'PENDENTE'`; a data é posta no dia da publicação.
- A tarefa diária (`.github/workflows/daily-articles.yml`) corre `scripts/publicar-da-fila.mjs`, que publica até 3 por dia e move-os para `content/blog/<slug>.md`.
- Se a fila esvaziar, o gerador automático escreve os artigos do dia (rede de segurança).
- Os ficheiros desta pasta não aparecem no site.
