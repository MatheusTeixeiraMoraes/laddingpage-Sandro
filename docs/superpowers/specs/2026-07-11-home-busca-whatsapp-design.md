# Home — Busca, Filtros e WhatsApp

**Data:** 2026-07-11
**Status:** Aprovado — pronto para plano de implementação
**Depende de:** [Fundação do projeto](2026-07-11-fundacao-projeto-design.md)

## Contexto

Segundo pilar do backlog da landing page do Sandro Higuti. Objetivo: a home
ganha busca em destaque, um painel de filtros (atrás de um ícone, para não
poluir a tela) e o botão de WhatsApp — tudo funcionando de ponta a ponta,
inclusive filtrando resultados de verdade, mesmo sem o cadastro real de
empreendimentos (que é o próximo pilar).

## Escopo

### 1. Dados mock de imóveis

`src/types/imovel.ts`:

```ts
export type TipoImovel = "apartamento" | "casa" | "comercial";

export type Imovel = {
  id: string;
  nome: string;
  tipo: TipoImovel;
  dormitorios: number;
  vagas: number;
  metragem: number; // m²
  preco: number; // R$
  bairro: string;
  imagemUrl: string;
};
```

`src/data/imoveis.ts` exporta um array com 5 imóveis mock cobrindo os três
tipos, faixas de metragem e preço variadas — usado só nesta fase. Quando o
pilar de Empreendimentos entrar, este arquivo é substituído pela fonte real
(planilha/admin), mas o `type Imovel` tende a se manter compatível.

### 2. Busca em texto

Campo de busca em destaque na home (não escondido), filtra por `nome` ou
`bairro` (case-insensitive, substring).

### 3. Painel de filtros

Um ícone ao lado da busca abre um **modal centralizado** (overlay, fecha com
X ou clique fora) com:

- **Tipo**: select — Todos / Apartamento / Casa / Comercial
- **Dormitórios**: select — Qualquer / 1+ / 2+ / 3+ / 4+ (mínimo)
- **Vagas**: select — Qualquer / 1+ / 2+ / 3+ (mínimo; sem distinção
  coberta/descoberta nesta fase — fica como detalhe do imóvel, não filtro)
- **Metragem**: dois inputs numéricos (mín. / máx., m²)
- **Preço**: dois inputs numéricos (mín. / máx., R$)

Botões "Aplicar filtros" e "Limpar filtros". Filtros aplicados persistem no
estado da página (não na URL) enquanto o modal fica fechado.

### 4. Lógica de filtragem

`src/lib/filterImoveis.ts` exporta:

```ts
export type Filtros = {
  tipo: TipoImovel | "todos";
  dormitoriosMin: number; // 0 = qualquer
  vagasMin: number; // 0 = qualquer
  metragemMin: number | null;
  metragemMax: number | null;
  precoMin: number | null;
  precoMax: number | null;
};

export function filterImoveis(
  imoveis: Imovel[],
  filtros: Filtros,
  searchTerm: string,
): Imovel[];
```

Função pura, sem dependência de React — testável isoladamente com
`node --test` (Node roda `.ts` nativamente, sem dependência nova).

### 5. Grade de resultados

Grade de cards (`ImovelCard`) abaixo da busca, mostrando nome, tipo,
dormitórios, vagas, metragem, preço formatado (`Intl.NumberFormat` BRL) e
bairro. Estado vazio ("Nenhum imóvel encontrado com esses filtros") quando o
resultado é zero.

### 6. WhatsApp

`src/lib/whatsapp.ts`:

```ts
const WHATSAPP_NUMBER = "5515992500314";

export function buildWhatsAppLink(message: string): string;
```

Gera link `https://wa.me/5515992500314?text=<mensagem_codificada>`.

- **Botão genérico** na home (fora da grade, próximo à busca/hero): mensagem
  fixa "Olá, vi o site e gostaria de saber mais sobre os imóveis."
- **Botão por card**: mensagem "Olá, vi o imóvel [Nome do imóvel] no site e
  gostaria de saber mais informações."

### Fora de escopo (explícito)

- Cadastro real de empreendimentos, plantas, páginas de detalhe — pilar
  seguinte.
- Filtro por vaga coberta/descoberta — não existe nesta fase.
- Filtros na URL (compartilhável) — só estado local do componente.
- Painel administrativo, Supabase, Vercel.

## Estrutura de arquivos

```
src/
  types/imovel.ts
  data/imoveis.ts
  lib/whatsapp.ts
  lib/filterImoveis.ts
  lib/filterImoveis.test.ts
  components/SearchBar.tsx       (client component)
  components/FiltersModal.tsx    (client component)
  components/ImovelCard.tsx
  components/PropertySearch.tsx  (client component; orquestra estado)
```

`src/app/page.tsx` (server component) importa `imoveis` de `data/imoveis.ts`
e renderiza `<PropertySearch imoveis={imoveis} />` mais o botão de WhatsApp
genérico.

## Critério de pronto

- `npm run build` e `npm run lint` passam sem erro.
- `node --test src/lib/filterImoveis.test.ts` passa.
- Verificação visual (Playwright): busca filtra por texto, ícone abre o
  modal, aplicar filtros reduz a grade corretamente, botões de WhatsApp
  geram links `wa.me` com mensagem esperada.
