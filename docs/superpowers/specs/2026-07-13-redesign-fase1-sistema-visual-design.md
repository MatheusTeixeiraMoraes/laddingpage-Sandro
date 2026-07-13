# Redesign — Fase 1: Sistema Visual

**Data:** 2026-07-13
**Status:** Aprovado — pronto para plano de implementação
**Depende de:** Fundação do projeto (paleta/tipografia atuais, a serem substituídas)

## Contexto

O cliente recebeu de um terceiro uma referência de landing page (imagem) que
"amou muito" — paleta navy escuro + rosa/magenta vibrante, tipografia
arredondada geométrica, cards e pills bem arredondados. É bem diferente da
paleta atual do site (roxo Nubank + azul, da ideia original antes de
qualquer validação do cliente).

Esta é a primeira de várias fases de redesign inspiradas nessa referência.
As demais fases (hero+busca reformulados, depoimentos em vídeo em
destaque, seção "sobre" com cards de estatística, carrossel de
lançamentos, footer expandido) ficam para specs próprias — esta fase troca
**só os tokens visuais** (cor + fonte) nos componentes que já existem, sem
mexer em estrutura, layout ou conteúdo.

Paleta e tipografia foram validadas com o usuário via comparação visual
(3 opções de cada, mockups reais) antes desta spec — não são um chute.

## Escopo

### 1. Paleta de cores

Substitui completamente `brand-purple`/`brand-blue` (mantém só `brand-white`):

| Token         | Hex       | Uso                                              |
|---------------|-----------|---------------------------------------------------|
| `brand-navy`  | `#151527` | Títulos, texto de destaque escuro, fundo escuro (footer, botões dark) |
| `brand-pink`  | `#EC4899` | Única cor de destaque: CTAs, links, badges, palavra de ênfase em títulos |
| `brand-blush` | `#FCE7F3` | Fundo suave (fundo de badge/pill, wash de seção)  |
| `brand-white` | `#FFFFFF` | Fundo (sem mudança)                               |

Não existe mais uma segunda cor de destaque tipo o `brand-blue` antigo — a
referência usa só navy+rosa. Onde `brand-blue` era usado hoje (botão de
WhatsApp genérico da home, botão "Aplicar filtros" do modal de filtros),
passa a usar `brand-pink`.

### 2. Tipografia

- **Poppins** (peso 800 para títulos grandes, 600 para subtítulos/botões) —
  substitui a Manrope atual como fonte principal.
- **Inter** (peso 400/600) — corpo de texto, parágrafos.
- **Caveat** (peso 600) — só para o toque cursivo tipo "Clientes que se
  tornam amigos." da referência; uso pontual, não em títulos/corpo.

Manrope sai do projeto — nenhum componente deve referenciá-la depois desta
fase.

### 3. Onde entra

Troca de token (cor/fonte) em todos os componentes/páginas que já
existem — 21 arquivos identificados usando `brand-purple`/`brand-blue`/
`brand-pink`/`font-sans` hoje: `Header`, `Footer` (implícito via layout),
todos os componentes de `/sobre`, `EmpreendimentoCard`, `EmpreendimentoDetalhe`,
`PlantaSelector`, `MapaEmpreendimento`, `SearchBar`, `FiltersModal`, os
componentes de `/admin` (`LoginForm`, `UpdatePasswordForm`), e as páginas
`page.tsx` de cada rota. `src/app/globals.css` (tokens `@theme`) e
`src/app/layout.tsx` (fontes via `next/font/google`) são os arquivos-base;
o resto é troca mecânica de classe (`text-brand-purple` → `text-brand-navy`
ou `text-brand-pink` conforme o papel do elemento, `bg-brand-blue` →
`bg-brand-pink`).

### 4. Logo

Continua wordmark em texto (arquivo real do logo ainda não foi fornecido —
ver `docs/superpowers/PENDENCIAS.md`) — só ganha as cores novas. Trocar
pelo arquivo real do cliente é uma mudança isolada e pequena, para quando
o arquivo chegar; não faz parte desta fase.

## Fora de escopo (explícito)

- Estrutura/layout de qualquer seção (hero, busca, depoimentos, sobre,
  listagem, footer) — fases seguintes.
- Logo real, fotos reais do Sandro — arquivos ainda não fornecidos.
- Ícones de redes sociais no header (a referência tem Instagram/TikTok/
  Facebook no header; hoje só existem como pills de texto em `/sobre`) —
  fica pra fase de header/nav.
- Badges de confiança (Empatia/Transparência/Honestidade), tagline
  cursiva no hero, elementos geométricos decorativos — fazem parte da
  fase de hero, não desta.

## Critério de pronto

- `npm run build` e `npm run lint` passam sem erro.
- Nenhuma referência a `brand-purple`, `brand-blue` ou Manrope sobra no
  código (`grep` limpo).
- Verificação visual (Playwright): home, `/sobre`, página de
  empreendimento e `/admin` mostram a paleta navy+rosa e a tipografia
  Poppins/Inter aplicadas de forma consistente, sem quebrar nenhum layout
  existente.
