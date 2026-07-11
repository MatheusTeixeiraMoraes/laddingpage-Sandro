# Pendências antes de ir para produção

Lista viva de tudo que depende de conteúdo ou credencial externa que ainda
não temos. Cada pilar novo que gerar uma pendência externa deve atualizar
este arquivo.

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
- [x] Supabase conectado (projeto criado, `NEXT_PUBLIC_SUPABASE_URL` e
      `NEXT_PUBLIC_SUPABASE_ANON_KEY` em `.env.local`, conectividade
      verificada via SDK). Ainda **sem nenhuma tabela** — schema entra junto
      com a spec do painel administrativo.
- [ ] Adicionar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      nas Environment Variables do projeto Vercel (dashboard → Settings →
      Environment Variables) — sem isso o site em produção não conecta ao
      Supabase, só o ambiente local.
- [ ] Painel administrativo: precisa de spec própria (schema de tabelas,
      RLS, auth do corretor, upload de imagens, importação por planilha).
      Supabase já está disponível pra isso, mas nada foi modelado ainda.
