-- "Suíte" deixa de ser sim/não e passa a ser a QUANTIDADE de suítes
-- (ex.: 3 dormitórios, 2 suítes). Mantém o nome da coluna `suite` (agora int)
-- de propósito: o código que já está no ar lê `suite` como truthy/falsy, e
-- 1/0 se comportam igual a true/false — então a migration é retrocompatível e
-- pode rodar antes do deploy do código novo, sem janela de quebra.
--
-- Não-destrutiva: true -> 1 suíte, false -> 0 (sem suíte).

alter table empreendimentos
  alter column suite drop default,
  alter column suite type int using (case when suite then 1 else 0 end),
  alter column suite set default 0;
