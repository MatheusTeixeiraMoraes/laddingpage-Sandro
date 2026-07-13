import type { Empreendimento } from "@/types/empreendimento";

/**
 * Mapa à esquerda e o texto do bairro à direita, dentro de um card — como o
 * resto da página. Sangrar até a borda destoava de todos os outros blocos.
 */
export function MapaEmpreendimento({
  empreendimento,
}: {
  empreendimento: Empreendimento;
}) {
  const { nome, endereco, sobreBairro, latitude, longitude } = empreendimento;

  const mapaEmbedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  const mapaLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const paragrafos = sobreBairro
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="grid overflow-hidden rounded-3xl shadow-md lg:grid-cols-2">
      <iframe
        src={mapaEmbedUrl}
        title={`Mapa de localização de ${nome}`}
        className="h-72 w-full border-0 sm:h-96 lg:h-full lg:min-h-[420px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div className="flex flex-col justify-center bg-brand-navy px-6 py-10 sm:px-10 sm:py-12">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-brand-pink sm:text-4xl">
          Localização
        </h2>

        {paragrafos.length > 0 ? (
          <>
            <h3 className="mt-5 font-heading text-xl font-bold text-white sm:text-2xl">
              Sobre o bairro
            </h3>
            <div className="mt-4 flex max-w-xl flex-col gap-3 text-slate-300">
              {paragrafos.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-5 max-w-xl text-slate-300">
            Veja no mapa onde fica o {nome}, em Sorocaba.
          </p>
        )}

        {endereco && (
          <p className="mt-6 text-sm font-medium text-white/70">{endereco}</p>
        )}

        <a
          href={mapaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
        >
          Abrir no Google Maps
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5M19 5l-7 7M10 5H5v14h14v-5" />
          </svg>
        </a>
      </div>
    </section>
  );
}
