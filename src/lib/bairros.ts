import { createClient } from "@/lib/supabase/server";
import type { Bairro } from "@/types/empreendimento";

export async function getBairros(): Promise<Bairro[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bairros")
    .select("id, nome, sobre")
    .order("nome");

  if (error) throw new Error(`Falha ao buscar bairros: ${error.message}`);

  return (data ?? []).map((b) => ({ ...b, sobre: b.sobre ?? "" }));
}
