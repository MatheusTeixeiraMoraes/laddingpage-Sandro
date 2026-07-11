import Link from "next/link";
import type { Empreendimento } from "@/types/empreendimento";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const TIPO_LABEL: Record<Empreendimento["tipo"], string> = {
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

function faixaDeMetragem(empreendimento: Empreendimento): string {
  const metragens = empreendimento.plantas.map((planta) => planta.metragem);
  const min = Math.min(...metragens);
  const max = Math.max(...metragens);
  return min === max ? `${min} m²` : `${min}–${max} m²`;
}

function precoAPartirDe(empreendimento: Empreendimento): number {
  return Math.min(...empreendimento.plantas.map((planta) => planta.preco));
}

export function EmpreendimentoCard({
  empreendimento,
}: {
  empreendimento: Empreendimento;
}) {
  const whatsappLink = buildWhatsAppLink(
    `Olá, vi o imóvel ${empreendimento.nome} no site e gostaria de saber mais informações.`,
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      <Link
        href={`/empreendimentos/${empreendimento.id}`}
        className="flex flex-1 flex-col"
      >
        <div className="flex h-36 items-center justify-center bg-brand-purple/10 text-sm font-medium text-brand-purple">
          {TIPO_LABEL[empreendimento.tipo]}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-bold text-slate-800">{empreendimento.nome}</h3>
          <p className="text-sm text-slate-500">{empreendimento.bairro}</p>
          <p className="text-sm text-slate-600">{faixaDeMetragem(empreendimento)}</p>
          <p className="text-lg font-bold text-brand-blue">
            A partir de {formatarPreco(precoAPartirDe(empreendimento))}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-brand-purple px-4 py-2 text-center text-sm font-medium text-white hover:bg-purple-700"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
