import { createClient } from "@/lib/supabase/client";
import { uploadImagem } from "@/lib/admin/empreendimentos";

/** Sobe a imagem pro Storage e registra o parceiro. O RLS exige admin. */
export async function adicionarParceiro(arquivo: File, texto: string): Promise<void> {
  const imagem = await uploadImagem(arquivo);

  const supabase = createClient();
  // O primeiro parceiro cadastrado ja entra como destaque (senao /parceiros
  // ficaria sem o destaque ate alguem marcar um).
  const { count } = await supabase
    .from("parceiros")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase
    .from("parceiros")
    .insert({ imagem, texto: texto.trim(), destaque: (count ?? 0) === 0 });

  if (error) throw new Error("Não foi possível adicionar o parceiro.");
}

/**
 * Edita um parceiro (texto e, opcionalmente, a imagem). Não mexe no destaque —
 * isso é o definirDestaque. Sem marca d'água — marca é só pra imóveis.
 */
export async function editarParceiro(
  id: string,
  dados: { texto: string; arquivo: File | null },
): Promise<void> {
  const patch: { texto: string; imagem?: string } = { texto: dados.texto.trim() };
  if (dados.arquivo) patch.imagem = await uploadImagem(dados.arquivo);

  const supabase = createClient();
  const { error } = await supabase.from("parceiros").update(patch).eq("id", id);

  if (error) throw new Error("Não foi possível salvar o parceiro.");
}

export async function excluirParceiro(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("parceiros").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o parceiro.");
}

/** Marca um parceiro como destaque e desmarca os demais (so um pode ser). */
export async function definirDestaque(id: string): Promise<void> {
  const supabase = createClient();

  const { error: eDesmarca } = await supabase
    .from("parceiros")
    .update({ destaque: false })
    .eq("destaque", true);
  if (eDesmarca) throw new Error("Não foi possível atualizar o destaque.");

  const { error: eMarca } = await supabase
    .from("parceiros")
    .update({ destaque: true })
    .eq("id", id);
  if (eMarca) throw new Error("Não foi possível atualizar o destaque.");
}
