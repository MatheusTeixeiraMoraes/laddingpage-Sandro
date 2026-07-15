"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { salvarConteudos } from "@/lib/admin/conteudo";

export type CampoTexto = {
  chave: string;
  label: string;
  ajuda?: string;
  tipo: "texto" | "area" | "lista";
  /** Valor atual já resolvido. Para 'lista', os itens juntados por quebra de linha. */
  valor: string;
};

const campoClasse =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-brand-pink";

/**
 * Editor de um bloco de textos do site. Cada campo é um texto, uma área ou uma
 * lista (um item por linha). Salva só o que mudou, tudo de uma vez.
 */
export function EditorTextos({
  titulo,
  campos,
}: {
  titulo: string;
  campos: CampoTexto[];
}) {
  const router = useRouter();
  const inicial = () =>
    Object.fromEntries(campos.map((c) => [c.chave, c.valor])) as Record<string, string>;

  const [valores, setValores] = useState<Record<string, string>>(inicial);
  const [base, setBase] = useState<Record<string, string>>(inicial);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const alterado = campos.some((c) => valores[c.chave] !== base[c.chave]);

  const mudar = (chave: string, valor: string) => {
    setErro(null);
    setValores((atual) => ({ ...atual, [chave]: valor }));
  };

  const handleSalvar = async () => {
    setErro(null);
    setSalvando(true);
    try {
      const entradas = campos
        .filter((c) => valores[c.chave] !== base[c.chave])
        .map((c) => ({
          chave: c.chave,
          valor:
            c.tipo === "lista"
              ? valores[c.chave]
                  .split("\n")
                  .map((linha) => linha.trim())
                  .filter(Boolean)
              : valores[c.chave],
        }));
      await salvarConteudos(entradas);
      setBase({ ...valores });
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-bold text-brand-navy">{titulo}</h2>
        <div className="flex items-center gap-3">
          {!alterado && !salvando && (
            <span className="text-sm text-slate-400">Tudo salvo</span>
          )}
          <button
            type="button"
            onClick={handleSalvar}
            disabled={!alterado || salvando}
            className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

      <div className="mt-5 flex flex-col gap-5">
        {campos.map((campo) => (
          <label key={campo.chave} className="block">
            <span className="text-sm font-medium text-brand-navy">{campo.label}</span>
            {campo.ajuda && (
              <span className="mt-0.5 block text-xs text-slate-400">{campo.ajuda}</span>
            )}
            {campo.tipo === "texto" ? (
              <input
                type="text"
                value={valores[campo.chave]}
                onChange={(e) => mudar(campo.chave, e.target.value)}
                className={`mt-1.5 ${campoClasse}`}
              />
            ) : (
              <textarea
                rows={campo.tipo === "lista" ? 4 : 3}
                value={valores[campo.chave]}
                onChange={(e) => mudar(campo.chave, e.target.value)}
                className={`mt-1.5 resize-y ${campoClasse}`}
              />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}
