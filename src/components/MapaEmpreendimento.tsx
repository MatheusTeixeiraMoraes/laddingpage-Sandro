import type { Empreendimento } from "@/types/empreendimento";

/**
 * Mapa sangrando na metade esquerda e o texto do bairro na direita.
 * A seção é full-bleed: quem usa precisa colocá-la FORA do container central.
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
    <section className="grid lg:grid-cols-2">
      <iframe
        src={mapaEmbedUrl}
        title={`Mapa de localização de ${nome}`}
        className="h-80 w-full border-0 sm:h-[420px] lg:h-full lg:min-h-[460px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div className="flex flex-col justify-center bg-brand-navy px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
        <h2 className="font-heading text-4xl font-extrabold tracking-tight text-brand-pink sm:text-5xl">
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
