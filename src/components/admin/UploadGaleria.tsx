"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImagens } from "@/lib/admin/empreendimentos";

/**
 * Campo de várias imagens: sobe os arquivos escolhidos para o Storage e
 * mantém a lista de URLs no estado do formulário pai.
 * Remover tira só a referência — o arquivo no Storage não é apagado.
 */
export function UploadGaleria({
  label,
  ajuda,
  imagens,
  onChange,
}: {
  label: string;
  ajuda?: string;
  imagens: string[];
  onChange: (imagens: string[]) => void;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleArquivos = async (lista: FileList | null) => {
    if (!lista || lista.length === 0) return;
    setErro(null);
    setEnviando(true);
    try {
      const urls = await uploadImagens(Array.from(lista));
      onChange([...imagens, ...urls]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar as imagens.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={enviando}
        onChange={(e) => {
          void handleArquivos(e.target.files);
          e.target.value = "";
        }}
        className="mt-1 w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-blush file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-pink disabled:opacity-50"
      />
      <span className="mt-1 block text-xs text-slate-400">
        {enviando ? "Enviando imagens..." : (ajuda ?? "Pode escolher várias de uma vez. JPG, PNG ou WEBP, até 5 MB cada.")}
      </span>

      {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}

      {imagens.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {imagens.map((img, i) => (
            <li key={img} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-100">
              <Image src={img} alt={`Imagem ${i + 1}`} fill sizes="120px" className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => onChange(imagens.filter((_, j) => j !== i))}
                aria-label={`Remover imagem ${i + 1}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-navy/80 text-xs text-white transition-colors hover:bg-red-600"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
