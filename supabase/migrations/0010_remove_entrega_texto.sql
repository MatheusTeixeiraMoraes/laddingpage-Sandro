-- ETAPA 2 de 2 (contract): remove o texto da entrega.
--
-- So rode DEPOIS que o codigo que le entrega_em estiver no ar e verificado.
-- Manter as duas colunas seria pior do que remover: duas fontes de verdade
-- para a mesma informacao divergem no primeiro cadastro feito pelo painel.
--
-- Nao ha perda: o rotulo ('Dez/2026') e derivado da data por
-- src/lib/entrega.ts, e 'Pronto para morar' e o proprio nulo.

alter table empreendimentos
  drop column entrega;
