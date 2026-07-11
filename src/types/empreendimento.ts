export type TipoEmpreendimento = "apartamento" | "casa" | "comercial";

export type Planta = {
  id: string;
  metragem: number;
  comSuite: boolean;
  dormitorios: number;
  vagas: number;
  preco: number;
  fotos: string[];
};

export type Empreendimento = {
  id: string;
  nome: string;
  tipo: TipoEmpreendimento;
  bairro: string;
  latitude: number;
  longitude: number;
  plantas: Planta[];
};
