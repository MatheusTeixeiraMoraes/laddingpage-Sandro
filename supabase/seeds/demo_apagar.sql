-- ============================================================================
-- APAGA TODOS OS DADOS DE DEMONSTRAÇÃO
-- ============================================================================
-- Rode este arquivo quando o Sandro tiver os imóveis de verdade cadastrados e
-- os demos não fizerem mais falta.
--
-- É SEGURO. Ele só apaga o que tem id começando com 'd0000000-' (empreendimento)
-- ou 'db000000-' (bairro) -- que é como o demo.sql criou os dados de propósito.
--
-- Um imóvel cadastrado pelo Sandro no painel recebe um id ALEATÓRIO do banco.
-- A chance de ele começar com 'd0000000-' é praticamente zero, e mesmo assim o
-- filtro exige os 8 primeiros caracteres exatos. Não tem como levar junto o que
-- é real.
--
-- As plantas somem sozinhas (on delete cascade).
-- ============================================================================

begin;

-- Mostra o que vai sair, antes de sair.
do $$
declare
  qtd_emp int;
  qtd_bairro int;
begin
  select count(*) into qtd_emp from empreendimentos where id::text like 'd0000000-%';
  select count(*) into qtd_bairro from bairros where id::text like 'db000000-%';
  raise notice 'Apagando % empreendimento(s) e % bairro(s) de demonstracao.', qtd_emp, qtd_bairro;
end $$;

delete from empreendimentos where id::text like 'd0000000-%';

-- Bairro só sai se não sobrou nenhum imóvel real nele. Se o Sandro cadastrar um
-- imóvel de verdade na Vila Haro, o bairro fica (e o texto dele também).
delete from bairros b
where b.id::text like 'db000000-%'
  and not exists (
    select 1 from empreendimentos e where e.bairro_id = b.id
  );

commit;
