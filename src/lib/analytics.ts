import { getLeads } from "@/lib/leads";
import { getEmpreendimentos } from "@/lib/empreendimentos";
import { getCliquesPorEmpreendimento } from "@/lib/cliques";
import { contarLeadsPorEmpreendimento, montarRanking } from "@/lib/ranking";
import {
  resumoLeads,
  leadsPorDia,
  leadsPorInteresse,
  type Resumo,
  type BarraDia,
  type BarraCategoria,
} from "@/lib/analyticsAgg";
import type { Lead } from "@/types/lead";

export type ImovelClicado = { nome: string; cliques: number };

export type DadosAnalytics = {
  resumo: Resumo;
  porDia: BarraDia[];
  porInteresse: BarraCategoria[];
  imoveisMaisClicados: ImovelClicado[];
  leadsRecentes: Lead[];
};

/**
 * Numeros do painel de Analytics, a partir dos dados do proprio site (leads e
 * cliques anonimos no WhatsApp). Tudo protegido por RLS (so admin le).
 */
export async function getAnalytics(): Promise<DadosAnalytics> {
  const [leads, empreendimentos, cliquesPorId] = await Promise.all([
    getLeads(),
    getEmpreendimentos(),
    getCliquesPorEmpreendimento(),
  ]);

  const totalCliques = [...cliquesPorId.values()].reduce((soma, n) => soma + n, 0);

  // Ranking de imoveis por cliques: reaproveita o mesmo helper do /admin/destaques
  // (chaveado por id, nao por nome, pra nao mesclar imoveis homonimos). So os que
  // tiveram ao menos um clique.
  const leadsPorImovel = contarLeadsPorEmpreendimento(empreendimentos, leads);
  const imoveisMaisClicados = montarRanking(empreendimentos, cliquesPorId, leadsPorImovel)
    .filter((r) => r.cliques > 0)
    .slice(0, 8)
    .map((r) => ({ nome: r.nome, cliques: r.cliques }));

  const agora = new Date();
  return {
    resumo: resumoLeads(leads, totalCliques, agora),
    porDia: leadsPorDia(leads, agora, 30),
    porInteresse: leadsPorInteresse(leads),
    imoveisMaisClicados,
    leadsRecentes: leads.slice(0, 5),
  };
}
