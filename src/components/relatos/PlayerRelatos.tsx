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

  // vq=hd1080: pedido de "melhor esforco" de alta resolucao. O YouTube
  // descontinuou forcar qualidade (~2019) e decide de forma adaptativa pela
  // conexao e pelo TAMANHO do player -- por isso o player grande abaixo e o
  // que de fato puxa a resolucao pra cima.
  const src = `${youtubeEmbedUrl(ativo.youtubeId)}?rel=0&vq=hd1080${autoplay ? "&autoplay=1" : ""}`;

  return (
    <div>
      {/* Player em pe (9:16), como um Reels. A largura e o maior valor que cabe
          na tela -- limitada por 90vw, por 45vh (pra altura nao passar de 80vh)
          e por 400px. Player maior = o YouTube entrega resolucao mais alta.
          Os videos sao verticais; num quadro 16:9 teriam tarjas nas laterais. */}
      <div className="flex flex-col items-center">
        <div className="relative aspect-[9/16] w-[min(400px,90vw,45vh)] overflow-hidden rounded-2xl bg-black shadow-lg">
          <iframe
            key={ativo.id}
            src={src}
            title={ativo.titulo || "Relato em vídeo"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        {ativo.titulo && (
          <p className="mt-3 text-center font-heading text-lg font-bold text-brand-navy">
            {ativo.titulo}
          </p>
        )}
      </div>

      {/* Galeria de miniaturas verticais (so aparece com mais de um video). O
          object-cover recorta as tarjas pretas da thumb do YouTube, mostrando
          so o conteudo vertical. */}
      {videos.length > 1 && (
        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
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
                  className={`relative aspect-[9/16] overflow-hidden rounded-xl ring-2 transition ${
                    selecionado ? "ring-brand-pink" : "ring-transparent hover:ring-brand-blush"
                  }`}
                >
                  <Image
                    src={youtubeThumbUrl(video.youtubeId)}
                    alt={video.titulo || "Relato em vídeo"}
                    fill
                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 22vw, 30vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition group-hover:bg-brand-pink">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 translate-x-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </div>
                {video.titulo && (
                  <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-600">
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
