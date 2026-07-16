import { SITE_URL, NEGOCIO } from "@/lib/site";

/**
 * Dados estruturados (JSON-LD) do tipo RealEstateAgent -- um bloco invisivel
 * que diz ao Google quem e o Sandro (corretor, CRECI, cidade, telefone, redes).
 * Ajuda o site a aparecer nas buscas pelo nome e nas buscas locais.
 */
export function SchemaOrg() {
  const { endereco } = NEGOCIO;
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#sandro`,
    name: NEGOCIO.nome,
    alternateName: NEGOCIO.nomeCurto,
    description: NEGOCIO.descricao,
    url: SITE_URL,
    image: `${SITE_URL}/logo-marca.png`,
    logo: `${SITE_URL}/logo-marca.png`,
    telephone: NEGOCIO.telefone,
    email: NEGOCIO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${endereco.logradouro} - ${endereco.bairro}`,
      addressLocality: endereco.cidade,
      addressRegion: endereco.uf,
      addressCountry: endereco.pais,
    },
    areaServed: NEGOCIO.areaAtendida,
    sameAs: [...NEGOCIO.redes],
    knowsAbout: [
      "Apartamento na planta",
      "Minha Casa Minha Vida",
      "Financiamento imobiliário",
      "Imóveis em Sorocaba",
    ],
  };

  // Escapa cada "<" (vira <): impede que algum valor feche o <script>
  // por acidente (padrao seguro pra JSON-LD). Hoje os dados sao constantes.
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
