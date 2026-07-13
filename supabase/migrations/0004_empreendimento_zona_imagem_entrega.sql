alter table empreendimentos
  add column zona text not null default 'norte'
    check (zona in ('norte', 'sul', 'leste', 'oeste', 'central')),
  add column imagem text not null default '',
  add column entrega text not null default '';
