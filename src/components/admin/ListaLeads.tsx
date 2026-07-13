"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@/types/lead";
import { marcarAtendido, excluirLead } from "@/lib/admin/leads";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function quando(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** wa.me exige só dígitos, com o 55 na frente. */
function linkDoLead(lead: Lead): string {
  const digitos = lead.telefone.replace(/\D/g, "");
  const comPais = digitos.startsWith("55") ? digitos : `55${digitos}`;
  const texto = `Olá, ${lead.nome.split(" ")[0]}! Aqui é o Sandro Higuti. Vi que você procura ${lead.interesse.toLowerCase()} — posso te ajudar?`;
  return buildWhatsAppLink(texto, comPais);
}

export function ListaLeads({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);

  const alternar = async (lead: Lead) => {
    setErro(null);
    try {
      await marcarAtendido(lead.id, !lead.atendido);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível atualizar.");
    }
  };

  const remover = async (lead: Lead) => {
    if (!confirm(`Excluir o lead de ${lead.nome}? Essa ação não pode ser desfeita.`)) return;
    setErro(null);
    try {
      await excluirLead(lead.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível excluir.");
    }
  };

  if (leads.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
        Nenhum lead ainda. Eles aparecem aqui assim que alguém preenche o
        formulário da home.
      </p>
    );
  }

  return (
    <div>
      {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}

      <ul className="flex flex-col gap-3">
        {leads.map((lead) => (
          <li
            key={lead.id}
            className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${
              lead.atendido ? "border-slate-100 bg-slate-50" : "border-brand-pink/30 bg-white"
            }`}
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-semibold text-brand-navy">
                {lead.nome}
                {!lead.atendido && (
                  <span className="rounded-full bg-brand-pink px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    novo
                  </span>
                )}
              </p>
              <p className="text-sm text-slate-500">
                {lead.telefone} · {lead.interesse || "sem interesse informado"}
              </p>
              <p className="text-xs text-slate-400">{quando(lead.criadoEm)}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={linkDoLead(lead)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-pink px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
              >
                Chamar no WhatsApp
              </a>
              <button
                type="button"
                onClick={() => alternar(lead)}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
              >
                {lead.atendido ? "Marcar como novo" : "Marcar como atendido"}
              </button>
              <button
                type="button"
                onClick={() => remover(lead)}
                className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
