import { getEmpreendimentos } from "@/lib/empreendimentos";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PropertySearch } from "@/components/PropertySearch";

export const dynamic = "force-dynamic";

const WHATSAPP_GENERICO = buildWhatsAppLink(
  "Olá, vi o site e gostaria de saber mais sobre os imóveis.",
);

export default async function Home() {
  const empreendimentos = await getEmpreendimentos();

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center">
      <h1 className="font-heading text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
        Sandro Higuti Consultor Imobiliário
      </h1>
      <p className="max-w-xl text-lg text-slate-600">
        Encontre o imóvel ideal com a consultoria de quem conhece o mercado.
      </p>
      <a
        href={WHATSAPP_GENERICO}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-brand-pink px-6 py-3 font-medium text-white transition-colors hover:bg-pink-700"
      >
        Falar no WhatsApp
      </a>
      <PropertySearch empreendimentos={empreendimentos} />
    </div>
  );
}
