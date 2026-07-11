# Painel Administrativo — Auth + Schema + RLS

**Data:** 2026-07-11
**Status:** Aprovado — pronto para plano de implementação
**Depende de:** conexão com Supabase (já feita — ver `docs/superpowers/PENDENCIAS.md`)

## Contexto

Sétimo pilar do backlog, e o mais complexo até aqui: o painel administrativo
completo (auth, schema, CRUD, upload de imagem, importação por planilha) é
grande demais pra uma spec só. Esta é a **primeira fatia**: login do
corretor, banco de dados real (substituindo `src/data/empreendimentos.ts`),
RLS protegendo escrita, e o site público lendo do banco em vez do mock.

CRUD no painel, upload de imagem e importação por planilha ficam para
sub-pilares seguintes — aqui, editar/criar empreendimento continua sendo
direto pela Table Editor do Supabase.

## Escopo

### 1. Autenticação

- Supabase Auth, e-mail + senha, **usuário único** (o corretor). Criado
  manualmente no dashboard do Supabase (Authentication → Users → Add user),
  sem tela de cadastro pública no site.
- `/admin/login` — página pública com formulário de e-mail/senha.
- `/admin` (e qualquer rota futura sob `/admin/*`) — protegida. Sem sessão
  válida, redireciona para `/admin/login`.
- Botão de logout.
- Nesta fatia, `/admin` (pós-login) é só uma página de confirmação ("Você
  está logado") + botão de sair — prova que o fluxo funciona de ponta a
  ponta, sem construir nenhuma feature de CRUD ainda.

### 2. Proteção de rota via `src/proxy.ts`

Next.js 16 renomeou `middleware.ts`/`middleware` para `proxy.ts`/`proxy`
(validado contra a documentação atual). Segue o padrão oficial do Supabase
para `@supabase/ssr` — chama `supabase.auth.getUser()` logo após criar o
client, sem nenhum código entre os dois (evita bug de sessão expirada
aleatoriamente).

### 3. Schema do banco

```sql
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
```

`fotos` continua sendo um array de legendas de texto (mesma abordagem
placeholder do site atual) — upload de imagem real é sub-pilar futuro.

### 4. RLS

RLS habilitada nas duas tabelas na mesma migration que as cria. Como só
existe uma conta possível (o corretor), `to authenticated` já é a checagem
de admin correta — não precisa de tabela de papéis/permissões:

```sql
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
```

### 5. Seed

Os 5 empreendimentos mock atuais (com suas plantas, coordenadas etc.)
entram como dado inicial do banco — o site não pode ficar vazio na troca.

### 6. Site público lê do banco

`src/app/page.tsx` e `src/app/empreendimentos/[id]/page.tsx` trocam o
import de `src/data/empreendimentos.ts` por uma consulta ao Supabase
(client de server, `src/lib/supabase/server.ts` já existe). `filterEmpreendimentos`
não muda — continua operando sobre um array em memória, só troca a origem
desse array. `generateStaticParams` sai da página de detalhe: sem isso, a
página deixa de ser pré-gerada estaticamente e passa a buscar o
empreendimento a cada request, então uma edição no banco aparece no site
sem precisar de redeploy.

`src/data/empreendimentos.ts` é removido depois que o seed confirma que os
dados estão no banco (evita duas fontes de verdade).

## Fora de escopo (explícito)

- Formulários de criar/editar/excluir empreendimento no painel (Table
  Editor do Supabase por enquanto).
- Upload de imagem real (continua legenda de texto).
- Importação por planilha.
- Múltiplos usuários admin / papéis de permissão.
- Recuperação de senha (o corretor troca a senha pelo próprio dashboard do
  Supabase se precisar, por enquanto).

## Nota sobre acesso ao Supabase

Não há CLI nem MCP autorizados neste projeto — só a URL e as chaves
(`anon`/`service_role`) do `.env.local`. Isso significa:

- A migration SQL é entregue pronta, e **o usuário cola no SQL Editor do
  dashboard do Supabase e roda manualmente** (mesmo caminho já usado pra
  conectar o projeto). Não há como eu aplicar direto.
- Não há como rodar `supabase db advisors`/MCP `get_advisors` — a revisão
  de segurança das policies é feita manualmente contra o checklist da
  skill `supabase` (auth.role() deprecated, UPDATE precisa de USING+WITH
  CHECK, etc.), não por ferramenta automatizada.

## Critério de pronto

- Migration colada e rodada no SQL Editor do Supabase pelo usuário (tabelas
  + RLS + seed), confirmado por uma query de leitura simples.
- `npm run build` e `npm run lint` passam sem erro.
- Verificação visual (Playwright): home e página de empreendimento
  continuam mostrando os mesmos 5 empreendimentos, agora vindos do banco;
  `/admin` sem login redireciona pra `/admin/login`; login com a conta do
  corretor funciona e leva pra `/admin`; logout funciona e bloqueia `/admin`
  de novo.
