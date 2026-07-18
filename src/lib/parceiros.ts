import { createClient } from "@/lib/supabase/server";

export type Parceiro = {
  id: string;
  imagem: string;
  texto: string;
  destaque: boolean;
};

/**
 * Parceiros do Sandro. Vivem no banco (imagem no Storage) porque ele adiciona,
 * remove e escolhe o destaque sozinho em /admin/parceiros. Aparecem em /parceiros.
 */
export async function getParceiros(): Promise<Parceiro[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parceiros")
    .select("id, imagem, texto, destaque")
    .order("created_at");

  if (error) throw new Error(`Falha ao buscar os parceiros: ${error.message}`);

  return (data ?? []).map((p) => ({
    id: p.id,
    imagem: p.imagem,
    texto: p.texto ?? "",
    destaque: p.destaque ?? false,
  }));
}
