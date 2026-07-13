-- Substitui os empreendimentos mock por 7 reais do material do Sandro.
-- Dados de dorms/metragem/entrega/preço são representativos (MCMV) até o
-- Sandro confirmar os reais pelo painel (ver PENDENCIAS.md).
delete from empreendimentos;

insert into empreendimentos (id, nome, tipo, bairro, zona, imagem, entrega, latitude, longitude) values
  ('a0000000-0000-0000-0000-000000000001', 'Vila Laredo', 'apartamento', 'Zona Leste', 'leste', '/imoveis/laredo.jpg', 'Pronto para morar', -23.463, -47.412),
  ('a0000000-0000-0000-0000-000000000002', 'Sou Viver Sorocaba', 'apartamento', 'Zona Leste', 'leste', '/imoveis/sou-viver.jpg', 'Dez/2026', -23.470, -47.401),
  ('a0000000-0000-0000-0000-000000000003', 'Siver Oasis', 'apartamento', 'Zona Norte', 'norte', '/imoveis/siver-oasis.jpg', 'Jun/2026', -23.470, -47.470),
  ('a0000000-0000-0000-0000-000000000004', 'Residencial São Paulo', 'apartamento', 'Zona Norte', 'norte', '/imoveis/sao-paulo.jpg', 'Dez/2027', -23.478, -47.462),
  ('a0000000-0000-0000-0000-000000000005', 'Arena', 'apartamento', 'Zona Oeste', 'oeste', '/imoveis/arena.jpg', 'Abr/2028', -23.512, -47.488),
  ('a0000000-0000-0000-0000-000000000006', 'Residencial Tropical', 'apartamento', 'Zona Oeste', 'oeste', '/imoveis/tropical.jpg', 'Pronto para morar', -23.505, -47.505),
  ('a0000000-0000-0000-0000-000000000007', 'Gran Campolim', 'apartamento', 'Zona Sul', 'sul', '/imoveis/gran-campolim.jpg', 'Dez/2026', -23.520, -47.455);

insert into plantas (empreendimento_id, metragem, com_suite, dormitorios, vagas, preco, fotos) values
  ('a0000000-0000-0000-0000-000000000001', 44, false, 2, 1, 245000, array['Sala', 'Cozinha', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000001', 48, true,  2, 1, 289000, array['Sala', 'Suíte', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000002', 45, false, 2, 1, 235000, array['Sala', 'Quarto', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000003', 44, false, 2, 1, 219000, array['Sala', 'Cozinha', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000003', 50, true,  2, 1, 268000, array['Sala', 'Suíte', 'Varanda']),
  ('a0000000-0000-0000-0000-000000000004', 46, false, 2, 1, 228000, array['Sala', 'Quarto', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000005', 47, false, 2, 1, 255000, array['Sala', 'Cozinha', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000005', 52, true,  2, 1, 312000, array['Sala', 'Suíte', 'Varanda']),
  ('a0000000-0000-0000-0000-000000000006', 48, false, 2, 1, 249000, array['Sala', 'Cozinha', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000007', 50, true,  2, 1, 298000, array['Sala', 'Suíte', 'Planta baixa']);
