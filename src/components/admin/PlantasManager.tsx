"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Planta } from "@/types/empreendimento";
import {
  criarPlanta,
  atualizarPlanta,
  excluirPlanta,
  type PlantaInput,
} from "@/lib/admin/empreendimentos";
import { formatarPrecoCurto } from "@/lib/preco";
import { UploadGaleria } from "@/components/admin/UploadGaleria";

const campo =
  "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-pink";
const rotulo = "block text-xs font-semibold uppercase tracking-wide text-slate-500";

const VAZIA: PlantaInput = {
  metragem: 0,
  preco: null,
  imagens: [],
};

/**
 * Campos de uma planta (metragem, preço, imagens). Compartilhado entre o
 * PlantasManager (edição, persiste na hora) e o PlantasBuffer (criação, guarda
 * em memória). Sem `required`: como o buffer vive DENTRO do form do
 * empreendimento, um required aqui travaria o "Criar empreendimento". A
 * validação (metragem > 0) fica em quem usa, desabilitando o botão.
 */
export function PlantaCampos({
  form,
  setForm,
}: {
  form: PlantaInput;
  setForm: (f: PlantaInput) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label>
        <span className={rotulo}>Metragem (m²)</span>
        <input
          type="number"
          min={1}
          className={campo}
          value={form.metragem || ""}
          onChange={(e) => setForm({ ...form, metragem: Number(e.target.value) })}
        />
      </label>

      <label>
        <span className={rotulo}>Preço desta planta (opcional)</span>
        <input
          type="number"
          min={0}
          className={campo}
          value={form.preco ?? ""}
          onChange={(e) =>
            setForm({ ...form, preco: e.target.value === "" ? null : Number(e.target.value) })
          }
          placeholder="Deixe vazio para usar o do empreendimento"
        />
        <span className="mt-1 block text-xs text-slate-400">
          Preencha só se esta planta tiver um valor diferente.
        </span>
      </label>

      <div className="sm:col-span-2">
        <UploadGaleria
          label="Imagens desta planta"
          ajuda="Planta baixa, decorado. Aparecem na página do imóvel com a legenda do tamanho."
          imagens={form.imagens}
          onChange={(imagens) => setForm({ ...form, imagens })}
        />
      </div>
    </div>
  );
}

/** Resumo (só leitura) de uma planta na lista. */
function PlantaResumo({ planta }: { planta: PlantaInput }) {
  return (
    <div>
      <p className="font-semibold text-brand-navy">{planta.metragem} m²</p>
      <p className="text-sm text-slate-500">
        {planta.preco === null
          ? "Sem preço próprio (usa o “a partir de” do empreendimento)"
          : formatarPrecoCurto(planta.preco)}
      </p>
      {planta.imagens.length > 0 && (
        <p className="mt-0.5 text-xs text-brand-pink">
          {planta.imagens.length} imagem(ns) desta planta
        </p>
      )}
    </div>
  );
}

const btnEditar =
  "rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink disabled:opacity-40 disabled:pointer-events-none";
const btnExcluir =
  "rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40 disabled:pointer-events-none";
const btnSalvar =
  "rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50";
const btnCancelar =
  "rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white";

/**
 * Gerencia as plantas de um empreendimento que JÁ EXISTE (tela de edição).
 * Cada alteração vai direto pro banco.
 */
export function PlantasManager({
  empreendimentoId,
  plantas,
}: {
  empreendimentoId: string;
  plantas: Planta[];
}) {
  const router = useRouter();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<PlantaInput>(VAZIA);
  const [aberto, setAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const abrirNova = () => {
    setEditandoId(null);
    setForm(VAZIA);
    setErro(null);
    setAberto(true);
  };

  const abrirEdicao = (planta: Planta) => {
    setEditandoId(planta.id);
    setForm({ metragem: planta.metragem, preco: planta.preco, imagens: planta.imagens });
    setErro(null);
    setAberto(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    setSalvando(true);

    try {
      if (editandoId) {
        await atualizarPlanta(editandoId, form);
      } else {
        await criarPlanta(empreendimentoId, form);
      }
      setAberto(false);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a planta.");
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (planta: Planta) => {
    if (!confirm(`Excluir a planta de ${planta.metragem}m²? Essa ação não pode ser desfeita.`)) {
      return;
    }
    try {
      await excluirPlanta(planta.id);
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível excluir a planta.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Plantas</h2>
          <p className="text-sm text-slate-500">
            Os tamanhos disponíveis. Suíte, varanda e quintal são do empreendimento,
            não da planta — estão no formulário acima.
          </p>
        </div>
        <button
          type="button"
          onClick={abrirNova}
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90"
        >
          Adicionar planta
        </button>
      </div>

      {plantas.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">Nenhuma planta cadastrada ainda.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {plantas.map((planta) => (
            <li
              key={planta.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"
            >
              <PlantaResumo planta={planta} />
              <div className="flex gap-2">
                <button type="button" onClick={() => abrirEdicao(planta)} className={btnEditar}>
                  Editar
                </button>
                <button type="button" onClick={() => handleExcluir(planta)} className={btnExcluir}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {aberto && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
          <p className="font-heading text-sm font-bold text-brand-navy">
            {editandoId ? "Editar planta" : "Nova planta"}
          </p>

          <div className="mt-4">
            <PlantaCampos form={form} setForm={setForm} />
          </div>

          {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

          <div className="mt-5 flex gap-3">
            <button type="submit" disabled={salvando || form.metragem <= 0} className={btnSalvar}>
              {salvando ? "Salvando..." : "Salvar planta"}
            </button>
            <button type="button" onClick={() => setAberto(false)} className={btnCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/**
 * Monta as plantas ANTES de o empreendimento existir (tela de criação). Guarda
 * tudo em memória (via onChange); quem persiste é o EmpreendimentoForm, logo
 * depois de criar o empreendimento. Vive dentro do <form> do empreendimento,
 * então não usa <form> próprio (form aninhado é inválido) nem `required`.
 */
export function PlantasBuffer({
  plantas,
  onChange,
  onAbertoChange,
}: {
  plantas: PlantaInput[];
  onChange: (plantas: PlantaInput[]) => void;
  /** Avisa o form pai quando o painel de planta abre/fecha, pra ele travar o
   *  "Criar empreendimento" enquanto há planta sendo digitada. */
  onAbertoChange?: (aberto: boolean) => void;
}) {
  const [editandoIdx, setEditandoIdx] = useState<number | null>(null);
  const [form, setForm] = useState<PlantaInput>(VAZIA);
  const [aberto, setAberto] = useState(false);

  const abrir = (idx: number | null) => {
    setEditandoIdx(idx);
    setForm(idx === null ? VAZIA : plantas[idx]);
    setAberto(true);
    onAbertoChange?.(true);
  };

  const fechar = () => {
    setAberto(false);
    onAbertoChange?.(false);
  };

  const salvar = () => {
    if (form.metragem <= 0) return;
    // A lista não muda com o painel aberto (os botões da lista ficam travados),
    // então editandoIdx continua apontando pro item certo.
    if (editandoIdx !== null) {
      onChange(plantas.map((p, i) => (i === editandoIdx ? form : p)));
    } else {
      onChange([...plantas, form]);
    }
    fechar();
  };

  const excluir = (idx: number) => {
    if (!confirm(`Remover a planta de ${plantas[idx].metragem}m² da lista?`)) return;
    onChange(plantas.filter((_, i) => i !== idx));
  };

  return (
    <div className="border-t border-slate-100 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className={rotulo}>Plantas</span>
          <p className="mt-1 text-xs text-slate-400">
            Os tamanhos disponíveis. Monte aqui — elas entram junto quando você criar o empreendimento.
          </p>
        </div>
        <button
          type="button"
          onClick={() => abrir(null)}
          disabled={aberto}
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-40 disabled:pointer-events-none"
        >
          Adicionar planta
        </button>
      </div>

      {plantas.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nenhuma planta ainda.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {plantas.map((planta, idx) => (
            <li
              key={idx}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"
            >
              <PlantaResumo planta={planta} />
              <div className="flex gap-2">
                {/* Travados enquanto um painel está aberto: senão mexer na lista
                    deslocaria o item em edição (editandoIdx é posicional). */}
                <button type="button" onClick={() => abrir(idx)} disabled={aberto} className={btnEditar}>
                  Editar
                </button>
                <button type="button" onClick={() => excluir(idx)} disabled={aberto} className={btnExcluir}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {aberto && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
          <p className="font-heading text-sm font-bold text-brand-navy">
            {editandoIdx !== null ? "Editar planta" : "Nova planta"}
          </p>

          <div className="mt-4">
            <PlantaCampos form={form} setForm={setForm} />
          </div>

          <div className="mt-5 flex gap-3">
            <button type="button" onClick={salvar} disabled={form.metragem <= 0} className={btnSalvar}>
              {editandoIdx !== null ? "Salvar planta" : "Adicionar à lista"}
            </button>
            <button type="button" onClick={fechar} className={btnCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
