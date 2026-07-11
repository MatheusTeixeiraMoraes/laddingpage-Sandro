# Sobre Mim / Autoridade Pessoal

**Data:** 2026-07-11
**Status:** Aprovado — pronto para plano de implementação
**Depende de:** [Fundação do projeto](2026-07-11-fundacao-projeto-design.md)

## Contexto

Quarto pilar do backlog da landing page do Sandro Higuti. O pedido original
prioriza credibilidade e autoridade pessoal do corretor, não só listar
imóveis. Este pilar entrega a seção "Sobre mim": história do corretor,
vídeos de depoimento, avaliações do Google, galeria de fotos e redes
sociais — como uma página própria (`/sobre`), pra não sobrecarregar a home
que já tem busca/filtros/listagem.

Nenhum conteúdo real (texto de bio, fotos, vídeos, links de redes sociais)
foi fornecido ainda — tudo entra como placeholder claramente isolado
(constantes em arquivos de dados), fácil de substituir depois sem tocar em
lógica de componente.

## Escopo

### 1. Rota `/sobre`

`src/app/sobre/page.tsx` — server component, sem estado/interatividade
(nenhuma seção desta página precisa de client component). Header ganha
navegação: link "Início" (`/`) e "Sobre" (`/sobre`).

### 2. Bio (`SobreBio`)

Foto placeholder (bloco colorido, sem imagem real) + texto de bio. O texto
vem de uma constante isolada em `src/data/sobre.ts`, fácil de encontrar e
trocar sem mexer no componente.

### 3. Galeria de fotos (`GaleriaFotos`)

Grade de blocos placeholder legendados — mesmo padrão visual já usado na
galeria de plantas do pilar de empreendimentos (bloco colorido + legenda),
representando fotos do corretor com clientes e imóveis entregues. Legendas
mock em `src/data/sobre.ts`.

### 4. Depoimentos em vídeo (`DepoimentosVideo`)

Cards com um placeholder de vídeo (bloco com ícone de play — sem player
real, sem URL de vídeo) ao lado do nome do cliente e um texto curto de
depoimento. Dados mock (nome, texto) em `src/data/sobre.ts`.

### 5. Avaliações do Google (`GoogleReviews`)

Cards de avaliação mock: autor, nota (1–5, exibida como estrelas ★/☆ via
caractere Unicode, sem ícone de terceiros) e texto. Modelo de dados isolado
(`src/types/googleReview.ts` + `src/data/googleReviews.ts`) pensado pra ser
o mesmo formato que a integração real da Google Places API preencheria
depois — troca de fonte de dado, não de componente.

```ts
export type GoogleReview = {
  id: string;
  autor: string;
  nota: number; // 1-5
  texto: string;
};
```

4 avaliações mock.

### 6. Redes sociais (`RedesSociais`)

Ícones (Instagram, Facebook, YouTube, LinkedIn) com `href="#"` placeholder,
SVG inline (sem dependência de ícone de terceiros). Lista de rede/link em
`src/data/sobre.ts`, fácil de trocar o `href` depois.

## Fora de escopo (explícito)

- Texto de bio, fotos, vídeos e links de redes sociais reais.
- Integração real com a Google Places API (precisa de API key + Place ID do
  negócio — combinado que fica pra quando o cliente tiver isso disponível).
- O pilar separado "Depoimentos em destaque" (posição de topo na home) —
  este pilar entrega só a página `/sobre`.
- Qualquer teste automatizado: esta fatia é conteúdo estático sem lógica
  condicional não-trivial (sem filtro/cálculo como nos pilares anteriores).

## Critério de pronto

- `npm run build` e `npm run lint` passam sem erro.
- Verificação visual (Playwright): link "Sobre" no header navega para
  `/sobre`; todas as 5 seções renderizam (bio, galeria, depoimentos em
  vídeo, Google Reviews com estrelas, redes sociais); link "Início" volta
  pra home.
