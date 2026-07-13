import { createClient } from "@/lib/supabase/client";
import type { LeadInput } from "@/types/lead";

/**
 * Envio do formulário público da home — roda no navegador do lead, com a chave
 * publicável. O RLS permite INSERT para anônimo, mas nunca SELECT: sem isso,
 * qualquer visitante baixaria a lista de contatos do Sandro.
 */
export async function enviarLead(dados: LeadInput): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").insert({
    nome: dados.nome.trim(),
    telefone: dados.telefone.trim(),
    interesse: dados.interesse,
    consentimento: dados.consentimento,
  });

  if (error) throw new Error("Não foi possível enviar. Tente novamente.");
}
