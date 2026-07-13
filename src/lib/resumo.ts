import type { Empreendimento } from "../types/empreendimento";

/** "45 m²" quando só há uma planta; "44–52 m²" quando há várias. */
export function faixaDeMetragem(empreendimento: Empreendimento): string {
  const metragens = empreendimento.plantas.map((p) => p.metragem);
  if (metragens.length === 0) return "—";

  const min = Math.min(...metragens);
  const max = Math.max(...metragens);
  return min === max ? `${min} m²` : `${min}–${max} m²`;
}

/** "2" · "2 e 3" · "1, 2 e 3" — como o Sandro escreve na planilha. */
export function listaDeDormitorios(dorms: number[]): string {
  if (dorms.length === 0) return "—";
  if (dorms.length === 1) return String(dorms[0]);

  const ordenados = [...dorms].sort((a, b) => a - b);
  return `${ordenados.slice(0, -1).join(", ")} e ${ordenados.at(-1)}`;
}
