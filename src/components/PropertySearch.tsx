"use client";

import { useMemo, useState } from "react";
import type { Empreendimento } from "@/types/empreendimento";
import {
  filterEmpreendimentos,
  FILTROS_VAZIOS,
  type Filtros,
} from "@/lib/filterEmpreendimentos";
import { SearchBar } from "@/components/SearchBar";
import { FiltersModal } from "@/components/FiltersModal";
import { EmpreendimentoCard } from "@/components/EmpreendimentoCard";

export function PropertySearch({
  empreendimentos,
}: {
  empreendimentos: Empreendimento[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [modalOpen, setModalOpen] = useState(false);

  const resultados = useMemo(
    () => filterEmpreendimentos(empreendimentos, filtros, searchTerm),
    [empreendimentos, filtros, searchTerm],
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
          {resultados.map((empreendimento) => (
            <EmpreendimentoCard key={empreendimento.id} empreendimento={empreendimento} />
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
