/**
 * "há 2 meses", "há 1 ano" — calculado na hora a partir da data.
 *
 * O rótulo NÃO é guardado de propósito: se o site gravasse "2 meses atrás",
 * daqui a um ano continuaria dizendo isso sobre uma avaliação de dois anos.
 * Rótulo de tempo guardado apodrece e vira mentira sozinho.
 */
export function tempoRelativo(data: string, hoje = new Date()): string {
  const [ano, mes] = data.split("-").map(Number);
  if (!ano || !mes) return "";

  const meses =
    (hoje.getFullYear() - ano) * 12 + (hoje.getMonth() + 1 - mes);

  if (meses <= 0) return "este mês";
  if (meses === 1) return "há 1 mês";
  if (meses < 12) return `há ${meses} meses`;

  const anos = Math.floor(meses / 12);
  return anos === 1 ? "há 1 ano" : `há ${anos} anos`;
}
