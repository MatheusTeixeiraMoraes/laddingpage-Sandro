-- ============================================================================
-- DADOS DE DEMONSTRAÇÃO — NÃO SÃO IMÓVEIS REAIS
-- ============================================================================
-- Os 10 empreendimentos abaixo existem só para exercitar as funcionalidades do
-- site. Nenhum deles é real, nenhum preço é real.
--
-- COMO APAGAR TUDO ISSO DEPOIS: rode supabase/seeds/demo_apagar.sql.
--
-- O que garante que dá pra apagar sem medo: TODO id de demo começa com
-- 'd0000000-' (empreendimento) ou 'db000000-' (bairro). O apagar filtra por esse
-- prefixo, então é impossível levar junto um imóvel de verdade cadastrado pelo
-- Sandro no painel -- o id dele vai ser aleatório e nunca vai começar com d0.
--
-- Cobertura (o que cada um serve para testar):
--   1 Vila Verde     pronto p/ morar · 2 plantas com preço próprio · imagem de planta
--   2 Aurora         MESMO bairro do 1 (texto do bairro reaproveitado)
--   3 Casas Jardim   tipo CASA · sem elevador (0) · quintal
--   4 Sala Comercial tipo COMERCIAL · sem dormitório (lista vazia)
--   5 Alto do Sol    3 plantas · mais barato do estoque · SEM galeria e SEM descrição
--   6 Parque Águas   TEM TUDO: suíte, varanda, quintal, garagem, vaga dupla, 3 elevadores, 3 pontos de ar
--   7 Bela Vista     bairro repetido (2º do Jardim Ipanema)
--   8 Torres do Lago mais caro do estoque (estica as faixas de preço)
--   9 Vivenda        ano de entrega mais distante (2029)
--  10 Reserva        ficha técnica TODA VAZIA (prova que campo vazio não vira card vazio)
-- ============================================================================

-- Fora o que existia antes (os 7 que eu tinha inventado + os bairros que eram
-- só a zona repetida).
delete from empreendimentos where id::text like 'a0000000-%';
delete from bairros where nome in ('Zona Norte', 'Zona Sul', 'Zona Leste', 'Zona Oeste');

-- ---------------------------------------------------------------- bairros ---
insert into bairros (id, nome, sobre) values
  ('db000000-0000-0000-0000-000000000001', 'Vila Haro',
   E'Bairro tradicional da Zona Leste, com acesso rápido à Av. Itavuvu e ao centro. Comércio de rua consolidado, escolas e supermercados a poucos minutos a pé.\nÉ uma das regiões mais procuradas por quem compra o primeiro imóvel: infraestrutura pronta e preço ainda acessível.'),
  ('db000000-0000-0000-0000-000000000002', 'Parque Campolim',
   E'Região nobre da Zona Sul, ao lado do Shopping Iguatemi e do Parque das Águas. Ruas arborizadas, ciclovia e fácil acesso à Rodovia Raposo Tavares.'),
  ('db000000-0000-0000-0000-000000000003', 'Centro', ''),
  ('db000000-0000-0000-0000-000000000004', 'Jardim Ipanema', ''),
  ('db000000-0000-0000-0000-000000000005', 'Jardim Simus',
   E'Zona Oeste, perto do Parque Natural da Biquinha e do Atacadão. Bairro em crescimento, com muitos lançamentos e boa saída para a Castelo Branco.'),
  ('db000000-0000-0000-0000-000000000006', 'Vila Barão', '');

-- --------------------------------------------------------- empreendimentos ---
insert into empreendimentos (
  id, nome, tipo, bairro_id, zona, imagem, galeria, entrega_em,
  preco_a_partir_de, dormitorios, suite, varanda, quintal, garagem_coberta,
  vaga_dupla, pontos_ar, descricao, construtora, torres, andares,
  aptos_por_andar, elevadores, entrega_com_piso, documentacao, endereco,
  latitude, longitude
) values

-- 1. Pronto para morar, 2 plantas com preço próprio, ficha completa
('d0000000-0000-0000-0000-000000000001', 'Vila Verde Sorocaba', 'apartamento',
 'db000000-0000-0000-0000-000000000001', 'leste', '/imoveis/laredo.jpg',
 array['/imoveis/laredo/1.jpg','/imoveis/laredo/2.jpg','/imoveis/laredo/3.jpg'],
 null, 245000, array[2], 1, true, false, true, false, 2,
 E'Empreendimento entregue e com unidades disponíveis para mudança imediata.\nÁrea de lazer completa: piscina, salão de festas, espaço gourmet e playground. As unidades saem com piso completo e dois pontos de ar-condicionado.',
 'BONELLI', 2, 'T + 16', 8, 2, 'completo', 'gratis',
 'R. Ramon Haro Martini, 1160 - Vila Haro', -23.4930, -47.4380),

-- 2. Mesmo bairro do 1 -> o texto do bairro aparece nos dois sem redigitar
('d0000000-0000-0000-0000-000000000002', 'Residencial Aurora', 'apartamento',
 'db000000-0000-0000-0000-000000000001', 'leste', '/imoveis/sou-viver.jpg',
 array['/imoveis/sou-viver/1.jpg','/imoveis/sou-viver/2.jpg','/imoveis/sou-viver/3.jpg'],
 '2026-12-01', 235000, array[2], 0, true, false, false, false, 1,
 'Torre única com 45 unidades, elevador e portaria 24h. Entrega prevista para dezembro de 2026.',
 'COMATT', 1, 'T + 7', 6, 1, 'areas_molhadas', 'desconto',
 'R. Antônio Aparecido Ferraz, 350 - Vila Haro', -23.4955, -47.4342),

-- 3. CASA: sem elevador (0), com quintal
('d0000000-0000-0000-0000-000000000003', 'Casas Jardim Sul', 'casa',
 'db000000-0000-0000-0000-000000000002', 'sul', '/imoveis/tropical.jpg',
 array['/imoveis/tropical/1.jpg','/imoveis/tropical/2.jpg','/imoveis/tropical/3.jpg'],
 null, 380000, array[2,3], 1, false, true, true, true, 1,
 E'Condomínio fechado de 45 sobrados, com portaria e área verde.\nCada casa tem quintal próprio e duas vagas cobertas.',
 'KRC', null, 'Sobrados', null, 0, 'completo', 'gratis',
 'R. Francisco Silva, 457 - Parque Campolim', -23.5195, -47.4610),

-- 4. COMERCIAL: sem dormitório nenhum (lista vazia)
('d0000000-0000-0000-0000-000000000004', 'Sala Comercial Centro', 'comercial',
 'db000000-0000-0000-0000-000000000003', 'central', '/imoveis/gran-campolim.jpg',
 array['/imoveis/gran-campolim/1.jpg','/imoveis/gran-campolim/2.jpg'],
 '2027-06-01', 165000, array[]::integer[], 0, false, false, true, false, 1,
 'Salas comerciais de 32 m² no coração do Centro, com recepção compartilhada e estacionamento rotativo.',
 'YESS', 1, 'T + 12', 10, 2, 'areas_molhadas', 'desconto',
 'R. São Bento, 200 - Centro', -23.5015, -47.4526),

-- 5. 3 plantas, o mais barato, SEM galeria e SEM descrição
('d0000000-0000-0000-0000-000000000005', 'Alto do Sol', 'apartamento',
 'db000000-0000-0000-0000-000000000004', 'norte', '/imoveis/siver-oasis.jpg',
 array[]::text[], '2028-04-01', 189000, array[1,2], 0, true, false, false,
 false, null, '', 'ESC', 3, 'T + 10', 8, 2, '', '',
 'Av. Itavuvu, 4500 - Jardim Ipanema', -23.4620, -47.4390),

-- 6. TEM TUDO: todos os chips e o filtro de 3 pontos de ar
('d0000000-0000-0000-0000-000000000006', 'Parque das Águas', 'apartamento',
 'db000000-0000-0000-0000-000000000005', 'oeste', '/imoveis/arena.jpg',
 array['/imoveis/arena/1.jpg','/imoveis/arena/2.jpg','/imoveis/arena/3.jpg'],
 '2026-06-01', 320000, array[2,3], 1, true, true, true, true, 3,
 E'O empreendimento mais completo da Zona Oeste: piscina adulto e infantil, quadra, academia, coworking e pet place.\nTodas as unidades com varanda gourmet, suíte e duas vagas cobertas.',
 'ACCESS', 3, 'T + 19', 4, 3, 'completo', 'gratis',
 'R. Antônio Lopes Filho, 140 - Jardim Simus', -23.4880, -47.4890),

-- 7. Segundo imóvel do Jardim Ipanema (bairro repetido)
('d0000000-0000-0000-0000-000000000007', 'Residencial Bela Vista', 'apartamento',
 'db000000-0000-0000-0000-000000000004', 'norte', '/imoveis/sao-paulo.jpg',
 array['/imoveis/sao-paulo/1.jpg','/imoveis/sao-paulo/2.jpg','/imoveis/sao-paulo/3.jpg'],
 null, 298000, array[2], 1, true, false, true, false, 2,
 'Pronto para morar, a 5 minutos da Av. Itavuvu. Lazer completo e unidades com suíte.',
 'CASA GRANDE', 2, 'T + 8', 4, 2, 'completo', 'desconto',
 'Av. Itavuvu, 5100 - Jardim Ipanema', -23.4590, -47.4415),

-- 8. O mais caro (estica as faixas de preço para cima)
('d0000000-0000-0000-0000-000000000008', 'Torres do Lago', 'apartamento',
 'db000000-0000-0000-0000-000000000006', 'sul', '/imoveis/gran-campolim.jpg',
 array['/imoveis/gran-campolim/1.jpg','/imoveis/gran-campolim/3.jpg'],
 '2027-12-01', 520000, array[3], 1, true, false, true, true, 3,
 E'Alto padrão na Zona Sul: 3 dormitórios com suíte, varanda gourmet e duas vagas.\nVista para a área verde preservada.',
 'BONELLI', 1, 'T + 22', 4, 3, 'completo', 'gratis',
 'R. Justiniano de Souza, 400 - Vila Barão', -23.5230, -47.4520),

-- 9. Entrega mais distante (2029)
('d0000000-0000-0000-0000-000000000009', 'Vivenda Central', 'apartamento',
 'db000000-0000-0000-0000-000000000003', 'central', '/imoveis/siver-oasis.jpg',
 array['/imoveis/siver-oasis/1.jpg','/imoveis/siver-oasis/2.jpg','/imoveis/siver-oasis/3.jpg'],
 '2029-03-01', 210000, array[1,2], 0, true, false, false, false, 1,
 'Studios e apartamentos de 2 dormitórios no Centro, a 300 m do terminal urbano.',
 'MUV', 1, 'T + 16', 10, 2, 'areas_molhadas', 'desconto',
 'R. Barão de Piratininga, 90 - Centro', -23.5040, -47.4560),

-- 10. Ficha técnica TODA VAZIA: campo vazio não pode virar card vazio
('d0000000-0000-0000-0000-000000000010', 'Reserva do Vale', 'apartamento',
 'db000000-0000-0000-0000-000000000001', 'leste', '/imoveis/tropical.jpg',
 array[]::text[], '2028-12-01', 259000, array[2], 0, false, false, false,
 false, null, '', '', null, '', null, null, '', '',
 '', -23.4900, -47.4300);

-- ---------------------------------------------------------------- plantas ---
insert into plantas (empreendimento_id, metragem, preco, imagens) values
  -- 1: duas plantas, cada uma com preço próprio + imagem de planta
  ('d0000000-0000-0000-0000-000000000001', 44, 245000, array['/imoveis/sou-viver/planta-45.jpg']),
  ('d0000000-0000-0000-0000-000000000001', 48, 289000, array[]::text[]),
  -- 2: uma planta, sem preço próprio (usa o "a partir de" do empreendimento)
  ('d0000000-0000-0000-0000-000000000002', 45, null, array[]::text[]),
  -- 3: casa, duas metragens
  ('d0000000-0000-0000-0000-000000000003', 70, 380000, array[]::text[]),
  ('d0000000-0000-0000-0000-000000000003', 85, 445000, array[]::text[]),
  -- 4: comercial
  ('d0000000-0000-0000-0000-000000000004', 32, null, array[]::text[]),
  -- 5: TRÊS plantas
  ('d0000000-0000-0000-0000-000000000005', 41, null, array[]::text[]),
  ('d0000000-0000-0000-0000-000000000005', 43, null, array[]::text[]),
  ('d0000000-0000-0000-0000-000000000005', 48, 219000, array[]::text[]),
  -- 6
  ('d0000000-0000-0000-0000-000000000006', 52, 320000, array[]::text[]),
  ('d0000000-0000-0000-0000-000000000006', 58, 368000, array[]::text[]),
  -- 7
  ('d0000000-0000-0000-0000-000000000007', 50, null, array[]::text[]),
  -- 8
  ('d0000000-0000-0000-0000-000000000008', 78, null, array[]::text[]),
  -- 9: studio + 2 dorms
  ('d0000000-0000-0000-0000-000000000009', 32, 210000, array[]::text[]),
  ('d0000000-0000-0000-0000-000000000009', 44, 268000, array[]::text[]),
  -- 10
  ('d0000000-0000-0000-0000-000000000010', 46, null, array[]::text[]);
