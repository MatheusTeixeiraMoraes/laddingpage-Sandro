import Link from "next/link";
import { getEmpreendimentos } from "@/lib/empreendimentos";
import { getLeads } from "@/lib/leads";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ListaEmpreendimentos } from "@/components/admin/ListaEmpreendimentos";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [empreendimentos, leads] = await Promise.all([
    getEmpreendimentos(),
    getLeads(),
  ]);
  const leadsNovos = leads.filter((l) => !l.atendido).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-brand-navy">
            Painel administrativo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {empreendimentos.length} empreendimento(s) publicado(s) no site.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
          >
            Leads
            {leadsNovos > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-pink px-1.5 text-xs font-bold text-white">
                {leadsNovos}
              </span>
            )}
          </Link>
          <Link
            href="/admin/destaques"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
          >
            Destaques
          </Link>
          <Link
            href="/admin/conteudo"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
          >
            Conteúdo do site
          </Link>
          <Link
            href="/admin/depoimentos"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
          >
            Depoimentos
          </Link>
          <Link
            href="/admin/atualizar-senha"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
          >
            Trocar senha
          </Link>
          <LogoutButton />
          <Link
            href="/admin/empreendimentos/novo"
            className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
          >
            Novo empreendimento
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <ListaEmpreendimentos empreendimentos={empreendimentos} />
      </div>
    </div>
  );
}
