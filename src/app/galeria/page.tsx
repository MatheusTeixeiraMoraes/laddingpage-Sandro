import Image from "next/image";
import Link from "next/link";
import { FOTOS_CLIENTES } from "@/data/sobre";
import { Depoimentos } from "@/components/Depoimentos";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Galeria de depoimentos | Sandro Higuti",
  description:
    "Momentos de entrega de chaves e o que os clientes do Sandro Higuti dizem sobre o atendimento.",
};

const WHATSAPP = buildWhatsAppLink(
  "Olá, Sandro! Vi a galeria de clientes no site e gostaria de conversar.",
);

export default function GaleriaPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-brand-blush/40 to-white">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center sm:py-16">
          <Link
            href="/#depoimentos"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Voltar ao início
          </Link>

          <p className="mt-6 font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
            Histórias que inspiram
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Clientes que se tornam <span className="text-brand-pink">amigos</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            {FOTOS_CLIENTES.length} momentos de entrega de chave que viraram
            amizade de verdade.
          </p>
        </div>
      </section>

      <section className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {FOTOS_CLIENTES.map((foto, i) => (
              <div
                key={foto}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm"
              >
                <Image
                  src={foto}
                  alt={`Cliente do Sandro Higuti na entrega das chaves ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Depoimentos />
          </div>

          <div className="mt-16 text-center">
            <h2 className="font-heading text-2xl font-extrabold text-brand-navy">
              Quer ser o próximo?
            </h2>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-md transition-colors hover:bg-pink-600"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
              </svg>
              Falar com o Sandro
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
