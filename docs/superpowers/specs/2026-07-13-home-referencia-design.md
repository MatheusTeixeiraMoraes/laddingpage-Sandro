# Home no estilo da referência (redesign completo)

**Data:** 2026-07-13
**Status:** Aprovado — pronto para plano de implementação
**Depende de:** [Fase 1 do redesign — Sistema Visual](2026-07-13-redesign-fase1-sistema-visual-design.md)

## Contexto

O cliente (Sandro) aprovou uma referência de landing page (imagem gerada por
terceiro) e quer a home no mesmo estilo. A Fase 1 já trocou a paleta para
navy+rosa e as fontes para Poppins/Inter. Esta fase reconstrói a **home
inteira** batendo com o layout da referência, usando assets reais do Sandro
(logo, foto recortada, fotos de clientes, fachadas de empreendimentos) do
diretório `C:\Users\mathe\Documents\Material Sandro`.

Decisões já validadas com o cliente:
- Foco de hoje: **home completa**; páginas de detalhe/admin ficam com a Fase 1.
- Semear **8 empreendimentos reais** (com fachada real) no lugar dos 5 mock.
- Seção de "depoimento em vídeo" vira **galeria de fotos reais de clientes**
  + Google Reviews (não há vídeo de cliente falando no material).
- Paleta **navy + rosa** mantida; logo real usado como está (roxo+rosa dele
  convive como cor de marca).

## Escopo

### Assets (otimizados para `public/`)

Copiar e redimensionar (via ffmpeg, disponível no PATH) para manter o repo
leve (alvo: total < ~6 MB):

- `public/logo-sandro.png` — de `Logos/Sandro_Higuti-removebg-preview.png`
  (transparente).
- `public/sandro-recorte.png` — de
  `fotos ensaio/DSC_1302-removebg-preview.png` (cutout, blazer). Usado no
  hero e na faixa "sobre mim".
- `public/clientes/cliente-1.jpg` … `cliente-6.jpg` — 6 fotos de
  `clientes/*.jpg` (redimensionadas ~900px largura). Pular o `.heic`.
- `public/imoveis/<slug>.jpg` — 1 fachada por empreendimento semeado (8),
  redimensionadas ~900px.

### Migration 0004 — campos de empreendimento

`empreendimentos` ganha três colunas:

```sql
alter table empreendimentos add column zona text not null default 'norte'
  check (zona in ('norte', 'sul', 'leste', 'oeste', 'central'));
alter table empreendimentos add column imagem text not null default '';
alter table empreendimentos add column entrega text not null default '';
```

- `zona`: usada pelas abas de região da busca.
- `imagem`: caminho da fachada em `public/imoveis/…` (ex: `/imoveis/laredo.jpg`).
- `entrega`: texto livre de previsão de entrega (ex: `"Dez/2026"`, `"Pronto"`).

O tipo `Empreendimento` (TS) e o mapper `src/lib/empreendimentos.ts` ganham
os três campos. `Filtros` (TS) ganha `zona: Zona | "todas"`.

### Seed 0005 — 8 empreendimentos reais

Substituir os 5 mock por 8 reais (nome + zona reais; fachada real;
dorms/metragem representativos de MCMV; **sem preço fabricado exibido como
real**). Distribuição: 2 Leste, 2 Norte, 3 Oeste, 1 Sul.

| Nome                 | Zona  | slug/imagem        |
|----------------------|-------|--------------------|
| Vila Laredo          | leste | laredo             |
| Sou Viver Sorocaba   | leste | sou-viver          |
| Siver Oasis          | norte | siver-oasis        |
| Residencial São Paulo| norte | sao-paulo          |
| Arena                | oeste | arena              |
| Park Ville           | oeste | park-ville         |
| Residencial Tropical | oeste | tropical           |
| Gran Campolim        | sul   | gran-campolim      |

Cada um recebe 1–2 plantas com dorms/metragem/vagas plausíveis e um `preco`
de referência (o preço fica no banco para a busca por faixa funcionar e para
a página de detalhe, mas **os cards da home não exibem preço** — ver seção de
cards). `com_suite`, `fotos` (legendas) mantêm o formato atual.

### Componentes da home (novos, em `src/components/home/`)

Cada seção um componente próprio; a página `src/app/page.tsx` orquestra.

1. **`SiteHeader`** (substitui o `Header` atual) — logo real à esquerda; nav
   central com âncoras (`#imoveis`, `#sobre`, `#depoimentos`, `#contato`) +
   link "Início"; à direita ícones sociais (Instagram/Facebook/YouTube, SVG
   inline, `href="#"`) + botão rosa "Fale comigo" (WhatsApp genérico). Sticky
   no topo. Colapsa a nav em telas pequenas (nav some < `md`, mantém logo +
   botão).
2. **`Hero`** — fundo claro; à esquerda: h1 "Mais que imóveis," + linha rosa
   "realizo sonhos.", subtítulo ("Especialista em apartamentos na planta em
   Sorocaba. Atendimento humanizado, transparente e focado em você."), três
   badges (Empatia, Transparência, Honestidade) com check, tagline cursiva
   (`font-script`) "Clientes que se tornam amigos."; à direita: `sandro-recorte.png`
   com um blob rosa atrás. Empilha no mobile (foto abaixo do texto).
3. **`BuscaImoveis`** (client) — card branco arredondado com sombra, `id="imoveis"`.
   Topo: abas de região (Todos/Norte/Sul/Leste/Oeste/Central). Grade de
   filtros: tipo, dormitórios (mín), vagas (mín), metragem (mín/máx). Botão
   rosa "Buscar imóveis". Abaixo, a grade de resultados (`EmpreendimentoCard`)
   reagindo aos filtros — reutiliza `filterEmpreendimentos` (estendido com
   `zona`).
4. **`ClientesAmigos`** (`id="depoimentos"`) — título "Clientes que se tornam
   amigos", grade das 6 fotos reais de clientes (arredondadas, object-cover),
   seguida dos `GoogleReviews` (componente existente reutilizado).
5. **`SobreMim`** (`id="sobre"`) — duas colunas: à esquerda texto "Prazer, eu
   sou **Sandro Higuti**" + bio curta + 4 pills (Atendimento humanizado, Foco
   no seu objetivo, Acompanhamento completo, Especialista em MCMV) + botão
   "Me conhecer melhor" (âncora/`/sobre`); à direita cutout do Sandro + card
   de estatísticas (+250 Famílias atendidas, +150 Sonhos realizados, 100%
   Comprometimento) sobre fundo navy/gradiente rosa.
6. **`LancamentosDestaque`** — "Lançamentos em destaque / Apartamentos na
   planta para o seu futuro"; grade/carrossel simples (grade responsiva, sem
   lib de carrossel) dos 8 empreendimentos como cards de lançamento: imagem
   real (`next/image`), nome, zona, linha "N dorms · Nm² · Entrega: X".
   **Sem preço.** Card inteiro linka para `/empreendimentos/[id]`.
7. **`FaixaContato`** (`id="contato"`, client) — faixa em gradiente rosa;
   "Vamos conversar?"; inputs nome + telefone; botão "Quero atendimento" que
   monta link `wa.me` com mensagem incluindo nome/telefone e abre em nova aba
   (sem backend, coerente com "sem captura automática" do brief original).
8. **`SiteFooter`** (substitui o `Footer` atual) — fundo navy; coluna 1: logo
   (versão clara/branca ou o logo sobre navy) + frase curta; coluna Navegação
   (mesmas âncoras); coluna Regiões (Norte/Sul/Leste/Oeste/Central linkando
   pra busca filtrada — ou âncora `#imoveis`); coluna Contato (WhatsApp
   `(15) 99250-0314`, Sorocaba - SP, CRECI 278922); coluna Redes (ícones).
   Rodapé: "© {ano} Sandro Higuti Consultor Imobiliário — CRECI 278922".

### WhatsApp / contato

- Número real já usado no projeto: `5515992500314` (helper `buildWhatsAppLink`
  existente). Exibido formatado como `(15) 99250-0314`.
- Botão "Fale comigo" (header) e "Quero atendimento" (faixa) usam o helper.
- Nenhum e-mail inventado; contato é WhatsApp + cidade + CRECI.

### Reuso / limpeza

- `GoogleReviews` (existente) reutilizado dentro de `ClientesAmigos`.
- `EmpreendimentoCard` (existente) continua sendo usado na grade de resultados
  da busca; `LancamentosDestaque` usa um card próprio (com imagem + entrega,
  sem preço).
- `Header`/`Footer` antigos são substituídos por `SiteHeader`/`SiteFooter`
  (o `layout.tsx` passa a importar os novos).
- A página `/sobre` continua existindo (Fase 1) e permanece linkável; o link
  "Me conhecer melhor" aponta pra ela.

## Fora de escopo (explícito)

- Redesign das páginas de detalhe de empreendimento e do painel admin (ficam
  na Fase 1).
- Vídeos (nenhum vídeo de cliente falando; tours de imóvel não entram hoje).
- Extração de preços/plantas reais dos PDFs de tabela de vendas (dados
  representativos + ajuste posterior pelo Sandro no painel).
- Carrossel com biblioteca (grade responsiva basta).
- Captura de leads em backend (contato é deep link WhatsApp).

## Pendências geradas (registrar em `docs/superpowers/PENDENCIAS.md`)

- Confirmar números reais de "famílias atendidas / sonhos realizados".
- Confirmar/ajustar dados reais (dorms, metragem, entrega, preço) dos 8
  empreendimentos semeados — hoje são representativos.
- Trocar `href="#"` das redes sociais pelos links reais.

## Critério de pronto

- Migration 0004 (colunas) e seed 0005 (8 reais) aplicados no Supabase.
- `npm run build`, `npm run lint`, `npm test` passam sem erro.
- Verificação visual (Playwright) da home inteira contra o print: header com
  logo, hero com foto do Sandro, busca com abas de região funcionando, grade
  de fotos de clientes, faixa sobre-mim com stats, cards de lançamento com
  imagem real, faixa de contato abrindo WhatsApp, footer navy — sem quebrar
  em mobile.
- Deploy no Vercel refletindo a home nova.
