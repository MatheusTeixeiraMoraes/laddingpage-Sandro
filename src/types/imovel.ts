export type TipoImovel = "apartamento" | "casa" | "comercial";

export type Imovel = {
  id: string;
  nome: string;
  tipo: TipoImovel;
  dormitorios: number;
  vagas: number;
  metragem: number;
  preco: number;
  bairro: string;
  imagemUrl: string;
};
