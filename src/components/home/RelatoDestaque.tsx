"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RelatoVideo } from "@/lib/relatosVideos";
import { youtubeEmbedUrl, youtubeThumbUrl } from "@/lib/youtube";

/**
 * Chamada na home para os relatos em video: o video em destaque (o principal,
 * escolhido no painel) de um lado e o convite para a galeria do outro.
 *
 * O player do YouTube so carrega quando o visitante clica no play (facade) --
 * senao toda visita da home baixaria o player do YouTube a toa.
 */
export function RelatoDestaque({ video }: { video: RelatoVideo }) {
  const [tocando, setTocando] = useState(false);

  return (
    <section className="bg-brand-blush/30 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        {/* Video (esquerda) */}
        <div className="flex justify-center md:justify-end">
          <div className="relative aspect-[9/16] w-[min(300px,72vw)] overflow-hidden rounded-2xl bg-black shadow-lg">
            {tocando ? (
              <iframe
                src={`${youtubeEmbedUrl(video.youtubeId)}?rel=0&autoplay=1&vq=hd1080`}
                title={video.titulo || "Relato em vídeo"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setTocando(true)}
                aria-label={`Assistir ao relato${video.titulo ? `: ${video.titulo}` : ""}`}
                className="group absolute inset-0 h-full w-full"
              >
                <Image
                  src={youtubeThumbUrl(video.youtubeId)}
                  alt={video.titulo || "Relato em vídeo"}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink text-white shadow-lg transition-transform group-hover:scale-105">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 translate-x-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Texto + botao (direita) */}
        <div className="text-center md:text-left">
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
            Relatos em vídeo
          </p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Sonhos que viraram <span className="text-brand-pink">realidade</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-600 md:mx-0">
            Nada fala mais alto do que quem já viveu. Aperte o play e ouça, na voz
            de quem realizou, como é conquistar o próprio lar ao lado de quem se
            importa de verdade.
          </p>
          <Link
            href="/relatos"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-navy/90"
          >
            Ver todos os relatos
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
