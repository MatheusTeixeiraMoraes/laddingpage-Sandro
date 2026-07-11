export const BIO_TEXTO =
  "Texto de apresentação do Sandro Higuti (placeholder) — substituir por um texto real contando a trajetória, especialidades e valores do corretor.";

export const GALERIA_FOTOS: string[] = [
  "Sandro com cliente — entrega das chaves",
  "Sandro em visita a um empreendimento",
  "Sandro com cliente — assinatura de contrato",
  "Equipe em evento do setor imobiliário",
];

export type DepoimentoVideo = {
  id: string;
  nome: string;
  texto: string;
};

export const DEPOIMENTOS_VIDEO: DepoimentoVideo[] = [
  {
    id: "1",
    nome: "Juliana Ferreira",
    texto: "O Sandro foi essencial para encontrarmos nosso primeiro apartamento.",
  },
  {
    id: "2",
    nome: "Carlos Eduardo",
    texto: "Atendimento personalizado do início ao fim da negociação.",
  },
];

export type RedeSocial = {
  nome: string;
  href: string;
};

export const REDES_SOCIAIS: RedeSocial[] = [
  { nome: "Instagram", href: "#" },
  { nome: "Facebook", href: "#" },
  { nome: "YouTube", href: "#" },
  { nome: "LinkedIn", href: "#" },
];
