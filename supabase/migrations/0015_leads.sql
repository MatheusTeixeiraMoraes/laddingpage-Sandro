-- Ate agora o formulario da home nao capturava nada: nome e telefone viravam
-- texto DENTRO da mensagem que o proprio lead enviava no WhatsApp. Se ele
-- desistisse antes de apertar enviar, o Sandro ficava sem nada.
--
-- Agora o lead e gravado ANTES de abrir o WhatsApp.

create table leads (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null check (btrim(nome) <> ''),
  telefone      text not null check (btrim(telefone) <> ''),
  interesse     text not null default '',
  -- LGPD: dado pessoal so entra com consentimento explicito. O check impede
  -- que qualquer caminho (bug, script) grave um lead sem ele.
  consentimento boolean not null check (consentimento),
  atendido      boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table leads enable row level security;

-- O formulario e PUBLICO: o anonimo precisa poder inserir.
create policy "qualquer um pode enviar" on leads
  for insert to anon, authenticated
  with check (true);

-- Mas NUNCA ler: sem isso, qualquer visitante baixaria a lista de contatos
-- do Sandro com a chave publicavel, que esta no HTML do site.
create policy "so admin le" on leads
  for select to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "so admin altera" on leads
  for update to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "so admin apaga" on leads
  for delete to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Sem grant de select para anon: nem chega na policy.
grant insert on table public.leads to anon, authenticated;
grant select, update, delete on table public.leads to authenticated;

create index leads_created_at_idx on leads (created_at desc);
