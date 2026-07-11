import type { Imovel } from "@/types/imovel";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const TIPO_LABEL: Record<Imovel["tipo"], string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  comercial: "Comercial",
};

function formatarPreco(preco: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

export function ImovelCard({ imovel }: { imovel: Imovel }) {
  const whatsappLink = buildWhatsAppLink(
    `Olá, vi o imóvel ${imovel.nome} no site e gostaria de saber mais informações.`,
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex h-36 items-center justify-center bg-brand-purple/10 text-sm font-medium text-brand-purple">
        {TIPO_LABEL[imovel.tipo]}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold text-slate-800">{imovel.nome}</h3>
        <p className="text-sm text-slate-500">{imovel.bairro}</p>
        <p className="text-sm text-slate-600">
          {imovel.dormitorios} dorm. · {imovel.vagas} vaga(s) · {imovel.metragem} m²
        </p>
        <p className="text-lg font-bold text-brand-blue">
          {formatarPreco(imovel.preco)}
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-full bg-brand-purple px-4 py-2 text-center text-sm font-medium text-white hover:bg-purple-700"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
