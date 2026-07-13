import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/types/lead";

/**
 * Leitura dos leads — SÓ SERVIDOR, e o RLS só devolve linhas para admin.
 * O envio do formulário público vive em src/lib/enviarLead.ts: misturar os
 * dois num arquivo só arrasta `next/headers` para o navegador do lead.
 */
export async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, nome, telefone, interesse, atendido, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Falha ao buscar leads: ${error.message}`);

  return (data ?? []).map((l) => ({
    id: l.id,
    nome: l.nome,
    telefone: l.telefone,
    interesse: l.interesse ?? "",
    atendido: l.atendido,
    criadoEm: l.created_at,
  }));
}
