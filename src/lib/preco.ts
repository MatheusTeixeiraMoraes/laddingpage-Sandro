/**
 * Formata o preço no padrão do mercado imobiliário: "A partir de R$ 289 mil".
 * Valores em milhões viram "A partir de R$ 1,25 milhões".
 */
export function formatarPrecoAPartirDe(preco: number): string {
  if (preco >= 1_000_000) {
    const milhoes = preco / 1_000_000;
    const texto = milhoes.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
    return `A partir de R$ ${texto} ${milhoes === 1 ? "milhão" : "milhões"}`;
  }

  const mil = Math.round(preco / 1000);
  return `A partir de R$ ${mil} mil`;
}
