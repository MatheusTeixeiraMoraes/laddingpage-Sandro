import Link from "next/link";
import { getPremiacoes } from "@/lib/premiacoes";
import { GerenciarPremiacoes } from "@/components/admin/GerenciarPremiacoes";

export const dynamic = "force-dynamic";

export default async function AdminPremiacoesPage() {
  const premiacoes = await getPremiacoes();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-3 font-heading text-2xl font-extrabold text-brand-navy">
        Premiações
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Seus prêmios e reconhecimentos — aparecem na página “Sobre”.
      </p>

      <div className="mt-8">
        <GerenciarPremiacoes premiacoes={premiacoes} />
      </div>
    </div>
  );
}
