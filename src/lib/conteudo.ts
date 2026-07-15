import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Conteudo = Record<string, unknown>;

/**
 * Conteúdo editável do site (fotos e textos que o Sandro muda no painel).
 * cache(): a mesma requisição pode ler isso em várias seções — sem cache seria
 * uma consulta por seção.
 */
export const getConteudo = cache(async (): Promise<Conteudo> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_site")
    .select("chave, valor");

  if (error) throw new Error(`Falha ao buscar o conteúdo do site: ${error.message}`);

  const mapa: Conteudo = {};
  for (const row of data ?? []) mapa[row.chave] = row.valor;
  return mapa;
});

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
