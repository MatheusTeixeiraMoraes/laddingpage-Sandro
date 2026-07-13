-- Aperta as policies de escrita: exige app_metadata.role = 'admin' (nao so
-- "qualquer usuario autenticado"). Ver PENDENCIAS.md para o contexto do
-- achado de seguranca que motivou isso.

drop policy "escrita so autenticado" on empreendimentos;
drop policy "escrita so autenticado" on plantas;

create policy "escrita so admin" on empreendimentos
  for all to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "escrita so admin" on plantas
  for all to authenticated
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
