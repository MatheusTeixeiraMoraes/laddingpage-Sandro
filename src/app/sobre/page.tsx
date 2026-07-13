import Image from "next/image";
import { GoogleReviews } from "@/components/GoogleReviews";
import { SocialIcons } from "@/components/home/SocialIcons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { BIO_PARAGRAFOS, VALORES, NUMEROS, FOTOS_CLIENTES } from "@/data/sobre";

const WHATSAPP = buildWhatsAppLink(
  "Olá, Sandro! Li a sua história no site e gostaria de conversar.",
);

export const metadata = {
  title: "Sobre o Sandro Higuti | Consultor Imobiliário em Sorocaba",
  description:
    "A história do Sandro Higuti: atendimento humanizado, especialista em Minha Casa Minha Vida em Sorocaba. CRECI 278922.",
};

export default function SobrePage() {
  return (
    <div>
      {/* Apresentação */}
      <section className="bg-gradient-to-b from-brand-blush/40 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
              Sobre mim
            </p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
              Prazer, eu sou <span className="text-brand-pink">Sandro Higuti</span>
            </h1>
            <div className="mt-5 flex flex-col gap-4 text-slate-600">
              {BIO_PARAGRAFOS.map((paragrafo) => (
                <p key={paragrafo.slice(0, 30)}>{paragrafo}</p>
              ))}
            </div>
            <p className="mt-5 font-script text-2xl text-brand-pink">
              Clientes que se tornam amigos.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-pink px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-pink-600"
              >
                Falar com o Sandro
              </a>
              <SocialIcons iconClassName="text-slate-500 hover:bg-brand-blush hover:text-brand-pink" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -right-4 -top-4 h-40 w-40 rounded-[40%] bg-brand-pink/20 blur-2xl" aria-hidden />
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/sobre/sandro-retrato.jpg"
                alt="Sandro Higuti, consultor imobiliário"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="bg-brand-navy py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-6 text-center">
          {NUMEROS.map((n) => (
            <div key={n.label}>
              <p className="font-heading text-3xl font-extrabold text-brand-pink sm:text-4xl">
                {n.valor}
              </p>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
              Como eu trabalho
            </p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              O que você pode <span className="text-brand-pink">esperar de mim</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {VALORES.map((valor) => (
              <div
                key={valor.titulo}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blush text-brand-pink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                <h3 className="mt-4 font-heading font-bold text-brand-navy">{valor.titulo}</h3>
                <p className="mt-1 text-sm text-slate-600">{valor.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clientes que viraram amigos */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
              Histórias que inspiram
            </p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              Clientes que se tornam <span className="text-brand-pink">amigos</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Momentos de entrega de chave que viraram amizade de verdade.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {FOTOS_CLIENTES.map((foto, i) => (
              <div key={foto} className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm">
                <Image
                  src={foto}
                  alt={`Cliente do Sandro Higuti na entrega das chaves ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mt-14">
            <GoogleReviews />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Vamos encontrar o seu?
          </h2>
          <p className="mt-2 text-slate-600">
            Me conta o que você procura — eu te mostro o que faz sentido para a sua realidade.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-md transition-colors hover:bg-pink-600"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
            </svg>
            Falar no WhatsApp
          </a>
          <p className="mt-4 text-xs text-slate-400">
            Sandro Higuti · Consultor Imobiliário · CRECI 278922 · Sorocaba - SP
          </p>
        </div>
      </section>
    </div>
  );
}
