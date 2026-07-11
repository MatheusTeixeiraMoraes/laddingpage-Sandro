# Mapa do Google Maps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cada página de empreendimento mostra um mapa do Google (embed sem API key) centralizado nas coordenadas do prédio, com link para abrir no Google Maps. Ambiente preparado para a API key futura, e uma lista de pendências consolidada documentando tudo que depende de conteúdo/API real antes do lançamento.

**Architecture:** `latitude`/`longitude` mock entram no tipo `Empreendimento` (nível do prédio). Um componente `MapaEmpreendimento` isolado renderiza o embed via `<iframe>` apontando pra `google.com/maps?q=lat,lng&output=embed` — zero API key, zero custo. `.env.example` documenta a variável que a futura API JavaScript vai usar, sem valor real.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.

## Global Constraints

- Coordenadas são mock (prédio real ainda não tem endereço confirmado) — documentado como pendência, não como bug.
- `latitude`/`longitude` pertencem ao `Empreendimento`, não à `Planta` — a localização não muda entre unidades do mesmo prédio.
- Sem API key nova nesta fase — o `.env.example` só documenta a variável, não cria segredo real nem altera comportamento do app.
- **Validado em sandbox:** o `.gitignore` gerado pelo `create-next-app` tem o padrão `.env*`, que ignora **qualquer** arquivo `.env.example` também. Precisa da negação `!.env.example` logo abaixo, senão o arquivo nunca entra no `git add`.
- **Validado em sandbox:** `<iframe>` puro não dispara nenhuma regra do `eslint-config-next` (`core-web-vitals`/`typescript`) — não precisa de tratamento especial.

---

### Task 1: Coordenadas no modelo de dados

**Files:**
- Modify: `src/types/empreendimento.ts`
- Modify: `src/data/empreendimentos.ts`

**Interfaces:**
- Produces: `Empreendimento.latitude: number`, `Empreendimento.longitude: number` — consumidos pela Task 2.

- [ ] **Step 1: Adicionar `latitude`/`longitude` ao tipo**

Em `src/types/empreendimento.ts`, adicionar os dois campos ao `Empreendimento` (logo após `bairro`):

```ts
export type Empreendimento = {
  id: string;
  nome: string;
  tipo: TipoEmpreendimento;
  bairro: string;
  latitude: number;
  longitude: number;
  plantas: Planta[];
};
```

- [ ] **Step 2: Adicionar as coordenadas mock nos 5 empreendimentos**

Em `src/data/empreendimentos.ts`, adicionar `latitude`/`longitude` (logo após
`bairro`) em cada item, nesta ordem:

```ts
// id "1" — Residencial Jardim das Flores
latitude: -23.4936,
longitude: -47.4451,

// id "2" — Edifício Bela Vista
latitude: -23.5015,
longitude: -47.4526,

// id "3" — Casa Recanto Verde
latitude: -23.4858,
longitude: -47.4611,

// id "4" — Studio Central
latitude: -23.5028,
longitude: -47.4508,

// id "5" — Sala Comercial Prime Office
latitude: -23.4951,
longitude: -47.4467,
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build compila sem erro (nenhuma página usa os campos novos ainda).

- [ ] **Step 4: Commit**

```bash
git add src/types/empreendimento.ts src/data/empreendimentos.ts
git commit -m "feat: adiciona coordenadas mock aos empreendimentos"
```

---

### Task 2: Componente do mapa e integração na página de detalhe

**Files:**
- Create: `src/components/MapaEmpreendimento.tsx`
- Modify: `src/app/empreendimentos/[id]/page.tsx`

**Interfaces:**
- Consumes: `Empreendimento.latitude`/`longitude`/`nome` (`@/types/empreendimento`).
- Produces: `MapaEmpreendimento({ nome, latitude, longitude })`, renderizado pela página de detalhe.

- [ ] **Step 1: Criar `src/components/MapaEmpreendimento.tsx`**

```tsx
export function MapaEmpreendimento({
  nome,
  latitude,
  longitude,
}: {
  nome: string;
  latitude: number;
  longitude: number;
}) {
  const mapaEmbedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
  const mapaLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <section className="flex w-full flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-brand-purple">Localização</h2>
      <div className="w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <iframe
          src={mapaEmbedUrl}
          title={`Mapa de localização de ${nome}`}
          className="h-72 w-full"
          loading="lazy"
        />
      </div>
      <a
        href={mapaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-brand-blue hover:underline"
      >
        Abrir no Google Maps
      </a>
    </section>
  );
}
```

- [ ] **Step 2: Integrar na página de detalhe**

Em `src/app/empreendimentos/[id]/page.tsx`, importar o componente:

```ts
import { MapaEmpreendimento } from "@/components/MapaEmpreendimento";
```

E renderizar logo depois de `<EmpreendimentoDetalhe empreendimento={empreendimento} />`:

```tsx
      <EmpreendimentoDetalhe empreendimento={empreendimento} />
      <MapaEmpreendimento
        nome={empreendimento.nome}
        latitude={empreendimento.latitude}
        longitude={empreendimento.longitude}
      />
```

- [ ] **Step 3: Build e lint**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro.

- [ ] **Step 4: Commit**

```bash
git add src/components/MapaEmpreendimento.tsx src/app/empreendimentos/[id]/page.tsx
git commit -m "feat: adiciona mapa do google maps na pagina de empreendimento"
```

---

### Task 3: Ambiente preparado, pendências e verificação visual

**Files:**
- Modify: `.gitignore`
- Create: `.env.example`
- Create: `docs/superpowers/PENDENCIAS.md`

**Interfaces:** nenhuma nova.

- [ ] **Step 1: Adicionar a negação no `.gitignore`**

Logo abaixo da linha `.env*` (seção "env files"), adicionar:

```
!.env.example
```

Sem isso, `.env.example` fica ignorado pelo padrão `.env*` e nunca entra no
`git add` (validado em sandbox).

- [ ] **Step 2: Criar `.env.example`**

```
# Nao usada ainda -- o mapa atual usa o embed sem API key.
# Preencher quando a API JavaScript do Google Maps entrar (ver docs/superpowers/PENDENCIAS.md).
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

- [ ] **Step 3: Criar `docs/superpowers/PENDENCIAS.md`**

```markdown
# Pendências antes de ir para produção

Lista viva de tudo que depende de conteúdo ou credencial externa que ainda
não temos. Cada pilar novo que gerar uma pendência externa deve atualizar
este arquivo.

## Conteúdo real do cliente

- [ ] Logo do Sandro Higuti (fundação — hoje é wordmark em texto)
- [ ] Texto de bio / história do corretor (pilar "Sobre mim")
- [ ] Fotos do corretor com clientes/imóveis entregues (pilar "Sobre mim")
- [ ] Vídeos de depoimento de clientes (pilar "Sobre mim")
- [ ] Links reais de redes sociais (pilar "Sobre mim")
- [ ] Endereços/coordenadas reais de cada empreendimento (pilar "Mapa")
- [ ] Fotos reais dos empreendimentos e plantas (pilar "Empreendimentos + Plantas")

## APIs e credenciais externas

- [ ] Google Places API (avaliações reais, precisa de API key + Place ID do
      negócio — pilar "Sobre mim")
- [ ] Google Maps JavaScript API (upgrade do embed sem API key atual,
      precisa de API key + billing no Google Cloud — pilar "Mapa";
      variável já documentada em `.env.example`)

## Infraestrutura

- [ ] Painel administrativo (depende de Supabase — combinado que entra
      depois, ainda não conectado)
- [ ] Deploy em produção (Vercel — combinado que entra depois)
```

- [ ] **Step 4: Verificação visual (Playwright)**

Subir `npm run dev` em background e, via Playwright MCP:
1. Navegar para `http://localhost:3000/empreendimentos/1`
2. Confirmar que a seção "Localização" aparece depois das specs/WhatsApp, com o `<iframe>` do mapa carregado
3. Inspecionar o `src` do iframe — confirmar que contém `q=-23.4936,-47.4451&output=embed`
4. Inspecionar o `href` do link "Abrir no Google Maps" — confirmar `https://www.google.com/maps?q=-23.4936,-47.4451`
5. Parar o servidor dev

Expected: mapa renderiza sem erro no console, coordenadas batem com os dados mock do empreendimento 1.

- [ ] **Step 5: Commit e push**

```bash
git add .gitignore .env.example docs/superpowers/PENDENCIAS.md
git commit -m "chore: prepara .env.example e consolida pendencias em PENDENCIAS.md"
git push
```
