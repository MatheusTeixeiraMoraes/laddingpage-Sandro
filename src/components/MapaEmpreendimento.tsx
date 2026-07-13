export function MapaEmpreendimento({
  nome,
  latitude,
  longitude,
}: {
  nome: string;
  latitude: number;
  longitude: number;
}) {
  const mapaEmbedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
  const mapaLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <section className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-brand-navy">
            Localização
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Veja onde fica o {nome} em Sorocaba.
          </p>
        </div>
        <a
          href={mapaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-pink transition-colors hover:underline"
        >
          Abrir no Google Maps
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5M19 5l-7 7M10 5H5v14h14v-5" />
          </svg>
        </a>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100 shadow-md">
        <iframe
          src={mapaEmbedUrl}
          title={`Mapa de localização de ${nome}`}
          className="h-80 w-full"
          loading="lazy"
        />
      </div>
    </section>
  );
}
