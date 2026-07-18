import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getEmpreendimentos } from "@/lib/empreendimentos";

/**
 * /sitemap.xml -- a "lista de enderecos" que o Google usa pra indexar. Paginas
 * fixas + uma entrada por empreendimento publicado (buscados do banco).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const empreendimentos = await getEmpreendimentos();

  const paginas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/relatos`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/parceiros`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/premiacoes`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contato`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/galeria`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const imoveis: MetadataRoute.Sitemap = empreendimentos.map((e) => ({
    url: `${SITE_URL}/empreendimentos/${e.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...paginas, ...imoveis];
}
