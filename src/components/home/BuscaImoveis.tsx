"use client";

import { useMemo, useState } from "react";
import type { Empreendimento, Zona } from "@/types/empreendimento";
import {
  filterEmpreendimentos,
  FILTROS_VAZIOS,
  type Filtros,
} from "@/lib/filterEmpreendimentos";
import { RegiaoTabs } from "@/components/home/RegiaoTabs";
import { EmpreendimentoCard } from "@/components/EmpreendimentoCard";

const TIPOS: { value: Filtros["tipo"]; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "comercial", label: "Comercial" },
];

const DORMS = [0, 1, 2, 3];
const VAGAS = [0, 1, 2];

const selectClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-pink";
const labelClass = "flex flex-col text-xs font-medium uppercase tracking-wide text-slate-500";

export function BuscaImoveis({
  empreendimentos,
  zonaInicial = "todas",
}: {
  empreendimentos: Empreendimento[];
  zonaInicial?: Zona | "todas";
}) {
  const [filtros, setFiltros] = useState<Filtros>({
    ...FILTROS_VAZIOS,
    zona: zonaInicial,
  });

  const resultados = useMemo(
    () => filterEmpreendimentos(empreendimentos, filtros, ""),
    [empreendimentos, filtros],
  );

  const parseOrNull = (v: string): number | null => (v === "" ? null : Number(v));

  return (
    <section id="imoveis" className="scroll-mt-20 bg-white pb-4">
      <div className="mx-auto -mt-6 max-w-6xl px-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8">
          <h2 className="font-heading text-xl font-bold text-brand-navy sm:text-2xl">
            Encontre o imóvel ideal para você
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Escolha a região e refine pelos filtros abaixo.
          </p>

          <div className="mt-5">
            <RegiaoTabs
              value={filtros.zona}
              onChange={(zona) => setFiltros((f) => ({ ...f, zona }))}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <label className={labelClass}>
              Tipo
              <select
                className={selectClass}
                value={filtros.tipo}
                onChange={(e) => setFiltros((f) => ({ ...f, tipo: e.target.value as Filtros["tipo"] }))}
              >
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Dormitórios
              <select
                className={selectClass}
                value={filtros.dormitoriosMin}
                onChange={(e) => setFiltros((f) => ({ ...f, dormitoriosMin: Number(e.target.value) }))}
              >
                {DORMS.map((d) => (
                  <option key={d} value={d}>{d === 0 ? "Qualquer" : `${d}+`}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Vagas
              <select
                className={selectClass}
                value={filtros.vagasMin}
                onChange={(e) => setFiltros((f) => ({ ...f, vagasMin: Number(e.target.value) }))}
              >
                {VAGAS.map((v) => (
                  <option key={v} value={v}>{v === 0 ? "Qualquer" : `${v}+`}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Metragem mín.
              <input
                type="number"
                min={0}
                placeholder="m²"
                className={selectClass}
                value={filtros.metragemMin ?? ""}
                onChange={(e) => setFiltros((f) => ({ ...f, metragemMin: parseOrNull(e.target.value) }))}
              />
            </label>

            <label className={labelClass}>
              Metragem máx.
              <input
                type="number"
                min={0}
                placeholder="m²"
                className={selectClass}
                value={filtros.metragemMax ?? ""}
                onChange={(e) => setFiltros((f) => ({ ...f, metragemMax: parseOrNull(e.target.value) }))}
              />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {resultados.length} {resultados.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
            </p>
            <button
              type="button"
              onClick={() => setFiltros(FILTROS_VAZIOS)}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        <div className="mt-8">
          {resultados.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              Nenhum imóvel encontrado com esses filtros.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((emp) => (
                <EmpreendimentoCard key={emp.id} empreendimento={emp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
