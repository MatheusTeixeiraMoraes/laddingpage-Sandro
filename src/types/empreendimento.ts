export type TipoEmpreendimento = "apartamento" | "casa" | "comercial";

export type Zona = "norte" | "sul" | "leste" | "oeste" | "central";

export type Planta = {
  id: string;
  metragem: number;
  comSuite: boolean;
  dormitorios: number;
  vagas: number;
  preco: number;
  /** Rótulos dos cômodos ("Sala", "Cozinha"). Não são imagens. */
  ambientes: string[];
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
  latitude: number;
  longitude: number;
  plantas: Planta[];
};
