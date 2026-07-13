import { createClient } from "@/lib/supabase/client";
import type { TipoEmpreendimento, Zona } from "@/types/empreendimento";

/** Nomes em snake_case: o objeto vai direto para o insert/update do Supabase. */
export type EmpreendimentoInput = {
  nome: string;
  tipo: TipoEmpreendimento;
  bairro: string;
  zona: Zona;
  imagem: string;
  galeria: string[];
  /** 'AAAA-MM-DD' ou null (= pronto para morar). */
  entrega_em: string | null;
  preco_a_partir_de: number;
  dormitorios: number[];
  suite: boolean;
  varanda: boolean;
  quintal: boolean;
  garagem_coberta: boolean;
  elevador: boolean;
  pontos_ar: number | null;
  latitude: number;
  longitude: number;
};

export type PlantaInput = {
  metragem: number;
  /** Opcional. Nulo = usa o "a partir de" do empreendimento. */
  preco: number | null;
  imagens: string[];
};

const BUCKET = "imoveis";
const TAMANHO_MAX = 5 * 1024 * 1024;
const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"];

function paraLinhaPlanta(dados: PlantaInput) {
  return {
    metragem: dados.metragem,
    preco: dados.preco,
    imagens: dados.imagens,
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

/** Sobe várias imagens e devolve as URLs na mesma ordem. */
export async function uploadImagens(arquivos: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const arquivo of arquivos) {
    urls.push(await uploadImagem(arquivo));
  }
  return urls;
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
