import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";
import type { Empreendimento, Zona } from "@/types/empreendimento";

const SELECT_EMPREENDIMENTO =
  "id, nome, tipo, zona, imagem, galeria, entrega_em, preco_a_partir_de, dormitorios, suite, varanda, quintal, garagem_coberta, vaga_dupla, pontos_ar, descricao, construtora, torres, andares, aptos_por_andar, elevadores, entrega_com_piso, documentacao, endereco, latitude, longitude, bairros(id, nome, sobre), plantas(id, metragem, preco, imagens)";

type PlantaRow = {
  id: string;
  metragem: number | string;
  preco: number | string | null;
  imagens: string[];
};

type EmpreendimentoRow = {
  id: string;
  nome: string;
  tipo: Empreendimento["tipo"];
  /** Vem do join com bairros. */
  bairros: { id: string; nome: string; sobre: string };
  zona: Zona;
  imagem: string;
  galeria: string[];
  entrega_em: string | null;
  preco_a_partir_de: number | string;
  dormitorios: number[];
  suite: boolean;
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
  entrega_com_piso: Empreendimento["entregaComPiso"];
  documentacao: Empreendimento["documentacao"];
  endereco: string;
  latitude: number;
  longitude: number;
  plantas: PlantaRow[];
};

function mapRow(row: EmpreendimentoRow): Empreendimento {
  return {
    id: row.id,
    nome: row.nome,
    tipo: row.tipo,
    bairro: {
      id: row.bairros.id,
      nome: row.bairros.nome,
      sobre: row.bairros.sobre ?? "",
    },
    zona: row.zona,
    imagem: row.imagem,
    galeria: row.galeria ?? [],
    entregaEm: row.entrega_em,
    precoAPartirDe: Number(row.preco_a_partir_de),
    dormitorios: row.dormitorios ?? [],
    suite: row.suite,
    varanda: row.varanda,
    quintal: row.quintal,
    garagemCoberta: row.garagem_coberta,
    vagaDupla: row.vaga_dupla,
    pontosAr: row.pontos_ar,
    descricao: row.descricao ?? "",
    construtora: row.construtora ?? "",
    torres: row.torres,
    andares: row.andares ?? "",
    aptosPorAndar: row.aptos_por_andar,
    elevadores: row.elevadores,
    entregaComPiso: row.entrega_com_piso ?? "",
    documentacao: row.documentacao ?? "",
    endereco: row.endereco ?? "",
    latitude: row.latitude,
    longitude: row.longitude,
    plantas: row.plantas
      .map((planta) => ({
        id: planta.id,
        metragem: Number(planta.metragem),
        preco: planta.preco === null ? null : Number(planta.preco),
        imagens: planta.imagens ?? [],
      }))
      .sort((a, b) => a.metragem - b.metragem),
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
