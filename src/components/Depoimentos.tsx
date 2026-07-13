import { depoimentos } from "@/data/depoimentos";

/** Busca o perfil dele no Maps. Trocar pelo link direto quando tivermos. */
const PERFIL_GOOGLE =
  "https://www.google.com/maps/search/?api=1&query=Sandro+Higuti+Consultor+Imobili%C3%A1rio+R.+Justiniano+de+Souza+145+Sorocaba";

function estrelas(nota: number): string {
  return "★".repeat(nota) + "☆".repeat(5 - nota);
}

export function Depoimentos() {
  // Sem depoimento real, a seção não existe. Melhor um site com uma seção a
  // menos do que um site com depoimento inventado.
  if (depoimentos.length === 0) return null;

  return (
    <section className="flex w-full flex-col items-center gap-2">
      <h2 className="font-heading text-2xl font-bold text-brand-navy">
        O que dizem os clientes
      </h2>
      <p className="text-sm text-slate-500">
        Avaliações publicadas no Google.{" "}
        <a
          href={PERFIL_GOOGLE}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-pink hover:underline"
        >
          Ver no Google
        </a>
      </p>

      <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {depoimentos.map((depoimento) => (
          <blockquote
            key={depoimento.id}
            className="flex flex-col gap-1 rounded-2xl border border-slate-100 p-5 text-left shadow-sm"
          >
            <p className="text-brand-pink" aria-label={`${depoimento.nota} de 5 estrelas`}>
              {estrelas(depoimento.nota)}
            </p>
            <p className="text-sm text-slate-600">&ldquo;{depoimento.texto}&rdquo;</p>
            <footer className="mt-1 text-sm font-bold text-brand-navy">
              {depoimento.autor}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
