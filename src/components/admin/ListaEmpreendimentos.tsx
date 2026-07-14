"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Empreendimento, Zona } from "@/types/empreendimento";
import { excluirEmpreendimento } from "@/lib/admin/empreendimentos";
import { formatarEntrega } from "@/lib/entrega";

const ZONA_LABEL: Record<Zona, string> = {
  norte: "Zona Norte",
  sul: "Zona Sul",
  leste: "Zona Leste",
  oeste: "Zona Oeste",
  central: "Central",
};

export function ListaEmpreendimentos({
  empreendimentos,
}: {
  empreendimentos: Empreendimento[];
}) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  const handleExcluir = async (empreendimento: Empreendimento) => {
    const confirmado = confirm(
      `Excluir "${empreendimento.nome}"? As ${empreendimento.plantas.length} planta(s) dele também serão apagadas. Essa ação não pode ser desfeita.`,
    );
    if (!confirmado) return;

    setErro(null);
    setExcluindo(empreendimento.id);
    try {
      await excluirEmpreendimento(empreendimento.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível excluir.");
    } finally {
      setExcluindo(null);
    }
  };

  if (empreendimentos.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
        Nenhum empreendimento cadastrado ainda.
      </p>
    );
  }

  return (
    <div>
      {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}

      <ul className="flex flex-col gap-3">
        {empreendimentos.map((emp) => (
          <li
            key={emp.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-blush">
              {emp.imagem && (
                <Image
                  src={emp.imagem}
                  alt={emp.nome}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-heading font-bold text-brand-navy">
                {emp.nome}
                {emp.destaque && (
                  <span className="shrink-0 rounded-full bg-brand-pink px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Destaque
                  </span>
                )}
              </p>
              <p className="text-sm text-slate-500">
                {ZONA_LABEL[emp.zona]} · {emp.plantas.length} planta(s) ·{" "}
                {formatarEntrega(emp.entregaEm)}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/empreendimentos/${emp.id}`}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleExcluir(emp)}
                disabled={excluindo === emp.id}
                className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {excluindo === emp.id ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
