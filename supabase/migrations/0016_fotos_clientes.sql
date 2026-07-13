-- As fotos de clientes (entrega de chaves) estavam FIXAS no codigo, em
-- public/clientes/. Para o Sandro adicionar uma foto nova era preciso um
-- programador -- exatamente o que o painel existe para evitar.
--
-- Agora vivem no banco, com o arquivo no Storage. O Sandro adiciona e remove
-- sozinho em /admin/depoimentos.

create table fotos_clientes (
  id         uuid primary key default gen_random_uuid(),
  url        text not null check (btrim(url) <> ''),
  -- Legenda opcional (quem aparece, qual empreendimento). Aparece como alt.
  legenda    text not null default '',
  created_at timestamptz not null default now()
);

-- RLS na mesma migration da tabela: leitura publica (o site mostra as fotos),
-- escrita so admin.
alter table fotos_clientes enable row level security;

create policy "leitura publica" on fotos_clientes
  for select to anon, authenticated using (true);

create policy "escrita so admin" on fotos_clientes
  for all to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

grant select on table public.fotos_clientes to anon, authenticated;
grant insert, update, delete on table public.fotos_clientes to authenticated;

create index fotos_clientes_created_at_idx on fotos_clientes (created_at);
