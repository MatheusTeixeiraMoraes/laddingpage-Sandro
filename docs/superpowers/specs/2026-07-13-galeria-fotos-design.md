# Galeria de fotos (empreendimento + por planta)

**Data:** 2026-07-13
**Status:** Aprovado — pronto para plano de implementação
**Depende de:** [Painel Admin — CRUD](2026-07-13-painel-admin-crud-design.md)

## Contexto

O briefing original pedia, com todas as letras: *"Cada imagem/galeria deve
deixar claro a qual planta/metragem específica aquela imagem se refere (evitar
confusão do lead sobre o que ele está vendo)"*. Hoje cada empreendimento tem
**uma** foto de capa, e as plantas guardam apenas **rótulos de texto** ("Sala",
"Cozinha") em `plantas.fotos` — nome que mente sobre o conteúdo.

Esta fatia entrega a galeria de verdade, em dois níveis, e o upload pelo painel.

## Escopo

### 1. Modelo (migration 0007)

```sql
alter table empreendimentos add column galeria text[] not null default '{}';
alter table plantas rename column fotos to ambientes;
alter table plantas add column imagens text[] not null default '{}';
```

- `empreendimentos.galeria` — fotos do empreendimento (fachada, lazer, piscina).
- `plantas.imagens` — imagens **daquela planta** (planta baixa, decorado).
- `plantas.ambientes` — os rótulos que já existiam (renomeado de `fotos`, que
  era um nome enganoso).

Todos aceitam caminho relativo (`/imoveis/...`, arquivo em `public/`) e URL
absoluta do Supabase Storage — igual ao campo `imagem` de capa.

Tipos TS acompanham: `Empreendimento.galeria: string[]`,
`Planta.ambientes: string[]`, `Planta.imagens: string[]` (o campo
`Planta.fotos` deixa de existir).

### 2. Seed (migration 0008)

Popular `galeria` dos 7 empreendimentos com fotos reais do material do Sandro
(3–4 por empreendimento: fachada, lazer, decorado) e `plantas.imagens` onde
existe planta baixa em arquivo (ex: Sou Viver tem `Planta 44.png` e
`Planta 45.png`). Arquivos otimizados vão para `public/imoveis/<slug>/`.

### 3. Página do imóvel (`/empreendimentos/[id]`)

- **Seção "Galeria"** nova: grade das fotos de `galeria`; clicar abre a foto
  ampliada (lightbox simples, fecha no X / clique fora / Esc).
- **Área das plantas**: ao selecionar uma planta, mostrar `planta.imagens` com
  **legenda explícita** identificando a planta (ex: "Planta 44m² sem suíte"),
  resolvendo o ponto do briefing. Os chips de `ambientes` continuam.
- Se uma planta não tem imagem, a área simplesmente não aparece (sem caixa
  vazia).

### 4. Painel admin

- **`EmpreendimentoForm`**: além da foto de capa, campo de **galeria** —
  seleciona várias imagens de uma vez, sobe todas, mostra as já existentes com
  botão de remover (remove só a referência; o arquivo no Storage não é
  apagado nesta fatia).
- **`PlantasManager`**: em cada planta, campo de **imagens da planta** com o
  mesmo comportamento.
- Reutiliza `uploadImagem` (validação de tipo/tamanho já existente); upload de
  vários arquivos = várias chamadas.

## Fora de escopo (explícito)

- Reordenar fotos por drag-and-drop (a ordem é a de inserção).
- Apagar o arquivo do Storage ao remover a foto da galeria (remove só a
  referência; limpeza do bucket fica para depois).
- Importação por planilha.
- Carrossel com autoplay/transições elaboradas — grade + lightbox basta.

## Critério de pronto

- Migrations 0007 e 0008 aplicadas.
- `npm run build`, `npm run lint`, `npm test` passam.
- Verificação visual: a página de um empreendimento mostra a galeria (clique
  amplia) e, ao trocar de planta, as imagens da planta mudam com a legenda
  correta.
- Verificação no painel (logado): subir várias fotos na galeria e imagens em
  uma planta, e vê-las refletidas na página pública.
