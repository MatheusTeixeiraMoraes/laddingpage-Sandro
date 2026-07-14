import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Página não encontrada | Sandro Higuti",
};

const WHATSAPP = buildWhatsAppLink(
  "Olá, Sandro! Cliquei num link do site que não abriu e gostaria de ajuda para encontrar um imóvel.",
);

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-brand-blush/40 to-white px-6 py-16">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-heading text-6xl font-extrabold text-brand-pink sm:text-7xl">
          404
        </p>
        <h1 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Essa página não existe — ou o imóvel já não está mais disponível.
        </h1>
        <p className="mt-3 text-slate-600">
          Pode ser um link antigo ou um endereço digitado errado. Mas os
          imóveis continuam lá.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#imoveis"
            className="rounded-full bg-brand-pink px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-pink-600"
          >
            Ver imóveis disponíveis
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink"
          >
            Voltar ao início
          </Link>
        </div>

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
        >
          Ou fale direto com o Sandro no WhatsApp →
        </a>
      </div>
    </div>
  );
}
