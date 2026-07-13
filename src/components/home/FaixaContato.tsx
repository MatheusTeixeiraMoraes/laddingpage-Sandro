"use client";

import { useState, type FormEvent } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function FaixaContato() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const partes = [`Olá, Sandro! Meu nome é ${nome.trim()}`];
    if (telefone.trim()) partes.push(`meu telefone é ${telefone.trim()}`);
    partes.push("gostaria de atendimento para encontrar meu imóvel.");
    const link = buildWhatsAppLink(partes.join(", ").replace(", gostaria", ". Gostaria"));
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contato" className="scroll-mt-20 bg-white pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-pink to-fuchsia-600 px-6 py-10 shadow-lg sm:px-12 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="text-white">
              <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">
                Vamos conversar?
              </h2>
              <p className="mt-2 max-w-md text-white/90">
                Preencha o formulário e eu te ajudo a encontrar o imóvel ideal
                para você ou sua família — direto no WhatsApp.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur sm:flex-row"
            >
              <input
                type="text"
                required
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border-none bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <input
                type="tel"
                placeholder="Seu telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border-none bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90"
              >
                Quero atendimento
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
