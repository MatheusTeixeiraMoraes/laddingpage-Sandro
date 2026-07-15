import Image from "next/image";
import Link from "next/link";
import {
  SOBREMIM_TITULO_1,
  SOBREMIM_TITULO_2,
  SOBREMIM_TEXTO,
  SOBREMIM_PILLS,
} from "@/data/home";

export function SobreMim({
  foto = "/sandro-sobre.jpg",
  titulo1 = SOBREMIM_TITULO_1,
  titulo2 = SOBREMIM_TITULO_2,
  paragrafo = SOBREMIM_TEXTO,
  pills = SOBREMIM_PILLS,
}: {
  foto?: string;
  titulo1?: string;
  titulo2?: string;
  paragrafo?: string;
  pills?: string[];
}) {
  return (
    <section id="sobre" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
            Sobre mim
          </p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            {titulo1} <span className="text-brand-pink">{titulo2}</span>
          </h2>
          <p className="mt-4 max-w-md text-slate-600">{paragrafo}</p>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {pills.map((pill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-blush/60 px-4 py-2.5 text-sm font-medium text-brand-navy"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-pink/15 text-brand-pink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                {pill}
              </span>
            ))}
          </div>

          <Link
            href="/sobre"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-navy/90"
          >
            Me conhecer melhor
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Foto diferente da do hero: o mesmo recorte tres vezes na home
            cansava a vista e fazia o site parecer que so tinha uma imagem. */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -right-6 -top-6 h-56 w-56 rounded-[45%] bg-brand-pink/20 blur-3xl" aria-hidden />
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={foto}
              alt="Sandro Higuti, consultor imobiliário"
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
