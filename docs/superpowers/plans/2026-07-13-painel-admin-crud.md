# Painel Administrativo — CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (execução inline pelo autor, que tem contexto completo). Passos usam checkbox (`- [ ]`).

**Goal:** Sandro consegue, sozinho, listar/criar/editar/excluir empreendimentos, subir a foto de capa e gerenciar as plantas (incluindo corrigir os preços/dados representativos).

**Architecture:** Bucket `imoveis` no Supabase Storage (leitura pública, escrita só `role=admin`, igual às tabelas). Camada de escrita client-side (`src/lib/admin/empreendimentos.ts`) usando o browser client — a sessão viaja no cookie e o RLS valida a claim. Páginas novas sob `/admin/*` (já protegidas pelo `src/proxy.ts`).

**Tech Stack:** Next.js 16 (App Router) + TS + Tailwind v4 + Supabase (Postgres + Storage) + `@supabase/ssr`.

## Global Constraints

- Toda escrita depende da claim `app_metadata.role = 'admin'` no JWT (RLS já ativo nas tabelas; o bucket recebe policy equivalente). **Não usar a `service_role` em nada que rode no navegador.**
- `empreendimentos.imagem` aceita **caminho relativo** (`/imoveis/laredo.jpg`, dos 7 semeados) **e URL absoluta** do Storage. `next.config.ts` precisa de `images.remotePatterns` para o host `snxcuwbtxffkongtrxsb.supabase.co`.
- Bucket limita 5 MB e só `image/jpeg`, `image/png`, `image/webp` — validação no servidor, não só no cliente.
- Migration aplicada via script `pg` temporário (o SQL Editor não persiste de forma confiável neste projeto). Pedir autorização ao usuário para o `rejectUnauthorized:false` (TLS-intercept local já diagnosticado).
- Erros de escrita mostram mensagem legível, sem vazar detalhe técnico.
- Preço é digitado em reais (ex: `245000`); a exibição pública já usa `formatarPrecoCurto`.

---

### Task 1: Storage (bucket + policies) e config do Next

**Files:**
- Create: `supabase/migrations/0006_storage_imoveis.sql`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: bucket `imoveis` (público para leitura, escrita só admin) usado pela Task 3.

- [ ] **Step 1: `0006_storage_imoveis.sql`**

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imoveis', 'imoveis', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "leitura publica imoveis"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'imoveis');

create policy "insert admin imoveis"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'imoveis'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

create policy "update admin imoveis"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'imoveis'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  )
  with check (
    bucket_id = 'imoveis'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

create policy "delete admin imoveis"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'imoveis'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );
```

- [ ] **Step 2: Aplicar via script `pg` temporário**

`npm install --no-save pg`, rodar um `run-mig-storage.mjs` que executa o SQL acima na `DATABASE_URL` e depois confere: `select id, public, file_size_limit from storage.buckets where id = 'imoveis';` (esperado 1 linha, public = true, 5242880). Apagar o script e desinstalar `pg`.

- [ ] **Step 3: `next.config.ts` — permitir imagens do Storage**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "snxcuwbtxffkongtrxsb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Build e commit**

Run: `npm run build`

```bash
git add supabase/migrations/0006_storage_imoveis.sql next.config.ts
git commit -m "feat: adiciona bucket de imagens no storage com escrita so de admin"
```

---

### Task 2: Helper de coordenadas (TDD)

**Files:**
- Create: `src/lib/coordenadas.ts`
- Test: `src/lib/coordenadas.test.ts`

**Interfaces:**
- Produces: `parseCoordenadas(entrada: string): { latitude: number; longitude: number } | null` — usado pelo formulário (Task 4).

- [ ] **Step 1: Escrever o teste (falhando)**

`src/lib/coordenadas.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCoordenadas } from "./coordenadas.ts";

test("extrai do link com @lat,lng,zoom", () => {
  const r = parseCoordenadas(
    "https://www.google.com/maps/place/Sorocaba/@-23.4936,-47.4451,15z/data=!3m1",
  );
  assert.deepEqual(r, { latitude: -23.4936, longitude: -47.4451 });
});

test("extrai do link com ?q=lat,lng", () => {
  const r = parseCoordenadas("https://www.google.com/maps?q=-23.5015,-47.4526");
  assert.deepEqual(r, { latitude: -23.5015, longitude: -47.4526 });
});

test("aceita par cru com espaco", () => {
  const r = parseCoordenadas("-23.463, -47.412");
  assert.deepEqual(r, { latitude: -23.463, longitude: -47.412 });
});

test("retorna null quando nao reconhece", () => {
  assert.equal(parseCoordenadas("https://exemplo.com/sem-coordenada"), null);
  assert.equal(parseCoordenadas(""), null);
});

test("rejeita coordenadas fora do intervalo valido", () => {
  assert.equal(parseCoordenadas("-200, 500"), null);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test src/lib/coordenadas.test.ts` → FAIL (módulo não existe).

- [ ] **Step 3: Implementar `src/lib/coordenadas.ts`**

```ts
export type Coordenadas = { latitude: number; longitude: number };

const PADROES = [
  /@(-?\d+\.\d+),(-?\d+\.\d+)/, // .../@-23.49,-47.44,15z
  /[?&]q=(-?\d+\.\d+),\s*(-?\d+\.\d+)/, // ...?q=-23.49,-47.44
  /^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/, // -23.49, -47.44
];

export function parseCoordenadas(entrada: string): Coordenadas | null {
  for (const padrao of PADROES) {
    const m = entrada.match(padrao);
    if (!m) continue;

    const latitude = Number(m[1]);
    const longitude = Number(m[2]);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;
    if (latitude < -90 || latitude > 90) continue;
    if (longitude < -180 || longitude > 180) continue;

    return { latitude, longitude };
  }

  return null;
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test src/lib/coordenadas.test.ts` → `pass 5`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/coordenadas.ts src/lib/coordenadas.test.ts
git commit -m "feat: adiciona parser de coordenadas do google maps"
```

---

### Task 3: Camada de escrita do admin

**Files:**
- Create: `src/lib/admin/empreendimentos.ts`

**Interfaces:**
- Consumes: `createClient` (`@/lib/supabase/client`), tipos de `@/types/empreendimento`.
- Produces (usados pelas Tasks 4 e 5):

```ts
export type EmpreendimentoInput = {
  nome: string;
  tipo: TipoEmpreendimento;
  bairro: string;
  zona: Zona;
  imagem: string;
  entrega: string;
  latitude: number;
  longitude: number;
};

export type PlantaInput = {
  metragem: number;
  comSuite: boolean;
  dormitorios: number;
  vagas: number;
  preco: number;
  fotos: string[];
};

criarEmpreendimento(dados: EmpreendimentoInput): Promise<string>
atualizarEmpreendimento(id: string, dados: EmpreendimentoInput): Promise<void>
excluirEmpreendimento(id: string): Promise<void>
criarPlanta(empreendimentoId: string, dados: PlantaInput): Promise<void>
atualizarPlanta(id: string, dados: PlantaInput): Promise<void>
excluirPlanta(id: string): Promise<void>
uploadImagem(arquivo: File): Promise<string>
```

- [ ] **Step 1: Implementar o arquivo**

Cada função chama o supabase e, em erro, lança `new Error("mensagem legível")`. Mapeamento camelCase → snake_case nas plantas (`comSuite` → `com_suite`).

`uploadImagem`: valida `arquivo.type` contra os 3 mime types e `arquivo.size <= 5 MB` antes de enviar (o bucket também valida); nome do arquivo = `${crypto.randomUUID()}.${extensão}`; faz `supabase.storage.from("imoveis").upload(nome, arquivo)` e devolve `supabase.storage.from("imoveis").getPublicUrl(nome).data.publicUrl`.

- [ ] **Step 2: Build**

Run: `npm run build` → passa (arquivo ainda não usado por nenhuma página).

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/empreendimentos.ts
git commit -m "feat: adiciona camada de escrita do painel admin"
```

---

### Task 4: Formulário de empreendimento (criar e editar)

**Files:**
- Create: `src/components/admin/EmpreendimentoForm.tsx`
- Create: `src/app/admin/empreendimentos/novo/page.tsx`
- Create: `src/app/admin/empreendimentos/[id]/page.tsx`

**Interfaces:**
- Consumes: `criarEmpreendimento`, `atualizarEmpreendimento`, `uploadImagem` (`@/lib/admin/empreendimentos`), `parseCoordenadas` (`@/lib/coordenadas`), `getEmpreendimentoById` (`@/lib/empreendimentos`, server-side na página de edição).
- Produces: `EmpreendimentoForm({ empreendimento? })` — client component; sem `empreendimento` cria, com `empreendimento` edita.

- [ ] **Step 1: `EmpreendimentoForm.tsx`** (client)

Campos: nome (text), tipo (select apartamento/casa/comercial), zona (select norte/sul/leste/oeste/central), bairro (text), entrega (text, placeholder "Dez/2026 ou Pronto para morar"), localização (text — cola o link do Google Maps; ao mudar, roda `parseCoordenadas` e mostra "Coordenada reconhecida: -23.49, -47.44" ou aviso de não reconhecida), foto (input file — ao escolher, mostra preview local; ao salvar, sobe via `uploadImagem`).

Estado: `salvando`, `erro`. Ao submeter: valida obrigatórios + coordenada; se há arquivo novo, `uploadImagem` primeiro; depois `criarEmpreendimento` (→ `router.push('/admin/empreendimentos/{id}')`) ou `atualizarEmpreendimento` (→ mensagem "Salvo").

Na edição, o campo de localização já vem preenchido com `"{latitude}, {longitude}"` (o parser aceita par cru), e a foto atual aparece como preview.

- [ ] **Step 2: `/admin/empreendimentos/novo/page.tsx`** — server component simples com título "Novo empreendimento" + `<EmpreendimentoForm />`.

- [ ] **Step 3: `/admin/empreendimentos/[id]/page.tsx`** — server component: `getEmpreendimentoById(id)`, `notFound()` se não existir; título "Editar empreendimento"; `<EmpreendimentoForm empreendimento={...} />` e, abaixo, `<PlantasManager ... />` (Task 5). `export const dynamic = "force-dynamic"`.

- [ ] **Step 4: Build e lint**

Run: `npm run build && npm run lint` (a página de edição referencia `PlantasManager` — criar na Task 5; até lá, deixar o import fora e adicionar na Task 5).

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/EmpreendimentoForm.tsx src/app/admin/empreendimentos
git commit -m "feat: adiciona formulario de criar/editar empreendimento no admin"
```

---

### Task 5: Gerenciador de plantas

**Files:**
- Create: `src/components/admin/PlantasManager.tsx`
- Modify: `src/app/admin/empreendimentos/[id]/page.tsx` (renderizar o manager)

**Interfaces:**
- Consumes: `criarPlanta`, `atualizarPlanta`, `excluirPlanta` (`@/lib/admin/empreendimentos`), tipo `Planta`.
- Produces: `PlantasManager({ empreendimentoId, plantas })` — client component.

- [ ] **Step 1: `PlantasManager.tsx`** (client)

Lista as plantas recebidas (metragem, dorms, vagas, suíte, preço, ambientes) em cards, cada um com **Editar** (abre o formulário inline preenchido) e **Excluir** (com `confirm()`).

Formulário (usado para adicionar e editar): metragem (number), dormitórios (number), vagas (number), suíte (checkbox), preço (number, em reais), ambientes (text separado por vírgula → `split(",").map(s => s.trim()).filter(Boolean)`).

Após qualquer operação, `router.refresh()` para a página server recarregar os dados.

- [ ] **Step 2: Integrar na página de edição** — importar e renderizar `<PlantasManager empreendimentoId={empreendimento.id} plantas={empreendimento.plantas} />`.

- [ ] **Step 3: Build e lint** → passam.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/PlantasManager.tsx "src/app/admin/empreendimentos/[id]/page.tsx"
git commit -m "feat: adiciona gerenciador de plantas no admin"
```

---

### Task 6: Painel `/admin` com a listagem

**Files:**
- Modify: `src/app/admin/page.tsx`
- Create: `src/components/admin/ListaEmpreendimentos.tsx`

**Interfaces:**
- Consumes: `getEmpreendimentos` (`@/lib/empreendimentos`, server), `excluirEmpreendimento` (client).

- [ ] **Step 1: `ListaEmpreendimentos.tsx`** (client) — recebe `empreendimentos`; renderiza cada um em linha/card com miniatura (`next/image`), nome, zona, nº de plantas, e botões **Editar** (Link para `/admin/empreendimentos/{id}`) e **Excluir** (`confirm()` avisando que apaga as plantas junto → `excluirEmpreendimento` → `router.refresh()`).

- [ ] **Step 2: `src/app/admin/page.tsx`** — server component, `dynamic = "force-dynamic"`: busca `getEmpreendimentos()`, cabeçalho com título "Painel administrativo", botões "Novo empreendimento" (Link), "Trocar senha" (Link) e `<LogoutButton />`; abaixo `<ListaEmpreendimentos empreendimentos={...} />` (ou estado vazio "Nenhum empreendimento cadastrado ainda.").

- [ ] **Step 3: Testes, build e lint**

Run: `npm test && npm run build && npm run lint` → tudo passa.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/page.tsx src/components/admin/ListaEmpreendimentos.tsx
git commit -m "feat: transforma /admin em painel com listagem de empreendimentos"
```

---

### Task 7: Verificação end-to-end e publicação

**Files:** nenhum (verificação) + `docs/superpowers/PENDENCIAS.md`

- [ ] **Step 1: Verificação de segurança (antes da funcional)**

Script temporário com a chave **publishable** (anônimo): tentar `insert` em `empreendimentos` e `upload` no bucket `imoveis` → ambos devem falhar. Criar um usuário de teste **sem** `role=admin`, logar e repetir → ambos devem falhar. Apagar o usuário de teste no fim. (Mesmo padrão da verificação da migration 0003.)

- [ ] **Step 2: Verificação funcional logado como admin (Playwright)**

Subir `npm run dev` (atenção: pode cair na 3001). Logar em `/admin/login` com a conta do admin — **precisa da senha**, que só o usuário tem: pedir para ele fazer o login e me avisar, ou pedir autorização para gerar uma senha temporária (como já foi feito antes).

Com a sessão ativa:
1. `/admin` lista os 7 empreendimentos com miniatura
2. "Novo empreendimento" → preencher, colar um link do Google Maps, subir uma foto → salvar → cai na edição
3. Adicionar uma planta → aparece na lista
4. Abrir a home → o novo empreendimento aparece com a foto do Storage
5. Voltar ao admin → editar a planta (mudar preço) → conferir na página de detalhe
6. Excluir a planta e depois o empreendimento de teste → some da home
7. Console sem erros

- [ ] **Step 3: Atualizar `PENDENCIAS.md`** — marcar o CRUD como entregue; mover "cadastrar os demais empreendimentos" e "corrigir dados representativos" para "agora dá para fazer pelo painel"; manter importação por planilha e galeria multi-foto como pendentes.

- [ ] **Step 4: Commit e push**

```bash
git add docs/superpowers/PENDENCIAS.md
git commit -m "docs: atualiza pendencias apos o CRUD do painel admin"
git pull --no-edit && git push
```
