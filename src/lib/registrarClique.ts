import { createClient } from "@/lib/supabase/client";

/**
 * Conta, de forma ANÔNIMA, que um imóvel levou alguém ao WhatsApp — só o id do
 * imóvel, nada de nome ou telefone. É fire-and-forget de propósito: se a
 * gravação falhar, o clique do usuário para o WhatsApp NÃO pode ser bloqueado
 * por causa de um contador secundário.
 */
export async function registrarClique(empreendimentoId: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase
      .from("cliques_whatsapp")
      .insert({ empreendimento_id: empreendimentoId });
  } catch {
    // Rastreio é secundário: engole o erro para nunca atrapalhar o usuário.
  }
}
