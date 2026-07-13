import Link from "next/link";
import { getFotosClientes } from "@/lib/fotosClientes";
import { GerenciarFotosClientes } from "@/components/admin/GerenciarFotosClientes";

export const dynamic = "force-dynamic";

export default async function AdminDepoimentosPage() {
  const fotos = await getFotosClientes();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-3 font-heading text-2xl font-extrabold text-brand-navy">
        Depoimentos
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        As fotos de entrega de chaves que aparecem na home e na galeria.
      </p>

      <div className="mt-8">
        <GerenciarFotosClientes fotos={fotos} />
      </div>

      <p className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
        As avaliações escritas (as do Google) ainda vivem no código, em
        <code className="mx-1 rounded bg-white px-1 py-0.5">src/data/depoimentos.ts</code>
        — elas mudam raramente e precisam ser transcritas do perfil do Google.
      </p>
    </div>
  );
}
