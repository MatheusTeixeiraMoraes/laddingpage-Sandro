import { depoimentos } from "@/data/depoimentos";

function estrelas(nota: number): string {
  return "★".repeat(nota) + "☆".repeat(5 - nota);
}

export function Depoimentos() {
  // Sem depoimento real, a seção não existe. Melhor um site com menos secoes do
  // que um site com depoimento inventado.
  if (depoimentos.length === 0) return null;

  return (
    <section className="flex w-full flex-col items-center gap-4">
      <h2 className="font-heading text-2xl font-bold text-brand-navy">
        O que dizem os clientes
      </h2>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {depoimentos.map((depoimento) => (
          <div
            key={depoimento.id}
            className="flex flex-col gap-1 rounded-2xl border border-slate-100 p-4 text-left shadow-sm"
          >
            <p className="text-brand-pink">{estrelas(depoimento.nota)}</p>
            <p className="text-sm text-slate-600">&ldquo;{depoimento.texto}&rdquo;</p>
            <p className="text-sm font-bold text-slate-800">{depoimento.autor}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
