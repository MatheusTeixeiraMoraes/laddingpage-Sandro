import { notFound } from "next/navigation";
import { getEmpreendimentoById } from "@/lib/empreendimentos";
import { EmpreendimentoDetalhe } from "@/components/EmpreendimentoDetalhe";
import { MapaEmpreendimento } from "@/components/MapaEmpreendimento";

export const dynamic = "force-dynamic";

export default async function EmpreendimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empreendimento = await getEmpreendimentoById(id);

  if (!empreendimento) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-brand-purple sm:text-4xl">
        {empreendimento.nome}
      </h1>
      <p className="text-slate-500">{empreendimento.bairro}</p>
      <EmpreendimentoDetalhe empreendimento={empreendimento} />
      <MapaEmpreendimento
        nome={empreendimento.nome}
        latitude={empreendimento.latitude}
        longitude={empreendimento.longitude}
      />
    </div>
  );
}
