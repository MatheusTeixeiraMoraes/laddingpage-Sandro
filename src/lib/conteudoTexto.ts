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

export type Valor = { emoji: string; titulo: string };

/**
 * Converte as linhas "emoji | nome" (como o Sandro edita) em pares.
 * Ex.: "❤️ | Empatia" -> { emoji: "❤️", titulo: "Empatia" }.
 * Linha sem "|" vira só o nome (sem emoji); linha sem nome é descartada.
 */
export function parseValores(linhas: string[]): Valor[] {
  return linhas
    .map((linha) => {
      const sep = linha.indexOf("|");
      return sep === -1
        ? { emoji: "", titulo: linha.trim() }
        : { emoji: linha.slice(0, sep).trim(), titulo: linha.slice(sep + 1).trim() };
    })
    .filter((v) => v.titulo !== "");
}

/** Resolve os valores editáveis, caindo no padrão quando o parse zera. */
export function resolverValores(
  conteudo: Conteudo,
  chave: string,
  padrao: Valor[],
): Valor[] {
  const bruto = conteudo[chave];
  if (Array.isArray(bruto)) {
    const parseados = parseValores(bruto as string[]);
    if (parseados.length > 0) return parseados;
  }
  return padrao;
}
