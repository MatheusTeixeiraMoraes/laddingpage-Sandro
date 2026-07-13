import type { Empreendimento, TipoEmpreendimento, Zona } from "../types/empreendimento";
import { anoDeEntrega } from "./entrega.ts";

/** "todos" = qualquer prazo; "pronto" = já pronto para morar; número = ano. */
export type PrazoEntrega = "todos" | "pronto" | number;

export type Filtros = {
  tipo: TipoEmpreendimento | "todos";
  zona: Zona | "todas";
  entrega: PrazoEntrega;
  dormitoriosMin: number;
  metragemMin: number | null;
  metragemMax: number | null;
  precoMin: number | null;
  precoMax: number | null;
  // Marcado = exige ter. Ninguém procura imóvel "sem varanda".
  suite: boolean;
  varanda: boolean;
  quintal: boolean;
  garagemCoberta: boolean;
  elevador: boolean;
  pontosArMin: number;
};

export const FILTROS_VAZIOS: Filtros = {
  tipo: "todos",
  zona: "todas",
  entrega: "todos",
  dormitoriosMin: 0,
  metragemMin: null,
  metragemMax: null,
  precoMin: null,
  precoMax: null,
  suite: false,
  varanda: false,
  quintal: false,
  garagemCoberta: false,
  elevador: false,
  pontosArMin: 0,
};

function atendeEntrega(empreendimento: Empreendimento, prazo: PrazoEntrega): boolean {
  if (prazo === "todos") return true;
  if (prazo === "pronto") return empreendimento.entregaEm === null;
  return anoDeEntrega(empreendimento.entregaEm) === prazo;
}

/** A metragem é da planta: basta uma planta caber na faixa. */
function atendeMetragem(empreendimento: Empreendimento, filtros: Filtros): boolean {
  if (filtros.metragemMin === null && filtros.metragemMax === null) return true;

  return empreendimento.plantas.some((planta) => {
    if (filtros.metragemMin !== null && planta.metragem < filtros.metragemMin) return false;
    if (filtros.metragemMax !== null && planta.metragem > filtros.metragemMax) return false;
    return true;
  });
}

export function filterEmpreendimentos(
  empreendimentos: Empreendimento[],
  filtros: Filtros,
  searchTerm: string,
): Empreendimento[] {
  const termo = searchTerm.trim().toLowerCase();

  return empreendimentos.filter((e) => {
    if (termo) {
      const alvo = `${e.nome} ${e.bairro.nome}`.toLowerCase();
      if (!alvo.includes(termo)) return false;
    }
    if (filtros.tipo !== "todos" && e.tipo !== filtros.tipo) return false;
    if (filtros.zona !== "todas" && e.zona !== filtros.zona) return false;
    if (!atendeEntrega(e, filtros.entrega)) return false;

    // Basta uma das opções de dormitório atender.
    if (filtros.dormitoriosMin > 0) {
      const maior = Math.max(0, ...e.dormitorios);
      if (maior < filtros.dormitoriosMin) return false;
    }

    if (filtros.precoMin !== null && e.precoAPartirDe < filtros.precoMin) return false;
    if (filtros.precoMax !== null && e.precoAPartirDe > filtros.precoMax) return false;

    if (!atendeMetragem(e, filtros)) return false;

    if (filtros.suite && !e.suite) return false;
    if (filtros.varanda && !e.varanda) return false;
    if (filtros.quintal && !e.quintal) return false;
    if (filtros.garagemCoberta && !e.garagemCoberta) return false;
    // A planilha guarda a QUANTIDADE de elevadores; "com elevador" é ter algum.
    if (filtros.elevador && (e.elevadores ?? 0) === 0) return false;
    if (filtros.pontosArMin > 0 && (e.pontosAr ?? 0) < filtros.pontosArMin) return false;

    return true;
  });
}
