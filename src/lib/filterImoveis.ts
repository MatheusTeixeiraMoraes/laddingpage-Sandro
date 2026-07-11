import type { Imovel, TipoImovel } from "../types/imovel";

export type Filtros = {
  tipo: TipoImovel | "todos";
  dormitoriosMin: number;
  vagasMin: number;
  metragemMin: number | null;
  metragemMax: number | null;
  precoMin: number | null;
  precoMax: number | null;
};

export const FILTROS_VAZIOS: Filtros = {
  tipo: "todos",
  dormitoriosMin: 0,
  vagasMin: 0,
  metragemMin: null,
  metragemMax: null,
  precoMin: null,
  precoMax: null,
};

export function filterImoveis(
  imoveis: Imovel[],
  filtros: Filtros,
  searchTerm: string,
): Imovel[] {
  const termo = searchTerm.trim().toLowerCase();

  return imoveis.filter((imovel) => {
    if (termo) {
      const alvo = `${imovel.nome} ${imovel.bairro}`.toLowerCase();
      if (!alvo.includes(termo)) return false;
    }
    if (filtros.tipo !== "todos" && imovel.tipo !== filtros.tipo) return false;
    if (imovel.dormitorios < filtros.dormitoriosMin) return false;
    if (imovel.vagas < filtros.vagasMin) return false;
    if (filtros.metragemMin !== null && imovel.metragem < filtros.metragemMin)
      return false;
    if (filtros.metragemMax !== null && imovel.metragem > filtros.metragemMax)
      return false;
    if (filtros.precoMin !== null && imovel.preco < filtros.precoMin)
      return false;
    if (filtros.precoMax !== null && imovel.preco > filtros.precoMax)
      return false;
    return true;
  });
}
