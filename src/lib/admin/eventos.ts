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

/**
 * Edita um evento. `galeria` são as URLs que ficam (Sandro pode ter removido
 * algumas no formulário); `novasFotos` sobem e entram no fim da galeria. Só
 * troca a capa se `capa` vier. Remover uma foto só tira a referência — o
 * arquivo no Storage continua lá (mesmo comportamento do resto do painel).
 * Sem marca d'água — marca é só pra imóveis.
 */
export async function editarEvento(
  id: string,
  dados: {
    nome: string;
    descricao: string;
    capa: File | null;
    galeria: string[];
    novasFotos: File[];
  },
): Promise<void> {
  const novasUrls =
    dados.novasFotos.length > 0 ? await uploadImagens(dados.novasFotos) : [];

  const patch: {
    nome: string;
    descricao: string;
    galeria: string[];
    capa?: string;
  } = {
    nome: dados.nome.trim(),
    descricao: dados.descricao.trim(),
    galeria: [...dados.galeria, ...novasUrls],
  };
  if (dados.capa) patch.capa = await uploadImagem(dados.capa);

  const supabase = createClient();
  const { error } = await supabase.from("eventos").update(patch).eq("id", id);

  if (error) throw new Error("Não foi possível salvar o evento.");
}

export async function excluirEvento(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("eventos").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o evento.");
}
