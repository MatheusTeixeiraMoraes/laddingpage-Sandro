-- Popula a galeria dos 7 empreendimentos com fotos reais do material do Sandro,
-- e a planta baixa do Sou Viver (unico que tem o arquivo da planta).
update empreendimentos set galeria = array[
  '/imoveis/laredo/1.jpg', '/imoveis/laredo/2.jpg', '/imoveis/laredo/3.jpg'
] where id = 'a0000000-0000-0000-0000-000000000001';

update empreendimentos set galeria = array[
  '/imoveis/sou-viver/1.jpg', '/imoveis/sou-viver/2.jpg', '/imoveis/sou-viver/3.jpg'
] where id = 'a0000000-0000-0000-0000-000000000002';

update empreendimentos set galeria = array[
  '/imoveis/siver-oasis/1.jpg', '/imoveis/siver-oasis/2.jpg', '/imoveis/siver-oasis/3.jpg'
] where id = 'a0000000-0000-0000-0000-000000000003';

update empreendimentos set galeria = array[
  '/imoveis/sao-paulo/1.jpg', '/imoveis/sao-paulo/2.jpg', '/imoveis/sao-paulo/3.jpg'
] where id = 'a0000000-0000-0000-0000-000000000004';

update empreendimentos set galeria = array[
  '/imoveis/arena/1.jpg', '/imoveis/arena/2.jpg', '/imoveis/arena/3.jpg'
] where id = 'a0000000-0000-0000-0000-000000000005';

update empreendimentos set galeria = array[
  '/imoveis/tropical/1.jpg', '/imoveis/tropical/2.jpg', '/imoveis/tropical/3.jpg'
] where id = 'a0000000-0000-0000-0000-000000000006';

update empreendimentos set galeria = array[
  '/imoveis/gran-campolim/1.jpg', '/imoveis/gran-campolim/2.jpg', '/imoveis/gran-campolim/3.jpg'
] where id = 'a0000000-0000-0000-0000-000000000007';

-- Planta baixa real do Sou Viver (planta unica de 45 m2).
update plantas
set imagens = array['/imoveis/sou-viver/planta-45.jpg']
where empreendimento_id = 'a0000000-0000-0000-0000-000000000002';
