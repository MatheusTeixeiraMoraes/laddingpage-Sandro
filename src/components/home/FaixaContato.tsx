"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { enviarLead } from "@/lib/enviarLead";

const INTERESSES = [
  "Apartamento na planta",
  "Pronto para morar",
  "Investimento",
  "Ainda não sei",
];

const PROVAS = [
  "CRECI 278922",
  "+100 famílias atendidas",
  "Especialista em Minha Casa Minha Vida",
];

const campo =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-pink";

export function FaixaContato() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [interesse, setInteresse] = useState(INTERESSES[0]);
  const [consentimento, setConsentimento] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);

    const digitos = telefone.replace(/\D/g, "");
    if (digitos.length < 10) {
      setErro("Digite o WhatsApp com DDD.");
      return;
    }

    setEnviando(true);
    try {
      // Grava ANTES de abrir o WhatsApp: se o lead desistir na conversa, o
      // contato dele nao se perde.
      await enviarLead({ nome, telefone, interesse, consentimento });

      const link = buildWhatsAppLink(
        `Olá, Sandro! Meu nome é ${nome.trim()}. Procuro: ${interesse}. Gostaria de atendimento.`,
      );
      window.open(link, "_blank", "noopener,noreferrer");

      setNome("");
      setTelefone("");
      setInteresse(INTERESSES[0]);
      setConsentimento(false);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="contato" className="scroll-mt-20 bg-white pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy shadow-xl">
          {/* brilho rosa atras do Sandro */}
          <div
            className="absolute -left-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-brand-pink/25 blur-3xl"
            aria-hidden
          />

          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[280px_1fr_360px] lg:gap-10 lg:px-12">
            {/* Terceira foto diferente: hero, "sobre mim" e aqui nao podem ser
                a mesma imagem repetida. */}
            <div className="relative hidden aspect-[3/4] overflow-hidden rounded-2xl shadow-lg lg:block">
              <Image
                src="/sandro-contato.jpg"
                alt="Sandro Higuti, consultor imobiliário"
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>

            <div className="text-white">
              <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
                Fale comigo
              </p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
                Vamos achar o <span className="text-brand-pink">seu imóvel</span>?
              </h2>
              <p className="mt-3 max-w-md text-slate-300">
                Conte o que você procura e em que momento está. O atendimento é
                pessoal: esclareço as condições de financiamento e conduzo cada
                etapa no seu tempo, sem pressa e sem compromisso.
              </p>
              <p className="mt-4 font-script text-2xl text-brand-pink">
                Clientes que se tornam amigos.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white p-5 shadow-lg sm:p-6"
            >
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={campo}
                />
                <input
                  type="tel"
                  required
                  placeholder="Seu WhatsApp com DDD"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className={campo}
                />
                <label className="sr-only" htmlFor="interesse">
                  O que você procura
                </label>
                <select
                  id="interesse"
                  value={interesse}
                  onChange={(e) => setInteresse(e.target.value)}
                  className={campo}
                >
                  {INTERESSES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>

                <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    required
                    checked={consentimento}
                    onChange={(e) => setConsentimento(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand-pink"
                  />
                  Autorizo o Sandro a guardar meu contato e falar comigo sobre imóveis.
                </label>

                {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}

                <button
                  type="submit"
                  disabled={enviando}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-pink px-5 py-3.5 font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-60"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                  </svg>
                  {enviando ? "Enviando..." : "Falar no WhatsApp"}
                </button>
              </div>
            </form>
          </div>

          <div className="relative border-t border-white/10 px-6 py-4 sm:px-10 lg:px-12">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
              {PROVAS.map((prova) => (
                <li key={prova} className="inline-flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3.5 w-3.5 text-brand-pink">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                  {prova}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
