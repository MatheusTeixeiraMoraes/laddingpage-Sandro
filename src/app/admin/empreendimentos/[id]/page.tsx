import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmpreendimentoById } from "@/lib/empreendimentos";
import { EmpreendimentoForm } from "@/components/admin/EmpreendimentoForm";
import { PlantasManager } from "@/components/admin/PlantasManager";

export const dynamic = "force-dynamic";

export default async function EditarEmpreendimentoPage({
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
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
        >
          ← Voltar ao painel
        </Link>
        <Link
          href={`/empreendimentos/${empreendimento.id}`}
          target="_blank"
          className="text-sm font-medium text-brand-pink hover:underline"
        >
          Ver no site
        </Link>
      </div>

      <h1 className="mt-3 font-heading text-2xl font-extrabold text-brand-navy">
        Editar empreendimento
      </h1>
      <p className="mt-1 text-sm text-slate-500">{empreendimento.nome}</p>

      <div className="mt-6">
        <EmpreendimentoForm empreendimento={empreendimento} />
      </div>

      <div className="mt-10">
        <PlantasManager
          empreendimentoId={empreendimento.id}
          plantas={empreendimento.plantas}
        />
      </div>
    </div>
  );
}
