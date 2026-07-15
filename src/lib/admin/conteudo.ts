import { createClient } from "@/lib/supabase/client";

/**
 * Salva (cria ou atualiza) um pedaço do conteúdo do site. Escrita client-side
 * sob RLS de admin, igual ao resto do painel.
 */
export async function salvarConteudo(chave: string, valor: unknown): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("conteudo_site")
    .upsert(
      { chave, valor, updated_at: new Date().toISOString() },
      { onConflict: "chave" },
    );

  if (error) {
    throw new Error("Não foi possível salvar. Tente novamente.");
  }
}

/** Salva vários campos de uma vez (usado pelos editores de texto em bloco). */
export async function salvarConteudos(
  entradas: { chave: string; valor: unknown }[],
): Promise<void> {
  if (entradas.length === 0) return;

  const supabase = createClient();
  const agora = new Date().toISOString();
  const linhas = entradas.map((e) => ({
    chave: e.chave,
    valor: e.valor,
    updated_at: agora,
  }));

  const { error } = await supabase
    .from("conteudo_site")
    .upsert(linhas, { onConflict: "chave" });

  if (error) {
    throw new Error("Não foi possível salvar. Tente novamente.");
  }
}
