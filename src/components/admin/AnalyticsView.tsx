import Link from "next/link";
import type { DadosAnalytics } from "@/lib/analytics";
import { diaBRTde, type BarraCategoria } from "@/lib/analyticsAgg";

/** "2026-07-15" -> "15/07". */
function ddmm(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function Cartao({
  valor,
  rotulo,
  destaque = false,
}: {
  valor: number;
  rotulo: string;
  destaque?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p
        className={`font-heading text-3xl font-extrabold ${
          destaque && valor > 0 ? "text-brand-pink" : "text-brand-navy"
        }`}
      >
        {valor}
      </p>
      <p className="mt-1 text-sm text-slate-500">{rotulo}</p>
    </div>
  );
}

/** Barras horizontais (uma serie): rotulo | barra rosa | valor. */
function BarrasHorizontais({
  itens,
  vazio,
}: {
  itens: BarraCategoria[];
  vazio: string;
}) {
  if (itens.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">{vazio}</p>;
  }
  const max = Math.max(...itens.map((i) => i.qtd));
  return (
    <ul className="space-y-3">
      {itens.map((item) => (
        <li key={item.rotulo} className="flex items-center gap-3 text-sm">
          <span className="w-40 shrink-0 truncate text-slate-600" title={item.rotulo}>
            {item.rotulo}
          </span>
          <span className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
            <span
              className="block h-full rounded-full bg-brand-pink"
              style={{ width: `${max > 0 ? (item.qtd / max) * 100 : 0}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right font-semibold tabular-nums text-brand-navy">
            {item.qtd}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Grafico de barras verticais: leads por dia (30 dias). */
function GraficoDias({ dados }: { dados: DadosAnalytics["porDia"] }) {
  const max = Math.max(1, ...dados.map((d) => d.qtd));
  const total = dados.reduce((s, d) => s + d.qtd, 0);

  return (
    <div>
      <div className="flex h-32 items-end gap-[3px]" aria-hidden>
        {dados.map((d) => (
          <span
            key={d.dia}
            title={`${ddmm(d.dia)}: ${d.qtd} lead(s)`}
            className={`flex-1 rounded-t ${d.qtd > 0 ? "bg-brand-pink" : "bg-slate-100"}`}
            style={{ height: d.qtd > 0 ? `${(d.qtd / max) * 100}%` : "3px" }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>{ddmm(dados[0].dia)}</span>
        <span>{ddmm(dados[Math.floor(dados.length / 2)].dia)}</span>
        <span>{ddmm(dados[dados.length - 1].dia)}</span>
      </div>
      <p className="mt-3 text-sm text-slate-500">
        <span className="font-semibold text-brand-navy">{total}</span> lead(s) nos últimos 30 dias
      </p>
    </div>
  );
}

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-heading text-lg font-bold text-brand-navy">{titulo}</h2>
      {children}
    </section>
  );
}

export function AnalyticsView({ dados }: { dados: DadosAnalytics }) {
  const { resumo, porDia, porInteresse, imoveisMaisClicados, leadsRecentes } = dados;

  return (
    <div className="space-y-6">
      {/* Cartoes de resumo */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Cartao valor={resumo.totalLeads} rotulo="Leads no total" />
        <Cartao valor={resumo.leadsMes} rotulo="Leads (últimos 30 dias)" />
        <Cartao valor={resumo.aAtender} rotulo="Leads a atender" destaque />
        <Cartao valor={resumo.totalCliques} rotulo="Cliques no WhatsApp" />
      </div>

      <Secao titulo="Leads por dia">
        <GraficoDias dados={porDia} />
      </Secao>

      <div className="grid gap-6 lg:grid-cols-2">
        <Secao titulo="O que mais procuram">
          <BarrasHorizontais itens={porInteresse} vazio="Nenhum lead ainda." />
        </Secao>

        <Secao titulo="Imóveis que mais levam ao WhatsApp">
          <BarrasHorizontais
            itens={imoveisMaisClicados.map((i) => ({ rotulo: i.nome, qtd: i.cliques }))}
            vazio="Nenhum clique ainda."
          />
        </Secao>
      </div>

      <Secao titulo="Leads recentes">
        {leadsRecentes.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Os leads aparecem aqui conforme as pessoas enviam o formulário.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-slate-100">
              {leadsRecentes.map((lead) => (
                <li key={lead.id} className="flex items-center gap-3 py-3">
                  {!lead.atendido && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-brand-pink" title="A atender" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-brand-navy">{lead.nome}</p>
                    <p className="truncate text-xs text-slate-500">
                      {lead.interesse || "Sem interesse informado"} · {lead.telefone}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{ddmm(diaBRTde(lead.criadoEm))}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/admin/leads"
              className="mt-4 inline-block text-sm font-semibold text-brand-pink hover:underline"
            >
              Ver todos os leads →
            </Link>
          </>
        )}
      </Secao>

      <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
        Aqui estão os dados de <strong>conversão</strong> do próprio site. O
        número de <strong>visitas</strong> e de onde vêm (Google, Instagram…)
        fica no Analytics da Vercel — os dois se completam.
      </p>
    </div>
  );
}
