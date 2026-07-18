"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Grade de fotos de um evento. Clicar abre a foto em tela cheia (lightbox);
 * clicar de novo ou apertar Esc fecha.
 */
export function GaleriaEvento({ imagens }: { imagens: string[] }) {
  const [aberta, setAberta] = useState<string | null>(null);

  useEffect(() => {
    if (!aberta) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberta(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberta]);

  if (imagens.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {imagens.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setAberta(url)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100"
          >
            <Image
              src={url}
              alt={`Foto do evento ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {aberta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setAberta(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Foto do evento"
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {/* Foto em tamanho cheio: <img> simples (next/image com fill num overlay
              fixo nao ajuda aqui). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aberta}
            alt="Foto do evento"
            className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
