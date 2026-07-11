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
    <section className="flex w-full flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-brand-purple">Localização</h2>
      <div className="w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <iframe
          src={mapaEmbedUrl}
          title={`Mapa de localização de ${nome}`}
          className="h-72 w-full"
          loading="lazy"
        />
      </div>
      <a
        href={mapaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-brand-blue hover:underline"
      >
        Abrir no Google Maps
      </a>
    </section>
  );
}
