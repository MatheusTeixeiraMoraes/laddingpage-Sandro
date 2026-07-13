import Image from "next/image";
import Link from "next/link";
import type { Empreendimento } from "@/types/empreendimento";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatarEntrega, PRONTO_PARA_MORAR } from "@/lib/entrega";

const TIPO_LABEL: Record<Empreendimento["tipo"], string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  comercial: "Comercial",
};

function faixaDeMetragem(empreendimento: Empreendimento): string {
  const metragens = empreendimento.plantas.map((planta) => planta.metragem);
  const min = Math.min(...metragens);
  const max = Math.max(...metragens);
  return min === max ? `${min} m²` : `${min}–${max} m²`;
}

function dormitorios(empreendimento: Empreendimento): number {
  return Math.min(...empreendimento.plantas.map((p) => p.dormitorios));
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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/empreendimentos/${empreendimento.id}`} className="flex flex-1 flex-col">
        <div className="relative h-44 w-full overflow-hidden">
          {empreendimento.imagem ? (
            <Image
              src={empreendimento.imagem}
              alt={empreendimento.nome}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-brand-blush text-sm font-medium text-brand-pink">
              {TIPO_LABEL[empreendimento.tipo]}
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy shadow-sm">
            {TIPO_LABEL[empreendimento.tipo]}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <h3 className="font-heading font-bold text-brand-navy">{empreendimento.nome}</h3>
          <p className="text-sm text-slate-500">{empreendimento.bairro}</p>
          <p className="text-sm text-slate-600">
            {dormitorios(empreendimento)} dorms · {faixaDeMetragem(empreendimento)} ·{" "}
            {empreendimento.entregaEm
              ? `Entrega: ${formatarEntrega(empreendimento.entregaEm)}`
              : PRONTO_PARA_MORAR}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-brand-pink px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-pink-600"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
