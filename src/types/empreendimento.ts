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
  vagaDupla: boolean;
  /** Pontos de ar-condicionado (1, 2, 3). Nulo = não informado. */
  pontosAr: number | null;
  /** Texto escrito pelo Sandro no painel. Vazio = não publicada. */
  descricao: string;

  // Ficha técnica (vem da planilha). Vazio/nulo = não informado, e o campo
  // simplesmente não aparece na página.
  construtora: string;
  torres: number | null;
  /** Como o Sandro escreve: "T + 19", "T+3". */
  andares: string;
  aptosPorAndar: number | null;
  /** Quantidade. Nulo = não informado; 0 = prédio sem elevador (sobrado). */
  elevadores: number | null;
  entregaComPiso: "" | "completo" | "areas_molhadas";
  documentacao: "" | "gratis" | "pago";

  latitude: number;
  longitude: number;
  plantas: Planta[];
};
