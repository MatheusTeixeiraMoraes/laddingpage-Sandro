# Pendências antes de ir para produção

Lista viva de tudo que depende de conteúdo ou credencial externa que ainda
não temos. Cada pilar novo que gerar uma pendência externa deve atualizar
este arquivo.

## 🔴 Segurança (prioridade alta)

- [ ] **Desabilitar cadastro público no Supabase Auth** (Authentication →
      Sign In / Providers → Email → desmarcar "Allow new users to sign up").
      Sem isso, qualquer visitante pode criar conta própria via
      `supabase.auth.signUp()` (a chave `publishable` é pública por design)
      e, como as policies de `empreendimentos`/`plantas` liberam escrita
      pra qualquer `authenticated`, ganhar acesso de escrita total ao banco.
      Achado por revisão de segurança automática nos commits do pilar
      "Painel administrativo — Auth + Schema + RLS"; usuário confirmou que
      vai resolver, ainda pendente de confirmação final.

## Conteúdo real do cliente

- [ ] Logo do Sandro Higuti (fundação — hoje é wordmark em texto)
- [ ] Texto de bio / história do corretor (pilar "Sobre mim")
- [ ] Fotos do corretor com clientes/imóveis entregues (pilar "Sobre mim")
- [ ] Vídeos de depoimento de clientes (pilar "Sobre mim")
- [ ] Links reais de redes sociais (pilar "Sobre mim")
- [ ] Endereços/coordenadas reais de cada empreendimento (pilar "Mapa")
- [ ] Fotos reais dos empreendimentos e plantas (pilar "Empreendimentos + Plantas")

## APIs e credenciais externas

- [ ] Google Places API (avaliações reais, precisa de API key + Place ID do
      negócio — pilar "Sobre mim")
- [ ] Google Maps JavaScript API (upgrade do embed sem API key atual,
      precisa de API key + billing no Google Cloud — pilar "Mapa";
      variável já documentada em `.env.example`)

## Infraestrutura

- [x] Vercel conectado ao repositório (projeto `laddingpage-sandro`, deploy
      automático a cada push em `main`).
- [x] Supabase conectado. Projeto usa o formato **novo** de chaves
      (`sb_publishable_...`/`sb_secret_...`, não o JWT legado
      anon/service_role) — env vars corretas são
      `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e `SUPABASE_SECRET_KEY`.
- [x] Tabelas `empreendimentos`/`plantas` criadas com RLS e seed (pilar
      "Painel administrativo — Auth + Schema"). O SQL Editor do dashboard
      não persistia as mudanças de forma confiável neste projeto — migration
      aplicada via conexão Postgres direta (`DATABASE_URL` em `.env.local`).
- [x] Login do corretor (Supabase Auth, single-admin) + `/admin` protegida
      via `src/proxy.ts` + site público lendo do banco.
- [ ] **Atualizar as Environment Variables do Vercel** com os nomes/valores
      corretos: `NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (as que estavam lá antes tinham
      o nome antigo/chave errada) — sem isso o site em produção não conecta
      ao Supabase.
- [ ] CRUD de empreendimentos no painel (hoje só dá pra editar via Table
      Editor do Supabase diretamente).
- [ ] Upload de imagem real (continua legenda de texto em `fotos`).
- [ ] Importação por planilha.
