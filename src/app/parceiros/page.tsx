import type { Metadata } from "next";
import Image from "next/image";
import { getParceiros } from "@/lib/parceiros";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Parceiros | Sandro Higuti Consultor Imobiliário",
  alternates: { canonical: "/parceiros" },
  description:
    "Parcerias do Sandro Higuti: benefícios e descontos exclusivos para quem compra o imóvel com ele.",
};

export default async function ParceirosPage() {
  const parceiros = await getParceiros();
  const destaque = parceiros.find((p) => p.destaque) ?? parceiros[0];
  const outros = parceiros.filter((p) => p.id !== destaque?.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest text-brand-pink">
          Parcerias
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
          Parcerias de sucesso
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Comprar o seu imóvel comigo rende mais do que as chaves: parceiros que
          oferecem descontos e vantagens exclusivas para quem fecha comigo.
        </p>
      </header>

      {parceiros.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-400">
          Em breve, as parcerias aparecem aqui.
        </div>
      ) : (
        <div className="mt-12 space-y-12">
          {destaque && (
            <div className="grid items-center gap-8 rounded-3xl border border-brand-pink/20 bg-brand-blush/20 p-6 shadow-sm sm:p-8 md:grid-cols-2">
              <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={destaque.imagem}
                  alt="Parceiro em destaque do Sandro Higuti"
                  fill
                  sizes="(max-width: 768px) 90vw, 400px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-pink px-3 py-1 text-xs font-semibold text-white">
                  ★ Parceiro em destaque
                </span>
                {destaque.texto && (
                  <p className="mt-4 text-lg leading-relaxed text-slate-700">{destaque.texto}</p>
                )}
              </div>
            </div>
          )}

          {outros.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {outros.map((parceiro) => (
                <div
                  key={parceiro.id}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={parceiro.imagem}
                      alt="Parceiro do Sandro Higuti"
                      fill
                      sizes="(max-width: 640px) 90vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  {parceiro.texto && (
                    <p className="p-4 text-sm leading-relaxed text-slate-600">{parceiro.texto}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
