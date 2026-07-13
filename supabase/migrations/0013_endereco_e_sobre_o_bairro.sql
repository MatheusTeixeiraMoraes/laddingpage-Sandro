-- A secao de localizacao mostrava so o mapa. Passa a ter, ao lado, o endereco
-- escrito e um texto sobre o bairro (acesso, comercio, escolas, lazer) -- que e
-- o que o lead realmente quer saber: "e bom morar ali?".
--
-- O endereco existe na planilha (coluna ENDERECO). O texto sobre o bairro nao:
-- e o Sandro quem escreve, no painel.

alter table empreendimentos
  add column endereco     text not null default '',
  add column sobre_bairro text not null default '';
