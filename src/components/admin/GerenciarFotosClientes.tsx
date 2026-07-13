"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FotoCliente } from "@/lib/fotosClientes";
import { adicionarFotoCliente, excluirFotoCliente } from "@/lib/admin/fotosClientes";

export function GerenciarFotosClientes({ fotos }: { fotos: FotoCliente[] }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(0);
  const [erro, setErro] = useState<string | null>(null);

  const handleArquivos = async (event: ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(event.target.files ?? []);
    if (arquivos.length === 0) return;

    setErro(null);
    setEnviando(arquivos.length);
    try {
      // Uma de cada vez: o erro aponta o arquivo que falhou.
      for (const arquivo of arquivos) {
        await adicionarFotoCliente(arquivo, "");
        setEnviando((n) => n - 1);
      }
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar a foto.");
    } finally {
      setEnviando(0);
      event.target.value = "";
    }
  };

  const excluir = async (foto: FotoCliente) => {
    if (!confirm("Excluir esta foto? Ela sai do site na hora e não dá pra desfazer.")) {
      return;
    }
    setErro(null);
    try {
      await excluirFotoCliente(foto.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível excluir a foto.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-brand-navy">
            Fotos de clientes
          </h2>
          <p className="text-sm text-slate-500">
            {fotos.length === 0
              ? "Nenhuma foto ainda."
              : `${fotos.length} foto(s) — aparecem no carrossel da home e na galeria.`}
          </p>
        </div>

        <label className="cursor-pointer rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600">
          {enviando > 0 ? `Enviando... (${enviando})` : "Adicionar fotos"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={enviando > 0}
            onChange={handleArquivos}
            className="hidden"
          />
        </label>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        JPG, PNG ou WEBP, até 5 MB cada. Dá para escolher várias de uma vez.
      </p>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      {fotos.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {fotos.map((foto) => (
            <div key={foto.id} className="group relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image
                src={foto.url}
                alt={foto.legenda}
                fill
                sizes="220px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => excluir(foto)}
                aria-label="Excluir foto"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-0 shadow-sm transition-opacity hover:bg-red-600 hover:text-white focus:opacity-100 group-hover:opacity-100"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
