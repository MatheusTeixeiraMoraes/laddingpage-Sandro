import { createClient } from "@/lib/supabase/client";

/**
 * Marca em destaque exatamente os imóveis de `marcadosIds` e tira o destaque de
 * todos os outros — de uma vez. Escrita client-side sob o RLS de admin (mesmo
 * padrão do resto do painel).
 */
export async function salvarDestaques(
  marcadosIds: string[],
  todosIds: string[],
): Promise<void> {
  const supabase = createClient();
  const desmarcadosIds = todosIds.filter((id) => !marcadosIds.includes(id));

  if (marcadosIds.length > 0) {
    const { error } = await supabase
      .from("empreendimentos")
      .update({ destaque: true })
      .in("id", marcadosIds);
    if (error) {
      throw new Error("Não foi possível salvar os destaques. Tente novamente.");
    }
  }

  if (desmarcadosIds.length > 0) {
    const { error } = await supabase
      .from("empreendimentos")
      .update({ destaque: false })
      .in("id", desmarcadosIds);
    if (error) {
      throw new Error("Não foi possível salvar os destaques. Tente novamente.");
    }
  }
}
