export type Depoimento = {
  id: string;
  /** Nome de quem AUTORIZOU o uso. Nunca inventar, nunca abreviar sem permissão. */
  autor: string;
  /** 1 a 5. */
  nota: number;
  texto: string;
};
