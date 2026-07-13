import { createClient } from "@/lib/supabase/server";

export type FotoCliente = {
  id: string;
  url: string;
  legenda: string;
};

/**
 * Fotos de entrega de chaves. Vivem no banco (arquivo no Storage) porque o
 * Sandro gerencia sozinho em /admin/depoimentos — antes estavam fixas no
 * código, e adicionar uma foto exigia um programador.
 */
export async function getFotosClientes(): Promise<FotoCliente[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fotos_clientes")
    .select("id, url, legenda")
    .order("created_at");

  if (error) throw new Error(`Falha ao buscar as fotos de clientes: ${error.message}`);

  return (data ?? []).map((f) => ({ ...f, legenda: f.legenda ?? "" }));
}
