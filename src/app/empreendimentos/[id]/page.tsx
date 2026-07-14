import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmpreendimentoById } from "@/lib/empreendimentos";
import { EmpreendimentoDetalhe } from "@/components/EmpreendimentoDetalhe";
import { MapaEmpreendimento } from "@/components/MapaEmpreendimento";
import { GaleriaEmpreendimento } from "@/components/GaleriaEmpreendimento";
import { AvisoValores } from "@/components/AvisoValores";
import { formatarEntrega, PRONTO_PARA_MORAR } from "@/lib/entrega";
import { formatarPrecoCurto } from "@/lib/preco";
import { listaDeDormitorios } from "@/lib/resumo";
import type { Zona } from "@/types/empreendimento";

export const dynamic = "force-dynamic";

const ZONA_LABEL: Record<Zona, string> = {
  norte: "Zona Norte",
  sul: "Zona Sul",
  leste: "Zona Leste",
  oeste: "Zona Oeste",
  central: "Região Central",
};

type Props = { params: Promise<{ id: string }> };

/**
 * Sem isso, TODA página de imóvel compartilhava o mesmo título genérico do
 * site. Quando um lead mandava o link no WhatsApp, o card de preview não
 * mostrava nem o nome do imóvel nem a foto — parecia link quebrado.
 *
 * cache() em getEmpreendimentoById evita bater no banco duas vezes (aqui e no
 * componente da página) para a mesma requisição.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const empreendimento = await getEmpreendimentoById(id);

  if (!empreendimento) notFound();

  const preco = formatarPrecoCurto(empreendimento.precoAPartirDe);
  const dorms = listaDeDormitorios(empreendimento.dormitorios);
  const entrega = empreendimento.entregaEm
    ? `Entrega em ${formatarEntrega(empreendimento.entregaEm)}`
    : PRONTO_PARA_MORAR;
  const descricao = `${dorms} dormitório(s) em ${empreendimento.bairro.nome}, Sorocaba. A partir de ${preco}. ${entrega}.`;

  return {
    title: `${empreendimento.nome} | Sandro Higuti Consultor Imobiliário`,
    description: descricao,
    openGraph: {
      title: empreendimento.nome,
      description: descricao,
      images: empreendimento.imagem ? [{ url: empreendimento.imagem }] : undefined,
    },
  };
}

export default async function EmpreendimentoPage({ params }: Props) {
  const { id } = await params;
  const empreendimento = await getEmpreendimentoById(id);

  if (!empreendimento) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
        <Link
          href="/#imoveis"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Voltar aos imóveis
        </Link>

        <section className="relative mt-4 h-[280px] overflow-hidden rounded-3xl shadow-md sm:h-[420px]">
          {empreendimento.imagem ? (
            <Image
              src={empreendimento.imagem}
              alt={empreendimento.nome}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-brand-blush" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-pink px-3 py-1 text-xs font-semibold text-white">
                {ZONA_LABEL[empreendimento.zona]}
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy">
                {empreendimento.entregaEm
                  ? `Entrega: ${formatarEntrega(empreendimento.entregaEm)}`
                  : PRONTO_PARA_MORAR}
              </span>
            </div>
            <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {empreendimento.nome}
            </h1>
            <p className="mt-1 text-sm text-white/80">{empreendimento.bairro.nome} · Sorocaba - SP</p>
          </div>
        </section>

        <EmpreendimentoDetalhe empreendimento={empreendimento} />

        <div className="mt-12">
          <GaleriaEmpreendimento
            nome={empreendimento.nome}
            fotos={empreendimento.galeria}
          />
        </div>

        <div className="mt-12">
          <MapaEmpreendimento empreendimento={empreendimento} />
        </div>

        <div className="mt-12">
          <AvisoValores />
        </div>
      </div>
    </>
  );
}
