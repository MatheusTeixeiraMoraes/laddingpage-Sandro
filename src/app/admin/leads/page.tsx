import Link from "next/link";
import { getLeads } from "@/lib/leads";
import { ListaLeads } from "@/components/admin/ListaLeads";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();
  const novos = leads.filter((l) => !l.atendido).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-3 font-heading text-2xl font-extrabold text-brand-navy">
        Leads
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {leads.length === 0
          ? "Ninguém preencheu o formulário ainda."
          : `${leads.length} contato(s) · ${novos} novo(s) para atender.`}
      </p>

      <div className="mt-8">
        <ListaLeads leads={leads} />
      </div>
    </div>
  );
}
