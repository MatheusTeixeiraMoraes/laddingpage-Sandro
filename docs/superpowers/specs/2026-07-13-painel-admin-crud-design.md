# Painel Administrativo — CRUD de Empreendimentos

**Data:** 2026-07-13
**Status:** Aprovado — pronto para plano de implementação
**Depende de:** [Painel Admin — Auth + Schema + RLS](2026-07-11-painel-admin-auth-schema-design.md)

## Contexto

O painel hoje só faz login/logout e troca de senha (`/admin` é uma página de
confirmação). Para o Sandro ter autonomia — cadastrar empreendimentos, subir
fotos e corrigir os dados representativos semeados (preço, dorms, metragem,
entrega) — falta o CRUD.

As tabelas `empreendimentos` e `plantas` já existem com RLS: leitura pública,
**escrita só para quem tem a claim `app_metadata.role = 'admin'`**. Toda
escrita desta fatia passa por essa trava.

## Escopo

### 1. Supabase Storage (migration 0006)

Bucket `imoveis` para as fotos de capa dos empreendimentos:

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imoveis', 'imoveis', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
```

Policies em `storage.objects` espelhando as das tabelas:

- `select` para `anon, authenticated` quando `bucket_id = 'imoveis'` (leitura pública).
- `insert`/`update`/`delete` só para `authenticated` **com** `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'`.

Limite de 5 MB e apenas imagens — validação no próprio bucket, não só no
cliente.

### 2. Imagens: caminho relativo e URL absoluta convivem

Os 7 empreendimentos semeados usam caminho relativo (`/imoveis/laredo.jpg`,
arquivo em `public/`). Uploads novos geram URL absoluta do Supabase Storage.
O campo `empreendimentos.imagem` aceita os dois; `next.config.ts` ganha
`images.remotePatterns` para o domínio do projeto Supabase
(`snxcuwbtxffkongtrxsb.supabase.co`, caminho `/storage/v1/object/public/**`).

### 3. Helper de coordenadas

`src/lib/coordenadas.ts` — `parseCoordenadas(entrada: string): { latitude: number; longitude: number } | null`.

Aceita:
- Link do Google Maps com `@-23.4936,-47.4451,15z`
- Link com `?q=-23.4936,-47.4451`
- Par cru `-23.4936, -47.4451`

Retorna `null` quando não reconhece. Com testes (`node --test`), porque é
parsing com branching real.

### 4. Camada de escrita (`src/lib/admin/empreendimentos.ts`)

Funções client-side usando o browser client (`@/lib/supabase/client`) — a
sessão do admin viaja no cookie e o RLS valida a claim:

```ts
criarEmpreendimento(dados: EmpreendimentoInput): Promise<string>   // retorna id
atualizarEmpreendimento(id: string, dados: EmpreendimentoInput): Promise<void>
excluirEmpreendimento(id: string): Promise<void>                   // cascade apaga plantas
criarPlanta(empreendimentoId: string, dados: PlantaInput): Promise<void>
atualizarPlanta(id: string, dados: PlantaInput): Promise<void>
excluirPlanta(id: string): Promise<void>
uploadImagem(arquivo: File): Promise<string>                       // retorna URL pública
```

`EmpreendimentoInput`: nome, tipo, bairro, zona, imagem, entrega, latitude, longitude.
`PlantaInput`: metragem, comSuite, dormitorios, vagas, preco, fotos (string[]).

### 5. Páginas

**`/admin`** — painel: cabeçalho com "Novo empreendimento" + logout/trocar
senha; lista dos empreendimentos (miniatura da foto, nome, zona, nº de
plantas) com **Editar** e **Excluir** (confirmação antes de excluir; excluir
apaga as plantas junto).

**`/admin/empreendimentos/novo`** — formulário de criação. Campos: nome, tipo
(select), zona (select), bairro, entrega (texto livre, ex: "Dez/2026"),
localização (campo de link do Google Maps → extrai lat/lng, mostra a
coordenada reconhecida), foto (upload com preview). Salvar redireciona para a
edição do empreendimento criado (para já adicionar as plantas).

**`/admin/empreendimentos/[id]`** — edição: mesmo formulário preenchido +
**gerenciador de plantas** abaixo: lista as plantas existentes com editar e
excluir, e um formulário para adicionar (metragem, dormitórios, vagas, suíte
sim/não, preço, ambientes — texto separado por vírgula).

Todas em `/admin/*`, já protegidas pelo `src/proxy.ts`.

### 6. Feedback e erros

Cada ação mostra estado de carregando e erro legível (ex: "Não foi possível
salvar. Tente novamente."). Erro de RLS/permissão não vaza detalhe técnico
para a tela.

## Fora de escopo (explícito)

- Importação por planilha (briefing original) — fatia própria depois.
- Galeria com várias fotos por empreendimento (hoje é 1 foto de capa) e fotos
  reais por planta (hoje `fotos` são rótulos de ambiente).
- Edição do conteúdo da página `/sobre` pelo painel.
- Redimensionar a imagem no navegador antes do upload (o bucket limita a 5 MB
  e o `next/image` otimiza na entrega).

## Critério de pronto

- Migration 0006 aplicada (bucket + policies).
- `npm run build`, `npm run lint` e `npm test` passam (incluindo os testes de
  `parseCoordenadas`).
- Verificação end-to-end **logado como admin**: criar um empreendimento com
  foto, ver ele aparecer na home; adicionar/editar/excluir uma planta; editar
  o empreendimento; excluir o empreendimento e confirmar que sumiu da home.
- Verificação de segurança: usuário **não** admin (ou anônimo) não consegue
  escrever nas tabelas nem no bucket.
