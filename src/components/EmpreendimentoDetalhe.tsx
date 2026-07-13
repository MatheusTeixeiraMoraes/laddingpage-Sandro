"use client";

import { useState } from "react";
import type { Empreendimento } from "@/types/empreendimento";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatarPrecoAPartirDe } from "@/lib/preco";
import { PlantaSelector, labelDaPlanta } from "@/components/PlantaSelector";

function Spec({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-heading text-lg font-bold text-brand-navy">{valor}</p>
    </div>
  );
}

export function EmpreendimentoDetalhe({
  empreendimento,
}: {
  empreendimento: Empreendimento;
}) {
  const [plantaId, setPlantaId] = useState(empreendimento.plantas[0].id);
  const planta =
    empreendimento.plantas.find((item) => item.id === plantaId) ??
    empreendimento.plantas[0];

  const whatsappLink = buildWhatsAppLink(
    `Olá, vi o imóvel ${empreendimento.nome} (${labelDaPlanta(planta)}) no site e gostaria de saber mais informações.`,
  );

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="font-heading text-2xl font-extrabold text-brand-navy">
          Plantas disponíveis
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Escolha a opção e veja o que muda em cada planta.
        </p>

        <div className="mt-5">
          <PlantaSelector
            plantas={empreendimento.plantas}
            selecionadaId={planta.id}
            onSelect={setPlantaId}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Spec label="Dormitórios" valor={String(planta.dormitorios)} />
          <Spec label="Metragem" valor={`${planta.metragem} m²`} />
          <Spec label="Vagas" valor={String(planta.vagas)} />
          <Spec label="Suíte" valor={planta.comSuite ? "Sim" : "Não"} />
        </div>

        {planta.fotos.length > 0 && (
          <div className="mt-8">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-500">
              Ambientes desta planta
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {planta.fotos.map((ambiente) => (
                <span
                  key={ambiente}
                  className="rounded-full bg-brand-blush px-4 py-2 text-sm font-medium text-brand-navy"
                >
                  {ambiente}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {labelDaPlanta(planta)}
          </p>
          <p className="mt-1 font-heading text-xl font-extrabold leading-snug text-brand-pink">
            {formatarPrecoAPartirDe(planta.preco)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Valores e condições sujeitos a confirmação.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-600"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
            </svg>
            Falar sobre esta planta
          </a>

          <p className="mt-4 text-center text-xs text-slate-400">
            Atendimento direto com Sandro Higuti · CRECI 278922
          </p>
        </div>
      </aside>
    </div>
  );
}
