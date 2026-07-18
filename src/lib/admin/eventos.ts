import { createClient } from "@/lib/supabase/client";
import { uploadImagem, uploadImagens } from "@/lib/admin/empreendimentos";

/**
 * Sobe a capa e as fotos da galeria pro Storage e registra o evento.
 * O RLS exige admin.
 */
export async function adicionarEvento(
  capa: File,
  nome: string,
  descricao: string,
  galeriaFiles: File[],
): Promise<void> {
  const capaUrl = await uploadImagem(capa);
  const galeria = galeriaFiles.length > 0 ? await uploadImagens(galeriaFiles) : [];

  const supabase = createClient();
  const { error } = await supabase
    .from("eventos")
    .insert({ capa: capaUrl, nome: nome.trim(), descricao: descricao.trim(), galeria });

  if (error) throw new Error("Não foi possível adicionar o evento.");
}

export async function excluirEvento(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("eventos").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o evento.");
}
