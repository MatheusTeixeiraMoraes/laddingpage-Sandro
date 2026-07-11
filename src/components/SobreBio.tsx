import { BIO_TEXTO } from "@/data/sobre";

export function SobreBio() {
  return (
    <section className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-brand-purple/10 text-sm font-medium text-brand-purple">
        Foto do Sandro
      </div>
      <h2 className="text-2xl font-bold text-brand-purple">Sobre o Sandro Higuti</h2>
      <p className="max-w-2xl text-slate-600">{BIO_TEXTO}</p>
    </section>
  );
}
