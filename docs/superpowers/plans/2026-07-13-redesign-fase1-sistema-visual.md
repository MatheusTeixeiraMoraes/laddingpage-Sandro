# Redesign — Fase 1: Sistema Visual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar a paleta roxo Nubank+azul e a fonte Manrope pela paleta navy+rosa e Poppins+Inter+Caveat em todos os 21 arquivos que hoje usam os tokens antigos, sem mudar estrutura/layout/conteúdo de nenhuma página.

**Architecture:** Dois arquivos-base (`globals.css` para os tokens de cor via `@theme`, `layout.tsx` para as fontes via `next/font/google`) definem o novo sistema; os outros 19 arquivos trocam classes Tailwind (`text-brand-purple` → `text-brand-navy` ou `text-brand-pink`, `bg-brand-blue` → `bg-brand-pink`, etc.) seguindo uma tabela de mapeamento fixa, sem lógica nova.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 (`@theme` tokens) + `next/font/google` (Poppins, Inter, Caveat).

## Global Constraints

- Tokens novos: `brand-navy` `#151527`, `brand-pink` `#EC4899` (sem mudança de valor), `brand-blush` `#FCE7F3`, `brand-white` `#FFFFFF` (sem mudança). `brand-blue` e `brand-purple` são removidos por completo.
- Fontes novas: Poppins (pesos 600/800, títulos e botões via classe `font-heading`), Inter (padrão do site via `font-sans`), Caveat (peso 600, carregada mas não aplicada nesta fase — reservada pra fase de hero).
- **Tabela de mapeamento de classes** (aplicar exatamente, sem interpretar caso a caso):
  - `text-brand-purple` em heading (`h1`/`h2`) ou wordmark → `text-brand-navy` **+ adicionar `font-heading`** na mesma className
  - `hover:text-brand-purple` (links de navegação) → `hover:text-brand-pink`
  - `bg-brand-purple ... text-white` (botão de ação) → `bg-brand-pink` **+ trocar `hover:bg-purple-700` por `hover:bg-pink-700`**
  - `bg-brand-purple/10 ... text-brand-purple` (badge/placeholder com fundo suave) → `bg-brand-blush text-brand-pink`
  - `text-brand-blue` (preço, link secundário) → `text-brand-pink`
  - `bg-brand-blue ... hover:bg-blue-700` (botão secundário) → `bg-brand-pink hover:bg-pink-700`
  - `text-brand-pink` já correto (estrelas do Google Reviews) → **não muda**
- Nenhuma mudança de texto, estrutura JSX, lógica ou nome de função — só `className`.

---

### Task 1: Fundação — tokens de cor e fontes

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: utilitários Tailwind `bg-brand-navy`/`text-brand-navy`, `bg-brand-pink`/`text-brand-pink`, `bg-brand-blush`/`text-brand-blush`, `font-heading`, `font-script` — consumidos pelas Tasks 2–4.

- [ ] **Step 1: Atualizar `src/app/globals.css`**

Substituir todo o conteúdo por:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #151527;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand-white: #ffffff;
  --color-brand-navy: #151527;
  --color-brand-pink: #ec4899;
  --color-brand-blush: #fce7f3;
  --font-sans: var(--font-inter);
  --font-heading: var(--font-poppins);
  --font-script: var(--font-caveat);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}
```

- [ ] **Step 2: Atualizar `src/app/layout.tsx`**

Substituir todo o conteúdo por:

```tsx
import type { Metadata } from "next";
import { Poppins, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
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
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build falha nos outros componentes (ainda referenciam `brand-purple`/`brand-blue`, que não existem mais) — **isso é esperado nesta task**. Confirmar especificamente que o erro é sobre classe/token ausente, não sobre sintaxe de `globals.css`/`layout.tsx`. Se preferir confirmar isolado, rodar `npx tsc --noEmit` (não valida classes Tailwind, só tipos) que deve passar limpo.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: adiciona tokens navy/rosa e fontes Poppins/Inter/Caveat"
```

---

### Task 2: Núcleo público — header, home, busca, empreendimentos

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/SearchBar.tsx`
- Modify: `src/components/FiltersModal.tsx`
- Modify: `src/components/EmpreendimentoCard.tsx`
- Modify: `src/components/PlantaSelector.tsx`
- Modify: `src/components/EmpreendimentoDetalhe.tsx`
- Modify: `src/components/MapaEmpreendimento.tsx`
- Modify: `src/app/empreendimentos/[id]/page.tsx`

**Interfaces:** nenhuma mudança de props/tipos — só `className`.

- [ ] **Step 1: `src/components/Header.tsx`**

```diff
-        <Link href="/" className="text-lg font-bold text-brand-purple">
+        <Link href="/" className="font-heading text-lg font-bold text-brand-navy">
           Sandro Higuti{" "}
-          <span className="font-medium text-slate-700">
+          <span className="font-sans font-medium text-slate-700">
             Consultor Imobiliário
           </span>
         </Link>
         <nav className="flex gap-6 text-sm font-medium text-slate-600">
-          <Link href="/" className="hover:text-brand-purple">
+          <Link href="/" className="hover:text-brand-pink">
             Início
           </Link>
-          <Link href="/sobre" className="hover:text-brand-purple">
+          <Link href="/sobre" className="hover:text-brand-pink">
             Sobre
           </Link>
```

- [ ] **Step 2: `src/app/page.tsx`**

```diff
-      <h1 className="text-4xl font-bold tracking-tight text-brand-purple sm:text-5xl">
+      <h1 className="font-heading text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
         Sandro Higuti Consultor Imobiliário
       </h1>
       ...
-        className="rounded-full bg-brand-blue px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
+        className="rounded-full bg-brand-pink px-6 py-3 font-medium text-white transition-colors hover:bg-pink-700"
```

- [ ] **Step 3: `src/components/SearchBar.tsx`**

```diff
-        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-white transition-colors hover:bg-purple-700"
+        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-pink text-white transition-colors hover:bg-pink-700"
```

- [ ] **Step 4: `src/components/FiltersModal.tsx`**

```diff
-          <h2 className="text-lg font-bold text-brand-purple">Filtros</h2>
+          <h2 className="font-heading text-lg font-bold text-brand-navy">Filtros</h2>
```
```diff
-              className="rounded-full bg-brand-blue px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
+              className="rounded-full bg-brand-pink px-5 py-2 text-sm font-medium text-white hover:bg-pink-700"
```

- [ ] **Step 5: `src/components/EmpreendimentoCard.tsx`**

```diff
-        <div className="flex h-36 items-center justify-center bg-brand-purple/10 text-sm font-medium text-brand-purple">
+        <div className="flex h-36 items-center justify-center bg-brand-blush text-sm font-medium text-brand-pink">
```
```diff
-          <p className="text-lg font-bold text-brand-blue">
+          <p className="text-lg font-bold text-brand-pink">
```
```diff
-          className="block rounded-full bg-brand-purple px-4 py-2 text-center text-sm font-medium text-white hover:bg-purple-700"
+          className="block rounded-full bg-brand-pink px-4 py-2 text-center text-sm font-medium text-white hover:bg-pink-700"
```

- [ ] **Step 6: `src/components/PlantaSelector.tsx`**

```diff
             planta.id === selecionadaId
-              ? "rounded-full bg-brand-purple px-4 py-2 text-sm font-medium text-white"
+              ? "rounded-full bg-brand-pink px-4 py-2 text-sm font-medium text-white"
```

- [ ] **Step 7: `src/components/EmpreendimentoDetalhe.tsx`**

```diff
-            className="flex h-32 items-center justify-center rounded-xl bg-brand-purple/10 p-2 text-center text-xs font-medium text-brand-purple"
+            className="flex h-32 items-center justify-center rounded-xl bg-brand-blush p-2 text-center text-xs font-medium text-brand-pink"
```
```diff
-        <p className="text-2xl font-bold text-brand-blue">
+        <p className="text-2xl font-bold text-brand-pink">
```
```diff
-        className="rounded-full bg-brand-purple px-6 py-3 font-medium text-white hover:bg-purple-700"
+        className="rounded-full bg-brand-pink px-6 py-3 font-medium text-white hover:bg-pink-700"
```

- [ ] **Step 8: `src/components/MapaEmpreendimento.tsx`**

```diff
-      <h2 className="text-2xl font-bold text-brand-purple">Localização</h2>
+      <h2 className="font-heading text-2xl font-bold text-brand-navy">Localização</h2>
```
```diff
-        className="text-sm font-medium text-brand-blue hover:underline"
+        className="text-sm font-medium text-brand-pink hover:underline"
```

- [ ] **Step 9: `src/app/empreendimentos/[id]/page.tsx`**

```diff
-      <h1 className="text-3xl font-bold tracking-tight text-brand-purple sm:text-4xl">
+      <h1 className="font-heading text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
```

- [ ] **Step 10: Build e lint**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro (arquivos de `/sobre` e `/admin` ainda quebram — seguem pras próximas tasks).

- [ ] **Step 11: Commit**

```bash
git add src/components/Header.tsx src/app/page.tsx src/components/SearchBar.tsx src/components/FiltersModal.tsx src/components/EmpreendimentoCard.tsx src/components/PlantaSelector.tsx src/components/EmpreendimentoDetalhe.tsx src/components/MapaEmpreendimento.tsx "src/app/empreendimentos/[id]/page.tsx"
git commit -m "feat: aplica paleta navy/rosa no header, home e paginas de empreendimento"
```

---

### Task 3: Seção Sobre

**Files:**
- Modify: `src/components/SobreBio.tsx`
- Modify: `src/components/GaleriaFotos.tsx`
- Modify: `src/components/DepoimentosVideo.tsx`
- Modify: `src/components/GoogleReviews.tsx`
- Modify: `src/components/RedesSociais.tsx`

**Interfaces:** nenhuma mudança de props/tipos — só `className`.

- [ ] **Step 1: `src/components/SobreBio.tsx`**

```diff
-      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-brand-purple/10 text-sm font-medium text-brand-purple">
+      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-brand-blush text-sm font-medium text-brand-pink">
         Foto do Sandro
       </div>
-      <h2 className="text-2xl font-bold text-brand-purple">Sobre o Sandro Higuti</h2>
+      <h2 className="font-heading text-2xl font-bold text-brand-navy">Sobre o Sandro Higuti</h2>
```

- [ ] **Step 2: `src/components/GaleriaFotos.tsx`**

```diff
-      <h2 className="text-2xl font-bold text-brand-purple">Galeria</h2>
+      <h2 className="font-heading text-2xl font-bold text-brand-navy">Galeria</h2>
```
```diff
-            className="flex h-32 items-center justify-center rounded-xl bg-brand-purple/10 p-2 text-center text-xs font-medium text-brand-purple"
+            className="flex h-32 items-center justify-center rounded-xl bg-brand-blush p-2 text-center text-xs font-medium text-brand-pink"
```

- [ ] **Step 3: `src/components/DepoimentosVideo.tsx`**

```diff
-      <h2 className="text-2xl font-bold text-brand-purple">Depoimentos em vídeo</h2>
+      <h2 className="font-heading text-2xl font-bold text-brand-navy">Depoimentos em vídeo</h2>
```
```diff
-            <div className="flex h-40 items-center justify-center bg-brand-purple/10 text-3xl text-brand-purple">
+            <div className="flex h-40 items-center justify-center bg-brand-blush text-3xl text-brand-pink">
```

- [ ] **Step 4: `src/components/GoogleReviews.tsx`**

```diff
-      <h2 className="text-2xl font-bold text-brand-purple">Avaliações no Google</h2>
+      <h2 className="font-heading text-2xl font-bold text-brand-navy">Avaliações no Google</h2>
```

Linha `<p className="text-brand-pink">{estrelas(review.nota)}</p>` **não muda** — já usa o token certo.

- [ ] **Step 5: `src/components/RedesSociais.tsx`**

```diff
-      <h2 className="text-2xl font-bold text-brand-purple">Redes sociais</h2>
+      <h2 className="font-heading text-2xl font-bold text-brand-navy">Redes sociais</h2>
```

- [ ] **Step 6: Build e lint**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro (arquivos de `/admin` ainda quebram — Task 4).

- [ ] **Step 7: Commit**

```bash
git add src/components/SobreBio.tsx src/components/GaleriaFotos.tsx src/components/DepoimentosVideo.tsx src/components/GoogleReviews.tsx src/components/RedesSociais.tsx
git commit -m "feat: aplica paleta navy/rosa na secao sobre"
```

---

### Task 4: Painel administrativo

**Files:**
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/login/page.tsx`
- Modify: `src/app/admin/atualizar-senha/page.tsx`
- Modify: `src/components/admin/LoginForm.tsx`
- Modify: `src/components/admin/UpdatePasswordForm.tsx`

**Interfaces:** nenhuma mudança de props/tipos — só `className`.

- [ ] **Step 1: `src/app/admin/page.tsx`**

```diff
-      <h1 className="text-2xl font-bold text-brand-purple">Você está logado</h1>
+      <h1 className="font-heading text-2xl font-bold text-brand-navy">Você está logado</h1>
       ...
-        className="text-sm font-medium text-brand-blue hover:underline"
+        className="text-sm font-medium text-brand-pink hover:underline"
```

- [ ] **Step 2: `src/app/admin/login/page.tsx`**

```diff
-      <h1 className="text-2xl font-bold text-brand-purple">Painel administrativo</h1>
+      <h1 className="font-heading text-2xl font-bold text-brand-navy">Painel administrativo</h1>
```

- [ ] **Step 3: `src/app/admin/atualizar-senha/page.tsx`**

```diff
-      <h1 className="text-2xl font-bold text-brand-purple">Definir nova senha</h1>
+      <h1 className="font-heading text-2xl font-bold text-brand-navy">Definir nova senha</h1>
```

- [ ] **Step 4: `src/components/admin/LoginForm.tsx`**

```diff
-        className="rounded-full bg-brand-purple px-5 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
+        className="rounded-full bg-brand-pink px-5 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
```

- [ ] **Step 5: `src/components/admin/UpdatePasswordForm.tsx`**

```diff
-        className="rounded-full bg-brand-purple px-5 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
+        className="rounded-full bg-brand-pink px-5 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
```

- [ ] **Step 6: Build e lint**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin src/components/admin
git commit -m "feat: aplica paleta navy/rosa no painel administrativo"
```

---

### Task 5: Verificação final e push

**Files:** nenhum (só verificação).

- [ ] **Step 1: Grep de tokens antigos**

Run: `grep -rn "brand-purple\|brand-blue\|Manrope" src/`
Expected: nenhum resultado.

- [ ] **Step 2: Build e lint completos**

Run: `npm run build && npm run lint`
Expected: ambos passam sem erro.

- [ ] **Step 3: Verificação visual (Playwright)**

Subir `npm run dev` em background e, via Playwright MCP:
1. Navegar para `http://localhost:3000` — confirmar heading em navy, botão de WhatsApp em rosa, ícone de filtro em rosa, cards com badge rosa-claro
2. Abrir o modal de filtros — confirmar título navy, botão "Aplicar filtros" rosa
3. Navegar para um empreendimento — confirmar título navy, abas de planta em rosa quando selecionadas, galeria com fundo rosa-claro, preço em rosa, mapa com título navy e link rosa
4. Navegar para `/sobre` — confirmar todos os headings em navy, badges/placeholders em rosa-claro, estrelas do Google Reviews continuam rosa
5. Navegar para `/admin/login` — confirmar título navy, botão "Entrar" rosa
6. Parar o servidor dev

Expected: todos os passos acima se comportam como descrito, sem erros no console do navegador, sem nenhum roxo/azul antigo visível.

- [ ] **Step 4: Push**

Run: `git pull --no-edit && git push`
Expected: commits das Tasks 1–4 publicados em `origin/main`. Deploy automático do Vercel dispara sozinho.
