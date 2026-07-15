import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Conteudo } from "@/lib/conteudoTexto";

// Reexporta as funções puras (resolver valor com padrão, parse de números) para
// quem importa "@/lib/conteudo" continuar pegando tudo de um lugar só.
export type { Conteudo, Numero } from "@/lib/conteudoTexto";
export { texto, lista, parseNumeros, resolverNumeros } from "@/lib/conteudoTexto";

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
