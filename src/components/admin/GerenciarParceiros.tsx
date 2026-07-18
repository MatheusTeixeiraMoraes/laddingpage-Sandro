"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Parceiro } from "@/lib/parceiros";
import { adicionarParceiro, editarParceiro, excluirParceiro, definirDestaque } from "@/lib/admin/parceiros";

const campo =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-pink focus:outline-none";

export function GerenciarParceiros({ parceiros }: { parceiros: Parceiro[] }) {
  const router = useRouter();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
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
      await adicionarParceiro(arquivo, texto);
      setArquivo(null);
      setPreview(null);
      setTexto("");
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível adicionar o parceiro.");
    } finally {
      setOcupado(false);
    }
  };

  const excluir = async (parceiro: Parceiro) => {
    if (!confirm("Excluir este parceiro? Ele sai do site na hora e não dá pra desfazer.")) return;
    setErro(null);
    setOcupado(true);
    try {
      await excluirParceiro(parceiro.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível excluir o parceiro.");
    } finally {
      setOcupado(false);
    }
  };

  const marcarDestaque = async (parceiro: Parceiro) => {
    if (parceiro.destaque || ocupado) return;
    setErro(null);
    setOcupado(true);
    try {
      await definirDestaque(parceiro.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível marcar o destaque.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-bold text-brand-navy">Parceiros</h2>
      <p className="mt-1 text-sm text-slate-500">
        {parceiros.length === 0
          ? "Nenhum parceiro ainda."
          : `${parceiros.length} parceiro(s). A estrela marca o destaque (o parceiro em evidência na página).`}
      </p>

      <form onSubmit={adicionar} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div>
          <span className="text-sm font-medium text-slate-600">Imagem</span>
          <label className="mt-1 flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 hover:border-brand-pink">
            {preview ? (
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
          <span className="text-sm font-medium text-slate-600">Texto sobre o parceiro</span>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={4}
            placeholder="Quem é o parceiro e qual o benefício exclusivo pra quem compra com o Sandro."
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-pink focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={ocupado || !arquivo}
          className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50 sm:mt-6"
        >
          {ocupado ? "Enviando..." : "Adicionar"}
        </button>
      </form>

      <p className="mt-2 text-xs text-slate-400">JPG, PNG ou WEBP, até 5 MB.</p>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      {parceiros.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {parceiros.map((parceiro) =>
            editandoId === parceiro.id ? (
              <li key={parceiro.id} className="sm:col-span-2">
                <EditarParceiroCard
                  parceiro={parceiro}
                  onCancel={() => setEditandoId(null)}
                  onSaved={() => {
                    setEditandoId(null);
                    router.refresh();
                  }}
                />
              </li>
            ) : (
              <li key={parceiro.id} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image src={parceiro.imagem} alt="" fill sizes="96px" className="object-cover" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  {parceiro.destaque && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-blush px-2 py-0.5 text-xs font-semibold text-brand-pink">
                      ★ Destaque
                    </span>
                  )}
                  <p className="mt-1 line-clamp-3 text-xs text-slate-500">
                    {parceiro.texto || "(sem texto)"}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditandoId(parceiro.id)}
                      disabled={ocupado}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink disabled:opacity-50"
                    >
                      Editar
                    </button>
                    {!parceiro.destaque && (
                      <button
                        type="button"
                        onClick={() => marcarDestaque(parceiro)}
                        disabled={ocupado}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink disabled:opacity-50"
                      >
                        Tornar destaque
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => excluir(parceiro)}
                      disabled={ocupado}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </section>
  );
}

function EditarParceiroCard({
  parceiro,
  onCancel,
  onSaved,
}: {
  parceiro: Parceiro;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [texto, setTexto] = useState(parceiro.texto);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const escolher = (event: ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] ?? null;
    setArquivo(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const salvar = async (event: FormEvent) => {
    event.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await editarParceiro(parceiro.id, { texto, arquivo });
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar o parceiro.");
      setSalvando(false);
    }
  };

  return (
    <form
      onSubmit={salvar}
      className="flex gap-3 rounded-xl border border-brand-pink/40 bg-brand-blush/20 p-3"
    >
      <div>
        <span className="text-sm font-medium text-slate-600">Imagem</span>
        <label
          title="Clique para trocar a imagem"
          className="mt-1 flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 hover:border-brand-pink"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview ?? parceiro.imagem} alt="" className="h-full w-full object-cover" />
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={escolher} className="hidden" />
        </label>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <label>
          <span className="text-sm font-medium text-slate-600">Texto sobre o parceiro</span>
          <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={4} className={campo} />
        </label>

        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            disabled={salvando}
            className="rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={salvando}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>

        {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}
      </div>
    </form>
  );
}
