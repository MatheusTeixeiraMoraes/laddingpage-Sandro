import { GALERIA_FOTOS } from "@/data/sobre";

export function GaleriaFotos() {
  return (
    <section className="flex w-full flex-col items-center gap-4">
      <h2 className="font-heading text-2xl font-bold text-brand-navy">Galeria</h2>
      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {GALERIA_FOTOS.map((legenda, index) => (
          <div
            key={index}
            className="flex h-32 items-center justify-center rounded-xl bg-brand-blush p-2 text-center text-xs font-medium text-brand-pink"
          >
            {legenda}
          </div>
        ))}
      </div>
    </section>
  );
}
