import Link from "next/link";
import type { Empreendimento } from "@/types/empreendimento";
import { LancamentoCard } from "@/components/home/LancamentoCard";

export function LancamentosDestaque({
  empreendimentos,
}: {
  empreendimentos: Empreendimento[];
}) {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
            Lançamentos em destaque
          </p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Apartamentos na planta <span className="text-brand-pink">para o seu futuro</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {empreendimentos.map((emp) => (
            <LancamentoCard key={emp.id} empreendimento={emp} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="#imoveis"
            className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-navy/90"
          >
            Ver todos os imóveis
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
