"use client";

import { useMemo, useState } from "react";
import type { Empreendimento, Zona } from "@/types/empreendimento";
import {
  filterEmpreendimentos,
  FILTROS_VAZIOS,
  type Filtros,
  type PrazoEntrega,
} from "@/lib/filterEmpreendimentos";
import {
  faixasDePreco,
  faixasDeMetragem,
  anosDeEntrega,
  temProntoParaMorar,
  maxDormitorios,
} from "@/lib/faixas";
import { PRONTO_PARA_MORAR } from "@/lib/entrega";
import { RegiaoTabs } from "@/components/home/RegiaoTabs";
import { EmpreendimentoCard } from "@/components/EmpreendimentoCard";

const selectClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-pink";
const labelClass = "flex flex-col text-xs font-medium uppercase tracking-wide text-slate-500";

function precoCurto(valor: number): string {
  return valor >= 1_000_000
    ? `${(valor / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`
    : `${valor / 1000} mil`;
}

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

  // As opções saem do estoque: nada de faixa que devolve zero imóvel.
  const opcoes = useMemo(
    () => ({
      preco: faixasDePreco(empreendimentos),
      metragem: faixasDeMetragem(empreendimentos),
      anos: anosDeEntrega(empreendimentos),
      temPronto: temProntoParaMorar(empreendimentos),
      dorms: maxDormitorios(empreendimentos),
    }),
    [empreendimentos],
  );

  const resultados = useMemo(
    () => filterEmpreendimentos(empreendimentos, filtros, ""),
    [empreendimentos, filtros],
  );

  const parseOrNull = (v: string): number | null => (v === "" ? null : Number(v));

  const prazoParaValor = (v: string): PrazoEntrega =>
    v === "todos" || v === "pronto" ? v : Number(v);

  const filtrosAtivos =
    filtros.zona !== "todas" ||
    filtros.entrega !== "todos" ||
    filtros.dormitoriosMin !== 0 ||
    filtros.precoMin !== null ||
    filtros.precoMax !== null ||
    filtros.metragemMin !== null ||
    filtros.metragemMax !== null;

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

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {/* "Pronto para morar" nao cabe em meia largura no celular. */}
            <label className={`${labelClass} col-span-2 sm:col-span-1`}>
              Entrega
              <select
                className={selectClass}
                value={String(filtros.entrega)}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, entrega: prazoParaValor(e.target.value) }))
                }
              >
                <option value="todos">Qualquer</option>
                {opcoes.temPronto && <option value="pronto">{PRONTO_PARA_MORAR}</option>}
                {opcoes.anos.map((ano) => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Dormitórios
              <select
                className={selectClass}
                value={filtros.dormitoriosMin}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, dormitoriosMin: Number(e.target.value) }))
                }
              >
                <option value={0}>Qualquer</option>
                {Array.from({ length: opcoes.dorms }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}+</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Valor mín.
              <select
                className={selectClass}
                value={filtros.precoMin ?? ""}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, precoMin: parseOrNull(e.target.value) }))
                }
              >
                <option value="">Qualquer</option>
                {opcoes.preco.min.map((v) => (
                  <option key={v} value={v}>R$ {precoCurto(v)}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Valor máx.
              <select
                className={selectClass}
                value={filtros.precoMax ?? ""}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, precoMax: parseOrNull(e.target.value) }))
                }
              >
                <option value="">Qualquer</option>
                {opcoes.preco.max.map((v) => (
                  <option key={v} value={v}>R$ {precoCurto(v)}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Área mín.
              <select
                className={selectClass}
                value={filtros.metragemMin ?? ""}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, metragemMin: parseOrNull(e.target.value) }))
                }
              >
                <option value="">Qualquer</option>
                {opcoes.metragem.min.map((v) => (
                  <option key={v} value={v}>{v} m²</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Área máx.
              <select
                className={selectClass}
                value={filtros.metragemMax ?? ""}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, metragemMax: parseOrNull(e.target.value) }))
                }
              >
                <option value="">Qualquer</option>
                {opcoes.metragem.max.map((v) => (
                  <option key={v} value={v}>{v} m²</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {resultados.length} {resultados.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
            </p>
            {filtrosAtivos && (
              <button
                type="button"
                onClick={() => setFiltros(FILTROS_VAZIOS)}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          {resultados.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-slate-500">Nenhum imóvel encontrado com esses filtros.</p>
              <button
                type="button"
                onClick={() => setFiltros(FILTROS_VAZIOS)}
                className="mt-3 rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
              >
                Limpar filtros
              </button>
            </div>
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
