import { createClient } from "@/lib/supabase/client";
import { uploadImagem } from "@/lib/admin/empreendimentos";

/** Sobe a imagem pro Storage e registra a premiacao. O RLS exige admin. */
export async function adicionarPremiacao(
  arquivo: File,
  titulo: string,
  ano: number | null,
): Promise<void> {
  const imagem = await uploadImagem(arquivo);

  const supabase = createClient();
  const { error } = await supabase
    .from("premiacoes")
    .insert({ imagem, titulo: titulo.trim(), ano });

  if (error) throw new Error("Não foi possível adicionar a premiação.");
}

/**
 * Edita uma premiação. Só sobe imagem nova se `arquivo` vier; senão mantém a
 * atual (o RLS exige admin). Sem marca d'água — marca é só pra imóveis.
 */
export async function editarPremiacao(
  id: string,
  dados: { titulo: string; ano: number | null; arquivo: File | null },
): Promise<void> {
  const patch: { titulo: string; ano: number | null; imagem?: string } = {
    titulo: dados.titulo.trim(),
    ano: dados.ano,
  };
  if (dados.arquivo) patch.imagem = await uploadImagem(dados.arquivo);

  const supabase = createClient();
  const { error } = await supabase.from("premiacoes").update(patch).eq("id", id);

  if (error) throw new Error("Não foi possível salvar a premiação.");
}

export async function excluirPremiacao(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("premiacoes").delete().eq("id", id);

  if (error) throw new Error("Não foi possível excluir a premiação.");
}
