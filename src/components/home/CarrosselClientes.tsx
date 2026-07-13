import Image from "next/image";
import type { FotoCliente } from "@/lib/fotosClientes";

/**
 * Faixa de fotos deslizando devagar, sem fim.
 *
 * Como funciona: a lista é renderizada DUAS vezes lado a lado e a faixa desliza
 * exatamente metade da própria largura. No fim do ciclo, a segunda cópia está
 * exatamente onde a primeira começou — a volta ao início é invisível.
 *
 * Sem biblioteca: é uma animação de CSS. Pausa quando o mouse está em cima, e
 * para de vez para quem pediu menos animação no sistema operacional.
 */
export function CarrosselClientes({ fotos }: { fotos: FotoCliente[] }) {
  if (fotos.length === 0) return null;

  const dobradas = [...fotos, ...fotos];

  return (
    // Dentro do container do site, como o resto da página — sangrar até a borda
    // destoava de todos os outros blocos.
    <div className="mx-auto max-w-6xl px-6">
      <div
        className="group relative overflow-hidden rounded-3xl"
        // As bordas somem em degradê: a foto entra e sai de cena em vez de
        // aparecer cortada na beirada.
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <ul className="flex w-max animate-desliza gap-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:overflow-x-auto">
          {dobradas.map((foto, i) => (
            <li
              key={`${foto.id}-${i}`}
              className="relative h-80 w-64 shrink-0 overflow-hidden rounded-2xl shadow-sm sm:h-96 sm:w-80"
            >
              <Image
                src={foto.url}
                alt={foto.legenda}
                fill
                sizes="320px"
                className="object-cover"
                // As primeiras entram no carregamento; o resto é preguiçoso.
                loading={i < 4 ? "eager" : "lazy"}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
