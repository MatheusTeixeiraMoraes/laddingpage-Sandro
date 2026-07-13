-- A entrega era texto livre ('Dez/2026', 'Pronto para morar'). Nao da pra
-- filtrar por prazo ordenando texto -- 'Abr/2028' vem antes de 'Dez/2026' no
-- alfabeto. Vira data de verdade.
--
-- entrega_em nulo = pronto para morar. O rotulo exibido ('Dez/2026') passa a
-- ser derivado da data no codigo (src/lib/entrega.ts).
--
-- ETAPA 1 de 2 (expand): so ADICIONA a coluna nova e preenche. A coluna de
-- texto continua viva de proposito -- o codigo em producao ainda le ela, e
-- derruba-la agora deixaria o site quebrado ate o deploy subir. A 0010 remove
-- o texto depois que o novo codigo estiver no ar.

alter table empreendimentos
  add column entrega_em date;

-- Backfill: 'Mmm/AAAA' -> primeiro dia do mes. Qualquer outra coisa
-- (inclusive 'Pronto para morar' e vazio) fica nulo = pronto para morar.
update empreendimentos
set entrega_em = make_date(
  split_part(entrega, '/', 2)::int,
  case lower(split_part(entrega, '/', 1))
    when 'jan' then 1  when 'fev' then 2  when 'mar' then 3
    when 'abr' then 4  when 'mai' then 5  when 'jun' then 6
    when 'jul' then 7  when 'ago' then 8  when 'set' then 9
    when 'out' then 10 when 'nov' then 11 when 'dez' then 12
  end,
  1
)
where lower(btrim(entrega)) ~ '^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/[0-9]{4}$';

-- Rede de seguranca: aborta se algum texto de data nao tiver sido convertido
-- (ex.: 'Marco/2027', 'final de 2026'). Melhor falhar aqui do que perder a data.
do $$
declare perdidos int;
begin
  select count(*) into perdidos
  from empreendimentos
  where entrega is not null
    and btrim(entrega) <> ''
    and lower(btrim(entrega)) <> 'pronto para morar'
    and entrega_em is null;

  if perdidos > 0 then
    raise exception 'Backfill de entrega_em nao converteu % linha(s). Abortado.', perdidos;
  end if;
end $$;
