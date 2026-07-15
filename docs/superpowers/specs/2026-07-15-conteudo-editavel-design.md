# Conteúdo editável pelo Sandro — design

**Objetivo:** uma aba "Conteúdo do site" no painel admin onde o Sandro edita sozinho,
sem programador, as fotos dele e os textos principais da home e da página /sobre.

## Arquitetura

- Tabela `conteudo_site (chave text pk, valor jsonb, updated_at)`.
- **O conteúdo fixo de hoje vira o padrão (fallback).** Cada campo tem um valor
  padrão no código (o texto/foto atual). O site só usa o banco quando o Sandro
  edita; campo nunca tocado = aparece como está hoje. Nada quebra, dá pra ligar
  campo por campo.
- Fotos: reusa o `uploadImagem` que já existe (bucket `imoveis`), guarda a URL
  como `valor`.
- Textos com várias linhas / listas: editados como texto, um item por linha.
- RLS: leitura pública (o site renderiza), escrita só admin (padrão de
  `empreendimentos`).
- `getConteudo()` com `cache()` (dedup por request); componentes recebem os
  valores por prop a partir das páginas server (page.tsx / sobre/page.tsx).

## Inventário de campos

### Fotos (4)
- `foto_hero` → home hero (padrão `/sandro-recorte.png`)
- `foto_sobremim` → "Sobre mim" da home (padrão `/sandro-sobre.jpg`)
- `foto_contato` → seção contato da home (padrão `/sandro-contato.png`)
- `foto_sobre` → página /sobre (padrão `/sobre/sandro-sentado.jpg`)

### Textos da home
- `hero_titulo_1` ("Mais que imóveis,"), `hero_titulo_2` ("realizo sonhos.")
- `hero_subtitulo`
- `hero_badges` (lista: Empatia, Transparência, Honestidade)
- `hero_frase` ("Clientes que se tornam amigos.")
- `sobremim_titulo`, `sobremim_texto`
- `sobremim_pills` (lista de 4)
- `numeros` (lista valor|label — compartilhado home + /sobre)

### Textos da página /sobre (data/sobre.ts)
- `bio_paragrafos`, `bio_realizacoes`, `bio_proposito`, `bio_frase_final`
- `valores` (lista emoji + título)
- `destaques` (lista)

## Entrega (fatias verticais que rodam)

1. **Infra + 4 fotos** — tabela, leitura/escrita, aba no painel, editor de fotos,
   e as 4 fotos ligadas com fallback. (1 migration)
2. **Textos da home** — hero + sobre-mim. (só código)
3. **Textos da /sobre** — bio, valores, números, conquistas. (só código)
