# Painel Administrativo — Auth + Schema + RLS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Login do corretor (Supabase Auth, single-admin), tabelas `empreendimentos`/`plantas` com RLS, e o site público lendo do banco em vez do arquivo mock — sem CRUD, upload de imagem ou importação por planilha ainda.

**Architecture:** Migration SQL entregue pronta; o usuário cola no SQL Editor do Supabase e roda (sem CLI/MCP disponível). `src/proxy.ts` (convenção Next 16, renomeado de `middleware.ts`) protege `/admin/*` usando o padrão oficial `@supabase/ssr` com `getAll`/`setAll`. Uma nova camada `src/lib/empreendimentos.ts` substitui o import estático de `src/data/empreendimentos.ts`, mantendo `filterEmpreendimentos` intacto (ele já opera sobre um array em memória).

**Tech Stack:** Next.js 16 (App Router, `src/proxy.ts`) + TypeScript + Supabase Auth + Postgres (RLS) + `@supabase/ssr` 0.12.0 (já instalado).

## Global Constraints

- Único usuário admin — a checagem de autorização é só "está autenticado?" (`to authenticated`), sem tabela de papéis.
- **Sem CLI/MCP do Supabase disponível neste projeto** — qualquer SQL é aplicado manualmente pelo usuário no SQL Editor do dashboard. Verificação pós-SQL é feita via script Node com a chave `anon` (leitura) — nunca com a `service_role`.
- **Eu não tenho a senha do admin** (por design — nunca compartilhada). Não consigo testar login bem-sucedido via Playwright. Verifico tudo mais (redirect quando deslogado, erro com credencial errada); login com sucesso fica pra confirmação manual do usuário.
- **Validado contra o `types.d.ts` instalado:** `setAll` recebe `(cookiesToSet, headers)` — dois parâmetros — e os `headers` devem ser propagados pra resposta (`Cache-Control` anti-cache em rotas de auth). Não omitir esse passo.
- **Verificado empiricamente (corrige suposição inicial):** ao contrário do gotcha comum de `numeric`→string em outras configurações de PostgREST, neste projeto `preco`/`metragem` voltam como `number` de verdade (`typeof === "number"`, testado via script). `Number(...)` na camada de mapeamento continua no código como salvaguarda barata, mas não é estritamente necessário aqui — não presumir string sem testar de novo se o schema mudar.
- **Descoberta importante durante a Task 1:** o SQL Editor do dashboard não estava persistindo as mudanças de forma confiável neste projeto (rodou "sem erro" repetidas vezes, mas `information_schema.tables` continuava vazio). A migration acabou sendo aplicada via conexão Postgres direta (`pg` + `DATABASE_URL` em `.env.local`, autorizado explicitamente pelo usuário a desabilitar verificação de certificado nessa conexão pontual, devido a um TLS-intercept local). Scripts usados (`run-migration.mjs`, `run-grants.mjs`, `check-db.mjs`, `check-schema.mjs`) são temporários e não fazem parte do código do projeto.
- `export const dynamic = "force-dynamic"` nas páginas que leem do banco — sem isso o Next pode gerar estático no build e uma edição no banco não apareceria sem redeploy, o que contradiz o objetivo desta fatia.

---

### Task 1: Schema, RLS e seed no Supabase

**Files:**
- Create: `supabase/migrations/0001_empreendimentos_plantas.sql`

**Interfaces:**
- Produces: tabelas `empreendimentos`/`plantas` no banco Supabase do projeto (aplicadas manualmente pelo usuário), consumidas pela Task 3.

- [ ] **Step 1: Criar o arquivo de migration**

Criar `supabase/migrations/0001_empreendimentos_plantas.sql`:

```sql
-- Tabelas
create table empreendimentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null check (tipo in ('apartamento', 'casa', 'comercial')),
  bairro text not null,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

create table plantas (
  id uuid primary key default gen_random_uuid(),
  empreendimento_id uuid not null references empreendimentos(id) on delete cascade,
  metragem numeric not null,
  com_suite boolean not null default false,
  dormitorios integer not null,
  vagas integer not null,
  preco numeric not null,
  fotos text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- RLS
alter table empreendimentos enable row level security;
alter table plantas enable row level security;

create policy "leitura publica" on empreendimentos
  for select to anon, authenticated using (true);

create policy "escrita so autenticado" on empreendimentos
  for all to authenticated using (true) with check (true);

create policy "leitura publica" on plantas
  for select to anon, authenticated using (true);

create policy "escrita so autenticado" on plantas
  for all to authenticated using (true) with check (true);

-- Seed: os 5 empreendimentos mock atuais do site
insert into empreendimentos (id, nome, tipo, bairro, latitude, longitude) values
  ('11111111-1111-1111-1111-111111111111', 'Residencial Jardim das Flores', 'apartamento', 'Vila Prado', -23.4936, -47.4451),
  ('22222222-2222-2222-2222-222222222222', 'Edifício Bela Vista', 'apartamento', 'Centro', -23.5015, -47.4526),
  ('33333333-3333-3333-3333-333333333333', 'Casa Recanto Verde', 'casa', 'Chácara Elisa', -23.4858, -47.4611),
  ('44444444-4444-4444-4444-444444444444', 'Studio Central', 'apartamento', 'Centro', -23.5028, -47.4508),
  ('55555555-5555-5555-5555-555555555555', 'Sala Comercial Prime Office', 'comercial', 'Vila Prado', -23.4951, -47.4467);

insert into plantas (empreendimento_id, metragem, com_suite, dormitorios, vagas, preco, fotos) values
  ('11111111-1111-1111-1111-111111111111', 44, false, 2, 1, 280000, array['Sala', 'Quarto', 'Planta baixa']),
  ('11111111-1111-1111-1111-111111111111', 44, true, 2, 1, 320000, array['Sala', 'Suíte', 'Planta baixa']),
  ('22222222-2222-2222-2222-222222222222', 65, false, 2, 1, 420000, array['Sala', 'Cozinha', 'Planta baixa']),
  ('22222222-2222-2222-2222-222222222222', 85, true, 3, 2, 520000, array['Sala', 'Suíte', 'Varanda', 'Planta baixa']),
  ('33333333-3333-3333-3333-333333333333', 180, true, 4, 3, 890000, array['Fachada', 'Sala', 'Suíte', 'Quintal']),
  ('44444444-4444-4444-4444-444444444444', 32, false, 1, 0, 210000, array['Ambiente integrado', 'Planta baixa']),
  ('55555555-5555-5555-5555-555555555555', 45, false, 0, 1, 280000, array['Sala principal', 'Recepção', 'Planta baixa']);
```

IDs fixos (não `gen_random_uuid()` no seed) propositalmente — permite verificar e navegar para `/empreendimentos/11111111-1111-1111-1111-111111111111` de forma previsível nas próximas tasks.

- [ ] **Step 2: Usuário roda a migration**

Pedir para o usuário: abrir o dashboard do Supabase → SQL Editor → New Query → colar o conteúdo do arquivo acima → Run. Aguardar confirmação de que rodou sem erro.

- [ ] **Step 3: Verificar leitura, bloqueio de escrita e o tipo de `numeric` via script**

Criar um script temporário `check-schema.mjs` na raiz do projeto:

```js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const { data: empreendimentos, error: readError } = await supabase
  .from("empreendimentos")
  .select("id, nome, plantas(id, preco, metragem)");

if (readError) throw new Error(`Leitura falhou: ${readError.message}`);
console.log(`Leitura OK: ${empreendimentos.length} empreendimentos`);
console.log(
  "Tipo de 'preco' vindo do banco:",
  typeof empreendimentos[0].plantas[0].preco,
);

const { error: writeError } = await supabase.from("empreendimentos").insert({
  nome: "teste-rls",
  tipo: "casa",
  bairro: "teste",
  latitude: 0,
  longitude: 0,
});

if (!writeError) {
  throw new Error("RLS FALHOU: usuario anonimo conseguiu escrever!");
}
console.log("RLS OK, escrita anonima bloqueada:", writeError.message);
```

Run: `node --env-file=.env.local check-schema.mjs`
Expected: `Leitura OK: 5 empreendimentos`; `RLS OK, escrita anonima bloqueada: ...`.
Nota: `NEXT_PUBLIC_SUPABASE_ANON_KEY` no snippet acima é o nome original do
plano — o projeto real usa `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (chave no
formato novo do Supabase, descoberto durante a execução desta task).

- [ ] **Step 4: Apagar o script temporário e commitar a migration**

```bash
rm check-schema.mjs
git add supabase/migrations/0001_empreendimentos_plantas.sql
git commit -m "feat: adiciona migration de empreendimentos/plantas com RLS e seed"
```

---

### Task 2: Autenticação (login, proxy de rota, admin placeholder, logout)

**Files:**
- Create: `src/proxy.ts`
- Create: `src/components/admin/LoginForm.tsx`
- Create: `src/components/admin/LogoutButton.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx`

**Interfaces:**
- Consumes: `createClient` de `@/lib/supabase/client` (já existe).
- Produces: rotas `/admin` (protegida) e `/admin/login` (pública).

- [ ] **Step 1: Usuário cria a conta admin no Supabase**

Pedir para o usuário: dashboard do Supabase → Authentication → Users → Add
user → preencher e-mail e senha → marcar **"Auto Confirm User"** (evita
precisar configurar SMTP pra confirmação por e-mail). A senha fica só com
o usuário — não precisa me contar.

- [ ] **Step 2: Criar `src/proxy.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // Nao rodar nada entre createServerClient e getUser() -- pode causar
  // logout aleatorio do usuario (padrao oficial do Supabase).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 3: Criar `src/components/admin/LoginForm.tsx`**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        E-mail
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Senha
        <input
          type="password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          required
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="submit"
        disabled={carregando}
        className="rounded-full bg-brand-purple px-5 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
      >
        {carregando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Criar `src/components/admin/LogoutButton.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
    >
      Sair
    </button>
  );
}
```

- [ ] **Step 5: Criar `src/app/admin/login/page.tsx`**

```tsx
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-6 py-24">
      <h1 className="text-2xl font-bold text-brand-purple">Painel administrativo</h1>
      <LoginForm />
    </div>
  );
}
```

- [ ] **Step 6: Criar `src/app/admin/page.tsx`**

```tsx
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-brand-purple">Você está logado</h1>
      <p className="text-slate-600">
        Painel administrativo em construção — CRUD de empreendimentos entra em breve.
      </p>
      <LogoutButton />
    </div>
  );
}
```

- [ ] **Step 7: Build e lint**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro.

- [ ] **Step 8: Commit**

```bash
git add src/proxy.ts src/components/admin src/app/admin
git commit -m "feat: adiciona login, logout e protecao de rota do painel admin"
```

---

### Task 3: Site público passa a ler do banco

**Files:**
- Create: `src/lib/empreendimentos.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/empreendimentos/[id]/page.tsx`
- Delete: `src/data/empreendimentos.ts`

**Interfaces:**
- Produces: `getEmpreendimentos(): Promise<Empreendimento[]>`, `getEmpreendimentoById(id: string): Promise<Empreendimento | null>` — usados pelas páginas.

- [ ] **Step 1: Criar `src/lib/empreendimentos.ts`**

```ts
import { createClient } from "@/lib/supabase/server";
import type { Empreendimento } from "@/types/empreendimento";

const SELECT_EMPREENDIMENTO =
  "id, nome, tipo, bairro, latitude, longitude, plantas(id, metragem, com_suite, dormitorios, vagas, preco, fotos)";

type PlantaRow = {
  id: string;
  metragem: number | string;
  com_suite: boolean;
  dormitorios: number;
  vagas: number;
  preco: number | string;
  fotos: string[];
};

type EmpreendimentoRow = {
  id: string;
  nome: string;
  tipo: Empreendimento["tipo"];
  bairro: string;
  latitude: number;
  longitude: number;
  plantas: PlantaRow[];
};

function mapRow(row: EmpreendimentoRow): Empreendimento {
  return {
    id: row.id,
    nome: row.nome,
    tipo: row.tipo,
    bairro: row.bairro,
    latitude: row.latitude,
    longitude: row.longitude,
    plantas: row.plantas.map((planta) => ({
      id: planta.id,
      metragem: Number(planta.metragem),
      comSuite: planta.com_suite,
      dormitorios: planta.dormitorios,
      vagas: planta.vagas,
      preco: Number(planta.preco),
      fotos: planta.fotos,
    })),
  };
}

export async function getEmpreendimentos(): Promise<Empreendimento[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empreendimentos")
    .select(SELECT_EMPREENDIMENTO);

  if (error) throw new Error(`Falha ao buscar empreendimentos: ${error.message}`);

  return (data as unknown as EmpreendimentoRow[]).map(mapRow);
}

export async function getEmpreendimentoById(
  id: string,
): Promise<Empreendimento | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empreendimentos")
    .select(SELECT_EMPREENDIMENTO)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar empreendimento: ${error.message}`);
  if (!data) return null;

  return mapRow(data as unknown as EmpreendimentoRow);
}
```

- [ ] **Step 2: Atualizar `src/app/page.tsx`**

Substituir todo o conteúdo por:

```tsx
import { getEmpreendimentos } from "@/lib/empreendimentos";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PropertySearch } from "@/components/PropertySearch";

export const dynamic = "force-dynamic";

const WHATSAPP_GENERICO = buildWhatsAppLink(
  "Olá, vi o site e gostaria de saber mais sobre os imóveis.",
);

export default async function Home() {
  const empreendimentos = await getEmpreendimentos();

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

- [ ] **Step 3: Atualizar `src/app/empreendimentos/[id]/page.tsx`**

Substituir todo o conteúdo por:

```tsx
import { notFound } from "next/navigation";
import { getEmpreendimentoById } from "@/lib/empreendimentos";
import { EmpreendimentoDetalhe } from "@/components/EmpreendimentoDetalhe";
import { MapaEmpreendimento } from "@/components/MapaEmpreendimento";

export const dynamic = "force-dynamic";

export default async function EmpreendimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empreendimento = await getEmpreendimentoById(id);

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
      <MapaEmpreendimento
        nome={empreendimento.nome}
        latitude={empreendimento.latitude}
        longitude={empreendimento.longitude}
      />
    </div>
  );
}
```

- [ ] **Step 4: Apagar o arquivo mock**

```bash
rm src/data/empreendimentos.ts
```

- [ ] **Step 5: Build e lint**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro. O build faz uma chamada real ao Supabase
(precisa do `.env.local` com as credenciais válidas, já configurado).

- [ ] **Step 6: Commit**

```bash
git add src/lib/empreendimentos.ts src/app/page.tsx "src/app/empreendimentos/[id]/page.tsx"
git rm src/data/empreendimentos.ts
git commit -m "feat: site publico passa a ler empreendimentos do supabase"
```

---

### Task 4: Verificação final e push

**Files:** nenhum (só verificação).

- [ ] **Step 1: Verificação visual (Playwright) — o que eu consigo confirmar sozinho**

Subir `npm run dev` em background e, via Playwright MCP:
1. Navegar para `http://localhost:3000` — confirmar que os 5 empreendimentos
   ainda aparecem (agora vindos do banco), com a mesma faixa de
   preço/metragem de antes
2. Navegar para `http://localhost:3000/empreendimentos/11111111-1111-1111-1111-111111111111`
   — confirmar que carrega "Residencial Jardim das Flores" com as 2 plantas
3. Navegar para `http://localhost:3000/admin` sem estar logado — confirmar
   redirect para `/admin/login`
4. Em `/admin/login`, preencher e-mail/senha **incorretos** e submeter —
   confirmar que aparece "E-mail ou senha incorretos." (prova que o
   tratamento de erro funciona, sem precisar de credencial real)
5. Parar o servidor dev

Expected: todos os passos acima se comportam como descrito, sem erros no
console do navegador.

- [ ] **Step 2: Verificação manual do usuário — login/logout com credencial real**

Pedir para o usuário testar, com a própria conta admin criada na Task 2:
1. Acessar `/admin/login`, entrar com e-mail/senha reais
2. Confirmar que foi redirecionado para `/admin` e vê "Você está logado"
3. Clicar em "Sair" e confirmar que volta pra `/admin/login`
4. Tentar acessar `/admin` de novo sem logar — confirmar que redireciona
   pra `/admin/login`

Aguardar confirmação do usuário antes de considerar a task concluída.

- [ ] **Step 3: Push**

Run: `git push`
Expected: commits das Tasks 1–3 publicados em `origin/main`. Deploy
automático do Vercel dispara sozinho.

- [ ] **Step 4: Atualizar `docs/superpowers/PENDENCIAS.md`**

Marcar como concluído: "Painel administrativo: auth + schema + RLS
funcionando". Adicionar pendências novas: "CRUD de empreendimentos no
painel", "Upload de imagem real", "Importação por planilha" — cada uma
como sub-pilar futuro, não bloqueando nada do que já existe.

```bash
git add docs/superpowers/PENDENCIAS.md
git commit -m "docs: atualiza pendencias apos auth+schema do painel admin"
git push
```
