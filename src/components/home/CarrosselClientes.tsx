import Image from "next/image";
import { FOTOS_CLIENTES } from "@/data/sobre";

/**
 * Faixa de fotos deslizando devagar, sem fim.
 *
 * Como funciona: a lista é renderizada DUAS vezes lado a lado e a faixa desliza
 * exatamente metade da própria largura. No fim do ciclo, a segunda cópia está
 * exatamente onde a primeira começou — o salto de volta é invisível.
 *
 * Sem biblioteca: é uma animação de CSS. Pausa quando o mouse está em cima, e
 * para de vez para quem pediu menos animação no sistema operacional.
 */
export function CarrosselClientes() {
  const fotos = [...FOTOS_CLIENTES, ...FOTOS_CLIENTES];

  return (
    <div
      className="group relative w-full overflow-hidden"
      // As bordas somem em degradê: a foto entra e sai da cena, em vez de
      // aparecer cortada na beirada.
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <ul className="flex w-max animate-desliza gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:overflow-x-auto">
        {fotos.map((foto, i) => (
          <li
            key={`${foto}-${i}`}
            className="relative h-64 w-52 shrink-0 overflow-hidden rounded-2xl shadow-sm sm:h-72 sm:w-60"
          >
            <Image
              src={foto}
              alt=""
              fill
              sizes="240px"
              className="object-cover"
              // As primeiras entram no carregamento; o resto é preguiçoso.
              loading={i < 4 ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
