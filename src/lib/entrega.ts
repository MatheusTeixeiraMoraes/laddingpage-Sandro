const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export const PRONTO_PARA_MORAR = "Pronto para morar";

/**
 * A entrega vive no banco como data (ou nulo = pronto para morar). O rótulo
 * exibido é sempre derivado daqui — nunca guardado — para não divergir.
 *
 * A data vem do Postgres como 'AAAA-MM-DD'. É lida como texto de propósito:
 * `new Date("2026-12-01")` seria interpretado como UTC e, em Sorocaba (UTC-3),
 * voltaria como 30/11 — o imóvel apareceria entregue um mês antes.
 */
export function formatarEntrega(entregaEm: string | null): string {
  const partes = partesDaData(entregaEm);
  if (!partes) return PRONTO_PARA_MORAR;

  const [ano, mes] = partes;
  return `${MESES[mes - 1]}/${ano}`;
}

/** Ano da entrega, ou null quando é pronto para morar. */
export function anoDeEntrega(entregaEm: string | null): number | null {
  const partes = partesDaData(entregaEm);
  return partes ? partes[0] : null;
}

function partesDaData(entregaEm: string | null): [number, number] | null {
  if (!entregaEm) return null;

  const match = /^(\d{4})-(\d{2})-\d{2}/.exec(entregaEm);
  if (!match) return null;

  const ano = Number(match[1]);
  const mes = Number(match[2]);
  if (mes < 1 || mes > 12) return null;

  return [ano, mes];
}
