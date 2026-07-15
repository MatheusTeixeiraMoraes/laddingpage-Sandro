import type { Metadata } from "next";
import { getRelatosVideos } from "@/lib/relatosVideos";
import { PlayerRelatos } from "@/components/relatos/PlayerRelatos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Relatos em vídeo | Sandro Higuti Consultor Imobiliário",
  description:
    "Histórias de clientes que realizaram o sonho do imóvel com o Sandro Higuti. Veja os relatos em vídeo.",
};

export default async function RelatosPage() {
  const videos = await getRelatosVideos();

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <header className="text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest text-brand-pink">
          Relatos
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
          Histórias de quem realizou o sonho
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          Cada vídeo é um cliente que virou amigo. Dá o play e conheça algumas
          dessas histórias.
        </p>
      </header>

      <div className="mt-10">
        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-400">
            Em breve, os relatos em vídeo aparecem aqui.
          </div>
        ) : (
          <PlayerRelatos videos={videos} />
        )}
      </div>
    </div>
  );
}
