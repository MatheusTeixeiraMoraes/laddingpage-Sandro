# Empreendimentos + Plantas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cada empreendimento pode ter várias plantas (metragem/suíte/preço próprios), a home mostra faixa de preço/metragem por empreendimento, e uma página de detalhe por empreendimento deixa o lead trocar de planta (abas) vendo galeria legendada, specs e WhatsApp específicos daquela planta.

**Architecture:** O modelo `Imovel` (unidade única) do pilar anterior é substituído por `Empreendimento` (com `plantas: Planta[]`). `filterEmpreendimentos` casa um empreendimento se **ao menos uma planta** atender aos filtros numéricos. Para não deixar o build quebrado no meio do trabalho, a migração acontece em duas etapas: Task 1 cria o novo modelo lado a lado com o antigo (nada quebra); Task 2 troca todos os consumidores para o novo modelo e só então apaga os arquivos antigos (`Imovel`/`filterImoveis`/`ImovelCard`). Task 3 adiciona a rota de detalhe (`/empreendimentos/[id]`), nova e aditiva.

**Tech Stack:** Next.js 16 (App Router, dynamic route com `params: Promise<...>` e `generateStaticParams`) + TypeScript + Tailwind CSS v4, `node:test` nativo.

## Global Constraints

- `Filtros`/`FILTROS_VAZIOS` (formato já existente) não mudam de forma — só o que eles filtram muda (plantas, não imóveis direto).
- Uma planta "casa" nos filtros numéricos (dormitórios/vagas/metragem/preço); um empreendimento casa se **qualquer** uma de suas plantas casar. Busca por texto (`nome`/`bairro`) e `tipo` continuam no nível do empreendimento.
- Sem fotos reais — galeria continua sendo blocos placeholder legendados (mesma abordagem do pilar anterior, sem URL externa).
- Card na home: link inteiro (exceto o botão de WhatsApp) navega para `/empreendimentos/[id]`; **não aninhar `<a>` dentro de `<a>`** — o botão de WhatsApp fica fora do `<Link>`, como irmão dentro do mesmo card.
- Mensagem de WhatsApp do card da home continua citando só o nome do empreendimento (sem mudança). Mensagem de WhatsApp da página de detalhe cita nome do empreendimento **+ rótulo da planta selecionada**.
- **Validado em sandbox:** rota dinâmica do Next 16 recebe `params` como `Promise<{ id: string }>` — precisa `await params` dentro do componente async. `generateStaticParams` funciona normalmente para pré-gerar as páginas conhecidas.

---

### Task 1: Novo modelo de dados (`Empreendimento`/`Planta`) e filtro

**Files:**
- Create: `src/types/empreendimento.ts`
- Create: `src/data/empreendimentos.ts`
- Create: `src/lib/filterEmpreendimentos.ts`
- Test: `src/lib/filterEmpreendimentos.test.ts`

**Interfaces:**
- Consumes: nenhuma.
- Produces: `type Empreendimento`, `type Planta`, `type TipoEmpreendimento` (`src/types/empreendimento.ts`); `empreendimentos: Empreendimento[]` (`src/data/empreendimentos.ts`); `type Filtros`, `FILTROS_VAZIOS`, `filterEmpreendimentos(empreendimentos, filtros, searchTerm): Empreendimento[]` (`src/lib/filterEmpreendimentos.ts`) — usados pela Task 2. Os arquivos antigos (`imovel.ts`, `imoveis.ts`, `filterImoveis.ts`) continuam intactos até a Task 2 — nada quebra nesta task.

- [ ] **Step 1: Criar os tipos**

Criar `src/types/empreendimento.ts`:

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

- [ ] **Step 2: Criar os dados mock**

Criar `src/data/empreendimentos.ts`:

```ts
import type { Empreendimento } from "@/types/empreendimento";

export const empreendimentos: Empreendimento[] = [
  {
    id: "1",
    nome: "Residencial Jardim das Flores",
    tipo: "apartamento",
    bairro: "Vila Prado",
    plantas: [
      {
        id: "1-sem-suite",
        metragem: 44,
        comSuite: false,
        dormitorios: 2,
        vagas: 1,
        preco: 280000,
        fotos: ["Sala", "Quarto", "Planta baixa"],
      },
      {
        id: "1-com-suite",
        metragem: 44,
        comSuite: true,
        dormitorios: 2,
        vagas: 1,
        preco: 320000,
        fotos: ["Sala", "Suíte", "Planta baixa"],
      },
    ],
  },
  {
    id: "2",
    nome: "Edifício Bela Vista",
    tipo: "apartamento",
    bairro: "Centro",
    plantas: [
      {
        id: "2-65",
        metragem: 65,
        comSuite: false,
        dormitorios: 2,
        vagas: 1,
        preco: 420000,
        fotos: ["Sala", "Cozinha", "Planta baixa"],
      },
      {
        id: "2-85",
        metragem: 85,
        comSuite: true,
        dormitorios: 3,
        vagas: 2,
        preco: 520000,
        fotos: ["Sala", "Suíte", "Varanda", "Planta baixa"],
      },
    ],
  },
  {
    id: "3",
    nome: "Casa Recanto Verde",
    tipo: "casa",
    bairro: "Chácara Elisa",
    plantas: [
      {
        id: "3-unica",
        metragem: 180,
        comSuite: true,
        dormitorios: 4,
        vagas: 3,
        preco: 890000,
        fotos: ["Fachada", "Sala", "Suíte", "Quintal"],
      },
    ],
  },
  {
    id: "4",
    nome: "Studio Central",
    tipo: "apartamento",
    bairro: "Centro",
    plantas: [
      {
        id: "4-unica",
        metragem: 32,
        comSuite: false,
        dormitorios: 1,
        vagas: 0,
        preco: 210000,
        fotos: ["Ambiente integrado", "Planta baixa"],
      },
    ],
  },
  {
    id: "5",
    nome: "Sala Comercial Prime Office",
    tipo: "comercial",
    bairro: "Vila Prado",
    plantas: [
      {
        id: "5-unica",
        metragem: 45,
        comSuite: false,
        dormitorios: 0,
        vagas: 1,
        preco: 280000,
        fotos: ["Sala principal", "Recepção", "Planta baixa"],
      },
    ],
  },
];
```

- [ ] **Step 3: Escrever o teste de `filterEmpreendimentos` (falhando)**

Criar `src/lib/filterEmpreendimentos.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { filterEmpreendimentos, FILTROS_VAZIOS } from "./filterEmpreendimentos.ts";
import type { Empreendimento } from "../types/empreendimento";

const fixture: Empreendimento[] = [
  {
    id: "1",
    nome: "Casa Azul",
    tipo: "casa",
    bairro: "Centro",
    plantas: [
      {
        id: "1-a",
        metragem: 120,
        comSuite: true,
        dormitorios: 3,
        vagas: 2,
        preco: 500000,
        fotos: [],
      },
    ],
  },
  {
    id: "2",
    nome: "Predio Duas Plantas",
    tipo: "apartamento",
    bairro: "Vila Nova",
    plantas: [
      {
        id: "2-a",
        metragem: 30,
        comSuite: false,
        dormitorios: 1,
        vagas: 0,
        preco: 180000,
        fotos: [],
      },
      {
        id: "2-b",
        metragem: 90,
        comSuite: true,
        dormitorios: 3,
        vagas: 2,
        preco: 600000,
        fotos: [],
      },
    ],
  },
];

test("sem filtros nem busca, retorna todos", () => {
  const resultado = filterEmpreendimentos(fixture, FILTROS_VAZIOS, "");
  assert.equal(resultado.length, 2);
});

test("busca por nome", () => {
  const resultado = filterEmpreendimentos(fixture, FILTROS_VAZIOS, "azul");
  assert.deepEqual(resultado.map((e) => e.id), ["1"]);
});

test("busca por bairro", () => {
  const resultado = filterEmpreendimentos(fixture, FILTROS_VAZIOS, "vila nova");
  assert.deepEqual(resultado.map((e) => e.id), ["2"]);
});

test("filtra por tipo", () => {
  const resultado = filterEmpreendimentos(
    fixture,
    { ...FILTROS_VAZIOS, tipo: "apartamento" },
    "",
  );
  assert.deepEqual(resultado.map((e) => e.id), ["2"]);
});

test("casa se pelo menos uma planta atende aos filtros numericos", () => {
  const resultado = filterEmpreendimentos(
    fixture,
    { ...FILTROS_VAZIOS, dormitoriosMin: 3, metragemMin: 80 },
    "",
  );
  // "Predio Duas Plantas" so tem a planta 2-b (90m2, 3 dorm) atendendo;
  // a planta 2-a (30m2, 1 dorm) nao atende, mas isso nao exclui o predio.
  assert.deepEqual(resultado.map((e) => e.id).sort(), ["1", "2"]);
});

test("nao casa quando nenhuma planta atende", () => {
  const resultado = filterEmpreendimentos(
    fixture,
    { ...FILTROS_VAZIOS, dormitoriosMin: 5 },
    "",
  );
  assert.equal(resultado.length, 0);
});
```

- [ ] **Step 4: Rodar o teste e confirmar que falha**

Run: `node --test src/lib/filterEmpreendimentos.test.ts`
Expected: FAIL — `Cannot find module './filterEmpreendimentos.ts'`.

- [ ] **Step 5: Implementar `src/lib/filterEmpreendimentos.ts`**

```ts
import type { Empreendimento, Planta, TipoEmpreendimento } from "../types/empreendimento";

export type Filtros = {
  tipo: TipoEmpreendimento | "todos";
  dormitoriosMin: number;
  vagasMin: number;
  metragemMin: number | null;
  metragemMax: number | null;
  precoMin: number | null;
  precoMax: number | null;
};

export const FILTROS_VAZIOS: Filtros = {
  tipo: "todos",
  dormitoriosMin: 0,
  vagasMin: 0,
  metragemMin: null,
  metragemMax: null,
  precoMin: null,
  precoMax: null,
};

function plantaAtendeFiltros(planta: Planta, filtros: Filtros): boolean {
  if (planta.dormitorios < filtros.dormitoriosMin) return false;
  if (planta.vagas < filtros.vagasMin) return false;
  if (filtros.metragemMin !== null && planta.metragem < filtros.metragemMin)
    return false;
  if (filtros.metragemMax !== null && planta.metragem > filtros.metragemMax)
    return false;
  if (filtros.precoMin !== null && planta.preco < filtros.precoMin)
    return false;
  if (filtros.precoMax !== null && planta.preco > filtros.precoMax)
    return false;
  return true;
}

export function filterEmpreendimentos(
  empreendimentos: Empreendimento[],
  filtros: Filtros,
  searchTerm: string,
): Empreendimento[] {
  const termo = searchTerm.trim().toLowerCase();

  return empreendimentos.filter((empreendimento) => {
    if (termo) {
      const alvo = `${empreendimento.nome} ${empreendimento.bairro}`.toLowerCase();
      if (!alvo.includes(termo)) return false;
    }
    if (filtros.tipo !== "todos" && empreendimento.tipo !== filtros.tipo)
      return false;
    return empreendimento.plantas.some((planta) =>
      plantaAtendeFiltros(planta, filtros),
    );
  });
}
```

- [ ] **Step 6: Rodar o teste e confirmar que passa**

Run: `node --test src/lib/filterEmpreendimentos.test.ts`
Expected: `pass 6`, `fail 0`.

- [ ] **Step 7: Build (confirma que nada quebrou — arquivos antigos ainda existem e nada os referencia ainda)**

Run: `npm run build`
Expected: build compila sem erro.

- [ ] **Step 8: Commit**

```bash
git add src/types/empreendimento.ts src/data/empreendimentos.ts src/lib/filterEmpreendimentos.ts src/lib/filterEmpreendimentos.test.ts
git commit -m "feat: adiciona modelo Empreendimento/Planta e logica de filtragem"
```

---

### Task 2: Migrar a home para o novo modelo (e apagar o antigo)

**Files:**
- Create: `src/components/EmpreendimentoCard.tsx`
- Modify: `src/components/PropertySearch.tsx`
- Modify: `src/components/FiltersModal.tsx`
- Modify: `src/app/page.tsx`
- Delete: `src/types/imovel.ts`
- Delete: `src/data/imoveis.ts`
- Delete: `src/lib/filterImoveis.ts`
- Delete: `src/lib/filterImoveis.test.ts`
- Delete: `src/components/ImovelCard.tsx`

**Interfaces:**
- Consumes: `Empreendimento` (`@/types/empreendimento`), `filterEmpreendimentos`/`FILTROS_VAZIOS`/`Filtros` (`@/lib/filterEmpreendimentos`), `buildWhatsAppLink` (`@/lib/whatsapp`), `empreendimentos` (`@/data/empreendimentos`).
- Produces: `EmpreendimentoCard({ empreendimento: Empreendimento })`, `PropertySearch({ empreendimentos: Empreendimento[] })` — este último consumido pela Task 4 (já é, via `page.tsx`).

- [ ] **Step 1: Criar `src/components/EmpreendimentoCard.tsx`**

```tsx
import Link from "next/link";
import type { Empreendimento } from "@/types/empreendimento";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const TIPO_LABEL: Record<Empreendimento["tipo"], string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  comercial: "Comercial",
};

function formatarPreco(preco: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

function faixaDeMetragem(empreendimento: Empreendimento): string {
  const metragens = empreendimento.plantas.map((planta) => planta.metragem);
  const min = Math.min(...metragens);
  const max = Math.max(...metragens);
  return min === max ? `${min} m²` : `${min}–${max} m²`;
}

function precoAPartirDe(empreendimento: Empreendimento): number {
  return Math.min(...empreendimento.plantas.map((planta) => planta.preco));
}

export function EmpreendimentoCard({
  empreendimento,
}: {
  empreendimento: Empreendimento;
}) {
  const whatsappLink = buildWhatsAppLink(
    `Olá, vi o imóvel ${empreendimento.nome} no site e gostaria de saber mais informações.`,
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      <Link
        href={`/empreendimentos/${empreendimento.id}`}
        className="flex flex-1 flex-col"
      >
        <div className="flex h-36 items-center justify-center bg-brand-purple/10 text-sm font-medium text-brand-purple">
          {TIPO_LABEL[empreendimento.tipo]}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-bold text-slate-800">{empreendimento.nome}</h3>
          <p className="text-sm text-slate-500">{empreendimento.bairro}</p>
          <p className="text-sm text-slate-600">{faixaDeMetragem(empreendimento)}</p>
          <p className="text-lg font-bold text-brand-blue">
            A partir de {formatarPreco(precoAPartirDe(empreendimento))}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-brand-purple px-4 py-2 text-center text-sm font-medium text-white hover:bg-purple-700"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Atualizar `src/components/PropertySearch.tsx`**

Substituir todo o conteúdo por:

```tsx
"use client";

import { useMemo, useState } from "react";
import type { Empreendimento } from "@/types/empreendimento";
import {
  filterEmpreendimentos,
  FILTROS_VAZIOS,
  type Filtros,
} from "@/lib/filterEmpreendimentos";
import { SearchBar } from "@/components/SearchBar";
import { FiltersModal } from "@/components/FiltersModal";
import { EmpreendimentoCard } from "@/components/EmpreendimentoCard";

export function PropertySearch({
  empreendimentos,
}: {
  empreendimentos: Empreendimento[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [modalOpen, setModalOpen] = useState(false);

  const resultados = useMemo(
    () => filterEmpreendimentos(empreendimentos, filtros, searchTerm),
    [empreendimentos, filtros, searchTerm],
  );

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onOpenFilters={() => setModalOpen(true)}
      />

      {resultados.length === 0 ? (
        <p className="text-slate-500">Nenhum imóvel encontrado com esses filtros.</p>
      ) : (
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((empreendimento) => (
            <EmpreendimentoCard key={empreendimento.id} empreendimento={empreendimento} />
          ))}
        </div>
      )}

      <FiltersModal
        open={modalOpen}
        filtros={filtros}
        onApply={(novosFiltros) => {
          setFiltros(novosFiltros);
          setModalOpen(false);
        }}
        onClear={() => setFiltros(FILTROS_VAZIOS)}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
```

- [ ] **Step 3: Atualizar o import em `src/components/FiltersModal.tsx`**

Trocar:

```ts
import type { Filtros } from "@/lib/filterImoveis";
```

por:

```ts
import type { Filtros } from "@/lib/filterEmpreendimentos";
```

Nenhuma outra linha do arquivo muda.

- [ ] **Step 4: Atualizar `src/app/page.tsx`**

Substituir todo o conteúdo por:

```tsx
import { empreendimentos } from "@/data/empreendimentos";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PropertySearch } from "@/components/PropertySearch";

const WHATSAPP_GENERICO = buildWhatsAppLink(
  "Olá, vi o site e gostaria de saber mais sobre os imóveis.",
);

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-brand-purple sm:text-5xl">
        Sandro Higuti Consultor Imobiliário
      </h1>
      <p className="max-w-xl text-lg text-slate-600">
        Encontre o imóvel ideal com a consultoria de quem conhece o mercado.
      </p>
      <a
        href={WHATSAPP_GENERICO}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-brand-blue px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Falar no WhatsApp
      </a>
      <PropertySearch empreendimentos={empreendimentos} />
    </div>
  );
}
```

- [ ] **Step 5: Apagar os arquivos do modelo antigo**

```bash
rm src/types/imovel.ts src/data/imoveis.ts src/lib/filterImoveis.ts src/lib/filterImoveis.test.ts src/components/ImovelCard.tsx
```

- [ ] **Step 6: Testes, build e lint**

Run: `npm test && npm run build && npm run lint`
Expected: todos passam sem erro (os testes de `filterImoveis` sumiram junto com o arquivo; só os de `filterEmpreendimentos` e `whatsapp` continuam rodando).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: migra a home para o modelo Empreendimento/Planta"
```

---

### Task 3: Página de detalhe do empreendimento

**Files:**
- Create: `src/components/PlantaSelector.tsx`
- Create: `src/components/EmpreendimentoDetalhe.tsx`
- Create: `src/app/empreendimentos/[id]/page.tsx`

**Interfaces:**
- Consumes: `Empreendimento`/`Planta` (`@/types/empreendimento`), `empreendimentos` (`@/data/empreendimentos`), `buildWhatsAppLink` (`@/lib/whatsapp`).
- Produces: rota `/empreendimentos/[id]`, consumida pelo `<Link>` do `EmpreendimentoCard` (Task 2).

- [ ] **Step 1: Criar `src/components/PlantaSelector.tsx`**

```tsx
"use client";

import type { Planta } from "@/types/empreendimento";

export function labelDaPlanta(planta: Planta): string {
  return `${planta.metragem}m² ${planta.comSuite ? "com suíte" : "sem suíte"}`;
}

type PlantaSelectorProps = {
  plantas: Planta[];
  selecionadaId: string;
  onSelect: (id: string) => void;
};

export function PlantaSelector({
  plantas,
  selecionadaId,
  onSelect,
}: PlantaSelectorProps) {
  if (plantas.length <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {plantas.map((planta) => (
        <button
          key={planta.id}
          type="button"
          onClick={() => onSelect(planta.id)}
          className={
            planta.id === selecionadaId
              ? "rounded-full bg-brand-purple px-4 py-2 text-sm font-medium text-white"
              : "rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          }
        >
          {labelDaPlanta(planta)}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Criar `src/components/EmpreendimentoDetalhe.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Empreendimento } from "@/types/empreendimento";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PlantaSelector, labelDaPlanta } from "@/components/PlantaSelector";

function formatarPreco(preco: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

export function EmpreendimentoDetalhe({
  empreendimento,
}: {
  empreendimento: Empreendimento;
}) {
  const [plantaId, setPlantaId] = useState(empreendimento.plantas[0].id);
  const planta =
    empreendimento.plantas.find((item) => item.id === plantaId) ??
    empreendimento.plantas[0];

  const whatsappLink = buildWhatsAppLink(
    `Olá, vi o imóvel ${empreendimento.nome} (${labelDaPlanta(planta)}) no site e gostaria de saber mais informações.`,
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <PlantaSelector
        plantas={empreendimento.plantas}
        selecionadaId={planta.id}
        onSelect={setPlantaId}
      />

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {planta.fotos.map((foto, index) => (
          <div
            key={index}
            className="flex h-32 items-center justify-center rounded-xl bg-brand-purple/10 p-2 text-center text-xs font-medium text-brand-purple"
          >
            Planta {labelDaPlanta(planta)} — {foto}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 text-slate-600">
        <p>
          {planta.dormitorios} dorm. · {planta.vagas} vaga(s) · {planta.metragem} m²
        </p>
        <p className="text-2xl font-bold text-brand-blue">
          {formatarPreco(planta.preco)}
        </p>
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-brand-purple px-6 py-3 font-medium text-white hover:bg-purple-700"
      >
        Falar no WhatsApp sobre esta planta
      </a>
    </div>
  );
}
```

- [ ] **Step 3: Criar `src/app/empreendimentos/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { empreendimentos } from "@/data/empreendimentos";
import { EmpreendimentoDetalhe } from "@/components/EmpreendimentoDetalhe";

export function generateStaticParams() {
  return empreendimentos.map((empreendimento) => ({ id: empreendimento.id }));
}

export default async function EmpreendimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empreendimento = empreendimentos.find((item) => item.id === id);

  if (!empreendimento) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-brand-purple sm:text-4xl">
        {empreendimento.nome}
      </h1>
      <p className="text-slate-500">{empreendimento.bairro}</p>
      <EmpreendimentoDetalhe empreendimento={empreendimento} />
    </div>
  );
}
```

- [ ] **Step 4: Build e lint**

Run: `npm run build && npm run lint`
Expected: build gera `/empreendimentos/[id]` como rota SSG (`generateStaticParams`) para os 5 ids do mock, sem erro de tipo; lint sem erro.

- [ ] **Step 5: Commit**

```bash
git add src/components/PlantaSelector.tsx src/components/EmpreendimentoDetalhe.tsx src/app/empreendimentos
git commit -m "feat: adiciona pagina de detalhe do empreendimento com selecao de planta"
```

---

### Task 4: Verificação visual end-to-end

**Files:** nenhum (só verificação).

- [ ] **Step 1: Rodar toda a suíte de testes**

Run: `npm test`
Expected: `pass` para todos os testes de `filterEmpreendimentos.test.ts` e `whatsapp.test.ts` (8 no total), `fail 0`.

- [ ] **Step 2: Verificação visual (Playwright)**

Subir `npm run dev` em background e, via Playwright MCP:
1. Navegar para `http://localhost:3000`, confirmar que os cards mostram faixa de metragem e "A partir de R$ ..." (ex: Residencial Jardim das Flores deve mostrar "44 m²" e "A partir de R$ 280.000,00")
2. Clicar no card "Residencial Jardim das Flores" (fora do botão de WhatsApp) — confirmar navegação para `/empreendimentos/1`
3. Confirmar que aparecem 2 abas de planta ("44m² sem suíte", "44m² com suíte") e a galeria mostra as legendas da planta ativa
4. Clicar na outra aba — confirmar que a galeria, as specs e o preço mudam
5. Inspecionar o `href` do botão de WhatsApp da página de detalhe — confirmar que contém o nome do empreendimento e o rótulo da planta selecionada, codificados
6. Navegar para `http://localhost:3000/empreendimentos/id-que-nao-existe` — confirmar página 404
7. Parar o servidor dev

Expected: todos os passos se comportam como descrito, sem erros no console do navegador.

- [ ] **Step 3: Push**

Run: `git push`
Expected: commits das Tasks 1–3 publicados em `origin/main`.
