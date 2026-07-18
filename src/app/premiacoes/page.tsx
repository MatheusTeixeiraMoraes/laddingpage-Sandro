import type { Metadata } from "next";
import Image from "next/image";
import { getPremiacoes } from "@/lib/premiacoes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premiações | Sandro Higuti Consultor Imobiliário",
  alternates: { canonical: "/premiacoes" },
  description:
    "Prêmios e reconhecimentos do Sandro Higuti, consultor imobiliário em Sorocaba. CRECI 278922.",
};

export default async function PremiacoesPage() {
  const premiacoes = await getPremiacoes();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest text-brand-pink">
          Reconhecimento
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
          Minhas premiações
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Prêmios e reconhecimentos que vieram do trabalho de cada dia — e da
          confiança de cada cliente.
        </p>
      </header>

      {premiacoes.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-400">
          Em breve, as premiações aparecem aqui.
        </div>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {premiacoes.map((premiacao) => (
            <li key={premiacao.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              <div className="relative aspect-[4/3]">
                <Image
                  src={premiacao.imagem}
                  alt={premiacao.titulo || "Premiação do Sandro Higuti"}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                {premiacao.titulo && (
                  <p className="text-sm font-semibold text-brand-navy">{premiacao.titulo}</p>
                )}
                {premiacao.ano != null && (
                  <p className="text-xs text-slate-400">{premiacao.ano}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
