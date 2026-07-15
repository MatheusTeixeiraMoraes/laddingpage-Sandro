import { createClient } from "@/lib/supabase/server";

export type RelatoVideo = {
  id: string;
  youtubeId: string;
  titulo: string;
  principal: boolean;
};

/**
 * Relatos em video (clientes) que aparecem em /relatos. Vivem no banco (link
 * do YouTube) porque o Sandro adiciona, remove e escolhe o principal sozinho
 * em /admin/relatos. Ordena pela criacao; o "principal" e resolvido na pagina.
 */
export async function getRelatosVideos(): Promise<RelatoVideo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("relatos_videos")
    .select("id, youtube_id, titulo, principal")
    .order("created_at");

  if (error) throw new Error(`Falha ao buscar os relatos em video: ${error.message}`);

  return (data ?? []).map((v) => ({
    id: v.id,
    youtubeId: v.youtube_id,
    titulo: v.titulo ?? "",
    principal: v.principal ?? false,
  }));
}
