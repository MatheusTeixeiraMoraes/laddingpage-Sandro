# Pendências antes de ir para produção

Lista viva de tudo que depende de conteúdo ou credencial externa que ainda
não temos. Cada pilar novo que gerar uma pendência externa deve atualizar
este arquivo.

## Conteúdo a confirmar — Home no estilo da referência (fase concluída)

A home nova foi montada com assets e empreendimentos reais do material do
Sandro, mas alguns dados são **representativos** até o Sandro confirmar:

- [ ] **Números das estatísticas** ("+250 famílias atendidas", "+150 sonhos
      realizados", "100% comprometimento" em `SobreMim`) — vieram da
      referência; confirmar os reais ou ajustar.
- [ ] **Dados dos 7 empreendimentos** semeados (Vila Laredo, Sou Viver,
      Siver Oasis, Residencial São Paulo, Arena, Residencial Tropical, Gran
      Campolim): dorms, metragem, **entrega e preço** são representativos de
      MCMV. Sandro ajusta os reais pelo painel (`/admin`). Nome, zona e
      fachada são reais.
- [ ] **Preço na página de detalhe** (`/empreendimentos/[id]`) exibe o valor
      representativo da planta — os cards da home não mostram preço, mas a
      página de detalhe sim. Confirmar/ajustar preços reais.
- [ ] **Links reais das redes sociais** (Instagram/Facebook/YouTube) — hoje
      `href="#"` no header e footer.
- [ ] Cadastrar os demais empreendimentos do material (dezenas por zona) pelo
      painel — só 7 foram semeados como amostra.
- Bio, fotos e reviews continuam como nas fases anteriores (algumas ainda
  placeholder na página `/sobre`).

## Segurança

- [x] **Policies de escrita travadas por `role=admin`** (migration `0003`),
      não mais "qualquer `authenticated`". Verificado com script descartável:
      usuário autenticado sem a claim `app_metadata.role=admin` é bloqueado
      na escrita, igual ao anônimo. Corrige o achado da revisão automática
      no pilar "Painel administrativo — Auth + Schema + RLS".
- [ ] **Desabilitar cadastro público no Supabase Auth** (Authentication →
      Sign In / Providers → Email → desmarcar "Allow new users to sign up")
      como defesa em profundidade adicional — a policy já bloqueia escrita
      de quem não é admin, mas cadastro público continua permitindo criar
      contas à toa. Usuário não achou a opção no dashboard ainda; retomar
      quando puder.
- [ ] Trocar a senha temporária da conta admin: logar em `/admin/login` com
      a senha temporária mais recente, ir em `/admin` → "Trocar senha" →
      definir senha própria. Não depende de e-mail (o formulário funciona
      com qualquer sessão logada) — ainda pendente do usuário fazer.
- Personalizar o template de e-mail "Reset Password" pra usar
  `/auth/confirm` (rota já construída) exige SMTP customizado, que é
  recurso pago do Supabase (plano Pro). Não é bloqueio: a troca de senha
  logada acima cobre o caso de uso sem custo. Revisitar só se algum dia
  precisar de recuperação de senha **sem** sessão ativa (esqueceu a senha
  de verdade, sem estar logado em lugar nenhum).

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
- [x] Environment Variables do Vercel atualizadas com os nomes corretos
      (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) e
      redeploy feito. Confirmado em produção: home mostra os 5
      empreendimentos vindos do banco, `/admin` redireciona pra
      `/admin/login`.
- [ ] CRUD de empreendimentos no painel (hoje só dá pra editar via Table
      Editor do Supabase diretamente).
- [ ] Upload de imagem real (continua legenda de texto em `fotos`).
- [ ] Importação por planilha.
