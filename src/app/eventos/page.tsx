import type { Metadata } from "next";
import Image from "next/image";
import { getEventos } from "@/lib/eventos";
import { GaleriaEvento } from "@/components/eventos/GaleriaEvento";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos | Sandro Higuti Consultor Imobiliário",
  alternates: { canonical: "/eventos" },
  description:
    "Lançamentos e eventos de que o Sandro Higuti participa — consultor imobiliário em Sorocaba.",
};

export default async function EventosPage() {
  const eventos = await getEventos();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest text-brand-pink">
          Eventos
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
          Eventos e lançamentos
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Estar presente é parte do trabalho: lançamentos, convenções e bastidores
          do mercado imobiliário que eu acompanho de perto por você.
        </p>
      </header>

      {eventos.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-400">
          Em breve, os eventos aparecem aqui.
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-16">
          {eventos.map((evento) => (
            <section key={evento.id}>
              <div className="grid items-center gap-8 md:grid-cols-[300px_1fr]">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-2xl shadow-md">
                  <Image
                    src={evento.capa}
                    alt={evento.nome || "Evento do Sandro Higuti"}
                    fill
                    sizes="(max-width: 768px) 90vw, 300px"
                    className="object-cover"
                  />
                </div>
                <div>
                  {evento.nome && (
                    <h2 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
                      {evento.nome}
                    </h2>
                  )}
                  {evento.descricao && (
                    <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-slate-600">
                      {evento.descricao}
                    </p>
                  )}
                </div>
              </div>

              {evento.galeria.length > 0 && (
                <div className="mt-8">
                  <GaleriaEvento imagens={evento.galeria} />
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
