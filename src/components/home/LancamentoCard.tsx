import Image from "next/image";
import Link from "next/link";
import type { Empreendimento } from "@/types/empreendimento";
import { formatarEntrega } from "@/lib/entrega";

function plantaBase(empreendimento: Empreendimento) {
  return empreendimento.plantas.reduce((menor, atual) =>
    atual.metragem < menor.metragem ? atual : menor,
  );
}

function IconDorm() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M3 18h18M3 18v2M21 18v2M6 11V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
    </svg>
  );
}
function IconArea() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4zM4 9h5M15 20v-5M9 4v3" />
    </svg>
  );
}
function IconEntrega() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function LancamentoCard({ empreendimento }: { empreendimento: Empreendimento }) {
  const base = plantaBase(empreendimento);

  return (
    <Link
      href={`/empreendimentos/${empreendimento.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={empreendimento.imagem}
          alt={empreendimento.nome}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-pink shadow-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 21s-7-4.35-9.33-8.17C1.1 10.1 2.06 6.5 5.2 6.02c1.87-.28 3.5.8 4.3 2.05.8-1.25 2.43-2.33 4.3-2.05 3.14.48 4.1 4.08 2.53 6.81C19 16.65 12 21 12 21Z" />
          </svg>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading font-bold text-brand-navy">{empreendimento.nome}</h3>
        <p className="text-sm text-slate-500">{empreendimento.bairro}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1"><IconDorm /> {base.dormitorios} dorms</span>
          <span className="inline-flex items-center gap-1"><IconArea /> {base.metragem}m²</span>
          <span className="inline-flex items-center gap-1"><IconEntrega /> {formatarEntrega(empreendimento.entregaEm)}</span>
        </div>
      </div>
    </Link>
  );
}
