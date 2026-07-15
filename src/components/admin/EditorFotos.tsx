"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadImagem } from "@/lib/admin/empreendimentos";
import { salvarConteudo } from "@/lib/admin/conteudo";

export type FotoEditavel = {
  chave: string;
  label: string;
  descricao: string;
  /** URL já resolvida: a foto editada ou o padrão. */
  url: string;
};

export function EditorFotos({ fotos }: { fotos: FotoEditavel[] }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const trocar = (chave: string) => async (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    setErro(null);
    setEnviando(chave);
    try {
      const url = await uploadImagem(arquivo);
      await salvarConteudo(chave, url);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível trocar a foto.");
    } finally {
      setEnviando(null);
      event.target.value = "";
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fotos.map((foto) => (
        <div
          key={foto.chave}
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <p className="font-heading font-bold text-brand-navy">{foto.label}</p>
          <p className="text-sm text-slate-500">{foto.descricao}</p>

          <div className="relative mt-3 aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-xl bg-brand-blush/40">
            <Image
              src={foto.url}
              alt={foto.label}
              fill
              sizes="200px"
              className="object-contain"
            />
          </div>

          <label className="mt-3 inline-block cursor-pointer rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600">
            {enviando === foto.chave ? "Enviando..." : "Trocar foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={enviando !== null}
              onChange={trocar(foto.chave)}
              className="hidden"
            />
          </label>
        </div>
      ))}

      {erro && <p className="text-sm text-red-600 sm:col-span-2">{erro}</p>}
    </div>
  );
}
