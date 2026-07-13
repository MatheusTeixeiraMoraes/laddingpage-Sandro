export type Depoimento = {
  id: string;
  /** Nome de quem AUTORIZOU o uso. Nunca inventar, nunca abreviar sem permissão. */
  autor: string;
  /** 1 a 5. */
  nota: number;
  /**
   * Mês da avaliação ('AAAA-MM'). O rótulo ("há 2 meses") é DERIVADO daqui, não
   * guardado: se guardássemos "2 meses atrás", daqui a um ano o site continuaria
   * dizendo isso sobre uma avaliação de dois anos.
   */
  quando: string;
  texto: string;
};
