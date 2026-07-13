import { createClient } from "@/lib/supabase/client";
import type { Bairro } from "@/types/empreendimento";

/**
 * O texto do bairro vale para TODOS os imóveis daquele bairro. Editar aqui
 * muda a página de todos eles — é de propósito: é a mesma Vila Haro.
 */
export async function listarBairros(): Promise<Bairro[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bairros")
    .select("id, nome, sobre")
    .order("nome");

  if (error) throw new Error("Não foi possível carregar os bairros.");

  return (data ?? []).map((b) => ({ ...b, sobre: b.sobre ?? "" }));
}

export async function criarBairro(nome: string): Promise<Bairro> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bairros")
    .insert({ nome: nome.trim() })
    .select("id, nome, sobre")
    .single();

  if (error || !data) {
    // unique_violation: o bairro já existe.
    if (error?.code === "23505") {
      throw new Error("Esse bairro já existe. Escolha ele na lista.");
    }
    throw new Error("Não foi possível criar o bairro.");
  }

  return { ...data, sobre: data.sobre ?? "" };
}

export async function salvarSobreBairro(id: string, sobre: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("bairros")
    .update({ sobre: sobre.trim() })
    .eq("id", id);

  if (error) throw new Error("Não foi possível salvar o texto do bairro.");
}
