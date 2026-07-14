"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { RankingItem } from "@/lib/ranking";
import { salvarDestaques } from "@/lib/admin/destaques";

function mesmoConjunto(a: Set<string>, b: Set<string>) {
  return a.size === b.size && [...a].every((x) => b.has(x));
}

export function GestaoDestaques({ ranking }: { ranking: RankingItem[] }) {
  const router = useRouter();
  const iniciais = () => new Set(ranking.filter((r) => r.destaque).map((r) => r.id));

  const [selecionados, setSelecionados] = useState<Set<string>>(iniciais);
  const [base, setBase] = useState<Set<string>>(iniciais);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const alterado = !mesmoConjunto(selecionados, base);

  const alternar = (id: string) => {
    setErro(null);
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
  };

  const marcarTodos = () => {
    setErro(null);
    setSelecionados(new Set(ranking.map((r) => r.id)));
  };

  const limpar = () => {
    setErro(null);
    setSelecionados(new Set());
  };

  const handleSalvar = async () => {
    setErro(null);
    setSalvando(true);
    try {
      await salvarDestaques([...selecionados], ranking.map((r) => r.id));
      setBase(new Set(selecionados));
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div>
      <div className="sticky top-20 z-10 -mx-2 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={marcarTodos}
            className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
          >
            Selecionar todos
          </button>
          <button
            type="button"
            onClick={limpar}
            className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
          >
            Limpar
          </button>
          <span className="text-slate-400">
            {selecionados.size} em destaque
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!alterado && !salvando && (
            <span className="text-sm text-slate-400">Tudo salvo</span>
          )}
          <button
            type="button"
            onClick={handleSalvar}
            disabled={!alterado || salvando}
            className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar destaques"}
          </button>
        </div>
      </div>

      {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}

      <ul className="flex flex-col gap-2">
        {ranking.map((item) => {
          const marcado = selecionados.has(item.id);
          return (
            <li key={item.id}>
              <label
                className={`flex cursor-pointer flex-wrap items-center gap-4 rounded-2xl border bg-white p-3 shadow-sm transition-colors ${
                  marcado
                    ? "border-brand-pink ring-1 ring-brand-pink/30"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={() => alternar(item.id)}
                  className="h-5 w-5 shrink-0 accent-brand-pink"
                />

                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-blush">
                  {item.imagem && (
                    <Image
                      src={item.imagem}
                      alt={item.nome}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading font-bold text-brand-navy">
                    {item.nome}
                  </p>
                  <p className="truncate text-sm text-slate-500">{item.bairro}</p>
                </div>

                <div className="flex items-center gap-2 text-center">
                  <span className="rounded-lg bg-brand-blush/60 px-3 py-1.5">
                    <span className="block font-heading text-base font-bold text-brand-navy">
                      {item.cliques}
                    </span>
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Cliques
                    </span>
                  </span>
                  <span className="rounded-lg bg-slate-50 px-3 py-1.5">
                    <span className="block font-heading text-base font-bold text-brand-navy">
                      {item.leads}
                    </span>
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Leads
                    </span>
                  </span>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
