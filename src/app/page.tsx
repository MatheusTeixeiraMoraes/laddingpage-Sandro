import { getEmpreendimentos } from "@/lib/empreendimentos";
import { getFotosClientes } from "@/lib/fotosClientes";
import { getConteudo, texto } from "@/lib/conteudo";
import { empreendimentosEmDestaque } from "@/lib/destaques";
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
  const [empreendimentos, fotosClientes, conteudo, params] = await Promise.all([
    getEmpreendimentos(),
    getFotosClientes(),
    getConteudo(),
    searchParams,
  ]);

  return (
    <>
      <Hero foto={texto(conteudo, "foto_hero", "/sandro-recorte.png")} />
      <BuscaImoveis
        empreendimentos={empreendimentos}
        zonaInicial={zonaDaUrl(params.zona)}
      />
      <SobreMim foto={texto(conteudo, "foto_sobremim", "/sandro-sobre.jpg")} />
      <ClientesAmigos fotos={fotosClientes} />
      <LancamentosDestaque empreendimentos={empreendimentosEmDestaque(empreendimentos)} />
      <FaixaContato foto={texto(conteudo, "foto_contato", "/sandro-contato.png")} />
    </>
  );
}
