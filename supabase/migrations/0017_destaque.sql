-- "Lançamentos em destaque" na home pegava os 4 primeiros que o banco
-- devolvesse, sem controle do Sandro sobre qual imóvel ele quer empurrar.
-- Quando a planilha subir com 88 imóveis, isso deixa de ser detalhe: ele vai
-- querer destacar o lançamento novo, não o que o banco decidir por acaso.

alter table empreendimentos
  add column destaque boolean not null default false;

create index empreendimentos_destaque_idx on empreendimentos (destaque) where destaque;
