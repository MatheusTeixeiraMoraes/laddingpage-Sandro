import { DEPOIMENTOS_VIDEO } from "@/data/sobre";

export function DepoimentosVideo() {
  return (
    <section className="flex w-full flex-col items-center gap-4">
      <h2 className="font-heading text-2xl font-bold text-brand-navy">Depoimentos em vídeo</h2>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        {DEPOIMENTOS_VIDEO.map((depoimento) => (
          <div
            key={depoimento.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex h-40 items-center justify-center bg-brand-blush text-3xl text-brand-pink">
              ▶
            </div>
            <div className="flex flex-col gap-1 p-4 text-left">
              <p className="text-sm text-slate-600">&ldquo;{depoimento.texto}&rdquo;</p>
              <p className="text-sm font-bold text-slate-800">{depoimento.nome}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
