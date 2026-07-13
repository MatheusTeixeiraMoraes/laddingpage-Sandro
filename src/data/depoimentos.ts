import type { Depoimento } from "@/types/depoimento";

/**
 * Depoimentos REAIS de clientes do Sandro, com autorização de quem assina.
 *
 * Esta lista está vazia de propósito. Até 13/07/2026 o site publicava quatro
 * depoimentos INVENTADOS (Marcia Oliveira, Roberto Lima, Fernanda Costa, Paulo
 * Henrique) — pessoas que não existem — com estrelas, como se fossem clientes
 * reais. Num site cujo pilar é a honestidade do Sandro, isso era o pior tipo de
 * bug: parecia verdade.
 *
 * Enquanto a lista estiver vazia, a seção simplesmente não aparece no site.
 *
 * Para publicar, basta preencher aqui:
 *
 *   { id: "1", autor: "Nome de quem autorizou", nota: 5, texto: "..." },
 *
 * Regra: só entra o que o cliente escreveu e autorizou. Sem inventar, sem
 * "melhorar" o texto dele, sem nome parcial que ninguém consiga confirmar.
 */
export const depoimentos: Depoimento[] = [];
