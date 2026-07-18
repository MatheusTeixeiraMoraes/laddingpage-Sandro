-- Premiacoes do Sandro (troeus, rankings, reconhecimentos). Cada uma tem uma
-- imagem, um titulo e o ano (opcional). O Sandro gerencia sozinho em
-- /admin/premiacoes; aparecem numa secao da pagina /sobre.
-- Mesmo padrao das tabelas fotos_clientes (0016) e relatos_videos (0020).

create table premiacoes (
  id         uuid primary key default gen_random_uuid(),
  imagem     text not null check (btrim(imagem) <> ''),
  titulo     text not null default '',
  ano        int,
  created_at timestamptz not null default now()
);

alter table premiacoes enable row level security;

create policy "leitura publica" on premiacoes
  for select to anon, authenticated using (true);

create policy "escrita so admin" on premiacoes
  for all to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

grant select on table public.premiacoes to anon, authenticated;
grant insert, update, delete on table public.premiacoes to authenticated;

create index premiacoes_created_at_idx on premiacoes (created_at);
