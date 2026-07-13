export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  /** O que ele procura ("Apartamento na planta", "Pronto para morar"...). */
  interesse: string;
  atendido: boolean;
  criadoEm: string;
};

export type LeadInput = {
  nome: string;
  telefone: string;
  interesse: string;
  /** LGPD: sem isso o banco recusa a linha. */
  consentimento: boolean;
};
