"use client";

import type { Planta } from "@/types/empreendimento";

/** A planta é identificada pelo tamanho — é a única coisa que a distingue. */
export function labelDaPlanta(planta: Planta): string {
  return `${planta.metragem} m²`;
}

type PlantaSelectorProps = {
  plantas: Planta[];
  selecionadaId: string;
  onSelect: (id: string) => void;
};

export function PlantaSelector({
  plantas,
  selecionadaId,
  onSelect,
}: PlantaSelectorProps) {
  if (plantas.length <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {plantas.map((planta) => (
        <button
          key={planta.id}
          type="button"
          onClick={() => onSelect(planta.id)}
          className={
            planta.id === selecionadaId
              ? "rounded-full bg-brand-pink px-4 py-2 text-sm font-medium text-white"
              : "rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          }
        >
          {labelDaPlanta(planta)}
        </button>
      ))}
    </div>
  );
}
