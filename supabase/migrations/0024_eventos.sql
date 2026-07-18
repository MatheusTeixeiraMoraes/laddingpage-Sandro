-- Galeria de eventos: eventos de que o Sandro participa (lancamentos, convencoes).
-- Cada evento tem capa, nome, descricao e uma galeria de imagens (array de URLs,
-- mesmo padrao de empreendimentos.galeria). Gerenciado em /admin/eventos;
-- aparece na pagina /eventos.

create table eventos (
  id         uuid primary key default gen_random_uuid(),
  capa       text not null check (btrim(capa) <> ''),
  nome       text not null default '',
  descricao  text not null default '',
  galeria    text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table eventos enable row level security;

create policy "leitura publica" on eventos
  for select to anon, authenticated using (true);

create policy "escrita so admin" on eventos
  for all to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

grant select on table public.eventos to anon, authenticated;
grant insert, update, delete on table public.eventos to authenticated;

create index eventos_created_at_idx on eventos (created_at);
