-- O texto sobre o bairro nao pertence ao imovel -- pertence ao bairro. Dois
-- apartamentos na Vila Haro ficam na MESMA Vila Haro. Se o texto fosse copiado
-- para cada imovel, no dia em que o Sandro corrigisse um, os outros passariam a
-- mentir. Entao o bairro vira uma entidade, com um texto so.
--
-- Na planilha sao 67 bairros para 88 imoveis; 14 bairros tem mais de um imovel,
-- e sao esses que aproveitam o texto ja escrito.

create table bairros (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null unique,
  sobre      text not null default '',
  created_at timestamptz not null default now()
);

-- RLS na mesma migration da tabela (leitura publica, escrita so admin) --
-- mesma politica de empreendimentos/plantas.
alter table bairros enable row level security;

create policy "leitura publica" on bairros
  for select to anon, authenticated using (true);

create policy "escrita so admin" on bairros
  for all to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

grant select on table public.bairros to anon, authenticated;
grant insert, update, delete on table public.bairros to authenticated;

-- Cria um bairro para cada valor que ja existe em empreendimentos.bairro.
-- Hoje esses valores sao a ZONA repetida ('Zona Leste'...), nao um bairro de
-- verdade -- a importacao da planilha corrige com os bairros reais.
insert into bairros (nome)
select distinct btrim(bairro)
from empreendimentos
where btrim(bairro) <> '';

alter table empreendimentos
  add column bairro_id uuid references bairros(id) on delete restrict;

update empreendimentos e
set bairro_id = b.id
from bairros b
where b.nome = btrim(e.bairro);

-- Rede de seguranca: imovel sem bairro perderia a secao de localizacao.
do $$
declare orfaos int;
begin
  select count(*) into orfaos from empreendimentos where bairro_id is null;
  if orfaos > 0 then
    raise exception '% empreendimento(s) ficaram sem bairro_id. Abortado.', orfaos;
  end if;
end $$;

alter table empreendimentos
  alter column bairro_id set not null;

-- O nome do bairro passa a viver so em bairros.nome, e o texto so em
-- bairros.sobre. Duas fontes de verdade para o mesmo fato divergem.
alter table empreendimentos
  drop column bairro,
  drop column sobre_bairro;
