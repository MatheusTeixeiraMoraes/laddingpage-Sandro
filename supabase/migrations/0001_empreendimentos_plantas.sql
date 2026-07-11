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
