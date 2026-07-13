import { createClient } from "@/lib/supabase/client";

export async function marcarAtendido(id: string, atendido: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").update({ atendido }).eq("id", id);

  if (error) throw new Error("Não foi possível atualizar o lead.");
}

export async function excluirLead(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) throw new Error("Não foi possível excluir o lead.");
}
