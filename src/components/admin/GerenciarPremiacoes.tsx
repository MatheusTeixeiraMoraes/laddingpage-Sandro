"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Premiacao } from "@/lib/premiacoes";
import { adicionarPremiacao, excluirPremiacao } from "@/lib/admin/premiacoes";

const campo =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-pink focus:outline-none";

export function GerenciarPremiacoes({ premiacoes }: { premiacoes: Premiacao[] }) {
  const router = useRouter();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [ano, setAno] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const escolher = (event: ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] ?? null;
    setArquivo(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const adicionar = async (event: FormEvent) => {
    event.preventDefault();
    if (!arquivo) return;

    setErro(null);
    setOcupado(true);
    try {
      const anoNum = ano.trim() === "" ? null : Number.parseInt(ano, 10);
      await adicionarPremiacao(arquivo, titulo, Number.isNaN(anoNum) ? null : anoNum);
      setArquivo(null);
      setPreview(null);
      setTitulo("");
      setAno("");
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível adicionar a premiação.");
    } finally {
      setOcupado(false);
    }
  };

  const excluir = async (premiacao: Premiacao) => {
    if (!confirm("Excluir esta premiação? Ela sai do site na hora e não dá pra desfazer.")) return;
    setErro(null);
    setOcupado(true);
    try {
      await excluirPremiacao(premiacao.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível excluir a premiação.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-bold text-brand-navy">Premiações</h2>
      <p className="mt-1 text-sm text-slate-500">
        {premiacoes.length === 0
          ? "Nenhuma premiação ainda."
          : `${premiacoes.length} premiação(ões) — aparecem na página “Premiações”.`}
      </p>

      <form onSubmit={adicionar} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="text-sm font-medium text-slate-600">Imagem</span>
          <label className="mt-1 flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 hover:border-brand-pink">
            {preview ? (
              // Preview local do arquivo escolhido (antes de enviar).
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              "Escolher"
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={escolher}
              className="hidden"
            />
          </label>
        </div>

        <label className="flex-1">
          <span className="text-sm font-medium text-slate-600">Título</span>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Melhor Corretor de Imóveis"
            className={campo}
          />
        </label>

        <label className="sm:w-24">
          <span className="text-sm font-medium text-slate-600">Ano</span>
          <input
            type="number"
            inputMode="numeric"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            placeholder="2025"
            className={campo}
          />
        </label>

        <button
          type="submit"
          disabled={ocupado || !arquivo}
          className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
        >
          {ocupado ? "Enviando..." : "Adicionar"}
        </button>
      </form>

      <p className="mt-2 text-xs text-slate-400">JPG, PNG ou WEBP, até 5 MB.</p>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      {premiacoes.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {premiacoes.map((premiacao) => (
            <li key={premiacao.id} className="group relative overflow-hidden rounded-xl border border-slate-100">
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image
                  src={premiacao.imagem}
                  alt={premiacao.titulo || "Premiação"}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => excluir(premiacao)}
                  disabled={ocupado}
                  aria-label="Excluir premiação"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-0 shadow-sm transition-opacity hover:bg-red-600 hover:text-white focus:opacity-100 group-hover:opacity-100"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-brand-navy">
                  {premiacao.titulo || "(sem título)"}
                </p>
                {premiacao.ano != null && (
                  <p className="text-xs text-slate-400">{premiacao.ano}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
