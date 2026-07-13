-- Galeria de fotos do empreendimento (fachada, lazer, decorado).
alter table empreendimentos add column galeria text[] not null default '{}';

-- plantas.fotos guardava rotulos de ambiente ("Sala", "Cozinha"), nao fotos.
-- Renomeia para o que realmente e, e cria o campo das imagens de verdade.
alter table plantas rename column fotos to ambientes;
alter table plantas add column imagens text[] not null default '{}';
