/**
 * Formata o preço no padrão curto do mercado imobiliário: "R$ 289 mil".
 * Valores em milhões viram "R$ 1,25 milhões".
 * O rótulo "A partir de" é responsabilidade de quem exibe.
 */
export function formatarPrecoCurto(preco: number): string {
  if (preco >= 1_000_000) {
    const milhoes = preco / 1_000_000;
    const texto = milhoes.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
    return `R$ ${texto} ${milhoes === 1 ? "milhão" : "milhões"}`;
  }

  const mil = Math.round(preco / 1000);
  return `R$ ${mil} mil`;
}
