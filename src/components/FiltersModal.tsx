"use client";

import type { FormEvent } from "react";
import type { Filtros } from "@/lib/filterImoveis";

type FiltersModalProps = {
  open: boolean;
  filtros: Filtros;
  onApply: (filtros: Filtros) => void;
  onClear: () => void;
  onClose: () => void;
};

const TIPOS: { value: Filtros["tipo"]; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "comercial", label: "Comercial" },
];

const DORMITORIOS_OPCOES = [0, 1, 2, 3, 4];
const VAGAS_OPCOES = [0, 1, 2, 3];

function parseNumberOrNull(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function FiltersModal({
  open,
  filtros,
  onApply,
  onClear,
  onClose,
}: FiltersModalProps) {
  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onApply({
      tipo: formData.get("tipo") as Filtros["tipo"],
      dormitoriosMin: Number(formData.get("dormitoriosMin")),
      vagasMin: Number(formData.get("vagasMin")),
      metragemMin: parseNumberOrNull(formData.get("metragemMin")),
      metragemMax: parseNumberOrNull(formData.get("metragemMax")),
      precoMin: parseNumberOrNull(formData.get("precoMin")),
      precoMax: parseNumberOrNull(formData.get("precoMax")),
    });
  };

  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-purple">Filtros</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar filtros"
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Tipo
            <select
              name="tipo"
              defaultValue={filtros.tipo}
              className="rounded-lg border border-slate-200 px-3 py-2"
            >
              {TIPOS.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Dormitórios (mínimo)
            <select
              name="dormitoriosMin"
              defaultValue={filtros.dormitoriosMin}
              className="rounded-lg border border-slate-200 px-3 py-2"
            >
              {DORMITORIOS_OPCOES.map((valor) => (
                <option key={valor} value={valor}>
                  {valor === 0 ? "Qualquer" : `${valor}+`}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Vagas (mínimo)
            <select
              name="vagasMin"
              defaultValue={filtros.vagasMin}
              className="rounded-lg border border-slate-200 px-3 py-2"
            >
              {VAGAS_OPCOES.map((valor) => (
                <option key={valor} value={valor}>
                  {valor === 0 ? "Qualquer" : `${valor}+`}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Metragem mín. (m²)
              <input
                type="number"
                name="metragemMin"
                defaultValue={filtros.metragemMin ?? ""}
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Metragem máx. (m²)
              <input
                type="number"
                name="metragemMax"
                defaultValue={filtros.metragemMax ?? ""}
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Preço mín. (R$)
              <input
                type="number"
                name="precoMin"
                defaultValue={filtros.precoMin ?? ""}
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              Preço máx. (R$)
              <input
                type="number"
                name="precoMax"
                defaultValue={filtros.precoMax ?? ""}
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
          <div className="mt-2 flex justify-between gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Limpar filtros
            </button>
            <button
              type="submit"
              className="rounded-full bg-brand-blue px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Aplicar filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
