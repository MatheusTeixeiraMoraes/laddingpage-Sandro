import Link from "next/link";
import { getEmpreendimentos } from "@/lib/empreendimentos";
import { getLeads } from "@/lib/leads";
import { getCliquesPorEmpreendimento } from "@/lib/cliques";
import { contarLeadsPorEmpreendimento, montarRanking } from "@/lib/ranking";
import { GestaoDestaques } from "@/components/admin/GestaoDestaques";

export const dynamic = "force-dynamic";

export default async function DestaquesPage() {
  const [empreendimentos, leads, cliques] = await Promise.all([
    getEmpreendimentos(),
    getLeads(),
    getCliquesPorEmpreendimento(),
  ]);

  const leadsPorEmp = contarLeadsPorEmpreendimento(empreendimentos, leads);
  const ranking = montarRanking(empreendimentos, cliques, leadsPorEmp);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-extrabold text-brand-navy">
        Destaques da home
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Marque os imóveis que aparecem em “Lançamentos em destaque”, na página
        inicial. Os mais clicados ficam no topo. Sem nenhum marcado, a home
        mostra os mais recentes.
      </p>
      <p className="mt-2 text-xs text-slate-400">
        <strong className="font-semibold text-slate-500">Cliques</strong>: quantas
        vezes o imóvel levou alguém ao WhatsApp (contagem anônima).{" "}
        <strong className="font-semibold text-slate-500">Leads</strong>: quantos
        deixaram contato por ele.
      </p>

      {empreendimentos.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
          Nenhum empreendimento cadastrado ainda.
        </p>
      ) : (
        <div className="mt-6">
          <GestaoDestaques ranking={ranking} />
        </div>
      )}
    </div>
  );
}
