"use client";

import { useEffect } from "react";
import type { Filtros } from "@/lib/filterEmpreendimentos";

/** Marcado = exige ter. Ninguém procura imóvel "sem varanda". */
const CARACTERISTICAS: { chave: keyof Filtros; label: string }[] = [
  { chave: "suite", label: "Com suíte" },
  { chave: "varanda", label: "Com varanda" },
  { chave: "quintal", label: "Com quintal" },
  { chave: "garagemCoberta", label: "Com garagem coberta" },
  { chave: "elevador", label: "Com elevador" },
];

export function contarFiltrosExtras(filtros: Filtros): number {
  const marcados = CARACTERISTICAS.filter((c) => filtros[c.chave] === true).length;
  return marcados + (filtros.pontosArMin > 0 ? 1 : 0);
}

export function MaisFiltros({
  filtros,
  onChange,
  onFechar,
  maxPontosAr,
  resultados,
}: {
  filtros: Filtros;
  onChange: (filtros: Filtros) => void;
  onFechar: () => void;
  maxPontosAr: number;
  resultados: number;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onFechar]);

  const limpar = () => {
    onChange({
      ...filtros,
      suite: false,
      varanda: false,
      quintal: false,
      garagemCoberta: false,
      elevador: false,
      pontosArMin: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-brand-navy/50"
        onClick={onFechar}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mais filtros"
        className="relative w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-xl font-bold text-brand-navy">Mais filtros</h3>
            <p className="mt-1 text-sm text-slate-500">
              Marque o que o imóvel precisa ter.
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-navy"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {CARACTERISTICAS.map((c) => (
            <label
              key={c.chave}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-brand-pink has-checked:border-brand-pink has-checked:bg-brand-blush/40"
            >
              <input
                type="checkbox"
                checked={filtros[c.chave] === true}
                onChange={(e) => onChange({ ...filtros, [c.chave]: e.target.checked })}
                className="h-4 w-4 shrink-0 rounded border-slate-300 accent-brand-pink"
              />
              <span className="text-sm font-medium text-brand-navy">{c.label}</span>
            </label>
          ))}
        </div>

        {maxPontosAr > 0 && (
          <label className="mt-4 flex flex-col text-xs font-medium uppercase tracking-wide text-slate-500">
            Pontos de ar-condicionado
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-pink"
              value={filtros.pontosArMin}
              onChange={(e) => onChange({ ...filtros, pontosArMin: Number(e.target.value) })}
            >
              <option value={0}>Qualquer</option>
              {Array.from({ length: maxPontosAr }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}+ {n === 1 ? "ponto" : "pontos"}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={limpar}
            className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
          >
            Ver {resultados} {resultados === 1 ? "imóvel" : "imóveis"}
          </button>
        </div>
      </div>
    </div>
  );
}
