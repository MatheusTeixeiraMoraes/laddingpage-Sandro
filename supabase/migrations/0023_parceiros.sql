-- Parceiros do Sandro (empresas que dao beneficio exclusivo pra quem compra o
-- imovel com ele). Cada um tem imagem, texto e um flag de destaque (so um fica
-- em destaque por vez, garantido no app). Gerenciado em /admin/parceiros;
-- aparece na pagina /parceiros. Mesmo padrao de relatos_videos (0020).

create table parceiros (
  id         uuid primary key default gen_random_uuid(),
  imagem     text not null check (btrim(imagem) <> ''),
  texto      text not null default '',
  destaque   boolean not null default false,
  created_at timestamptz not null default now()
);

alter table parceiros enable row level security;

create policy "leitura publica" on parceiros
  for select to anon, authenticated using (true);

create policy "escrita so admin" on parceiros
  for all to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

grant select on table public.parceiros to anon, authenticated;
grant insert, update, delete on table public.parceiros to authenticated;

create index parceiros_created_at_idx on parceiros (created_at);
