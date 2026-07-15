import Link from "next/link";
import { getRelatosVideos } from "@/lib/relatosVideos";
import { GerenciarRelatos } from "@/components/admin/GerenciarRelatos";

export const dynamic = "force-dynamic";

export default async function AdminRelatosPage() {
  const videos = await getRelatosVideos();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-3 font-heading text-2xl font-extrabold text-brand-navy">
        Relatos em vídeo
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Os vídeos de clientes que aparecem na página “Relatos”. Cole o link do
        YouTube — o site incorpora o player.
      </p>

      <div className="mt-8">
        <GerenciarRelatos videos={videos} />
      </div>
    </div>
  );
}
