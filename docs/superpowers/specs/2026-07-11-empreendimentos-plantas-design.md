# Empreendimentos + Plantas

**Data:** 2026-07-11
**Status:** Aprovado — pronto para plano de implementação
**Depende de:** [Home — Busca, Filtros e WhatsApp](2026-07-11-home-busca-whatsapp-design.md)

## Contexto

Terceiro pilar do backlog da landing page do Sandro Higuti. O pilar anterior
modelou cada resultado da busca como um `Imovel` de metragem/preço únicos —
um stand-in necessário para ter busca/filtros funcionando de ponta a ponta
sem dado real. Este pilar implementa o requisito original: um empreendimento
pode ter **múltiplas plantas** (ex: 44m² e 65m², com ou sem suíte), cada uma
com sua própria galeria de fotos claramente rotulada, e uma página de
detalhe por empreendimento com WhatsApp citando a planta específica vista
pelo lead.

## Escopo

### 1. Modelo de dados — `Imovel` vira `Empreendimento`

O modelo antigo não consegue representar múltiplas plantas por prédio.
Substituição (não extensão): os arquivos `types/imovel.ts`,
`data/imoveis.ts`, `lib/filterImoveis.ts` (+ teste) e
`components/ImovelCard.tsx` são renomeados e restruturados.

`src/types/empreendimento.ts`:

```ts
export type TipoEmpreendimento = "apartamento" | "casa" | "comercial";

export type Planta = {
  id: string;
  metragem: number;
  comSuite: boolean;
  dormitorios: number;
  vagas: number;
  preco: number;
  fotos: string[];
};

export type Empreendimento = {
  id: string;
  nome: string;
  tipo: TipoEmpreendimento;
  bairro: string;
  plantas: Planta[];
};
```

`fotos: string[]` são legendas mock (ex: `"Sala"`, `"Quarto"`, `"Planta baixa"`),
não URLs de imagem real — mesma abordagem de placeholder sem imagem/rede
usada no pilar anterior.

### 2. Dados mock (`src/data/empreendimentos.ts`)

5 empreendimentos (os mesmos do pilar anterior). Dois deles ganham 2 plantas
cada, pra exercitar a feature de verdade; os outros três ficam com 1 planta
única (múltiplas plantas é opcional, não obrigatório, por empreendimento):

- Residencial Jardim das Flores — 44m² sem suíte / 44m² com suíte
- Edifício Bela Vista — 65m² sem suíte / 85m² com suíte
- Casa Recanto Verde — planta única, 180m², com suíte
- Studio Central — planta única, 32m², sem suíte
- Sala Comercial Prime Office — planta única, 45m², sem suíte

### 3. Filtro (`src/lib/filterEmpreendimentos.ts`)

Mesma assinatura de `filterImoveis`, mas a semântica muda: busca e tipo
continuam no nível do empreendimento (`nome`, `bairro`, `tipo`); os campos
numéricos (dormitórios/vagas/metragem/preço) casam o empreendimento se
**pelo menos uma planta** atender a todos os critérios.

```ts
export function filterEmpreendimentos(
  empreendimentos: Empreendimento[],
  filtros: Filtros,
  searchTerm: string,
): Empreendimento[];
```

`Filtros` (tipo já existente) não muda de forma.

### 4. Card na home (`EmpreendimentoCard`, renomeado de `ImovelCard`)

Mostra nome, bairro, tipo, faixa de metragem (mín–máx entre as plantas) e
"a partir de R$ X" (menor preço entre as plantas). O card inteiro (exceto o
botão de WhatsApp) é um link para `/empreendimentos/[id]`. O botão de
WhatsApp do card continua citando só o nome do empreendimento — igual ao
comportamento já existente, sem mudança de mensagem.

### 5. Página de detalhe (`src/app/empreendimentos/[id]/page.tsx`)

Server component: busca o empreendimento pelo `id` nos dados mock; se não
encontrar, chama `notFound()` (404 nativo do Next). `generateStaticParams`
pré-gera as páginas para todos os ids conhecidos.

Renderiza um client component (`EmpreendimentoDetalhe`) que recebe o
empreendimento inteiro e controla qual planta está selecionada:

- **Seletor de planta**: uma aba/pill por planta, rótulo `"{metragem}m²
  {com/sem} suíte"` (ex: "44m² sem suíte"). Clicar troca a planta ativa.
- **Galeria da planta ativa**: um bloco placeholder por item de `fotos`,
  cada um legendado `"Planta {label da planta} — {legenda da foto}"` (ex:
  "Planta 44m² sem suíte — Sala"), pra deixar inequívoco a qual planta
  aquela imagem se refere.
- **Specs da planta ativa**: dormitórios, vagas, metragem, preço formatado.
- **WhatsApp**: mensagem `"Olá, vi o imóvel {nome do empreendimento}
  ({label da planta}) no site e gostaria de saber mais informações."`,
  atualizada conforme a planta selecionada.

### Fora de escopo (explícito)

- Fotos reais (arquivo/URL) — continuam sendo placeholders legendados.
- Painel administrativo, Supabase, Vercel.
- Mapa do Google (pilar próprio, ainda não iniciado).
- Qualquer alteração na home além de trocar o card e adicionar o link de
  navegação (busca/filtros do pilar anterior continuam como estão).

## Critério de pronto

- `npm run build`, `npm run lint` e `npm test` passam sem erro.
- Testes cobrem `filterEmpreendimentos`, incluindo o caso "casa se pelo
  menos uma planta atende aos filtros, mesmo que outra não atenda".
- Verificação visual (Playwright): clicar num card da home abre a página do
  empreendimento certo; trocar de aba de planta troca a galeria/specs
  exibidas; o link de WhatsApp da página de detalhe contém o nome do
  empreendimento e o rótulo da planta selecionada; acessar um id inexistente
  mostra 404.
