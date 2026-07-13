# Home no estilo da referência — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (execução inline pelo autor, que tem contexto completo). Passos usam checkbox (`- [ ]`). Componentes de UI são escritos durante a execução com apoio da skill frontend-design para o acabamento visual; este plano fixa estrutura, dados, lógica e verificação.

**Goal:** Reconstruir a home batendo com o print aprovado pelo Sandro, usando assets reais e 8 empreendimentos reais no banco.

**Architecture:** Assets otimizados em `public/`. Migration adiciona `zona`/`imagem`/`entrega` a `empreendimentos`; seed troca os 5 mock por 8 reais. Novos componentes em `src/components/home/` compõem a página; `SiteHeader`/`SiteFooter` substituem `Header`/`Footer`. Migrations aplicadas via conexão Postgres direta (`DATABASE_URL` em `.env.local`) porque o SQL Editor do dashboard não persistia de forma confiável neste projeto.

**Tech Stack:** Next.js 16 (App Router) + TS + Tailwind v4 (tokens `brand-navy`/`brand-pink`/`brand-blush`, fontes `font-heading`/`font-script`) + Supabase + `next/image`.

## Global Constraints

- Paleta navy `#151527` + rosa `#EC4899` + blush `#FCE7F3` (Fase 1). Fontes: Poppins (`font-heading`), Inter (`font-sans`), Caveat (`font-script`).
- WhatsApp real: `5515992500314`, exibido `(15) 99250-0314`. Usar helper `buildWhatsAppLink` de `@/lib/whatsapp`.
- **Cards de lançamento NÃO exibem preço** (evita valor fabricado como real). Exibem `N dorms · Nm² · Entrega: X`.
- Dados de empreendimento (dorms/metragem/entrega/preço) e números de stats são **representativos** — registrar em PENDENCIAS que Sandro confirma depois.
- Migrations via script `pg` temporário com `ssl:{rejectUnauthorized:false}` (TLS-intercept local já diagnosticado; autorizado pelo usuário em sessões anteriores — pedir confirmação de novo se o classificador bloquear).
- Não inventar e-mail. Contato = WhatsApp + "Sorocaba - SP" + "CRECI 278922".

---

### Task 1: Assets otimizados em `public/`

**Files:**
- Create: `public/logo-sandro.png`, `public/sandro-recorte.png`, `public/clientes/cliente-1..6.jpg`, `public/imoveis/<8 slugs>.jpg`

**Origem:** `C:\Users\mathe\Documents\Material Sandro` (fora do repo).

- [ ] **Step 1: Criar diretórios**

```bash
mkdir -p public/clientes public/imoveis
```

- [ ] **Step 2: Logo e cutout do Sandro**

```bash
MAT="C:/Users/mathe/Documents/Material Sandro"
ffmpeg -y -i "$MAT/Logos/Sandro_Higuti-removebg-preview.png" -vf "scale=400:-1" -update 1 public/logo-sandro.png
ffmpeg -y -i "$MAT/fotos ensaio/DSC_1302-removebg-preview.png" -vf "scale=760:-1" -update 1 public/sandro-recorte.png
```

- [ ] **Step 3: 6 fotos de clientes (escolher as 6 melhores `.jpg` de `clientes/`, pular `.heic`)**

Para cada foto escolhida `N`: `ffmpeg -y -i "$MAT/clientes/<arquivo>" -vf "scale=900:-1" -update 1 "public/clientes/cliente-N.jpg"`. Ver as candidatas antes de escolher; priorizar fotos com o Sandro + cliente sorrindo.

- [ ] **Step 4: 8 fachadas (1 por empreendimento; ver candidatas e escolher a fachada/perspectiva mais limpa de cada pasta)**

Mapa pasta → slug:
- `Zona Leste/Laredo/imagens` → `laredo`
- `Zona Leste/Sou Viver Sorocaba/fachada.jpg` → `sou-viver`
- `Zona Norte/Siver Oasis/imagens` → `siver-oasis`
- `Zona Norte/São Paulo/imagens` → `sao-paulo`
- `Zona Oeste/Arena/.../Material MKT` → `arena`
- `Zona Oeste/Park Vile/imagens` → `park-ville`
- `Zona Oeste/Tropical/imagens` → `tropical`
- `Zona Sul/Gran Campolim/.../Fachada.jpeg` → `gran-campolim`

Cada: `ffmpeg -y -i "<fachada escolhida>" -vf "scale=900:-1" -update 1 "public/imoveis/<slug>.jpg"`.

- [ ] **Step 5: Conferir tamanho total e commit**

Run: `du -sh public/` (esperado < ~6 MB). Ver rapidamente cada imagem gerada (Read) pra confirmar que não ficou corrompida/errada.

```bash
git add public/logo-sandro.png public/sandro-recorte.png public/clientes public/imoveis
git commit -m "chore: adiciona assets reais do Sandro (logo, foto, clientes, fachadas)"
```

---

### Task 2: Migration, seed e camada de dados

**Files:**
- Create: `supabase/migrations/0004_empreendimento_zona_imagem_entrega.sql`
- Create: `supabase/migrations/0005_seed_empreendimentos_reais.sql`
- Modify: `src/types/empreendimento.ts`, `src/lib/empreendimentos.ts`, `src/lib/filterEmpreendimentos.ts`, `src/lib/filterEmpreendimentos.test.ts`

**Interfaces:**
- Produces: `Empreendimento` com `zona: Zona`, `imagem: string`, `entrega: string`; `type Zona = "norte"|"sul"|"leste"|"oeste"|"central"`; `Filtros.zona: Zona | "todas"`; `FILTROS_VAZIOS.zona = "todas"`.

- [ ] **Step 1: `0004_empreendimento_zona_imagem_entrega.sql`**

```sql
alter table empreendimentos
  add column zona text not null default 'norte'
    check (zona in ('norte', 'sul', 'leste', 'oeste', 'central')),
  add column imagem text not null default '',
  add column entrega text not null default '';
```

- [ ] **Step 2: `0005_seed_empreendimentos_reais.sql`**

Apaga os empreendimentos atuais (cascade apaga plantas) e insere os 8 reais. IDs fixos (`aaaa…01`..`08`) pra navegação previsível. Cada um com 1–2 plantas representativas (2 dorms, 44–52 m², 1 vaga, preço de referência 210000–330000, `com_suite` variando, `fotos` = legendas de texto).

```sql
delete from empreendimentos;

insert into empreendimentos (id, nome, tipo, bairro, zona, imagem, entrega, latitude, longitude) values
  ('a0000000-0000-0000-0000-000000000001', 'Vila Laredo', 'apartamento', 'Zona Leste', 'leste', '/imoveis/laredo.jpg', 'Pronto para morar', -23.463, -47.412),
  ('a0000000-0000-0000-0000-000000000002', 'Sou Viver Sorocaba', 'apartamento', 'Zona Leste', 'leste', '/imoveis/sou-viver.jpg', 'Dez/2026', -23.470, -47.401),
  ('a0000000-0000-0000-0000-000000000003', 'Siver Oasis', 'apartamento', 'Zona Norte', 'norte', '/imoveis/siver-oasis.jpg', 'Jun/2026', -23.470, -47.470),
  ('a0000000-0000-0000-0000-000000000004', 'Residencial São Paulo', 'apartamento', 'Zona Norte', 'norte', '/imoveis/sao-paulo.jpg', 'Dez/2027', -23.478, -47.462),
  ('a0000000-0000-0000-0000-000000000005', 'Arena', 'apartamento', 'Zona Oeste', 'oeste', '/imoveis/arena.jpg', 'Abr/2028', -23.512, -47.488),
  ('a0000000-0000-0000-0000-000000000006', 'Park Ville', 'apartamento', 'Zona Oeste', 'oeste', '/imoveis/park-ville.jpg', 'Ago/2027', -23.520, -47.495),
  ('a0000000-0000-0000-0000-000000000007', 'Residencial Tropical', 'apartamento', 'Zona Oeste', 'oeste', '/imoveis/tropical.jpg', 'Pronto para morar', -23.505, -47.505),
  ('a0000000-0000-0000-0000-000000000008', 'Gran Campolim', 'apartamento', 'Zona Sul', 'sul', '/imoveis/gran-campolim.jpg', 'Dez/2026', -23.520, -47.455);

insert into plantas (empreendimento_id, metragem, com_suite, dormitorios, vagas, preco, fotos) values
  ('a0000000-0000-0000-0000-000000000001', 44, false, 2, 1, 245000, array['Sala', 'Cozinha', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000001', 48, true,  2, 1, 289000, array['Sala', 'Suíte', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000002', 45, false, 2, 1, 235000, array['Sala', 'Quarto', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000003', 44, false, 2, 1, 219000, array['Sala', 'Cozinha', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000003', 50, true,  2, 1, 268000, array['Sala', 'Suíte', 'Varanda']),
  ('a0000000-0000-0000-0000-000000000004', 46, false, 2, 1, 228000, array['Sala', 'Quarto', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000005', 47, false, 2, 1, 255000, array['Sala', 'Cozinha', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000005', 52, true,  2, 1, 312000, array['Sala', 'Suíte', 'Varanda']),
  ('a0000000-0000-0000-0000-000000000006', 45, false, 2, 1, 239000, array['Sala', 'Quarto', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000007', 48, false, 2, 1, 249000, array['Sala', 'Cozinha', 'Planta baixa']),
  ('a0000000-0000-0000-0000-000000000008', 50, true,  2, 1, 298000, array['Sala', 'Suíte', 'Planta baixa']);
```

- [ ] **Step 3: Aplicar as duas migrations via script `pg` temporário**

Instalar pg (`npm install --no-save pg`), rodar um `run-mig.mjs` que lê e executa `0004` e `0005` na conexão `DATABASE_URL` (`ssl:{rejectUnauthorized:false}`), depois faz um `select` de contagem (esperado: 8 empreendimentos, 11 plantas) e imprime `zona`/`imagem` de 1 registro. Apagar o script e desinstalar pg depois.

- [ ] **Step 4: `src/types/empreendimento.ts`** — adicionar tipo `Zona` e campos

```ts
export type Zona = "norte" | "sul" | "leste" | "oeste" | "central";
```
No `Empreendimento`, após `bairro`: `zona: Zona; imagem: string; entrega: string;`

- [ ] **Step 5: `src/lib/empreendimentos.ts`** — incluir novas colunas no `select` e no mapper

`SELECT_EMPREENDIMENTO` passa a incluir `zona, imagem, entrega`. `EmpreendimentoRow` ganha `zona: Zona; imagem: string; entrega: string;`. `mapRow` copia os três direto.

- [ ] **Step 6: `src/lib/filterEmpreendimentos.ts`** — filtro por zona

`Filtros` ganha `zona: Zona | "todas"`. `FILTROS_VAZIOS.zona = "todas"`. No `filterEmpreendimentos`, após o filtro de tipo: `if (filtros.zona !== "todas" && empreendimento.zona !== filtros.zona) return false;`. Importar `Zona` do tipo.

- [ ] **Step 7: `src/lib/filterEmpreendimentos.test.ts`** — atualizar fixtures e adicionar teste de zona

Adicionar `zona`, `imagem`, `entrega` aos 2 fixtures (`zona: "leste"` no id 1, `zona: "norte"` no id 2; `imagem: ""`, `entrega: ""`). Adicionar teste: filtro `{ zona: "leste" }` retorna só id "1".

- [ ] **Step 8: Testes + build**

Run: `npm test && npm run build`
Expected: testes passam (agora com o de zona); build compila (home ainda usa componentes antigos — ok, muda na Task seguinte).

- [ ] **Step 9: Commit**

```bash
git add supabase/migrations/0004_empreendimento_zona_imagem_entrega.sql supabase/migrations/0005_seed_empreendimentos_reais.sql src/types/empreendimento.ts src/lib/empreendimentos.ts src/lib/filterEmpreendimentos.ts src/lib/filterEmpreendimentos.test.ts
git commit -m "feat: adiciona zona/imagem/entrega e semeia 8 empreendimentos reais"
```

---

### Task 3: Shell do site — SiteHeader e SiteFooter

**Files:**
- Create: `src/components/home/SiteHeader.tsx`, `src/components/home/SiteFooter.tsx`, `src/components/home/SocialIcons.tsx`
- Modify: `src/app/layout.tsx` (importar os novos), remover uso de `Header`/`Footer`
- Delete: `src/components/Header.tsx`, `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `buildWhatsAppLink` (`@/lib/whatsapp`), `next/image`, `next/link`.
- Produces: `SiteHeader`, `SiteFooter`.

- [ ] **Step 1: `SocialIcons.tsx`** — 3 SVGs inline (Instagram, Facebook, YouTube), props `className`, `href="#"` cada (placeholder). Reutilizável em header e footer.

- [ ] **Step 2: `SiteHeader.tsx`** — sticky, fundo branco, sombra sutil. Logo (`next/image` `logo-sandro.png`, altura ~44px) linkando pra `/`. Nav central (some `< md`): Início (`/`), Imóveis (`#imoveis`), Sobre (`#sobre`), Depoimentos (`#depoimentos`), Contato (`#contato`). Direita: `SocialIcons` + botão rosa pill "Fale comigo" (WhatsApp genérico via helper, target `_blank`).

- [ ] **Step 3: `SiteFooter.tsx`** — fundo `brand-navy`, texto claro. Grid responsivo: coluna marca (logo + frase "Atendimento humanizado e transparente para realizar o seu sonho do primeiro lar."), coluna Navegação (as âncoras), coluna Regiões (Norte/Sul/Leste/Oeste/Central → `#imoveis`), coluna Contato (WhatsApp `(15) 99250-0314` link, "Sorocaba - SP", "CRECI 278922"), coluna Redes (`SocialIcons`). Linha final: `© {new Date().getFullYear()} Sandro Higuti Consultor Imobiliário — CRECI 278922`.

- [ ] **Step 4: `layout.tsx`** — trocar imports/uso de `Header`/`Footer` por `SiteHeader`/`SiteFooter`. Apagar os arquivos antigos.

- [ ] **Step 5: Build + lint + commit**

Run: `npm run build && npm run lint`

```bash
git add src/components/home/SiteHeader.tsx src/components/home/SiteFooter.tsx src/components/home/SocialIcons.tsx src/app/layout.tsx
git rm src/components/Header.tsx src/components/Footer.tsx
git commit -m "feat: adiciona SiteHeader e SiteFooter no estilo da referencia"
```

---

### Task 4: Hero e SobreMim

**Files:**
- Create: `src/components/home/Hero.tsx`, `src/components/home/SobreMim.tsx`

**Interfaces:** Consumes `buildWhatsAppLink`, `next/image`, `next/link`. Produces `Hero`, `SobreMim`.

- [ ] **Step 1: `Hero.tsx`** — grade 2 colunas (empilha no mobile). Esquerda: h1 (`font-heading`) "Mais que imóveis," + `<span class="text-brand-pink">realizo sonhos.</span>`; parágrafo subtítulo; 3 badges (Empatia/Transparência/Honestidade) com ✓ (pills `bg-brand-blush`/borda); tagline `font-script` rosa "Clientes que se tornam amigos.". Direita: blob rosa (`bg-brand-pink/20`, blur/rounded) atrás do `next/image` `sandro-recorte.png`.

- [ ] **Step 2: `SobreMim.tsx`** (`id="sobre"`) — 2 colunas. Esquerda: label "SOBRE MIM", h2 "Prazer, eu sou <span pink>Sandro Higuti</span>", bio curta (MCMV Sorocaba), 4 pills (Atendimento humanizado, Foco no seu objetivo, Acompanhamento completo, Especialista em MCMV), botão navy "Me conhecer melhor" → `/sobre`. Direita: cutout do Sandro + card de stats sobreposto (navy/gradiente rosa): +250 Famílias atendidas, +150 Sonhos realizados, 100% Comprometimento.

- [ ] **Step 3: Build + lint (componentes ainda não usados na página — só compila) + commit**

```bash
git add src/components/home/Hero.tsx src/components/home/SobreMim.tsx
git commit -m "feat: adiciona secoes Hero e SobreMim da home"
```

---

### Task 5: Busca com região e Lançamentos em destaque

**Files:**
- Create: `src/components/home/BuscaImoveis.tsx`, `src/components/home/RegiaoTabs.tsx`, `src/components/home/LancamentoCard.tsx`, `src/components/home/LancamentosDestaque.tsx`
- Modify: `src/components/FiltersModal.tsx` (adicionar campo zona? — não; a busca nova tem os filtros inline; `FiltersModal` permanece pra reuso, mas a home usa `BuscaImoveis`)

**Interfaces:**
- Consumes: `Empreendimento`, `Zona` (`@/types/empreendimento`); `filterEmpreendimentos`, `FILTROS_VAZIOS`, `Filtros` (`@/lib/filterEmpreendimentos`); `EmpreendimentoCard` (`@/components/EmpreendimentoCard`); `next/image`, `next/link`.
- Produces: `BuscaImoveis({ empreendimentos })`, `LancamentosDestaque({ empreendimentos })`.

- [ ] **Step 1: `RegiaoTabs.tsx`** (client) — pills de região (Todos/Norte/Sul/Leste/Oeste/Central); prop `value`, `onChange`. Ativa = `bg-brand-pink text-white`.

- [ ] **Step 2: `BuscaImoveis.tsx`** (client, `id="imoveis"`) — card branco arredondado sombra. Título "Encontre o imóvel ideal para você". `RegiaoTabs` no topo. Grade de filtros (tipo select, dormitórios mín select, vagas mín select, metragem mín/máx number). Botão rosa "Buscar imóveis" (aplica — mas filtragem é reativa via `useMemo`, o botão faz scroll até os resultados/no-op). Estado local `useState<Filtros>` + grade `EmpreendimentoCard` reagindo. Reusa `filterEmpreendimentos`.

- [ ] **Step 3: `LancamentoCard.tsx`** — card: `next/image` (`imagem`, fill/object-cover, h ~200px) com ícone coração decorativo no canto; corpo: nome (`font-heading`), zona (texto `bairro`), linha meta `N dorms · Nm² · Entrega: {entrega}` (usar a planta de menor metragem pra dorms/m²). **Sem preço.** Card inteiro = `Link` para `/empreendimentos/{id}`.

- [ ] **Step 4: `LancamentosDestaque.tsx`** — label "LANÇAMENTOS EM DESTAQUE", h2 "Apartamentos na planta <span pink>para o seu futuro</span>", grade responsiva (1/2/4 col) de `LancamentoCard` para os empreendimentos recebidos. Botão "Ver todos os imóveis" → `#imoveis`.

- [ ] **Step 5: Build + lint + commit**

```bash
git add src/components/home/BuscaImoveis.tsx src/components/home/RegiaoTabs.tsx src/components/home/LancamentoCard.tsx src/components/home/LancamentosDestaque.tsx
git commit -m "feat: adiciona busca por regiao e lancamentos em destaque"
```

---

### Task 6: Clientes/reviews e Faixa de contato

**Files:**
- Create: `src/components/home/ClientesAmigos.tsx`, `src/components/home/FaixaContato.tsx`

**Interfaces:** Consumes `GoogleReviews` (`@/components/GoogleReviews`), `buildWhatsAppLink`, `next/image`. Produces `ClientesAmigos`, `FaixaContato`.

- [ ] **Step 1: `ClientesAmigos.tsx`** (`id="depoimentos"`) — label "HISTÓRIAS QUE INSPIRAM", h2 "A confiança de quem <span pink>realizou o sonho</span>", parágrafo curto. Grade das 6 fotos (`/clientes/cliente-1..6.jpg`, `next/image`, arredondadas, object-cover, aspect quadrado ou 4/5). Abaixo, `<GoogleReviews />`.

- [ ] **Step 2: `FaixaContato.tsx`** (client, `id="contato"`) — faixa gradiente rosa (`from-brand-pink to-purple-600` ou navy), texto branco. "Vamos conversar?" + subtítulo. Inputs nome + telefone (`useState`). Botão "Quero atendimento" (branco/navy) que monta `buildWhatsAppLink("Olá, meu nome é {nome}, telefone {telefone}. Quero atendimento para encontrar meu imóvel.")` e abre em `_blank` (via `window.open` ou `<a>` com href derivado). Validar nome não vazio antes.

- [ ] **Step 3: Build + lint + commit**

```bash
git add src/components/home/ClientesAmigos.tsx src/components/home/FaixaContato.tsx
git commit -m "feat: adiciona secao de clientes/reviews e faixa de contato"
```

---

### Task 7: Montagem da home, verificação e publicação

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `docs/superpowers/PENDENCIAS.md`

- [ ] **Step 1: Reescrever `src/app/page.tsx`** — server component, `dynamic = "force-dynamic"`, `getEmpreendimentos()`. Ordena as seções: `<Hero />`, `<BuscaImoveis empreendimentos={…} />`, `<ClientesAmigos />`, `<SobreMim />`, `<LancamentosDestaque empreendimentos={…} />`, `<FaixaContato />`. (Header/Footer vêm do layout.) Sem `max-w` apertado no topo — cada seção controla seu container.

- [ ] **Step 2: Testes + build + lint**

Run: `npm test && npm run build && npm run lint`
Expected: tudo passa.

- [ ] **Step 3: Verificação visual (Playwright)**

Subir `npm run dev` (atenção: porta pode ser 3001 se 3000 ocupada — checar o log). Via Playwright:
1. Home desktop: header com logo, hero com foto do Sandro + badges + tagline, screenshot full-page
2. Clicar aba de região "Oeste" na busca → confirmar que a grade reduz para os 3 empreendimentos da zona oeste
3. Rolar até Lançamentos → cards com imagem real, sem preço, com "Entrega:"
4. Faixa de contato: preencher nome, inspecionar `href`/ação do botão → contém `wa.me/5515992500314` e o nome
5. Footer navy com colunas
6. Emular mobile (resize ~390px) → confirmar que hero empilha e nav colapsa, sem overflow horizontal
7. Console sem erros
8. Parar o dev server

- [ ] **Step 4: Atualizar `PENDENCIAS.md`** — adicionar seção "Conteúdo a confirmar (home)": números de stats, dados reais dos 8 empreendimentos (dorms/metragem/entrega/preço são representativos), links reais de redes sociais. Marcar a home da referência como concluída.

- [ ] **Step 5: Commit final + push**

```bash
git add src/app/page.tsx docs/superpowers/PENDENCIAS.md
git commit -m "feat: monta a home no estilo da referencia e atualiza pendencias"
git pull --no-edit && git push
```
