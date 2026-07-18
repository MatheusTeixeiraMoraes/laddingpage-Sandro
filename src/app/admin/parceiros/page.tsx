import Link from "next/link";
import { getParceiros } from "@/lib/parceiros";
import { GerenciarParceiros } from "@/components/admin/GerenciarParceiros";

export const dynamic = "force-dynamic";

export default async function AdminParceirosPage() {
  const parceiros = await getParceiros();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-3 font-heading text-2xl font-extrabold text-brand-navy">
        Parceiros
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Empresas parceiras e os benefícios pra quem compra com você — aparecem na
        página “Parceiros”.
      </p>

      <div className="mt-8">
        <GerenciarParceiros parceiros={parceiros} />
      </div>
    </div>
  );
}
