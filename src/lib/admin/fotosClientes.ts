import { createClient } from "@/lib/supabase/client";
import { uploadImagem } from "@/lib/admin/empreendimentos";

/** Sobe o arquivo para o Storage e registra a foto. O RLS exige admin. */
export async function adicionarFotoCliente(arquivo: File, legenda: string): Promise<void> {
  const url = await uploadImagem(arquivo);

  const supabase = createClient();
  const { error } = await supabase
    .from("fotos_clientes")
    .insert({ url, legenda: legenda.trim() });

  if (error) throw new Error("Não foi possível adicionar a foto.");
}

export async function excluirFotoCliente(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("fotos_clientes").delete().eq("id", id);

  if (error) throw new Error("Não foi possível excluir a foto.");
}
