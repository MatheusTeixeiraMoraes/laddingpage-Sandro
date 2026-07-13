# Setup multi-PC — sincronizar duas máquinas neste projeto

Guia pra configurar uma máquina nova (ou recuperar uma existente) e manter
o trabalho em sincronia com a outra máquina via git. Sem isso, as duas
divergem em silêncio e o segundo push vira conflito.

## 1. Pré-requisitos

- Node.js 20+ (o `@types/node` está fixado em `^20`; qualquer LTS mais
  recente funciona).
- npm (vem junto com o Node).
- Git configurado com a identidade do autor — mesma nas duas máquinas, pra
  não poluir o histórico com autores diferentes pro mesmo dev:

  ```bash
  git config --global user.name "MatheusTeixeiraMoraes"
  git config --global user.email "matheusteixeiramoraes2019@gmail.com"
  ```

## 2. Clonar e instalar

```bash
git clone https://github.com/MatheusTeixeiraMoraes/laddingpage-Sandro.git
cd laddingpage-Sandro
npm install
```

`node_modules/` nunca é versionado (está no `.gitignore`) — cada máquina
instala a própria cópia. Depois de puxar mudanças que mexeram em
`package.json`/`package-lock.json`, rode `npm install` de novo.

## 3. Variáveis de ambiente (`.env.local`)

`.env.local` **nunca é commitado** (está no `.gitignore`, só `.env.example`
é versionado) — cada máquina mantém o próprio arquivo, com os mesmos
valores reais.

```bash
cp .env.example .env.local
```

Preencher em `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` — painel
  Supabase → Project Settings → API, do mesmo projeto usado na outra
  máquina.
- `SUPABASE_SERVICE_ROLE_KEY` — só preencher quando for mexer no painel
  administrativo; nunca usar em código que roda no navegador, nunca
  commitar valor real.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — ainda não usada (ver
  `docs/superpowers/PENDENCIAS.md`); deixar em branco por enquanto.

Não existe sincronia automática desse arquivo via git — copie os valores
manualmente da outra máquina ou direto do painel de cada serviço.

## 4. Fluxo do dia a dia (evitar as duas máquinas divergirem)

- **Antes de começar a trabalhar em qualquer máquina:** `git pull`.
- **Antes de trocar de máquina:** garanta que tudo relevante está
  commitado e *pushado* — nada de deixar mudança só local numa ponta.
- **Um assunto = uma sessão/branch** (ver `CLAUDE.md` global) — evita
  puxar trabalho pela metade de uma máquina pra outra no meio de uma
  feature.
- Se `git pull` trouxer conflito, resolva antes de continuar. Nunca usar
  `git push --force` pra empurrar por cima do que a outra máquina mandou.

## 5. Verificar que a máquina está pronta

```bash
npm run dev
```

Abrir http://localhost:3000 — a home deve carregar. Erro de env var
faltando só aparece quando algo efetivamente chamar o client do Supabase
(`src/lib/supabase/client.ts` ou `server.ts`); se acontecer, revisar o
passo 3.

## 6. O que NUNCA sincroniza via git (é por máquina)

- `node_modules/`
- `.next/`
- `.env.local` (e qualquer `.env*`, exceto `.env.example`)
- Variáveis de ambiente do Vercel (produção) — configuram-se no dashboard
  do Vercel, não neste arquivo (ver `docs/superpowers/PENDENCIAS.md`).
