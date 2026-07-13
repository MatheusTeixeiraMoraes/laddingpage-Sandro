import Image from "next/image";
import { Depoimentos } from "@/components/Depoimentos";

const FOTOS = [1, 2, 3, 4, 5, 6];

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

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {FOTOS.map((n) => (
            <div key={n} className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm">
              <Image
                src={`/clientes/cliente-${n}.jpg`}
                alt={`Cliente do Sandro Higuti na entrega das chaves ${n}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-14 empty:mt-0">
          <Depoimentos />
        </div>
      </div>
    </section>
  );
}
