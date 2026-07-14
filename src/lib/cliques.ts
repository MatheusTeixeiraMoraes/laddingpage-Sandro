import { createClient } from "@/lib/supabase/server";
import { contarCliques } from "@/lib/ranking";

/**
 * Contagem de cliques de WhatsApp por imóvel. SÓ SERVIDOR e SÓ ADMIN: o RLS da
 * tabela não devolve linha nenhuma para o público.
 *
 * ponytail: lê todas as linhas e conta em JS. No volume de uma landing page de
 * um consultor isso é irrelevante; se um dia crescer muito, trocar por uma view
 * ou rpc que já devolva a contagem agregada.
 */
export async function getCliquesPorEmpreendimento(): Promise<Map<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cliques_whatsapp")
    .select("empreendimento_id");

  if (error) throw new Error(`Falha ao buscar cliques: ${error.message}`);

  return contarCliques(data ?? []);
}
