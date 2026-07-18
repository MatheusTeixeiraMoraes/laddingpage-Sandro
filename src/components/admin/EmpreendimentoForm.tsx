"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Bairro, Empreendimento, TipoEmpreendimento, Zona } from "@/types/empreendimento";
import { parseCoordenadas } from "@/lib/coordenadas";
import {
  criarEmpreendimento,
  atualizarEmpreendimento,
  uploadImagem,
  type EmpreendimentoInput,
} from "@/lib/admin/empreendimentos";
import { criarBairro, salvarSobreBairro } from "@/lib/admin/bairros";
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
  { value: "votorantim", label: "Votorantim" },
];

const campo =
  "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-pink";
const rotulo = "block text-xs font-semibold uppercase tracking-wide text-slate-500";

export function EmpreendimentoForm({
  empreendimento,
  bairros: bairrosIniciais,
}: {
  empreendimento?: Empreendimento;
  bairros: Bairro[];
}) {
  const router = useRouter();
  const editando = Boolean(empreendimento);

  const [nome, setNome] = useState(empreendimento?.nome ?? "");
  const [tipo, setTipo] = useState<TipoEmpreendimento>(empreendimento?.tipo ?? "apartamento");
  const [zona, setZona] = useState<Zona>(empreendimento?.zona ?? "norte");

  // O texto do bairro pertence ao BAIRRO: escolher um bairro que ja tem texto
  // preenche na hora, e editar aqui muda em todos os imoveis daquele bairro.
  const [bairros, setBairros] = useState<Bairro[]>(bairrosIniciais);
  const [bairroId, setBairroId] = useState(empreendimento?.bairro.id ?? "");
  const [sobreBairro, setSobreBairro] = useState(empreendimento?.bairro.sobre ?? "");
  const [novoBairro, setNovoBairro] = useState("");
  const [criandoBairro, setCriandoBairro] = useState(false);

  const bairroSelecionado = bairros.find((b) => b.id === bairroId);

  const escolherBairro = (id: string) => {
    setBairroId(id);
    setSobreBairro(bairros.find((b) => b.id === id)?.sobre ?? "");
  };

  const handleNovoBairro = async () => {
    const nomeLimpo = novoBairro.trim();
    if (!nomeLimpo) return;

    setCriandoBairro(true);
    setErro(null);
    try {
      const bairro = await criarBairro(nomeLimpo);
      setBairros((atuais) => [...atuais, bairro].sort((a, b) => a.nome.localeCompare(b.nome)));
      setBairroId(bairro.id);
      setSobreBairro("");
      setNovoBairro("");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível criar o bairro.");
    } finally {
      setCriandoBairro(false);
    }
  };
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
  const [vagaDupla, setVagaDupla] = useState(empreendimento?.vagaDupla ?? false);
  const [pontosAr, setPontosAr] = useState<number | null>(empreendimento?.pontosAr ?? null);

  // Descricao (escrita pelo Sandro) + ficha tecnica (vem da planilha).
  const [descricao, setDescricao] = useState(empreendimento?.descricao ?? "");
  const [construtora, setConstrutora] = useState(empreendimento?.construtora ?? "");
  const [torres, setTorres] = useState<number | null>(empreendimento?.torres ?? null);
  const [andares, setAndares] = useState(empreendimento?.andares ?? "");
  const [aptosPorAndar, setAptosPorAndar] = useState<number | null>(
    empreendimento?.aptosPorAndar ?? null,
  );
  const [elevadores, setElevadores] = useState<number | null>(
    empreendimento?.elevadores ?? null,
  );
  const [piso, setPiso] = useState<Empreendimento["entregaComPiso"]>(
    empreendimento?.entregaComPiso ?? "",
  );
  const [documentacao, setDocumentacao] = useState<Empreendimento["documentacao"]>(
    empreendimento?.documentacao ?? "",
  );
  const [endereco, setEndereco] = useState(empreendimento?.endereco ?? "");
  const [destaque, setDestaque] = useState(empreendimento?.destaque ?? false);

  const numeroOuNulo = (v: string): number | null => (v === "" ? null : Number(v));

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
    if (!bairroId) {
      setErro("Escolha o bairro do empreendimento.");
      return;
    }

    setSalvando(true);
    try {
      const imagem = arquivo
        ? await uploadImagem(arquivo, { marca: true })
        : (empreendimento?.imagem ?? "");

      // O texto vive no bairro, nao no imovel: salva na tabela de bairros e
      // vale para todos os imoveis daquele bairro.
      await salvarSobreBairro(bairroId, sobreBairro);

      const dados: EmpreendimentoInput = {
        nome: nome.trim(),
        tipo,
        zona,
        bairro_id: bairroId,
        entrega_em: pronto ? null : `${mesEntrega}-01`,
        preco_a_partir_de: preco,
        dormitorios: dorms,
        suite,
        varanda,
        quintal,
        garagem_coberta: garagem,
        vaga_dupla: vagaDupla,
        pontos_ar: pontosAr,
        descricao: descricao.trim(),
        construtora: construtora.trim(),
        torres,
        andares: andares.trim(),
        aptos_por_andar: aptosPorAndar,
        elevadores,
        entrega_com_piso: piso,
        documentacao,
        endereco: endereco.trim(),
        destaque,
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
          <select
            className={campo}
            value={bairroId}
            onChange={(e) => escolherBairro(e.target.value)}
          >
            <option value="">Escolha o bairro…</option>
            {bairros.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nome}
                {b.sobre ? " ✓" : ""}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-slate-400">
            ✓ = o bairro já tem texto escrito.
          </span>
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
              ["Vaga dupla", vagaDupla, setVagaDupla],
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
            onChange={(e) => setPontosAr(numeroOuNulo(e.target.value))}
          >
            <option value="">Não informado</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className={rotulo}>Descrição</span>
          <textarea
            className={`${campo} min-h-32`}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Conte a história do empreendimento: lazer, localização, o que ele tem de diferente. Uma linha em branco separa os parágrafos."
          />
          <span className="mt-1 block text-xs text-slate-400">
            Aparece na página do imóvel, em &ldquo;Sobre o empreendimento&rdquo;. Deixe vazio para não publicar.
          </span>
        </label>

        <div className="sm:col-span-2 border-t border-slate-100 pt-4">
          <span className={rotulo}>Ficha técnica</span>
          <p className="mt-1 text-xs text-slate-400">
            O que ficar vazio simplesmente não aparece na página.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <label>
              <span className={rotulo}>Construtora</span>
              <input
                className={campo}
                value={construtora}
                onChange={(e) => setConstrutora(e.target.value)}
                placeholder="Ex: BONELLI"
              />
            </label>

            <label>
              <span className={rotulo}>Torres</span>
              <input
                type="number"
                min={0}
                className={campo}
                value={torres ?? ""}
                onChange={(e) => setTorres(numeroOuNulo(e.target.value))}
                placeholder="Ex: 3"
              />
            </label>

            <label>
              <span className={rotulo}>Andares</span>
              <input
                className={campo}
                value={andares}
                onChange={(e) => setAndares(e.target.value)}
                placeholder="Ex: T + 16"
              />
            </label>

            <label>
              <span className={rotulo}>Aptos. por andar</span>
              <input
                type="number"
                min={0}
                className={campo}
                value={aptosPorAndar ?? ""}
                onChange={(e) => setAptosPorAndar(numeroOuNulo(e.target.value))}
                placeholder="Ex: 8"
              />
            </label>

            <label>
              <span className={rotulo}>Elevadores</span>
              <input
                type="number"
                min={0}
                className={campo}
                value={elevadores ?? ""}
                onChange={(e) => setElevadores(numeroOuNulo(e.target.value))}
                placeholder="Ex: 2"
              />
              <span className="mt-1 block text-xs text-slate-400">0 = sem elevador.</span>
            </label>

            <label>
              <span className={rotulo}>Entrega com piso</span>
              <select
                className={campo}
                value={piso}
                onChange={(e) => setPiso(e.target.value as Empreendimento["entregaComPiso"])}
              >
                <option value="">Não informado</option>
                <option value="completo">Completo</option>
                <option value="areas_molhadas">Só áreas molhadas</option>
              </select>
            </label>

            <label>
              <span className={rotulo}>Documentação</span>
              <select
                className={campo}
                value={documentacao}
                onChange={(e) => setDocumentacao(e.target.value as Empreendimento["documentacao"])}
              >
                <option value="">Não informado</option>
                <option value="gratis">Grátis</option>
                <option value="pago">Por conta do comprador</option>
              </select>
            </label>
          </div>
        </div>

        <div className="sm:col-span-2 border-t border-slate-100 pt-4">
          <span className={rotulo}>Localização</span>
          <p className="mt-1 text-xs text-slate-400">
            Aparece na página do imóvel: mapa à esquerda, este texto à direita.
          </p>

          <div className="mt-3 grid gap-4">
            <label>
              <span className={rotulo}>Link do Google Maps (define o ponto no mapa)</span>
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

            <label>
              <span className={rotulo}>Endereço (escrito)</span>
              <input
                className={campo}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: R. Ramon Haro Martini, 1160 - Vila Haro"
              />
            </label>

            <div>
              <span className={rotulo}>Bairro não está na lista?</span>
              <div className="mt-1 flex gap-2">
                <input
                  className={`${campo} mt-0`}
                  value={novoBairro}
                  onChange={(e) => setNovoBairro(e.target.value)}
                  placeholder="Ex: Vila Haro"
                />
                <button
                  type="button"
                  onClick={handleNovoBairro}
                  disabled={criandoBairro || novoBairro.trim() === ""}
                  className="shrink-0 whitespace-nowrap rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-40"
                >
                  {criandoBairro ? "Criando..." : "Criar bairro"}
                </button>
              </div>
            </div>

            <div>
              <span className={rotulo}>
                Sobre o bairro
                {bairroSelecionado ? ` — ${bairroSelecionado.nome}` : ""}
              </span>
              <textarea
                className={`${campo} min-h-28 disabled:bg-slate-100`}
                value={sobreBairro}
                onChange={(e) => setSobreBairro(e.target.value)}
                disabled={!bairroId}
                placeholder={
                  bairroId
                    ? "O que tem por perto: acesso a rodovias e avenidas, supermercados, escolas, parques, comércio. Uma linha em branco separa os parágrafos."
                    : "Escolha o bairro primeiro."
                }
              />
              {bairroId && (
                <span className="mt-1 block text-xs text-amber-600">
                  Este texto é do bairro, não deste imóvel: ao salvar, passa a valer
                  para todos os imóveis de {bairroSelecionado?.nome}.
                </span>
              )}
            </div>
          </div>
        </div>

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
            marca
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-pink/30 bg-brand-blush/30 p-4 sm:col-span-2">
          <input
            type="checkbox"
            checked={destaque}
            onChange={(e) => setDestaque(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-pink"
          />
          <span>
            <span className="block text-sm font-semibold text-brand-navy">
              Destacar na home
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Aparece em &ldquo;Lançamentos em destaque&rdquo;, na página inicial. Sem
              nenhum imóvel marcado, a seção mostra os mais recentes.
            </span>
          </span>
        </label>
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
