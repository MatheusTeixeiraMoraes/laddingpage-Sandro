import type { Empreendimento } from "../types/empreendimento";

const QUANTIDADE = 4;

/**
 * Os marcados como destaque pelo Sandro entram primeiro. Sem nenhum marcado
 * (ou marcados de menos), completa com os mais recentes — a seção nunca fica
 * vazia ou pela metade só porque ninguém mexeu no painel ainda.
 */
export function empreendimentosEmDestaque(
  empreendimentos: Empreendimento[],
): Empreendimento[] {
  const marcados = empreendimentos.filter((e) => e.destaque);
  if (marcados.length >= QUANTIDADE) return marcados.slice(0, QUANTIDADE);

  const idsMarcados = new Set(marcados.map((e) => e.id));
  const resto = empreendimentos.filter((e) => !idsMarcados.has(e.id));

  return [...marcados, ...resto].slice(0, QUANTIDADE);
}
