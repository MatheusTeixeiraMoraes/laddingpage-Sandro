import { createClient } from "@/lib/supabase/client";
import { prepararImagem } from "@/lib/admin/imagemUpload";
import type { TipoEmpreendimento, Zona } from "@/types/empreendimento";

/** Nomes em snake_case: o objeto vai direto para o insert/update do Supabase. */
export type EmpreendimentoInput = {
  nome: string;
  tipo: TipoEmpreendimento;
  bairro_id: string;
  zona: Zona;
  imagem: string;
  galeria: string[];
  /** 'AAAA-MM-DD' ou null (= pronto para morar). */
  entrega_em: string | null;
  preco_a_partir_de: number;
  dormitorios: number[];
  /** Quantidade de suítes (0 = sem suíte). */
  suite: number;
  varanda: boolean;
  quintal: boolean;
  garagem_coberta: boolean;
  vaga_dupla: boolean;
  pontos_ar: number | null;
  descricao: string;
  construtora: string;
  torres: number | null;
  andares: string;
  aptos_por_andar: number | null;
  elevadores: number | null;
  entrega_com_piso: "" | "completo" | "areas_molhadas";
  documentacao: "" | "gratis" | "desconto";
  endereco: string;
  destaque: boolean;
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

/**
 * Sobe a imagem já redimensionada e comprimida (ver imagemUpload.ts). Com
 * `marca: true` também queima a logo do Sandro no centro — só imóveis.
 */
export async function uploadImagem(
  arquivo: File,
  opts?: { marca?: boolean },
): Promise<string> {
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    throw new Error("Formato não aceito. Use JPG, PNG ou WEBP.");
  }
  if (arquivo.size > TAMANHO_MAX) {
    throw new Error("A imagem passa de 5 MB. Escolha uma menor.");
  }

  // Sempre prepara: o site serve direto do Storage, então imagem pesada aqui
  // é imagem pesada no celular do cliente.
  const arquivoFinal = await prepararImagem(arquivo, opts);

  const supabase = createClient();
  // A extensão vem do arquivo JÁ processado (vira .jpg), não do original.
  const extensao = arquivoFinal.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const nome = `${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage.from(BUCKET).upload(nome, arquivoFinal);
  if (error) throw new Error("Não foi possível enviar a imagem. Tente novamente.");

  return supabase.storage.from(BUCKET).getPublicUrl(nome).data.publicUrl;
}

/** Sobe várias imagens e devolve as URLs na mesma ordem. */
export async function uploadImagens(
  arquivos: File[],
  opts?: { marca?: boolean },
): Promise<string[]> {
  const urls: string[] = [];
  for (const arquivo of arquivos) {
    urls.push(await uploadImagem(arquivo, opts));
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
