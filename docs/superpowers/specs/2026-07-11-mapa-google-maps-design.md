# Mapa do Google Maps

**Data:** 2026-07-11
**Status:** Aprovado — pronto para plano de implementação
**Depende de:** [Empreendimentos + Plantas](2026-07-11-empreendimentos-plantas-design.md)

## Contexto

Quinto pilar do backlog: mostrar a localização de cada empreendimento na
página de detalhe. Sem endereço real de nenhum empreendimento ainda (só
bairro), e sem API key do Google configurada — a solução usa coordenadas
mock e o embed clássico do Google Maps, que não exige chave nem custo,
deixando o projeto pronto para trocar por dado real e, futuramente, pela
API JavaScript oficial.

## Escopo

### 1. Coordenadas no modelo de dados

`latitude`/`longitude` entram em `Empreendimento` (nível do prédio, não da
planta — a localização não muda entre unidades do mesmo empreendimento).

`src/types/empreendimento.ts` ganha:

```ts
export type Empreendimento = {
  id: string;
  nome: string;
  tipo: TipoEmpreendimento;
  bairro: string;
  latitude: number;
  longitude: number;
  plantas: Planta[];
};
```

`src/data/empreendimentos.ts` ganha `latitude`/`longitude` mock em cada um
dos 5 empreendimentos (valores plausíveis, não endereços reais).

### 2. Componente `MapaEmpreendimento`

Recebe `{ latitude, longitude, nome }`. Renderiza:

- Um `<iframe>` com `src="https://www.google.com/maps?q={lat},{lng}&output=embed"` — sem API key, sem custo.
- Um link abaixo, "Abrir no Google Maps", para `https://www.google.com/maps?q={lat},{lng}` (`target="_blank"`), pro lead abrir a rota no app/site do Google.

Componente isolado: trocar esse embed pela Google Maps JavaScript API no
futuro é mudar só este arquivo, sem tocar no resto da página.

### 3. Posição na página

`src/app/empreendimentos/[id]/page.tsx` ganha a seção do mapa depois de
`EmpreendimentoDetalhe` (specs/plantas/WhatsApp continuam em primeiro
lugar; localização é contexto complementar).

### 4. Ambiente preparado para a API key futura

Criar `.env.example` na raiz do projeto (arquivo de exemplo, sem segredo
real) documentando:

```
# Nao usada ainda -- o mapa atual usa o embed sem API key.
# Preencher quando a API JavaScript do Google Maps entrar (ver PENDENCIAS.md).
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### 5. Lista de pendências consolidada (`docs/superpowers/PENDENCIAS.md`)

Novo arquivo, fora da pasta `specs`/`plans` (é uma lista viva, não uma spec
fechada), consolidando tudo que depende de algo externo ao projeto antes de
ir para produção:

- Conteúdo real: bio, fotos, vídeos de depoimento, links de redes sociais
  (pilar "Sobre mim"), endereços/coordenadas reais dos empreendimentos
  (este pilar), logo do corretor (fundação).
- Google Places API (avaliações reais — pilar "Sobre mim").
- Google Maps JavaScript API (upgrade do embed atual — este pilar).
- Painel administrativo (depende de Supabase, combinado que entra depois).
- Deploy (Vercel), combinado que entra depois.

Cada pilar futuro que gerar uma pendência externa deve atualizar este
arquivo, pra nada ficar esquecido antes do lançamento.

## Fora de escopo (explícito)

- Google Maps JavaScript API real (fica documentada como pendência).
- Endereços/coordenadas reais — mock por enquanto.
- Marcador customizado, múltiplos pins num mapa só, ou mapa na home (só a
  página de detalhe do empreendimento, um mapa por empreendimento).

## Critério de pronto

- `npm run build` e `npm run lint` passam sem erro.
- Verificação visual (Playwright): a página de cada empreendimento mostra o
  mapa embutido centralizado nas coordenadas certas, e o link "Abrir no
  Google Maps" aponta para a URL esperada.
- `docs/superpowers/PENDENCIAS.md` existe e lista os itens acima.
