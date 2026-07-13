import Link from "next/link";
import { Depoimentos } from "@/components/Depoimentos";
import { CarrosselClientes } from "@/components/home/CarrosselClientes";

export function ClientesAmigos() {
  return (
    <section id="depoimentos" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
            Histórias que inspiram
          </p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Clientes que se tornam <span className="text-brand-pink">amigos</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Cada conquista é única. Estes são alguns dos momentos de entrega de
            chave que viraram amizade de verdade.
          </p>
        </div>
      </div>

      {/* Fora do container: a faixa desliza de borda a borda. */}
      <div className="mt-10">
        <CarrosselClientes />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mt-8 text-center">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink"
          >
            Ir para a galeria de depoimentos
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="mt-14 empty:mt-0">
          <Depoimentos />
        </div>
      </div>
    </section>
  );
}
