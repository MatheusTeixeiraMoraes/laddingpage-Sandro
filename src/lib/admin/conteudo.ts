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
