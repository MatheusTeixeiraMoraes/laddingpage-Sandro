-- "Documentação": troca a opção "Por conta do comprador" (pago) por
-- "Com desconto" (desconto). Nenhum empreendimento usava 'pago' (conferido em
-- produção antes), então é só trocar o CHECK — não mexe em nenhum dado, e
-- todos os registros atuais ('' ou 'gratis') já satisfazem o novo.

alter table empreendimentos drop constraint empreendimentos_documentacao_check;

alter table empreendimentos
  add constraint empreendimentos_documentacao_check
  check (documentacao in ('', 'gratis', 'desconto'));
