"use client";

import { useMemo, useState } from "react";
import type { Imovel } from "@/types/imovel";
import { filterImoveis, FILTROS_VAZIOS, type Filtros } from "@/lib/filterImoveis";
import { SearchBar } from "@/components/SearchBar";
import { FiltersModal } from "@/components/FiltersModal";
import { ImovelCard } from "@/components/ImovelCard";

export function PropertySearch({ imoveis }: { imoveis: Imovel[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [modalOpen, setModalOpen] = useState(false);

  const resultados = useMemo(
    () => filterImoveis(imoveis, filtros, searchTerm),
    [imoveis, filtros, searchTerm],
  );

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onOpenFilters={() => setModalOpen(true)}
      />

      {resultados.length === 0 ? (
        <p className="text-slate-500">Nenhum imóvel encontrado com esses filtros.</p>
      ) : (
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      )}

      <FiltersModal
        open={modalOpen}
        filtros={filtros}
        onApply={(novosFiltros) => {
          setFiltros(novosFiltros);
          setModalOpen(false);
        }}
        onClear={() => setFiltros(FILTROS_VAZIOS)}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
