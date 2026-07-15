-- Conteúdo editável pelo Sandro no painel (aba "Conteúdo do site"): fotos dele
-- e textos principais da home e da /sobre. Antes tudo isso vivia fixo no código
-- e trocar uma foto ou uma frase exigia um programador.
--
-- Chave-valor: cada pedaço editável tem uma chave (ex.: 'foto_hero',
-- 'hero_frase'). O valor é jsonb para caber tanto texto solto quanto listas
-- (badges, valores...). O que não estiver aqui usa o padrão definido no código
-- — então o site funciona igual mesmo com a tabela vazia.

create table conteudo_site (
  chave      text primary key,
  valor      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table conteudo_site enable row level security;

-- O site é público e renderiza esse conteúdo: qualquer um pode ler.
create policy "todos leem conteudo" on conteudo_site
  for select to anon, authenticated
  using (true);

-- Só o admin edita.
create policy "so admin edita conteudo" on conteudo_site
  for all to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

grant select on table public.conteudo_site to anon, authenticated;
grant insert, update, delete on table public.conteudo_site to authenticated;
