import { googleReviews } from "@/data/googleReviews";

function estrelas(nota: number): string {
  return "★".repeat(nota) + "☆".repeat(5 - nota);
}

export function GoogleReviews() {
  return (
    <section className="flex w-full flex-col items-center gap-4">
      <h2 className="font-heading text-2xl font-bold text-brand-navy">Avaliações no Google</h2>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {googleReviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col gap-1 rounded-2xl border border-slate-100 p-4 text-left shadow-sm"
          >
            <p className="text-brand-pink">{estrelas(review.nota)}</p>
            <p className="text-sm text-slate-600">&ldquo;{review.texto}&rdquo;</p>
            <p className="text-sm font-bold text-slate-800">{review.autor}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
