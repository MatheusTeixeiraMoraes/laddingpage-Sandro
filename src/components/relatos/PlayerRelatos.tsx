"use client";

import { useState } from "react";
import Image from "next/image";
import type { RelatoVideo } from "@/lib/relatosVideos";
import { youtubeEmbedUrl, youtubeThumbUrl } from "@/lib/youtube";

export function PlayerRelatos({ videos }: { videos: RelatoVideo[] }) {
  // Comeca no principal (marcado no painel); senao, no primeiro da lista.
  const inicial = videos.find((v) => v.principal) ?? videos[0];
  const [ativo, setAtivo] = useState<RelatoVideo>(inicial);
  // Autoplay so depois de um clique -- nunca ao abrir a pagina.
  const [autoplay, setAutoplay] = useState(false);

  const trocar = (video: RelatoVideo) => {
    setAtivo(video);
    setAutoplay(true);
  };

  const src = `${youtubeEmbedUrl(ativo.youtubeId)}?rel=0${autoplay ? "&autoplay=1" : ""}`;

  return (
    <div>
      {/* Player grande */}
      <div className="overflow-hidden rounded-2xl bg-black shadow-lg">
        <div className="relative aspect-video w-full">
          <iframe
            key={ativo.id}
            src={src}
            title={ativo.titulo || "Relato em vídeo"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
      {ativo.titulo && (
        <p className="mt-3 text-center font-heading text-lg font-bold text-brand-navy">
          {ativo.titulo}
        </p>
      )}

      {/* Galeria (so aparece com mais de um video) */}
      {videos.length > 1 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {videos.map((video) => {
            const selecionado = video.id === ativo.id;
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => trocar(video)}
                aria-pressed={selecionado}
                className="group text-left"
              >
                <div
                  className={`relative aspect-video overflow-hidden rounded-xl ring-2 transition ${
                    selecionado ? "ring-brand-pink" : "ring-transparent hover:ring-brand-blush"
                  }`}
                >
                  <Image
                    src={youtubeThumbUrl(video.youtubeId)}
                    alt={video.titulo || "Relato em vídeo"}
                    fill
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition group-hover:bg-brand-pink">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 translate-x-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </div>
                {video.titulo && (
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-600">
                    {video.titulo}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
