import { createClient } from "@/lib/supabase/server";

export type Evento = {
  id: string;
  capa: string;
  nome: string;
  descricao: string;
  galeria: string[];
};

/**
 * Eventos de que o Sandro participa (lancamentos, convencoes). Vivem no banco
 * (imagens no Storage) porque ele adiciona e remove sozinho em /admin/eventos.
 * Aparecem em /eventos, do mais recente pro mais antigo.
 */
export async function getEventos(): Promise<Evento[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eventos")
    .select("id, capa, nome, descricao, galeria")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Falha ao buscar os eventos: ${error.message}`);

  return (data ?? []).map((e) => ({
    id: e.id,
    capa: e.capa,
    nome: e.nome ?? "",
    descricao: e.descricao ?? "",
    galeria: e.galeria ?? [],
  }));
}
