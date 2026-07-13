import { createClient } from "@/lib/supabase/client";
import type { TipoEmpreendimento, Zona } from "@/types/empreendimento";

export type EmpreendimentoInput = {
  nome: string;
  tipo: TipoEmpreendimento;
  bairro: string;
  zona: Zona;
  imagem: string;
  entrega: string;
  latitude: number;
  longitude: number;
};

export type PlantaInput = {
  metragem: number;
  comSuite: boolean;
  dormitorios: number;
  vagas: number;
  preco: number;
  fotos: string[];
};

const BUCKET = "imoveis";
const TAMANHO_MAX = 5 * 1024 * 1024;
const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"];

function paraLinhaPlanta(dados: PlantaInput) {
  return {
    metragem: dados.metragem,
    com_suite: dados.comSuite,
    dormitorios: dados.dormitorios,
    vagas: dados.vagas,
    preco: dados.preco,
    fotos: dados.fotos,
  };
}

export async function uploadImagem(arquivo: File): Promise<string> {
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    throw new Error("Formato não aceito. Use JPG, PNG ou WEBP.");
  }
  if (arquivo.size > TAMANHO_MAX) {
    throw new Error("A imagem passa de 5 MB. Escolha uma menor.");
  }

  const supabase = createClient();
  const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const nome = `${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage.from(BUCKET).upload(nome, arquivo);
  if (error) throw new Error("Não foi possível enviar a imagem. Tente novamente.");

  return supabase.storage.from(BUCKET).getPublicUrl(nome).data.publicUrl;
}

export async function criarEmpreendimento(
  dados: EmpreendimentoInput,
): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("empreendimentos")
    .insert(dados)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Não foi possível criar o empreendimento. Tente novamente.");
  }

  return data.id as string;
}

export async function atualizarEmpreendimento(
  id: string,
  dados: EmpreendimentoInput,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("empreendimentos")
    .update(dados)
    .eq("id", id);

  if (error) {
    throw new Error("Não foi possível salvar as alterações. Tente novamente.");
  }
}

export async function excluirEmpreendimento(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("empreendimentos").delete().eq("id", id);

  if (error) {
    throw new Error("Não foi possível excluir o empreendimento. Tente novamente.");
  }
}

export async function criarPlanta(
  empreendimentoId: string,
  dados: PlantaInput,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("plantas")
    .insert({ empreendimento_id: empreendimentoId, ...paraLinhaPlanta(dados) });

  if (error) {
    throw new Error("Não foi possível adicionar a planta. Tente novamente.");
  }
}

export async function atualizarPlanta(
  id: string,
  dados: PlantaInput,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("plantas")
    .update(paraLinhaPlanta(dados))
    .eq("id", id);

  if (error) {
    throw new Error("Não foi possível salvar a planta. Tente novamente.");
  }
}

export async function excluirPlanta(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("plantas").delete().eq("id", id);

  if (error) {
    throw new Error("Não foi possível excluir a planta. Tente novamente.");
  }
}
