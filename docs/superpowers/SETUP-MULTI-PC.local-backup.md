# Setup e sincronia entre computadores

Guia único pra configurar um computador novo do zero e manter os dois (ou mais)
em sincronia. Repositórios envolvidos:

- **Projeto:** https://github.com/MatheusTeixeiraMoraes/laddingpage-Sandro
- **Config global do Claude Code (skills/CLAUDE.md pessoais, sem segredo):**
  https://github.com/MatheusTeixeiraMoraes/claude-dotfiles (privado)

## Setup de um computador novo (primeira vez)

Pré-requisitos — instalar só o que faltar, reabrindo o terminal depois de
cada instalação (o PATH só atualiza numa sessão nova):

- Git → `winget install --id Git.Git -e --source winget`
- Node.js LTS → `winget install --id OpenJS.NodeJS.LTS -e --source winget`

Projeto:

```powershell
git clone https://github.com/MatheusTeixeiraMoraes/laddingpage-Sandro.git
cd laddingpage-Sandro
npx vercel login
npx vercel link
npx vercel env pull .env.local
npm install
npm run dev   # valida em http://localhost:3000 antes de seguir
```

Config global do Claude (pra `/catchup`, `/levantamento` etc. existirem):

```powershell
git clone https://github.com/MatheusTeixeiraMoraes/claude-dotfiles.git
cd claude-dotfiles
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\commands" | Out-Null
Copy-Item CLAUDE.md "$env:USERPROFILE\.claude\CLAUDE.md" -Force
Copy-Item commands\*.md "$env:USERPROFILE\.claude\commands\" -Force
```

Reabrir o Claude Code no projeto e rodar `/catchup` pra carregar o contexto
atual (lê commits + este diretório `docs/superpowers/`).

## Rotina de sincronia (toda sessão, em qualquer computador)

- **Antes de começar:** `git pull` no projeto.
- **Ao terminar:** `git add -A && git commit -m "..." && git push`, mesmo
  que seja trabalho parcial.
- **Decisão de arquitetura que só ficou na conversa** → registrar em
  [PENDENCIAS.md](PENDENCIAS.md) (ou no código) antes de fechar a sessão. O
  que não vira arquivo não atravessa pro outro computador.
- **Skill global nova ou editada** (arquivo em `~/.claude/commands/` ou o
  `~/.claude/CLAUDE.md`) → copiar pra pasta `claude-dotfiles`, commitar e dar
  push, senão ela fica presa só naquela máquina.
- **Env var nova no Supabase/Vercel** → rodar `npx vercel env pull .env.local`
  de novo em cada computador.
- Nunca editar nos dois computadores ao mesmo tempo sem `git pull` antes —
  evita conflito de merge.

## O que nunca sincroniza (por design)

- `.env*` (exceto `.env.example`) — segredo, fica só local, puxado do Vercel.
- `~/.claude/.credentials.json`, `settings.json`, `settings.local.json`,
  `~/.claude/projects/` — config/sessão local da máquina, nunca vai pro git.
- Esta conversa/chat em si — o que não virar arquivo (código, doc, commit)
  não existe pro próximo computador.
