"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import { registrarClique } from "@/lib/registrarClique";

/**
 * Botão de WhatsApp do card na grade de imóveis. É client só por causa do
 * onClick que conta o clique (anônimo) antes de abrir a conversa — o card em si
 * segue sendo server component.
 */
export function BotaoWhatsappCard({ id, nome }: { id: string; nome: string }) {
  const href = buildWhatsAppLink(
    `Olá, vi o imóvel ${nome} no site e gostaria de saber mais informações.`,
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => void registrarClique(id)}
      className="block rounded-full bg-brand-pink px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-pink-600"
    >
      Falar no WhatsApp
    </a>
  );
}
