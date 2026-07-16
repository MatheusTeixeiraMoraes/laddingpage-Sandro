import type { Metadata } from "next";
import { getEmpreendimentos } from "@/lib/empreendimentos";
import { getFotosClientes } from "@/lib/fotosClientes";
import { getRelatosVideos } from "@/lib/relatosVideos";
import { getConteudo, texto, lista } from "@/lib/conteudo";
import { empreendimentosEmDestaque } from "@/lib/destaques";
import {
  HERO_TITULO_1,
  HERO_TITULO_2,
  HERO_SUBTITULO,
  HERO_BADGES,
  HERO_FRASE,
  SOBREMIM_TITULO_1,
  SOBREMIM_TITULO_2,
  SOBREMIM_TEXTO,
  SOBREMIM_PILLS,
} from "@/data/home";
import type { Zona } from "@/types/empreendimento";
import { Hero } from "@/components/home/Hero";
import { BuscaImoveis } from "@/components/home/BuscaImoveis";
import { ClientesAmigos } from "@/components/home/ClientesAmigos";
import { RelatoDestaque } from "@/components/home/RelatoDestaque";
import { SobreMim } from "@/components/home/SobreMim";
import { LancamentosDestaque } from "@/components/home/LancamentosDestaque";
import { FaixaContato } from "@/components/home/FaixaContato";

export const dynamic = "force-dynamic";

// So o canonical; titulo/descricao/openGraph vem do layout (raiz).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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
  const [empreendimentos, fotosClientes, relatos, conteudo, params] = await Promise.all([
    getEmpreendimentos(),
    getFotosClientes(),
    getRelatosVideos(),
    getConteudo(),
    searchParams,
  ]);

  // O video em destaque na home = o principal escolhido no painel (senao o
  // primeiro). Sem relatos, a secao nao aparece.
  const relatoDestaque = relatos.find((v) => v.principal) ?? relatos[0];

  return (
    <>
      <Hero
        foto={texto(conteudo, "foto_hero", "/sandro-recorte.png")}
        titulo1={texto(conteudo, "hero_titulo_1", HERO_TITULO_1)}
        titulo2={texto(conteudo, "hero_titulo_2", HERO_TITULO_2)}
        subtitulo={texto(conteudo, "hero_subtitulo", HERO_SUBTITULO)}
        badges={lista(conteudo, "hero_badges", HERO_BADGES)}
        frase={texto(conteudo, "hero_frase", HERO_FRASE)}
      />
      <BuscaImoveis
        empreendimentos={empreendimentos}
        zonaInicial={zonaDaUrl(params.zona)}
      />
      <SobreMim
        foto={texto(conteudo, "foto_sobremim", "/sandro-sobre.jpg")}
        titulo1={texto(conteudo, "sobremim_titulo_1", SOBREMIM_TITULO_1)}
        titulo2={texto(conteudo, "sobremim_titulo_2", SOBREMIM_TITULO_2)}
        paragrafo={texto(conteudo, "sobremim_texto", SOBREMIM_TEXTO)}
        pills={lista(conteudo, "sobremim_pills", SOBREMIM_PILLS)}
      />
      {relatoDestaque && <RelatoDestaque video={relatoDestaque} />}
      <ClientesAmigos fotos={fotosClientes} />
      <LancamentosDestaque empreendimentos={empreendimentosEmDestaque(empreendimentos)} />
      <FaixaContato foto={texto(conteudo, "foto_contato", "/sandro-contato.jpg")} />
    </>
  );
}
