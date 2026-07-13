import { createClient } from "@/lib/supabase/server";
import type { Empreendimento } from "@/types/empreendimento";

const SELECT_EMPREENDIMENTO =
  "id, nome, tipo, bairro, latitude, longitude, plantas(id, metragem, com_suite, dormitorios, vagas, preco, fotos)";

type PlantaRow = {
  id: string;
  metragem: number | string;
  com_suite: boolean;
  dormitorios: number;
  vagas: number;
  preco: number | string;
  fotos: string[];
};

type EmpreendimentoRow = {
  id: string;
  nome: string;
  tipo: Empreendimento["tipo"];
  bairro: string;
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
    latitude: row.latitude,
    longitude: row.longitude,
    plantas: row.plantas.map((planta) => ({
      id: planta.id,
      metragem: Number(planta.metragem),
      comSuite: planta.com_suite,
      dormitorios: planta.dormitorios,
      vagas: planta.vagas,
      preco: Number(planta.preco),
      fotos: planta.fotos,
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
