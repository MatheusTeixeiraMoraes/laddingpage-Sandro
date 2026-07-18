import Link from "next/link";
import { getEventos } from "@/lib/eventos";
import { GerenciarEventos } from "@/components/admin/GerenciarEventos";

export const dynamic = "force-dynamic";

export default async function AdminEventosPage() {
  const eventos = await getEventos();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-3 font-heading text-2xl font-extrabold text-brand-navy">
        Eventos
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Lançamentos e eventos de que você participa — aparecem na página “Eventos”.
      </p>

      <div className="mt-8">
        <GerenciarEventos eventos={eventos} />
      </div>
    </div>
  );
}
