# Fundação do Projeto — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ter um projeto Next.js rodando localmente com a identidade visual básica (paleta + fonte) aplicada numa home placeholder, versionado num repositório GitHub privado — sem nenhuma feature de negócio.

**Architecture:** `create-next-app` gera o esqueleto (App Router, TypeScript, Tailwind v4, ESLint, `src/`). Em seguida, sobrescrevemos os tokens de tema em `globals.css`, trocamos a fonte padrão (Geist) por Manrope em `layout.tsx`, e adicionamos `Header`/`Footer` + uma home placeholder que aplica a paleta. Por fim, publicamos no GitHub.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (config via `@theme` em CSS, sem `tailwind.config.ts`), ESLint (`eslint-config-next`), npm.

## Global Constraints

- Stack: Next.js (App Router) + TypeScript + Tailwind CSS + ESLint, `src/` directory, import alias `@/*`.
- Paleta exata (hex): `brand-white` `#FFFFFF`, `brand-blue` `#2563EB`, `brand-pink` `#EC4899`, `brand-purple` `#8A05BE`.
- Tipografia: uma única família, **Manrope** (via `next/font/google`).
- Nenhuma feature de negócio nesta fase (sem busca, sem cards de imóvel, sem WhatsApp, sem mapa, sem admin).
- Sem integração com Vercel ou Supabase nesta fase.
- Repositório GitHub: `laddingpage-Sandro`, **privado**, criado via `gh` CLI.
- Logo real ainda não fornecido — header usa wordmark em texto: "Sandro Higuti Consultor Imobiliário".

---

### Task 1: Scaffold do projeto Next.js

**Files:**
- Create: todo o esqueleto gerado por `create-next-app` (`package.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `public/*`, `AGENTS.md`, `CLAUDE.md`, `README.md`)

**Interfaces:**
- Produces: projeto Next.js buildável em `src/app/` que a Task 2 vai modificar (`layout.tsx`, `page.tsx`, `globals.css`).

- [ ] **Step 1: Rodar o scaffold (diretório já tem `.git` e `docs/`, o que é seguro — `create-next-app` ignora esses arquivos)**

Run:
```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git --yes
```
Expected: termina com `Success! Created ...` e `Skipping git initialization.` (não reinicializa o `.git` existente).

- [ ] **Step 2: Confirmar que o build do scaffold vanilla funciona**

Run: `npm run build`
Expected: build finaliza com `✓ Compiled successfully` e sem erros de tipo/lint.

- [ ] **Step 3: Commit do scaffold vanilla**

```bash
git add -A
git commit -m "chore: scaffold do projeto Next.js via create-next-app"
```

---

### Task 2: Identidade visual — paleta, fonte, header, footer e home placeholder

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Delete: `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, `public/window.svg` (só eram usados pela home padrão do `create-next-app`, que está sendo substituída)

**Interfaces:**
- Consumes: nenhuma (primeira camada de UI).
- Produces: `Header` e `Footer` exportados como named exports (`export function Header()`, `export function Footer()`), usados por `src/app/layout.tsx`. Tokens de cor Tailwind `bg-brand-purple`, `text-brand-purple`, `bg-brand-blue`, `text-brand-pink`, etc., disponíveis para qualquer componente futuro via `@theme` em `globals.css`.

- [ ] **Step 1: Remover os SVGs padrão não usados**

Run:
```bash
rm public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

- [ ] **Step 2: Definir os tokens de marca em `globals.css`**

Substituir todo o conteúdo de `src/app/globals.css` por:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand-white: #ffffff;
  --color-brand-blue: #2563eb;
  --color-brand-pink: #ec4899;
  --color-brand-purple: #8a05be;
  --font-sans: var(--font-manrope);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}
```

- [ ] **Step 3: Trocar a fonte para Manrope e montar o layout base em `layout.tsx`**

Substituir todo o conteúdo de `src/app/layout.tsx` por:

```tsx
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sandro Higuti | Consultor Imobiliário",
  description: "Encontre o imóvel ideal com a consultoria de Sandro Higuti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Criar `src/components/Header.tsx`**

```tsx
export function Header() {
  return (
    <header className="border-b border-slate-100 bg-brand-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-brand-purple">
          Sandro Higuti{" "}
          <span className="font-medium text-slate-700">
            Consultor Imobiliário
          </span>
        </span>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Criar `src/components/Footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-slate-600">
        <p>Sandro Higuti Consultor Imobiliário</p>
        <p className="mt-1">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Substituir a home padrão por um placeholder que aplica a paleta**

Substituir todo o conteúdo de `src/app/page.tsx` por:

```tsx
export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-24 text-center">
      <span className="rounded-full bg-brand-pink/10 px-4 py-1 text-sm font-medium text-brand-pink">
        Em construção
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-brand-purple sm:text-5xl">
        Sandro Higuti Consultor Imobiliário
      </h1>
      <p className="max-w-xl text-lg text-slate-600">
        Encontre o imóvel ideal com a consultoria de quem conhece o mercado.
        Esta página está sendo construída — em breve, busca de imóveis,
        plantas, depoimentos e muito mais.
      </p>
    </div>
  );
}
```

- [ ] **Step 7: Build e lint**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro (build compila, lint sem warnings/erros).

- [ ] **Step 8: Verificação visual (fluxo real, não só build)**

Run em background: `npm run dev` (porta 3000)
Depois, usar a ferramenta de browser (Playwright MCP) para:
1. Navegar para `http://localhost:3000`
2. Tirar um snapshot/screenshot da página

Expected: título "Sandro Higuti Consultor Imobiliário" em roxo (`#8A05BE`), badge "Em construção" em rosa, fundo branco, fonte Manrope aplicada — header e footer visíveis. Parar o servidor dev depois de verificar.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: aplica paleta de marca, fonte Manrope e home placeholder"
```

---

### Task 3: Documentação final e publicação no GitHub

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: nada de código (task de fechamento).
- Produces: repositório `laddingpage-Sandro` publicado no GitHub, remote `origin` configurado.

- [ ] **Step 1: Escrever um `README.md` específico do projeto**

Substituir todo o conteúdo de `README.md` por:

```markdown
# Sandro Higuti — Consultor Imobiliário

Landing page do corretor Sandro Higuti: apresentação de empreendimentos,
autoridade pessoal e captação de leads via WhatsApp.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4

## Paleta de marca

| Token          | Hex       |
|----------------|-----------|
| `brand-white`  | `#FFFFFF` |
| `brand-blue`   | `#2563EB` |
| `brand-pink`   | `#EC4899` |
| `brand-purple` | `#8A05BE` |

Tipografia: **Manrope**.

## Rodando localmente

\`\`\`bash
npm install
npm run dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000).

## Estado do projeto

Fundação do projeto. Features de negócio (busca/filtros, plantas de
empreendimentos, autoridade pessoal, depoimentos, painel administrativo,
WhatsApp, mapa) entram em specs e planos futuros — ver `docs/superpowers/`.
```

- [ ] **Step 2: Commit da documentação**

```bash
git add README.md
git commit -m "docs: atualiza README com informações do projeto"
```

- [ ] **Step 3: Renomear branch para `main`**

Run: `git branch -M main`

- [ ] **Step 4: Criar o repositório privado no GitHub e publicar**

Run:
```bash
gh repo create laddingpage-Sandro --private --source=. --remote=origin --push
```
Expected: repositório criado em `https://github.com/<usuário>/laddingpage-Sandro`, branch `main` publicada, `git remote -v` mostra `origin`.

- [ ] **Step 5: Confirmar publicação**

Run: `git log --oneline -5 && git status`
Expected: `status` mostra `working tree clean` e branch `main` sincronizada com `origin/main`.
