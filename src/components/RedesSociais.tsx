import { REDES_SOCIAIS } from "@/data/sobre";

export function RedesSociais() {
  return (
    <section className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-brand-purple">Redes sociais</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {REDES_SOCIAIS.map((rede) => (
          <a
            key={rede.nome}
            href={rede.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {rede.nome}
          </a>
        ))}
      </div>
    </section>
  );
}
