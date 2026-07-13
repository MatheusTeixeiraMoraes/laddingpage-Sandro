"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Empreendimento, TipoEmpreendimento, Zona } from "@/types/empreendimento";
import { parseCoordenadas } from "@/lib/coordenadas";
import {
  criarEmpreendimento,
  atualizarEmpreendimento,
  uploadImagem,
  type EmpreendimentoInput,
} from "@/lib/admin/empreendimentos";
import { UploadGaleria } from "@/components/admin/UploadGaleria";

const TIPOS: { value: TipoEmpreendimento; label: string }[] = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "comercial", label: "Comercial" },
];

const ZONAS: { value: Zona; label: string }[] = [
  { value: "norte", label: "Zona Norte" },
  { value: "sul", label: "Zona Sul" },
  { value: "leste", label: "Zona Leste" },
  { value: "oeste", label: "Zona Oeste" },
  { value: "central", label: "Central" },
];

const campo =
  "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-pink";
const rotulo = "block text-xs font-semibold uppercase tracking-wide text-slate-500";

export function EmpreendimentoForm({
  empreendimento,
}: {
  empreendimento?: Empreendimento;
}) {
  const router = useRouter();
  const editando = Boolean(empreendimento);

  const [nome, setNome] = useState(empreendimento?.nome ?? "");
  const [tipo, setTipo] = useState<TipoEmpreendimento>(empreendimento?.tipo ?? "apartamento");
  const [zona, setZona] = useState<Zona>(empreendimento?.zona ?? "norte");
  const [bairro, setBairro] = useState(empreendimento?.bairro ?? "");
  // Entrega vira data no banco. Antes era texto livre: dava pra digitar
  // "final de 2026" e o imóvel sumia de qualquer filtro por prazo.
  const [pronto, setPronto] = useState(empreendimento?.entregaEm === null);
  const [mesEntrega, setMesEntrega] = useState(
    empreendimento?.entregaEm?.slice(0, 7) ?? "",
  );

  // Caracteristicas do PREDIO (a planta guarda so o tamanho).
  const [preco, setPreco] = useState(empreendimento?.precoAPartirDe ?? 0);
  const [dorms, setDorms] = useState<number[]>(empreendimento?.dormitorios ?? [2]);
  const [suite, setSuite] = useState(empreendimento?.suite ?? false);
  const [varanda, setVaranda] = useState(empreendimento?.varanda ?? false);
  const [quintal, setQuintal] = useState(empreendimento?.quintal ?? false);
  const [garagem, setGaragem] = useState(empreendimento?.garagemCoberta ?? false);
  const [elevador, setElevador] = useState(empreendimento?.elevador ?? false);
  const [pontosAr, setPontosAr] = useState<number | null>(empreendimento?.pontosAr ?? null);

  const alternarDorm = (n: number) => {
    setDorms((atuais) =>
      atuais.includes(n) ? atuais.filter((d) => d !== n) : [...atuais, n].sort((a, b) => a - b),
    );
  };
  const [local, setLocal] = useState(
    empreendimento ? `${empreendimento.latitude}, ${empreendimento.longitude}` : "",
  );
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(empreendimento?.imagem ?? null);
  const [galeria, setGaleria] = useState<string[]>(empreendimento?.galeria ?? []);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const coordenadas = parseCoordenadas(local);

  const handleArquivo = (file: File | null) => {
    setArquivo(file);
    setPreview(file ? URL.createObjectURL(file) : (empreendimento?.imagem ?? null));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    setOk(false);

    if (!coordenadas) {
      setErro("Cole um link do Google Maps válido (ou a coordenada) na localização.");
      return;
    }
    if (!arquivo && !empreendimento?.imagem) {
      setErro("Escolha uma foto de capa para o empreendimento.");
      return;
    }
    if (!pronto && !mesEntrega) {
      setErro("Informe o mês da entrega ou marque “Pronto para morar”.");
      return;
    }
    if (dorms.length === 0) {
      setErro("Escolha ao menos uma opção de dormitórios.");
      return;
    }
    if (preco <= 0) {
      setErro("Informe o preço “a partir de”.");
      return;
    }

    setSalvando(true);
    try {
      const imagem = arquivo
        ? await uploadImagem(arquivo)
        : (empreendimento?.imagem ?? "");

      const dados: EmpreendimentoInput = {
        nome: nome.trim(),
        tipo,
        zona,
        bairro: bairro.trim(),
        entrega_em: pronto ? null : `${mesEntrega}-01`,
        preco_a_partir_de: preco,
        dormitorios: dorms,
        suite,
        varanda,
        quintal,
        garagem_coberta: garagem,
        elevador,
        pontos_ar: pontosAr,
        imagem,
        galeria,
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
      };

      if (empreendimento) {
        await atualizarEmpreendimento(empreendimento.id, dados);
        setOk(true);
        router.refresh();
      } else {
        const id = await criarEmpreendimento(dados);
        router.push(`/admin/empreendimentos/${id}`);
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className={rotulo}>Nome</span>
          <input
            className={campo}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Ex: Vila Laredo"
          />
        </label>

        <label>
          <span className={rotulo}>Tipo</span>
          <select className={campo} value={tipo} onChange={(e) => setTipo(e.target.value as TipoEmpreendimento)}>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span className={rotulo}>Região</span>
          <select className={campo} value={zona} onChange={(e) => setZona(e.target.value as Zona)}>
            {ZONAS.map((z) => (
              <option key={z.value} value={z.value}>{z.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span className={rotulo}>Bairro</span>
          <input
            className={campo}
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            required
            placeholder="Ex: Zona Leste"
          />
        </label>

        <div>
          <span className={rotulo}>Entrega</span>
          <input
            type="month"
            className={`${campo} disabled:bg-slate-100 disabled:text-slate-400`}
            value={mesEntrega}
            onChange={(e) => setMesEntrega(e.target.value)}
            disabled={pronto}
            min="2020-01"
            aria-label="Mês e ano da entrega"
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={pronto}
              onChange={(e) => setPronto(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
            />
            Pronto para morar
          </label>
        </div>

        <label>
          <span className={rotulo}>Preço &ldquo;a partir de&rdquo; (R$)</span>
          <input
            type="number"
            min={1}
            required
            className={campo}
            value={preco || ""}
            onChange={(e) => setPreco(Number(e.target.value))}
            placeholder="Ex: 245000"
          />
          <span className="mt-1 block text-xs text-slate-400">
            É o valor que aparece no card e na página do imóvel.
          </span>
        </label>

        <div>
          <span className={rotulo}>Dormitórios</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((n) => (
              <label
                key={n}
                className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                  dorms.includes(n)
                    ? "border-brand-pink bg-brand-blush/50 text-brand-navy"
                    : "border-slate-200 text-slate-600 hover:border-brand-pink"
                }`}
              >
                <input
                  type="checkbox"
                  checked={dorms.includes(n)}
                  onChange={() => alternarDorm(n)}
                  className="sr-only"
                />
                {n}
              </label>
            ))}
          </div>
          <span className="mt-1 block text-xs text-slate-400">
            Marque todas as opções que o empreendimento oferece.
          </span>
        </div>

        <div className="sm:col-span-2">
          <span className={rotulo}>O que este empreendimento tem</span>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {([
              ["Suíte", suite, setSuite],
              ["Varanda", varanda, setVaranda],
              ["Quintal", quintal, setQuintal],
              ["Garagem coberta", garagem, setGaragem],
              ["Elevador", elevador, setElevador],
            ] as const).map(([label, valor, set]) => (
              <label
                key={label}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-brand-pink"
              >
                <input
                  type="checkbox"
                  checked={valor}
                  onChange={(e) => set(e.target.checked)}
                  className="h-4 w-4 accent-brand-pink"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <label>
          <span className={rotulo}>Pontos de ar-condicionado</span>
          <select
            className={campo}
            value={pontosAr ?? ""}
            onChange={(e) => setPontosAr(e.target.value === "" ? null : Number(e.target.value))}
          >
            <option value="">Não informado</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className={rotulo}>Localização</span>
          <input
            className={campo}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Cole aqui o link do Google Maps do empreendimento"
          />
          {local.trim() !== "" && (
            <span className={`mt-1 block text-xs ${coordenadas ? "text-emerald-600" : "text-amber-600"}`}>
              {coordenadas
                ? `Local reconhecido: ${coordenadas.latitude}, ${coordenadas.longitude}`
                : "Não reconheci a coordenada. Abra o local no Google Maps e cole o link da barra de endereço."}
            </span>
          )}
        </label>

        <label className="sm:col-span-2">
          <span className={rotulo}>Foto de capa</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleArquivo(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-blush file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-pink"
          />
          <span className="mt-1 block text-xs text-slate-400">JPG, PNG ou WEBP, até 5 MB.</span>
          {preview && (
            <span className="relative mt-3 block h-40 w-full max-w-sm overflow-hidden rounded-xl">
              <Image src={preview} alt="Prévia da foto de capa" fill sizes="384px" className="object-cover" unoptimized />
            </span>
          )}
        </label>

        <div className="sm:col-span-2">
          <UploadGaleria
            label="Galeria do empreendimento"
            ajuda="Fachada, piscina, lazer, decorado. Pode escolher várias de uma vez."
            imagens={galeria}
            onChange={setGaleria}
          />
        </div>
      </div>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}
      {ok && <p className="mt-4 text-sm text-emerald-600">Alterações salvas.</p>}

      <button
        type="submit"
        disabled={salvando}
        className="mt-6 rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
      >
        {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar empreendimento"}
      </button>
    </form>
  );
}
