import type { Empreendimento, Planta, TipoEmpreendimento, Zona } from "../types/empreendimento";
import { anoDeEntrega } from "./entrega.ts";

/** "todos" = qualquer prazo; "pronto" = já pronto para morar; número = ano. */
export type PrazoEntrega = "todos" | "pronto" | number;

export type Filtros = {
  tipo: TipoEmpreendimento | "todos";
  zona: Zona | "todas";
  entrega: PrazoEntrega;
  dormitoriosMin: number;
  vagasMin: number;
  metragemMin: number | null;
  metragemMax: number | null;
  precoMin: number | null;
  precoMax: number | null;
};

export const FILTROS_VAZIOS: Filtros = {
  tipo: "todos",
  zona: "todas",
  entrega: "todos",
  dormitoriosMin: 0,
  vagasMin: 0,
  metragemMin: null,
  metragemMax: null,
  precoMin: null,
  precoMax: null,
};

function plantaAtendeFiltros(planta: Planta, filtros: Filtros): boolean {
  if (planta.dormitorios < filtros.dormitoriosMin) return false;
  if (planta.vagas < filtros.vagasMin) return false;
  if (filtros.metragemMin !== null && planta.metragem < filtros.metragemMin)
    return false;
  if (filtros.metragemMax !== null && planta.metragem > filtros.metragemMax)
    return false;
  if (filtros.precoMin !== null && planta.preco < filtros.precoMin)
    return false;
  if (filtros.precoMax !== null && planta.preco > filtros.precoMax)
    return false;
  return true;
}

function atendeEntrega(empreendimento: Empreendimento, prazo: PrazoEntrega): boolean {
  if (prazo === "todos") return true;
  if (prazo === "pronto") return empreendimento.entregaEm === null;
  return anoDeEntrega(empreendimento.entregaEm) === prazo;
}

export function filterEmpreendimentos(
  empreendimentos: Empreendimento[],
  filtros: Filtros,
  searchTerm: string,
): Empreendimento[] {
  const termo = searchTerm.trim().toLowerCase();

  return empreendimentos.filter((empreendimento) => {
    if (termo) {
      const alvo = `${empreendimento.nome} ${empreendimento.bairro}`.toLowerCase();
      if (!alvo.includes(termo)) return false;
    }
    if (filtros.tipo !== "todos" && empreendimento.tipo !== filtros.tipo)
      return false;
    if (filtros.zona !== "todas" && empreendimento.zona !== filtros.zona)
      return false;
    if (!atendeEntrega(empreendimento, filtros.entrega)) return false;

    return empreendimento.plantas.some((planta) =>
      plantaAtendeFiltros(planta, filtros),
    );
  });
}
