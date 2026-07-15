/**
 * Funções puras de conteúdo (resolver valor com padrão, parse de números).
 * Ficam separadas de getConteudo porque este puxa `next/headers` (server-only)
 * — assim elas rodam nos testes e podem ser usadas em qualquer lugar.
 */

export type Conteudo = Record<string, unknown>;

/** Texto (ou URL de foto) da chave, caindo no padrão quando não foi editado. */
export function texto(conteudo: Conteudo, chave: string, padrao: string): string {
  const valor = conteudo[chave];
  return typeof valor === "string" && valor.trim() !== "" ? valor : padrao;
}

/** Lista de strings da chave, caindo no padrão quando não foi editada. */
export function lista(conteudo: Conteudo, chave: string, padrao: string[]): string[] {
  const valor = conteudo[chave];
  return Array.isArray(valor) && valor.length > 0 ? (valor as string[]) : padrao;
}

export type Numero = { valor: string; label: string };

/**
 * Converte as linhas "valor | label" (como o Sandro edita no painel) em pares.
 * Ex.: "+100 | Famílias atendidas" -> { valor: "+100", label: "Famílias atendidas" }.
 * Linha sem "|" vira só o valor; linha vazia é descartada.
 */
export function parseNumeros(linhas: string[]): Numero[] {
  return linhas
    .map((linha) => {
      const sep = linha.indexOf("|");
      return sep === -1
        ? { valor: linha.trim(), label: "" }
        : { valor: linha.slice(0, sep).trim(), label: linha.slice(sep + 1).trim() };
    })
    .filter((n) => n.valor !== "" || n.label !== "");
}

/**
 * Resolve os números editáveis, caindo no padrão quando não há nada útil.
 * Diferente de lista(): olha o resultado JÁ parseado — se o Sandro salvar só
 * lixo (ex.: uma linha com "|" solto), o parse zera e voltamos ao padrão, em
 * vez de renderizar a seção vazia.
 */
export function resolverNumeros(
  conteudo: Conteudo,
  chave: string,
  padrao: Numero[],
): Numero[] {
  const bruto = conteudo[chave];
  if (Array.isArray(bruto)) {
    const parseados = parseNumeros(bruto as string[]);
    if (parseados.length > 0) return parseados;
  }
  return padrao;
}
