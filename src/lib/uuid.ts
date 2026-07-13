const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Ids de empreendimento vêm da URL (entrada não confiável). Sem esta checagem,
 * um id que não é UUID chega ao Postgres, ele estoura e a página vira 500 em
 * vez de 404.
 */
export function isUuid(valor: string): boolean {
  return UUID.test(valor);
}
