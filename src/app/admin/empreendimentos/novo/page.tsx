import Link from "next/link";
import { EmpreendimentoForm } from "@/components/admin/EmpreendimentoForm";
import { getBairros } from "@/lib/bairros";

export const dynamic = "force-dynamic";

export default async function NovoEmpreendimentoPage() {
  const bairros = await getBairros();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>
      <h1 className="mt-3 font-heading text-2xl font-extrabold text-brand-navy">
        Novo empreendimento
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Depois de criar, você adiciona as plantas na tela de edição.
      </p>

      <div className="mt-6">
        <EmpreendimentoForm bairros={bairros} />
      </div>
    </div>
  );
}
