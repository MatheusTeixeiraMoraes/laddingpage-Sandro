-- Bucket das fotos de capa dos empreendimentos.
-- Leitura publica; escrita apenas para quem tem app_metadata.role = 'admin'
-- (mesma trava das tabelas empreendimentos/plantas).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imoveis', 'imoveis', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "leitura publica imoveis"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'imoveis');

create policy "insert admin imoveis"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'imoveis'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

create policy "update admin imoveis"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'imoveis'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  )
  with check (
    bucket_id = 'imoveis'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

create policy "delete admin imoveis"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'imoveis'
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );
