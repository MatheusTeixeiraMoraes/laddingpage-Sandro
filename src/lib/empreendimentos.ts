import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";
import type { Empreendimento, Zona } from "@/types/empreendimento";

const SELECT_EMPREENDIMENTO =
  "id, nome, tipo, bairro, zona, imagem, galeria, entrega_em, latitude, longitude, plantas(id, metragem, com_suite, dormitorios, vagas, preco, ambientes, imagens)";

type PlantaRow = {
  id: string;
  metragem: number | string;
  com_suite: boolean;
  dormitorios: number;
  vagas: number;
  preco: number | string;
  ambientes: string[];
  imagens: string[];
};

type EmpreendimentoRow = {
  id: string;
  nome: string;
  tipo: Empreendimento["tipo"];
  bairro: string;
  zona: Zona;
  imagem: string;
  galeria: string[];
  entrega_em: string | null;
  latitude: number;
  longitude: number;
  plantas: PlantaRow[];
};

function mapRow(row: EmpreendimentoRow): Empreendimento {
  return {
    id: row.id,
    nome: row.nome,
    tipo: row.tipo,
    bairro: row.bairro,
    zona: row.zona,
    imagem: row.imagem,
    galeria: row.galeria ?? [],
    entregaEm: row.entrega_em,
    latitude: row.latitude,
    longitude: row.longitude,
    plantas: row.plantas.map((planta) => ({
      id: planta.id,
      metragem: Number(planta.metragem),
      comSuite: planta.com_suite,
      dormitorios: planta.dormitorios,
      vagas: planta.vagas,
      preco: Number(planta.preco),
      ambientes: planta.ambientes ?? [],
      imagens: planta.imagens ?? [],
    })),
  };
}

export async function getEmpreendimentos(): Promise<Empreendimento[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empreendimentos")
    .select(SELECT_EMPREENDIMENTO);

  if (error) throw new Error(`Falha ao buscar empreendimentos: ${error.message}`);

  return (data as unknown as EmpreendimentoRow[]).map(mapRow);
}

export async function getEmpreendimentoById(
  id: string,
): Promise<Empreendimento | null> {
  if (!isUuid(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empreendimentos")
    .select(SELECT_EMPREENDIMENTO)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar empreendimento: ${error.message}`);
  if (!data) return null;

  return mapRow(data as unknown as EmpreendimentoRow);
}
