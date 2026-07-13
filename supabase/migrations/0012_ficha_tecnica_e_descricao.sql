-- A pagina do imovel mostrava pouca coisa. A planilha do Sandro tem uma ficha
-- tecnica inteira que nao estava em lugar nenhum do site.
--
-- Mais a DESCRICAO: texto livre que o Sandro escreve no painel (a planilha nao
-- tem esse campo -- e ele quem conta a historia do empreendimento).

alter table empreendimentos
  add column descricao        text    not null default '',
  add column construtora      text    not null default '',
  add column torres           integer,
  add column andares          text    not null default '',
  add column aptos_por_andar  integer,
  add column elevadores       integer,
  add column vaga_dupla       boolean not null default false,
  add column entrega_com_piso text    not null default ''
    check (entrega_com_piso in ('', 'completo', 'areas_molhadas')),
  add column documentacao     text    not null default ''
    check (documentacao in ('', 'gratis', 'pago'));

-- O booleano 'elevador' vira o NUMERO de elevadores: a planilha tem a
-- quantidade, e guardar as duas coisas seria duas fontes de verdade para o
-- mesmo fato. O filtro "com elevador" passa a ser elevadores > 0.
update empreendimentos set elevadores = 1 where elevador = true;

alter table empreendimentos
  drop column elevador;
