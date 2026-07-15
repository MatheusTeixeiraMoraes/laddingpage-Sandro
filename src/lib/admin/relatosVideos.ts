import { createClient } from "@/lib/supabase/client";
import { extrairYoutubeId } from "@/lib/youtube";

/** Registra um relato em video a partir do link do YouTube. RLS exige admin. */
export async function adicionarRelatoVideo(link: string, titulo: string): Promise<void> {
  const youtubeId = extrairYoutubeId(link);
  if (!youtubeId) {
    throw new Error("Link do YouTube invalido. Cole o endereco do video (ex.: https://youtu.be/...).");
  }

  const supabase = createClient();

  // O primeiro video cadastrado ja entra como principal -- senao /relatos
  // ficaria sem o video grande ate alguem marcar um na mao.
  const { count } = await supabase
    .from("relatos_videos")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase
    .from("relatos_videos")
    .insert({ youtube_id: youtubeId, titulo: titulo.trim(), principal: (count ?? 0) === 0 });

  if (error) throw new Error("Nao foi possivel adicionar o video.");
}

export async function excluirRelatoVideo(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("relatos_videos").delete().eq("id", id);
  if (error) throw new Error("Nao foi possivel excluir o video.");
}

/** Marca um video como principal e desmarca os demais (so um pode ser). */
export async function definirPrincipal(id: string): Promise<void> {
  const supabase = createClient();

  // Desmarca o atual, depois marca o escolhido. Sao duas queries (sem
  // transacao no client); no meio pode nao haver principal, mas a pagina
  // tolera isso caindo no primeiro video.
  const { error: eDesmarca } = await supabase
    .from("relatos_videos")
    .update({ principal: false })
    .eq("principal", true);
  if (eDesmarca) throw new Error("Nao foi possivel atualizar o video principal.");

  const { error: eMarca } = await supabase
    .from("relatos_videos")
    .update({ principal: true })
    .eq("id", id);
  if (eMarca) throw new Error("Nao foi possivel atualizar o video principal.");
}
