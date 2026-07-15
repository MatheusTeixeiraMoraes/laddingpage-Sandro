-- Relatos em video dos clientes. Os arquivos originais tem 100-850 MB cada --
-- grandes demais para o Storage e para a cota de banda. Por isso os videos
-- vivem no YouTube (canal do Sandro): aqui guardamos so o ID do video (11
-- caracteres) e montamos o player/miniatura a partir dele, sem API key.
--
-- O Sandro adiciona, remove e escolhe o video principal sozinho em
-- /admin/relatos. Mesmo padrao da tabela fotos_clientes (0016).

create table relatos_videos (
  id         uuid primary key default gen_random_uuid(),
  youtube_id text not null check (btrim(youtube_id) <> ''),
  -- Legenda que aparece sob o player e na galeria. Opcional.
  titulo     text not null default '',
  -- O video grande no topo de /relatos. So um fica true (garantido no app).
  principal  boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS na mesma migration da tabela: leitura publica (o site mostra os videos),
-- escrita so admin.
alter table relatos_videos enable row level security;

create policy "leitura publica" on relatos_videos
  for select to anon, authenticated using (true);

create policy "escrita so admin" on relatos_videos
  for all to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

grant select on table public.relatos_videos to anon, authenticated;
grant insert, update, delete on table public.relatos_videos to authenticated;

create index relatos_videos_created_at_idx on relatos_videos (created_at);
