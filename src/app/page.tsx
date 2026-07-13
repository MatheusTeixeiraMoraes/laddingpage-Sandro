import { getEmpreendimentos } from "@/lib/empreendimentos";
import type { Zona } from "@/types/empreendimento";
import { Hero } from "@/components/home/Hero";
import { BuscaImoveis } from "@/components/home/BuscaImoveis";
import { ClientesAmigos } from "@/components/home/ClientesAmigos";
import { SobreMim } from "@/components/home/SobreMim";
import { LancamentosDestaque } from "@/components/home/LancamentosDestaque";
import { FaixaContato } from "@/components/home/FaixaContato";

export const dynamic = "force-dynamic";

const ZONAS_VALIDAS = ["norte", "sul", "leste", "oeste", "central"] as const;

function zonaDaUrl(valor: string | string[] | undefined): Zona | "todas" {
  return typeof valor === "string" && (ZONAS_VALIDAS as readonly string[]).includes(valor)
    ? (valor as Zona)
    : "todas";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ zona?: string | string[] }>;
}) {
  const [empreendimentos, params] = await Promise.all([
    getEmpreendimentos(),
    searchParams,
  ]);

  return (
    <>
      <Hero />
      <BuscaImoveis
        empreendimentos={empreendimentos}
        zonaInicial={zonaDaUrl(params.zona)}
      />
      <SobreMim />
      <ClientesAmigos />
      <LancamentosDestaque empreendimentos={empreendimentos.slice(0, 4)} />
      <FaixaContato />
    </>
  );
}
