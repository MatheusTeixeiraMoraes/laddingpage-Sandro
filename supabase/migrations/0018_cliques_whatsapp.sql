-- "Lançamentos em destaque" agora é curado pelo Sandro no painel. Para ele
-- decidir o que promover, precisa ver quais imóveis mais levam gente ao
-- WhatsApp. Este é o contador desses cliques.
--
-- É ANÔNIMO de propósito: guarda só o id do imóvel e a data. Sem nome, sem
-- telefone, sem IP, sem cookie — não dá para ligar a nenhuma pessoa. Por isso
-- não é dado pessoal e não exige consentimento (ao contrário da tabela `leads`).

create table cliques_whatsapp (
  id                uuid primary key default gen_random_uuid(),
  empreendimento_id uuid not null references empreendimentos(id) on delete cascade,
  created_at        timestamptz not null default now()
);

alter table cliques_whatsapp enable row level security;

-- O clique acontece no site público: o anônimo precisa poder inserir.
create policy "qualquer um registra clique" on cliques_whatsapp
  for insert to anon, authenticated
  with check (true);

-- Só o admin lê (para montar o ranking). O público nem enumera os cliques.
create policy "so admin le cliques" on cliques_whatsapp
  for select to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Ninguém edita nem apaga clique: o histórico some junto com o imóvel (cascade).
grant insert on table public.cliques_whatsapp to anon, authenticated;
grant select on table public.cliques_whatsapp to authenticated;

create index cliques_whatsapp_empreendimento_idx
  on cliques_whatsapp (empreendimento_id);
