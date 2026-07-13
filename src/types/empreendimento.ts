export type TipoEmpreendimento = "apartamento" | "casa" | "comercial";

export type Zona = "norte" | "sul" | "leste" | "oeste" | "central";

/**
 * A planta é só o tamanho. Quem tem suíte, varanda ou quintal é o
 * empreendimento — é assim que a planilha do Sandro descreve os imóveis, e é
 * o que ele consegue preencher para os 88.
 */
export type Planta = {
  id: string;
  metragem: number;
  /** Opcional. Nulo = usa o "a partir de" do empreendimento. */
  preco: number | null;
  /** Imagens desta planta (planta baixa, decorado). */
  imagens: string[];
};

export type Empreendimento = {
  id: string;
  nome: string;
  tipo: TipoEmpreendimento;
  bairro: string;
  zona: Zona;
  /** Foto de capa (cards e hero). */
  imagem: string;
  /** Fotos do empreendimento (fachada, lazer, decorado). */
  galeria: string[];
  /** Data de entrega ('AAAA-MM-DD'); nulo = pronto para morar. O rótulo
   *  exibido ('Dez/2026') é derivado por src/lib/entrega.ts. */
  entregaEm: string | null;
  /** O preço oficial exibido no site. */
  precoAPartirDe: number;
  /** Opções de dormitórios do empreendimento: [2] ou [2, 3] ou [1, 2, 3]. */
  dormitorios: number[];
  suite: boolean;
  varanda: boolean;
  quintal: boolean;
  garagemCoberta: boolean;
  elevador: boolean;
  /** Pontos de ar-condicionado (1, 2, 3). Nulo = não informado. */
  pontosAr: number | null;
  latitude: number;
  longitude: number;
  plantas: Planta[];
};
