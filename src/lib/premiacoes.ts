import { createClient } from "@/lib/supabase/server";

export type Premiacao = {
  id: string;
  imagem: string;
  titulo: string;
  ano: number | null;
};

/**
 * Premiacoes do Sandro. Vivem no banco (arquivo no Storage) porque ele
 * adiciona e remove sozinho em /admin/premiacoes. Ordenadas do ano mais
 * recente pro mais antigo (sem ano vai pro fim).
 */
export async function getPremiacoes(): Promise<Premiacao[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("premiacoes")
    .select("id, imagem, titulo, ano")
    .order("ano", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Falha ao buscar as premiações: ${error.message}`);

  return (data ?? []).map((p) => ({
    id: p.id,
    imagem: p.imagem,
    titulo: p.titulo ?? "",
    ano: p.ano,
  }));
}
