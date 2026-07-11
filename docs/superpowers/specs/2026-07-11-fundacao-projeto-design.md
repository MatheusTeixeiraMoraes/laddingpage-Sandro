# Landing Page — Sandro Higuti Consultor Imobiliário

**Data:** 2026-07-11
**Status:** Fundação aprovada — pilares de feature ficam para specs futuras

## Contexto

Landing page para o corretor Sandro Higuti, com foco em apresentar empreendimentos,
gerar autoridade pessoal e captar leads via WhatsApp. Projeto multi-sessão: os
pilares abaixo são desenvolvidos um de cada vez, cada um com sua própria spec e
plano. Por decisão do cliente, **nesta fase não integramos Vercel nem Supabase** —
apenas o repositório no GitHub e o código local.

## Pilares do produto (backlog, fora do escopo desta spec)

1. Busca em destaque na home + painel de filtros (tipo, dormitórios, vagas,
   metragem, preço) que abre em modal/painel para não poluir a tela.
2. Página de empreendimento com múltiplas plantas, cada imagem rotulada com a
   metragem/planta correspondente, toggle "com suíte" / "sem suíte".
3. Seção "Sobre mim": história do corretor, vídeos de depoimento, redes sociais,
   Google Reviews, galeria de fotos.
4. Depoimentos em destaque (vídeo + texto) perto do topo da página.
5. Vídeo explicativo curto (ex: como funciona financiamento).
6. Identidade visual: paleta branco/azul/rosa/roxo Nubank + logo do corretor
   (ainda não fornecido).
7. Painel administrativo para o corretor cadastrar empreendimentos, subir
   imagens/dados (idealmente via planilha) e editar textos sem ajuda técnica.
   Depende de backend/storage — só faz sentido quando Supabase for conectado.
8. Botão de WhatsApp (deep link `wa.me`) genérico na home e específico por
   imóvel, com mensagem pré-preenchida citando o empreendimento/unidade.
9. Mapa (Google Maps) mostrando a localização de cada empreendimento.

Cada um desses vira uma spec própria quando for a vez de implementá-lo.

## Escopo desta spec: Fundação do projeto

Objetivo: ter um projeto Next.js rodando localmente, com a identidade visual
básica aplicada e versionado no GitHub, sem nenhuma feature de negócio ainda.
É a base sobre a qual cada pilar entra como fatia vertical fina.

### Stack

- Next.js (App Router) + TypeScript, `src/` directory.
- Tailwind CSS para estilos.
- ESLint (config padrão do `create-next-app`).
- Gerenciador de pacotes: npm (já disponível no ambiente).

### Paleta de cores (Tailwind theme tokens)

| Token          | Hex       | Uso                                  |
|----------------|-----------|---------------------------------------|
| `brand.white`  | `#FFFFFF` | Fundo                                  |
| `brand.blue`   | `#2563EB` | CTAs secundários, links, confiança     |
| `brand.pink`   | `#EC4899` | Destaques, seção de autoridade pessoal |
| `brand.purple` | `#8A05BE` | Cor primária da marca (roxo Nubank)    |

Neutros de texto usam a escala `slate` nativa do Tailwind — sem criar escala
própria.

### Tipografia

Uma família só: **Manrope**, via `next/font/google`, peso variável para título
e corpo. Fonte secundária só entra se um pilar futuro justificar.

### Estrutura de pastas

```
src/
  app/            layout.tsx, page.tsx, globals.css
  components/     (populada pelos pilares futuros)
  lib/            (populada pelos pilares futuros)
  types/          (populada pelos pilares futuros)
  data/           (populada pelos pilares futuros)
```

Pastas de feature (`components/`, `lib/`, `types/`, `data/`) só recebem
arquivo quando um pilar realmente precisar — nada de scaffolding vazio "para
mostrar estrutura".

### Layout base e home placeholder

- Header: wordmark "Sandro Higuti Consultor Imobiliário" (texto, já que o
  arquivo de logo ainda não foi entregue).
- Footer: informação de contato básica (placeholder).
- Home: página mínima que aplica a paleta e a tipografia para validar
  visualmente a fundação. Sem busca, sem cards de imóveis, sem WhatsApp —
  isso é o pilar seguinte.

### Repositório

- Criado no GitHub como `laddingpage-Sandro`, privado, via `gh repo create`.
- `git init` local, primeiro commit com a fundação, push para `main`.

### Fora de escopo (explícito)

- Qualquer feature de negócio listada nos pilares acima.
- Deploy (Vercel) e conexão com banco de dados (Supabase) — combinado
  explicitamente com o cliente para entrar depois.
- Logo real (arquivo ainda não fornecido).

### Critério de pronto

- `npm run build` passa sem erros.
- `npm run dev` sobe e a home renderiza com a paleta/tipografia aplicadas
  (verificado visualmente, não só pelo build).
- Repositório GitHub privado criado e com o primeiro commit publicado.
