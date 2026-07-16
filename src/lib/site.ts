/**
 * Endereco canonico do site. A raiz (.com.br) redireciona 308 para o www,
 * entao o www e o oficial. Usado em metadata, sitemap, robots e nos dados
 * estruturados -- fonte unica pra nao divergir.
 */
export const SITE_URL = "https://www.sandrohigutiimoveis.com.br";

/** Dados publicos do negocio para SEO / dados estruturados. */
export const NEGOCIO = {
  nome: "Sandro Higuti — Consultor Imobiliário",
  nomeCurto: "Sandro Higuti",
  descricao:
    "Consultor imobiliário em Sorocaba, especialista em apartamentos na planta e Minha Casa Minha Vida. Atendimento humano do começo ao fim. CRECI 278922.",
  creci: "278922",
  telefone: "+5515992500314",
  email: "sandrohiguti@creci.org.br",
  endereco: {
    logradouro: "Rua Justiniano de Souza, 145",
    bairro: "Vila Angélica",
    cidade: "Sorocaba",
    uf: "SP",
    pais: "BR",
  },
  areaAtendida: "Sorocaba e Região",
  redes: [
    "https://www.instagram.com/sandrohiguti_cons_imob",
    "https://www.facebook.com/share/1CY2SxY7KG/",
    "https://www.tiktok.com/@sandro_higuti",
  ],
} as const;
