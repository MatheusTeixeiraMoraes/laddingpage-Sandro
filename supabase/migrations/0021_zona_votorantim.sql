-- Sandro tem imoveis em Votorantim (cidade vizinha de Sorocaba). A coluna zona
-- so aceitava as 5 zonas de Sorocaba; aqui liberamos 'votorantim' tambem.
-- Nenhum dado muda -- so o CHECK passa a aceitar o novo valor.

alter table empreendimentos drop constraint empreendimentos_zona_check;

alter table empreendimentos
  add constraint empreendimentos_zona_check
  check (zona in ('norte', 'sul', 'leste', 'oeste', 'central', 'votorantim'));
