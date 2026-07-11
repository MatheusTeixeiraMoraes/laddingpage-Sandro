"use client";

import { useState } from "react";
import type { Empreendimento } from "@/types/empreendimento";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PlantaSelector, labelDaPlanta } from "@/components/PlantaSelector";

function formatarPreco(preco: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
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
    <div className="flex flex-col items-center gap-6">
      <PlantaSelector
        plantas={empreendimento.plantas}
        selecionadaId={planta.id}
        onSelect={setPlantaId}
      />

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {planta.fotos.map((foto, index) => (
          <div
            key={index}
            className="flex h-32 items-center justify-center rounded-xl bg-brand-purple/10 p-2 text-center text-xs font-medium text-brand-purple"
          >
            Planta {labelDaPlanta(planta)} — {foto}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 text-slate-600">
        <p>
          {planta.dormitorios} dorm. · {planta.vagas} vaga(s) · {planta.metragem} m²
        </p>
        <p className="text-2xl font-bold text-brand-blue">
          {formatarPreco(planta.preco)}
        </p>
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-brand-purple px-6 py-3 font-medium text-white hover:bg-purple-700"
      >
        Falar no WhatsApp sobre esta planta
      </a>
    </div>
  );
}
