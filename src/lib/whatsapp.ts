const WHATSAPP_NUMBER = "5515992500314";

/**
 * Sem `numero`, abre a conversa com o Sandro (o caso do site).
 * Com `numero`, abre a conversa com aquela pessoa — é assim que o Sandro
 * chama um lead a partir do painel.
 */
export function buildWhatsAppLink(message: string, numero?: string): string {
  const destino = numero ?? WHATSAPP_NUMBER;
  return `https://wa.me/${destino}?text=${encodeURIComponent(message)}`;
}
