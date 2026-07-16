/**
 * Agregacoes puras do painel de Analytics (sem imports de servidor, pra rodar
 * nos testes). Recebem os leads ja carregados e devolvem os numeros dos graficos.
 */
import type { Lead } from "@/types/lead";

export type Resumo = {
  totalLeads: number;
  leadsMes: number;
  aAtender: number;
  totalCliques: number;
};
export type BarraDia = { dia: string; qtd: number };
export type BarraCategoria = { rotulo: string; qtd: number };

const DIA_MS = 86_400_000;
// Brasil e UTC-3 (sem horario de verao desde 2019). Agrupar o dia em BRT evita
// que um lead das 22h apareca no dia seguinte.
const BRT_OFFSET_MS = 3 * 60 * 60 * 1000;

/** Chave 'AAAA-MM-DD' do dia em horario de Brasilia. */
function diaBRT(ms: number): string {
  return new Date(ms - BRT_OFFSET_MS).toISOString().slice(0, 10);
}

/** Mesmo dia BRT, a partir do created_at ISO do banco (UTC). */
export function diaBRTde(iso: string): string {
  return diaBRT(new Date(iso).getTime());
}

export function resumoLeads(leads: Lead[], totalCliques: number, agora: Date): Resumo {
  const limiteMes = agora.getTime() - 30 * DIA_MS;
  return {
    totalLeads: leads.length,
    leadsMes: leads.filter((l) => new Date(l.criadoEm).getTime() >= limiteMes).length,
    aAtender: leads.filter((l) => !l.atendido).length,
    totalCliques,
  };
}

/** Leads por dia nos ultimos `dias`, preenchendo zeros (pro grafico nao ter buracos). */
export function leadsPorDia(leads: Lead[], agora: Date, dias: number): BarraDia[] {
  const contagem = new Map<string, number>();
  for (const l of leads) {
    const chave = diaBRT(new Date(l.criadoEm).getTime());
    contagem.set(chave, (contagem.get(chave) ?? 0) + 1);
  }

  const saida: BarraDia[] = [];
  for (let i = dias - 1; i >= 0; i--) {
    const chave = diaBRT(agora.getTime() - i * DIA_MS);
    saida.push({ dia: chave, qtd: contagem.get(chave) ?? 0 });
  }
  return saida;
}

/** Leads agrupados pelo interesse, do mais procurado pro menos. */
export function leadsPorInteresse(leads: Lead[]): BarraCategoria[] {
  const contagem = new Map<string, number>();
  for (const l of leads) {
    const rotulo = l.interesse.trim() || "(não informado)";
    contagem.set(rotulo, (contagem.get(rotulo) ?? 0) + 1);
  }
  return [...contagem.entries()]
    .map(([rotulo, qtd]) => ({ rotulo, qtd }))
    .sort((a, b) => b.qtd - a.qtd);
}
