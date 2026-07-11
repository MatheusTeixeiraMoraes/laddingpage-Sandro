# Home — Busca, Filtros e WhatsApp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Home com busca por texto, painel de filtros (modal) e botões de WhatsApp (genérico + por imóvel) funcionando de ponta a ponta sobre uma lista mock de imóveis.

**Architecture:** Duas funções puras e testáveis (`buildWhatsAppLink`, `filterImoveis`) isoladas em `src/lib/`, cobertas por `node --test` nativo (Node 24 roda `.ts` sem dependência extra). Em cima delas, componentes de UI: `SearchBar` + `FiltersModal` (client components controlando estado) orquestrados por `PropertySearch`, que renderiza a grade de `ImovelCard`. `page.tsx` (server component) injeta os dados mock e monta a página.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, Node.js `node:test`/`node:assert` nativo (sem framework de teste novo).

## Global Constraints

- Sem parâmetros de URL para os filtros — estado local do componente (`useState`).
- Sem slider de terceiros — inputs numéricos nativos para faixas de metragem/preço.
- Filtro de vagas é só "quantidade mínima" — sem distinção coberta/descoberta nesta fase.
- Número de WhatsApp: `5515992500314`.
- Mensagem genérica (home): `"Olá, vi o site e gostaria de saber mais sobre os imóveis."`
- Mensagem por imóvel: `"Olá, vi o imóvel [Nome do imóvel] no site e gostaria de saber mais informações."`
- Paleta/fonte já definidas na fundação: `brand-white/blue/pink/purple`, fonte Manrope via `font-sans`.
- **Restrição de import não-óbvia:** `src/lib/filterImoveis.ts` é executado tanto pelo bundler do Next.js quanto direto pelo `node --test`. Node nativo exige extensão `.ts` explícita em imports *de valor* relativos, mas `import type` é apagado antes da resolução — por isso o tipo `Imovel` é importado sem extensão (`import type ... from "../types/imovel"`), e os arquivos `.test.ts` importam a função sob teste **com** extensão (`from "./filterImoveis.ts"`). Não trocar esse padrão sem re-testar `node --test`.
- **Pré-requisito validado:** por padrão, `tsc` rejeita import com extensão `.ts` explícita (`error TS5097`). É necessário `"allowImportingTsExtensions": true` no `tsconfig.json` — só é permitido porque `noEmit` já é `true` no projeto. Sem isso, `npm run build` quebra assim que o primeiro `.test.ts` for criado.

---

### Task 1: Link do WhatsApp (`buildWhatsAppLink`)

**Files:**
- Create: `src/lib/whatsapp.ts`
- Test: `src/lib/whatsapp.test.ts`

**Interfaces:**
- Produces: `buildWhatsAppLink(message: string): string`, usado pelas Tasks 3 e 4.

- [ ] **Step 1: Habilitar `allowImportingTsExtensions` no `tsconfig.json`**

Em `compilerOptions`, logo abaixo de `"moduleResolution": "bundler",`, adicionar:

```json
    "allowImportingTsExtensions": true,
```

Sem isso, `tsc` recusa o import com extensão `.ts` explícita usado nos arquivos
`*.test.ts` desta e das próximas tasks (erro `TS5097`). Só é seguro habilitar
porque `noEmit` já é `true` neste projeto.

- [ ] **Step 2: Escrever o teste (falhando)**

Criar `src/lib/whatsapp.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppLink } from "./whatsapp.ts";

test("gera link wa.me com o numero correto", () => {
  const link = buildWhatsAppLink("oi");
  assert.equal(link, "https://wa.me/5515992500314?text=oi");
});

test("codifica espacos, virgula e acentos na mensagem", () => {
  const link = buildWhatsAppLink("Olá, tudo bem?");
  assert.equal(
    link,
    "https://wa.me/5515992500314?text=Ol%C3%A1%2C%20tudo%20bem%3F",
  );
});
```

- [ ] **Step 3: Rodar o teste e confirmar que falha**

Run: `node --test src/lib/whatsapp.test.ts`
Expected: FAIL — `Cannot find module './whatsapp.ts'` (o arquivo `whatsapp.ts` ainda não existe).

- [ ] **Step 4: Implementar `src/lib/whatsapp.ts`**

```ts
const WHATSAPP_NUMBER = "5515992500314";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 5: Rodar o teste e confirmar que passa**

Run: `node --test src/lib/whatsapp.test.ts`
Expected: `pass 2`, `fail 0`.

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json src/lib/whatsapp.ts src/lib/whatsapp.test.ts
git commit -m "feat: adiciona helper de link do WhatsApp"
```

---

### Task 2: Tipos, dados mock e filtragem (`filterImoveis`)

**Files:**
- Create: `src/types/imovel.ts`
- Create: `src/data/imoveis.ts`
- Create: `src/lib/filterImoveis.ts`
- Test: `src/lib/filterImoveis.test.ts`

**Interfaces:**
- Consumes: nenhuma.
- Produces: `type Imovel`, `type TipoImovel` (`src/types/imovel.ts`); `imoveis: Imovel[]` (`src/data/imoveis.ts`); `type Filtros`, `FILTROS_VAZIOS: Filtros`, `filterImoveis(imoveis: Imovel[], filtros: Filtros, searchTerm: string): Imovel[]` (`src/lib/filterImoveis.ts`) — usados pela Task 3.

- [ ] **Step 1: Criar o tipo `Imovel`**

Criar `src/types/imovel.ts`:

```ts
export type TipoImovel = "apartamento" | "casa" | "comercial";

export type Imovel = {
  id: string;
  nome: string;
  tipo: TipoImovel;
  dormitorios: number;
  vagas: number;
  metragem: number;
  preco: number;
  bairro: string;
  imagemUrl: string;
};
```

- [ ] **Step 2: Criar os dados mock**

Criar `src/data/imoveis.ts`:

```ts
import type { Imovel } from "@/types/imovel";

export const imoveis: Imovel[] = [
  {
    id: "1",
    nome: "Residencial Jardim das Flores",
    tipo: "apartamento",
    dormitorios: 2,
    vagas: 1,
    metragem: 55,
    preco: 320000,
    bairro: "Vila Prado",
    imagemUrl: "/imoveis/placeholder-1.jpg",
  },
  {
    id: "2",
    nome: "Edifício Bela Vista",
    tipo: "apartamento",
    dormitorios: 3,
    vagas: 2,
    metragem: 85,
    preco: 520000,
    bairro: "Centro",
    imagemUrl: "/imoveis/placeholder-2.jpg",
  },
  {
    id: "3",
    nome: "Casa Recanto Verde",
    tipo: "casa",
    dormitorios: 4,
    vagas: 3,
    metragem: 180,
    preco: 890000,
    bairro: "Chácara Elisa",
    imagemUrl: "/imoveis/placeholder-3.jpg",
  },
  {
    id: "4",
    nome: "Studio Central",
    tipo: "apartamento",
    dormitorios: 1,
    vagas: 0,
    metragem: 32,
    preco: 210000,
    bairro: "Centro",
    imagemUrl: "/imoveis/placeholder-4.jpg",
  },
  {
    id: "5",
    nome: "Sala Comercial Prime Office",
    tipo: "comercial",
    dormitorios: 0,
    vagas: 1,
    metragem: 45,
    preco: 280000,
    bairro: "Vila Prado",
    imagemUrl: "/imoveis/placeholder-5.jpg",
  },
];
```

- [ ] **Step 3: Escrever o teste de `filterImoveis` (falhando)**

Criar `src/lib/filterImoveis.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { filterImoveis, FILTROS_VAZIOS } from "./filterImoveis.ts";
import type { Imovel } from "../types/imovel";

const fixture: Imovel[] = [
  {
    id: "1",
    nome: "Casa Azul",
    tipo: "casa",
    dormitorios: 3,
    vagas: 2,
    metragem: 120,
    preco: 500000,
    bairro: "Centro",
    imagemUrl: "",
  },
  {
    id: "2",
    nome: "Apartamento Rosa",
    tipo: "apartamento",
    dormitorios: 1,
    vagas: 0,
    metragem: 30,
    preco: 180000,
    bairro: "Vila Nova",
    imagemUrl: "",
  },
];

test("sem filtros nem busca, retorna todos", () => {
  const resultado = filterImoveis(fixture, FILTROS_VAZIOS, "");
  assert.equal(resultado.length, 2);
});

test("busca por nome (case-insensitive)", () => {
  const resultado = filterImoveis(fixture, FILTROS_VAZIOS, "azul");
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("busca por bairro", () => {
  const resultado = filterImoveis(fixture, FILTROS_VAZIOS, "vila nova");
  assert.deepEqual(resultado.map((i) => i.id), ["2"]);
});

test("filtra por tipo", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, tipo: "casa" },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("filtra por dormitorios minimo", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, dormitoriosMin: 2 },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("filtra por vagas minimo", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, vagasMin: 1 },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("filtra por faixa de metragem", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, metragemMin: 100, metragemMax: 150 },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("filtra por faixa de preco", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, precoMin: 0, precoMax: 200000 },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["2"]);
});
```

- [ ] **Step 4: Rodar o teste e confirmar que falha**

Run: `node --test src/lib/filterImoveis.test.ts`
Expected: FAIL — `Cannot find module './filterImoveis.ts'`.

- [ ] **Step 5: Implementar `src/lib/filterImoveis.ts`**

```ts
import type { Imovel, TipoImovel } from "../types/imovel";

export type Filtros = {
  tipo: TipoImovel | "todos";
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

export function filterImoveis(
  imoveis: Imovel[],
  filtros: Filtros,
  searchTerm: string,
): Imovel[] {
  const termo = searchTerm.trim().toLowerCase();

  return imoveis.filter((imovel) => {
    if (termo) {
      const alvo = `${imovel.nome} ${imovel.bairro}`.toLowerCase();
      if (!alvo.includes(termo)) return false;
    }
    if (filtros.tipo !== "todos" && imovel.tipo !== filtros.tipo) return false;
    if (imovel.dormitorios < filtros.dormitoriosMin) return false;
    if (imovel.vagas < filtros.vagasMin) return false;
    if (filtros.metragemMin !== null && imovel.metragem < filtros.metragemMin)
      return false;
    if (filtros.metragemMax !== null && imovel.metragem > filtros.metragemMax)
      return false;
    if (filtros.precoMin !== null && imovel.preco < filtros.precoMin)
      return false;
    if (filtros.precoMax !== null && imovel.preco > filtros.precoMax)
      return false;
    return true;
  });
}
```

- [ ] **Step 6: Rodar o teste e confirmar que passa**

Run: `node --test src/lib/filterImoveis.test.ts`
Expected: `pass 8`, `fail 0`.

- [ ] **Step 7: Build (garante que os imports com alias `@/` resolvem no Next.js)**

Run: `npm run build`
Expected: build compila sem erro de tipo.

- [ ] **Step 8: Commit**

```bash
git add src/types/imovel.ts src/data/imoveis.ts src/lib/filterImoveis.ts src/lib/filterImoveis.test.ts
git commit -m "feat: adiciona tipos, dados mock e logica de filtragem de imoveis"
```

---

### Task 3: Componentes de UI (busca, filtros, card)

**Files:**
- Create: `src/components/SearchBar.tsx`
- Create: `src/components/FiltersModal.tsx`
- Create: `src/components/ImovelCard.tsx`
- Create: `src/components/PropertySearch.tsx`

**Interfaces:**
- Consumes: `Imovel`/`TipoImovel` (`@/types/imovel`), `Filtros`/`FILTROS_VAZIOS`/`filterImoveis` (`@/lib/filterImoveis`), `buildWhatsAppLink` (`@/lib/whatsapp`).
- Produces: `PropertySearch({ imoveis: Imovel[] })` — componente client usado pela Task 4 em `page.tsx`.

- [ ] **Step 1: Criar `src/components/SearchBar.tsx`**

```tsx
"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onOpenFilters: () => void;
};

export function SearchBar({ value, onChange, onOpenFilters }: SearchBarProps) {
  return (
    <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nome ou bairro..."
        className="flex-1 border-none bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
      />
      <button
        type="button"
        onClick={onOpenFilters}
        aria-label="Abrir filtros"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-white transition-colors hover:bg-purple-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 9h12M10 15h4" />
        </svg>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Criar `src/components/FiltersModal.tsx`**

```tsx
"use client";

import type { FormEvent } from "react";
import type { Filtros } from "@/lib/filterImoveis";

type FiltersModalProps = {
  open: boolean;
  filtros: Filtros;
  onApply: (filtros: Filtros) => void;
  onClear: () => void;
  onClose: () => void;
};

const TIPOS: { value: Filtros["tipo"]; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "comercial", label: "Comercial" },
];

const DORMITORIOS_OPCOES = [0, 1, 2, 3, 4];
const VAGAS_OPCOES = [0, 1, 2, 3];

function parseNumberOrNull(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function FiltersModal({
  open,
  filtros,
  onApply,
  onClear,
  onClose,
}: FiltersModalProps) {
  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onApply({
      tipo: formData.get("tipo") as Filtros["tipo"],
      dormitoriosMin: Number(formData.get("dormitoriosMin")),
      vagasMin: Number(formData.get("vagasMin")),
      metragemMin: parseNumberOrNull(formData.get("metragemMin")),
      metragemMax: parseNumberOrNull(formData.get("metragemMax")),
      precoMin: parseNumberOrNull(formData.get("precoMin")),
      precoMax: parseNumberOrNull(formData.get("precoMax")),
    });
  };

  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-purple">Filtros</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar filtros"
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Tipo
            <select
              name="tipo"
              defaultValue={filtros.tipo}
              className="rounded-lg border border-slate-200 px-3 py-2"
            >
              {TIPOS.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Dormitórios (mínimo)
            <select
              name="dormitoriosMin"
              defaultValue={filtros.dormitoriosMin}
              className="rounded-lg border border-slate-200 px-3 py-2"
            >
              {DORMITORIOS_OPCOES.map((valor) => (
                <option key={valor} value={valor}>
                  {valor === 0 ? "Qualquer" : `${valor}+`}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Vagas (mínimo)
            <select
              name="vagasMin"
              defaultValue={filtros.vagasMin}
              className="rounded-lg border border-slate-200 px-3 py-2"
            >
              {VAGAS_OPCOES.map((valor) => (
                <option key={valor} value={valor}>
                  {valor === 0 ? "Qualquer" : `${valor}+`}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Metragem mín. (m²)
              <input
                type="number"
                name="metragemMin"
                defaultValue={filtros.metragemMin ?? ""}
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Metragem máx. (m²)
              <input
                type="number"
                name="metragemMax"
                defaultValue={filtros.metragemMax ?? ""}
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Preço mín. (R$)
              <input
                type="number"
                name="precoMin"
                defaultValue={filtros.precoMin ?? ""}
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Preço máx. (R$)
              <input
                type="number"
                name="precoMax"
                defaultValue={filtros.precoMax ?? ""}
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
          <div className="mt-2 flex justify-between gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Limpar filtros
            </button>
            <button
              type="submit"
              className="rounded-full bg-brand-blue px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Aplicar filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Criar `src/components/ImovelCard.tsx`**

```tsx
import type { Imovel } from "@/types/imovel";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const TIPO_LABEL: Record<Imovel["tipo"], string> = {
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

export function ImovelCard({ imovel }: { imovel: Imovel }) {
  const whatsappLink = buildWhatsAppLink(
    `Olá, vi o imóvel ${imovel.nome} no site e gostaria de saber mais informações.`,
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex h-36 items-center justify-center bg-brand-purple/10 text-sm font-medium text-brand-purple">
        {TIPO_LABEL[imovel.tipo]}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold text-slate-800">{imovel.nome}</h3>
        <p className="text-sm text-slate-500">{imovel.bairro}</p>
        <p className="text-sm text-slate-600">
          {imovel.dormitorios} dorm. · {imovel.vagas} vaga(s) · {imovel.metragem} m²
        </p>
        <p className="text-lg font-bold text-brand-blue">
          {formatarPreco(imovel.preco)}
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-full bg-brand-purple px-4 py-2 text-center text-sm font-medium text-white hover:bg-purple-700"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Criar `src/components/PropertySearch.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import type { Imovel } from "@/types/imovel";
import { filterImoveis, FILTROS_VAZIOS, type Filtros } from "@/lib/filterImoveis";
import { SearchBar } from "@/components/SearchBar";
import { FiltersModal } from "@/components/FiltersModal";
import { ImovelCard } from "@/components/ImovelCard";

export function PropertySearch({ imoveis }: { imoveis: Imovel[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [modalOpen, setModalOpen] = useState(false);

  const resultados = useMemo(
    () => filterImoveis(imoveis, filtros, searchTerm),
    [imoveis, filtros, searchTerm],
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
          {resultados.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} />
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

- [ ] **Step 5: Build e lint**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro.

- [ ] **Step 6: Commit**

```bash
git add src/components/SearchBar.tsx src/components/FiltersModal.tsx src/components/ImovelCard.tsx src/components/PropertySearch.tsx
git commit -m "feat: adiciona componentes de busca, filtros e card de imovel"
```

---

### Task 4: Integração na home e verificação visual

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `package.json` (script `test`)

**Interfaces:**
- Consumes: `imoveis` (`@/data/imoveis`), `buildWhatsAppLink` (`@/lib/whatsapp`), `PropertySearch` (`@/components/PropertySearch`).

- [ ] **Step 1: Adicionar script de teste ao `package.json`**

No bloco `"scripts"`, adicionar a linha `"test": "node --test",` (mantendo `dev`, `build`, `start`, `lint` como estão).

- [ ] **Step 2: Reescrever `src/app/page.tsx`**

Substituir todo o conteúdo por:

```tsx
import { imoveis } from "@/data/imoveis";
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
      <PropertySearch imoveis={imoveis} />
    </div>
  );
}
```

- [ ] **Step 3: Rodar toda a suíte de testes**

Run: `npm test`
Expected: todos os testes de `src/lib/whatsapp.test.ts` e `src/lib/filterImoveis.test.ts` passam (`pass 10`, `fail 0` no total).

- [ ] **Step 4: Build e lint**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro.

- [ ] **Step 5: Verificação visual end-to-end (Playwright)**

Subir `npm run dev` em background e, via Playwright MCP:
1. Navegar para `http://localhost:3000`
2. Tirar snapshot — confirmar hero, botão "Falar no WhatsApp" e grade com os 5 imóveis mock
3. Digitar "centro" na busca — confirmar que a grade reduz para os imóveis do bairro/nome "Centro"
4. Limpar a busca, clicar no ícone de filtro — confirmar que o modal abre
5. Selecionar tipo "Casa", aplicar — confirmar que só "Casa Recanto Verde" aparece
6. Inspecionar o `href` do botão "Falar no WhatsApp" de um card — confirmar que começa com `https://wa.me/5515992500314?text=` e contém o nome do imóvel codificado
7. Parar o servidor dev

Expected: todos os passos acima se comportam como descrito, sem erros no console do navegador.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx package.json
git commit -m "feat: integra busca, filtros e whatsapp na home"
```
