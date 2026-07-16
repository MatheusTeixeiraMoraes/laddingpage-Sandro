import Link from "next/link";
import { getAnalytics } from "@/lib/analytics";
import { AnalyticsView } from "@/components/admin/AnalyticsView";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const dados = await getAnalytics();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-3 font-heading text-2xl font-extrabold text-brand-navy">
        Analytics
      </h1>
      <p className="mb-8 mt-1 text-sm text-slate-500">
        Leads, interesses e imóveis que mais levam gente ao WhatsApp — direto dos
        dados do site.
      </p>

      <AnalyticsView dados={dados} />
    </div>
  );
}
