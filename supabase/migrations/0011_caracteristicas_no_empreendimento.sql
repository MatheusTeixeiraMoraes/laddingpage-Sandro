-- A planilha do Sandro (88 imoveis) trata as caracteristicas como do PREDIO,
-- nao da planta: uma coluna VARANDA, uma SUITE, uma QUINTAL, um unico
-- "A PARTIR DE:". Ela nao diz qual metragem tem suite nem quanto custa cada
-- uma -- e nao precisa: metragem e dormitorios sao filtros independentes.
--
-- Entao as caracteristicas sobem para o empreendimento e a planta fica com o
-- que a planilha realmente tem sobre ela: o tamanho (mais as imagens).
--
-- plantas.preco continua existindo, mas OPCIONAL: o painel oferece preco por
-- planta para o futuro; o preco oficial e o "a partir de" do empreendimento.

alter table empreendimentos
  add column preco_a_partir_de numeric,
  add column dormitorios integer[] not null default '{}',
  add column suite boolean not null default false,
  add column varanda boolean not null default false,
  add column quintal boolean not null default false,
  add column garagem_coberta boolean not null default false,
  add column elevador boolean not null default false,
  add column pontos_ar integer;

-- Backfill a partir das plantas que ja existem: o menor preco vira o
-- "a partir de", os dormitorios viram a lista, e basta UMA planta com suite
-- para o empreendimento oferecer suite.
update empreendimentos e
set preco_a_partir_de = p.menor_preco,
    dormitorios       = p.dorms,
    suite             = p.tem_suite
from (
  select empreendimento_id,
         min(preco) as menor_preco,
         array_agg(distinct dormitorios order by dormitorios) as dorms,
         bool_or(com_suite) as tem_suite
  from plantas
  group by empreendimento_id
) p
where e.id = p.empreendimento_id;

-- Rede de seguranca: empreendimento sem preco sumiria do filtro de valor.
do $$
declare sem_preco int;
begin
  select count(*) into sem_preco from empreendimentos where preco_a_partir_de is null;
  if sem_preco > 0 then
    raise exception '% empreendimento(s) ficaram sem preco_a_partir_de. Abortado.', sem_preco;
  end if;
end $$;

alter table empreendimentos
  alter column preco_a_partir_de set not null;

-- A planta perde o que era da unidade e agora e do predio. O preco vira
-- opcional (nulo = usa o "a partir de" do empreendimento).
alter table plantas
  alter column preco drop not null,
  drop column dormitorios,
  drop column vagas,
  drop column com_suite,
  drop column ambientes;
