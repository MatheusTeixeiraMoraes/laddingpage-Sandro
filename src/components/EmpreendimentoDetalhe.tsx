"use client";

import { useState } from "react";
import Image from "next/image";
import type { Empreendimento } from "@/types/empreendimento";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatarPrecoCurto } from "@/lib/preco";
import { faixaDeMetragem, listaDeDormitorios } from "@/lib/resumo";
import { PlantaSelector, labelDaPlanta } from "@/components/PlantaSelector";

function Spec({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-heading text-lg font-bold text-brand-navy">{valor}</p>
    </div>
  );
}

const PISO: Record<Empreendimento["entregaComPiso"], string> = {
  "": "",
  completo: "Completo",
  areas_molhadas: "Só áreas molhadas",
};

const DOCUMENTACAO: Record<Empreendimento["documentacao"], string> = {
  "": "",
  gratis: "Grátis",
  pago: "Por conta do comprador",
};

/** Só entra na ficha o que foi informado — campo vazio não vira card vazio. */
function fichaTecnica(e: Empreendimento): { label: string; valor: string }[] {
  const linhas: { label: string; valor: string | null }[] = [
    { label: "Dormitórios", valor: listaDeDormitorios(e.dormitorios) },
    { label: "Metragem", valor: faixaDeMetragem(e) },
    { label: "Plantas", valor: e.plantas.length > 0 ? String(e.plantas.length) : null },
    { label: "Construtora", valor: e.construtora || null },
    { label: "Torres", valor: e.torres !== null ? String(e.torres) : null },
    { label: "Andares", valor: e.andares || null },
    {
      label: "Aptos. por andar",
      valor: e.aptosPorAndar !== null ? String(e.aptosPorAndar) : null,
    },
    {
      label: "Elevadores",
      valor: e.elevadores !== null ? String(e.elevadores) : null,
    },
    {
      label: "Ar-condicionado",
      valor: e.pontosAr
        ? `${e.pontosAr} ${e.pontosAr === 1 ? "ponto" : "pontos"}`
        : null,
    },
    { label: "Piso", valor: PISO[e.entregaComPiso] || null },
    { label: "Documentação", valor: DOCUMENTACAO[e.documentacao] || null },
  ];

  return linhas.filter((l): l is { label: string; valor: string } => l.valor !== null);
}

export function EmpreendimentoDetalhe({
  empreendimento,
}: {
  empreendimento: Empreendimento;
}) {
  const temPlantas = empreendimento.plantas.length > 0;
  const [plantaId, setPlantaId] = useState(empreendimento.plantas[0]?.id ?? "");
  const planta =
    empreendimento.plantas.find((item) => item.id === plantaId) ??
    empreendimento.plantas[0];

  const whatsappLink = buildWhatsAppLink(
    planta
      ? `Olá, vi o imóvel ${empreendimento.nome} (planta de ${labelDaPlanta(planta)}) no site e gostaria de saber mais informações.`
      : `Olá, vi o imóvel ${empreendimento.nome} no site e gostaria de saber mais informações.`,
  );

  // O preço da planta é opcional; o oficial é o "a partir de" do empreendimento.
  const preco = planta?.preco ?? empreendimento.precoAPartirDe;

  const presentes = [
    { label: "Suíte", tem: empreendimento.suite },
    { label: "Varanda", tem: empreendimento.varanda },
    { label: "Quintal", tem: empreendimento.quintal },
    { label: "Garagem coberta", tem: empreendimento.garagemCoberta },
    { label: "Vaga dupla", tem: empreendimento.vagaDupla },
  ].filter((c) => c.tem);

  const ficha = fichaTecnica(empreendimento);
  const paragrafos = empreendimento.descricao
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="font-heading text-xl font-extrabold text-brand-navy">
          Ficha técnica
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ficha.map((item) => (
            <Spec key={item.label} label={item.label} valor={item.valor} />
          ))}
        </div>

        {presentes.length > 0 && (
          <div className="mt-6">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-500">
              O que este empreendimento tem
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {presentes.map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-blush px-4 py-2 text-sm font-medium text-brand-navy"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3.5 w-3.5 text-brand-pink">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {paragrafos.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-xl font-extrabold text-brand-navy">
              Sobre o empreendimento
            </h2>
            <div className="mt-4 flex flex-col gap-3 text-slate-600">
              {paragrafos.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {temPlantas && (
          <div className="mt-10">
            <h2 className="font-heading text-2xl font-extrabold text-brand-navy">
              Plantas disponíveis
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {empreendimento.plantas.length === 1
                ? "Este empreendimento tem uma planta."
                : "Escolha o tamanho e veja as imagens dessa planta."}
            </p>

            <div className="mt-5">
              <PlantaSelector
                plantas={empreendimento.plantas}
                selecionadaId={planta.id}
                onSelect={setPlantaId}
              />
            </div>

            {planta.imagens.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {planta.imagens.map((img, i) => (
                  <figure
                    key={img}
                    className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm"
                  >
                    <div className="relative h-64 w-full bg-white">
                      <Image
                        src={img}
                        alt={`Planta de ${labelDaPlanta(planta)} — imagem ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain"
                      />
                    </div>
                    <figcaption className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-xs font-medium text-brand-navy">
                      Planta de {labelDaPlanta(planta)}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                As imagens da planta de {labelDaPlanta(planta)} ainda não foram publicadas.
              </p>
            )}
          </div>
        )}
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
          {temPlantas && (
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Planta de {labelDaPlanta(planta)}
            </p>
          )}
          <p className="mt-3 text-sm font-medium text-slate-500">A partir de</p>
          <p className="font-heading text-3xl font-extrabold leading-tight text-brand-pink">
            {formatarPrecoCurto(preco)}
          </p>
          <p className="mt-1.5 text-xs text-slate-400">
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
            {temPlantas ? "Falar sobre esta planta" : "Falar sobre este imóvel"}
          </a>

          <p className="mt-4 text-center text-xs text-slate-400">
            Atendimento direto com Sandro Higuti · CRECI 278922
          </p>
        </div>
      </aside>
    </div>
  );
}
