import Image from "next/image";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const BADGES = ["Empatia", "Transparência", "Honestidade"];

const WHATSAPP = buildWhatsAppLink(
  "Olá, Sandro! Vi o seu site e gostaria de conhecer os imóveis disponíveis.",
);

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-blush/40 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 pt-14 pb-4 lg:grid-cols-2 lg:gap-4 lg:pt-20">
        <div className="order-2 lg:order-1">
          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
            Mais que imóveis,
            <br />
            <span className="text-brand-pink">realizo sonhos.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-slate-600">
            Especialista em apartamentos na planta em Sorocaba. Atendimento
            humanizado, transparente e focado em você.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-brand-pink/20 bg-white px-4 py-2 text-sm font-medium text-brand-navy shadow-sm"
              >
                <span className="text-brand-pink">
                  <Check />
                </span>
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-pink-600"
            >
              Fale comigo
            </a>
            <a
              href="#imoveis"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 font-semibold text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink"
            >
              Ver imóveis
            </a>
          </div>

          <p className="mt-6 font-script text-2xl text-brand-pink">
            Clientes que se tornam amigos.
          </p>
        </div>

        <div className="relative order-1 flex justify-center lg:order-2">
          <div className="absolute bottom-0 h-[85%] w-[85%] rounded-[45%] bg-brand-pink/25 blur-2xl" aria-hidden />
          <div className="absolute bottom-0 right-6 h-64 w-64 rounded-full bg-brand-pink/30" aria-hidden />
          <Image
            src="/sandro-recorte.png"
            alt="Sandro Higuti, consultor imobiliário"
            width={520}
            height={640}
            priority
            className="relative z-10 h-auto w-[280px] object-contain sm:w-[340px] lg:w-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
