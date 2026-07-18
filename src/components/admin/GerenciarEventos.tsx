"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Evento } from "@/lib/eventos";
import { adicionarEvento, editarEvento, excluirEvento } from "@/lib/admin/eventos";

const campo =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy focus:border-brand-pink focus:outline-none";

export function GerenciarEventos({ eventos }: { eventos: Evento[] }) {
  const router = useRouter();
  const [capa, setCapa] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [galeria, setGaleria] = useState<File[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const escolherCapa = (event: ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] ?? null;
    setCapa(f);
    setCapaPreview(f ? URL.createObjectURL(f) : null);
  };

  const escolherGaleria = (event: ChangeEvent<HTMLInputElement>) => {
    setGaleria(Array.from(event.target.files ?? []));
  };

  const adicionar = async (event: FormEvent) => {
    event.preventDefault();
    if (!capa) return;

    setErro(null);
    setOcupado(true);
    try {
      await adicionarEvento(capa, nome, descricao, galeria);
      setCapa(null);
      setCapaPreview(null);
      setNome("");
      setDescricao("");
      setGaleria([]);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível adicionar o evento.");
    } finally {
      setOcupado(false);
    }
  };

  const excluir = async (evento: Evento) => {
    if (!confirm("Excluir este evento? Ele sai do site na hora e não dá pra desfazer.")) return;
    setErro(null);
    setOcupado(true);
    try {
      await excluirEvento(evento.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível excluir o evento.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-bold text-brand-navy">Eventos</h2>
      <p className="mt-1 text-sm text-slate-500">
        {eventos.length === 0
          ? "Nenhum evento ainda."
          : `${eventos.length} evento(s) — aparecem na página “Eventos”.`}
      </p>

      <form onSubmit={adicionar} className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div>
            <span className="text-sm font-medium text-slate-600">Capa</span>
            <label className="mt-1 flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 hover:border-brand-pink">
              {capaPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={capaPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                "Escolher capa"
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={escolherCapa}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Nome do evento</span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Lançamento Alpha Celeste — MLB Construtora"
                className={campo}
              />
            </label>
            <label className="mt-3 block">
              <span className="text-sm font-medium text-slate-600">Descrição</span>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                placeholder="O que foi o evento e o que você viveu lá."
                className={campo}
              />
            </label>
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-slate-600">Fotos do evento (galeria)</span>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-brand-pink hover:text-brand-pink">
              Escolher fotos
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={escolherGaleria}
                className="hidden"
              />
            </label>
            {galeria.length > 0 && (
              <span className="text-sm text-slate-500">{galeria.length} foto(s) selecionada(s)</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={ocupado || !capa}
            className="rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
          >
            {ocupado ? "Enviando..." : "Adicionar evento"}
          </button>
          <span className="text-xs text-slate-400">JPG, PNG ou WEBP, até 5 MB cada.</span>
        </div>
      </form>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      {eventos.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {eventos.map((evento) =>
            editandoId === evento.id ? (
              <li key={evento.id} className="sm:col-span-2">
                <EditarEventoCard
                  evento={evento}
                  onCancel={() => setEditandoId(null)}
                  onSaved={() => {
                    setEditandoId(null);
                    router.refresh();
                  }}
                />
              </li>
            ) : (
              <li key={evento.id} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image src={evento.capa} alt="" fill sizes="112px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-sm font-medium text-brand-navy">
                    {evento.nome || "(sem nome)"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {evento.galeria.length} foto(s) na galeria
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditandoId(evento.id)}
                      disabled={ocupado}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink disabled:opacity-50"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => excluir(evento)}
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

function EditarEventoCard({
  evento,
  onCancel,
  onSaved,
}: {
  evento: Evento;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [nome, setNome] = useState(evento.nome);
  const [descricao, setDescricao] = useState(evento.descricao);
  const [capa, setCapa] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);
  const [galeria, setGaleria] = useState<string[]>(evento.galeria);
  const [novasFotos, setNovasFotos] = useState<File[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const escolherCapa = (event: ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] ?? null;
    setCapa(f);
    setCapaPreview(f ? URL.createObjectURL(f) : null);
  };

  const salvar = async (event: FormEvent) => {
    event.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await editarEvento(evento.id, { nome, descricao, capa, galeria, novasFotos });
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar o evento.");
      setSalvando(false);
    }
  };

  return (
    <form
      onSubmit={salvar}
      className="flex flex-col gap-4 rounded-xl border border-brand-pink/40 bg-brand-blush/20 p-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div>
          <span className="text-sm font-medium text-slate-600">Capa</span>
          <label
            title="Clique para trocar a capa"
            className="mt-1 flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 hover:border-brand-pink"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capaPreview ?? evento.capa} alt="" className="h-full w-full object-cover" />
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={escolherCapa} className="hidden" />
          </label>
        </div>

        <div className="flex-1">
          <label className="block">
            <span className="text-sm font-medium text-slate-600">Nome do evento</span>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className={campo} />
          </label>
          <label className="mt-3 block">
            <span className="text-sm font-medium text-slate-600">Descrição</span>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className={campo} />
          </label>
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-slate-600">Fotos da galeria</span>
        {galeria.length > 0 ? (
          <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {galeria.map((url) => (
              <li key={url} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setGaleria(galeria.filter((u) => u !== url))}
                  aria-label="Remover foto"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-navy/80 text-xs text-white transition-colors hover:bg-red-600"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-slate-400">Nenhuma foto na galeria.</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-brand-pink hover:text-brand-pink">
            Adicionar fotos
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => setNovasFotos(Array.from(e.target.files ?? []))}
              className="hidden"
            />
          </label>
          {novasFotos.length > 0 && (
            <span className="text-sm text-slate-500">{novasFotos.length} foto(s) nova(s) selecionada(s)</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={salvando}
          className="rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar evento"}
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

      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </form>
  );
}
