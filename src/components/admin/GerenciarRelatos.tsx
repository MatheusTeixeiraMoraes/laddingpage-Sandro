"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { RelatoVideo } from "@/lib/relatosVideos";
import { youtubeThumbUrl } from "@/lib/youtube";
import {
  adicionarRelatoVideo,
  excluirRelatoVideo,
  definirPrincipal,
} from "@/lib/admin/relatosVideos";

export function GerenciarRelatos({ videos }: { videos: RelatoVideo[] }) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [titulo, setTitulo] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const adicionar = async (event: FormEvent) => {
    event.preventDefault();
    if (link.trim() === "") return;

    setErro(null);
    setOcupado(true);
    try {
      await adicionarRelatoVideo(link, titulo);
      setLink("");
      setTitulo("");
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Nao foi possivel adicionar o video.");
    } finally {
      setOcupado(false);
    }
  };

  const excluir = async (video: RelatoVideo) => {
    if (!confirm("Excluir este video? Ele sai do site na hora e nao da pra desfazer.")) return;
    setErro(null);
    setOcupado(true);
    try {
      await excluirRelatoVideo(video.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Nao foi possivel excluir o video.");
    } finally {
      setOcupado(false);
    }
  };

  const marcarPrincipal = async (video: RelatoVideo) => {
    if (video.principal || ocupado) return;
    setErro(null);
    setOcupado(true);
    try {
      await definirPrincipal(video.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Nao foi possivel marcar como principal.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-bold text-brand-navy">Relatos em video</h2>
      <p className="mt-1 text-sm text-slate-500">
        {videos.length === 0
          ? "Nenhum video ainda."
          : `${videos.length} video(s). A estrela marca o principal (o grande no topo da pagina).`}
      </p>

      <form onSubmit={adicionar} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="text-sm font-medium text-slate-600">Link do YouTube</span>
          <input
            type="text"
            inputMode="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://youtu.be/..."
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-pink focus:outline-none"
          />
        </label>
        <label className="flex-1">
          <span className="text-sm font-medium text-slate-600">Titulo (opcional)</span>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Kauany e Jorge"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-pink focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={ocupado || link.trim() === ""}
          className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
        >
          {ocupado ? "Adicionando..." : "Adicionar"}
        </button>
      </form>

      <p className="mt-2 text-xs text-slate-400">
        Cole o link do video no YouTube (o site incorpora o player). O primeiro
        video ja vira o principal.
      </p>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      {videos.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {videos.map((video) => (
            <li key={video.id} className="flex gap-3 rounded-xl border border-slate-100 p-3">
              <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={youtubeThumbUrl(video.youtubeId)}
                  alt={video.titulo || "Relato em video"}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-sm font-medium text-brand-navy">
                  {video.titulo || "(sem titulo)"}
                </p>
                {video.principal && (
                  <span className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-full bg-brand-blush px-2 py-0.5 text-xs font-semibold text-brand-pink">
                    ★ Principal
                  </span>
                )}

                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {!video.principal && (
                    <button
                      type="button"
                      onClick={() => marcarPrincipal(video)}
                      disabled={ocupado}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink disabled:opacity-50"
                    >
                      Tornar principal
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => excluir(video)}
                    disabled={ocupado}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
