"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function GaleriaEmpreendimento({
  nome,
  fotos,
}: {
  nome: string;
  fotos: string[];
}) {
  const [aberta, setAberta] = useState<number | null>(null);

  useEffect(() => {
    if (aberta === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberta(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberta]);

  if (fotos.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="font-heading text-2xl font-extrabold text-brand-navy">Galeria</h2>
      <p className="mt-1 text-sm text-slate-500">
        Fotos do {nome}. Clique para ampliar.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fotos.map((foto, i) => (
          <button
            key={foto}
            type="button"
            onClick={() => setAberta(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]"
          >
            <Image
              src={foto}
              alt={`${nome} — foto ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {aberta !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/90 p-4"
          onClick={() => setAberta(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada de ${nome}`}
        >
          <button
            type="button"
            onClick={() => setAberta(null)}
            aria-label="Fechar"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition-colors hover:bg-white/25"
          >
            ✕
          </button>

          <div
            className="relative h-[75vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fotos[aberta]}
              alt={`${nome} — foto ${aberta + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {fotos.length > 1 && (
            <div className="absolute bottom-6 flex gap-2" onClick={(e) => e.stopPropagation()}>
              {fotos.map((foto, i) => (
                <button
                  key={foto}
                  type="button"
                  onClick={() => setAberta(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={
                    i === aberta
                      ? "h-2.5 w-6 rounded-full bg-brand-pink"
                      : "h-2.5 w-2.5 rounded-full bg-white/50 transition-colors hover:bg-white/80"
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
