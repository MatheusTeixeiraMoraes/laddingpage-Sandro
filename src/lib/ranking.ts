import type { Empreendimento } from "@/types/empreendimento";
import type { Lead } from "@/types/lead";

export type RankingItem = {
  id: string;
  nome: string;
  imagem: string;
  bairro: string;
  destaque: boolean;
  cliques: number;
  leads: number;
};

/** Conta quantos cliques cada imóvel recebeu, a partir das linhas cruas. */
export function contarCliques(
  rows: { empreendimento_id: string }[],
): Map<string, number> {
  const contagem = new Map<string, number>();
  for (const { empreendimento_id } of rows) {
    contagem.set(empreendimento_id, (contagem.get(empreendimento_id) ?? 0) + 1);
  }
  return contagem;
}

/**
 * Liga cada lead ao imóvel pelo campo "interesse", que a ficha grava como o
 * nome do imóvel (sozinho ou seguido de " — planta de ..."). O separador " —"
 * evita que um nome que é prefixo de outro conte a mais. Leads da home (interesse
 * = categoria, ex.: "Apartamento na planta") não casam com nenhum imóvel — certo.
 */
export function contarLeadsPorEmpreendimento(
  empreendimentos: Empreendimento[],
  leads: Lead[],
): Map<string, number> {
  const contagem = new Map<string, number>();
  for (const emp of empreendimentos) {
    const total = leads.filter(
      (l) => l.interesse === emp.nome || l.interesse.startsWith(`${emp.nome} —`),
    ).length;
    contagem.set(emp.id, total);
  }
  return contagem;
}

/** Monta o ranking ordenado do mais clicado para o menos (leads como desempate). */
export function montarRanking(
  empreendimentos: Empreendimento[],
  cliques: Map<string, number>,
  leads: Map<string, number>,
): RankingItem[] {
  return empreendimentos
    .map((emp) => ({
      id: emp.id,
      nome: emp.nome,
      imagem: emp.imagem,
      bairro: emp.bairro.nome,
      destaque: emp.destaque,
      cliques: cliques.get(emp.id) ?? 0,
      leads: leads.get(emp.id) ?? 0,
    }))
    .sort(
      (a, b) =>
        b.cliques - a.cliques ||
        b.leads - a.leads ||
        a.nome.localeCompare(b.nome, "pt-BR"),
    );
}
