import { test } from "node:test";
import assert from "node:assert/strict";
import { filterEmpreendimentos, FILTROS_VAZIOS } from "./filterEmpreendimentos.ts";
import type { Empreendimento } from "../types/empreendimento";

function emp(over: Partial<Empreendimento> & { id: string }): Empreendimento {
  return {
    nome: over.id,
    tipo: "apartamento",
    bairro: "",
    zona: "norte",
    imagem: "",
    galeria: [],
    entregaEm: null,
    precoAPartirDe: 250_000,
    dormitorios: [2],
    suite: false,
    varanda: false,
    quintal: false,
    garagemCoberta: false,
    vagaDupla: false,
    pontosAr: null,
    descricao: "",
    construtora: "",
    torres: null,
    andares: "",
    aptosPorAndar: null,
    elevadores: null,
    entregaComPiso: "",
    documentacao: "",
    endereco: "",
    sobreBairro: "",
    latitude: 0,
    longitude: 0,
    plantas: [{ id: `${over.id}-a`, metragem: 45, preco: null, imagens: [] }],
    ...over,
  };
}

const fixture: Empreendimento[] = [
  emp({
    id: "1",
    nome: "Casa Azul",
    bairro: "Centro",
    zona: "leste",
    precoAPartirDe: 500_000,
    dormitorios: [3],
    suite: true,
    varanda: true,
    plantas: [{ id: "1-a", metragem: 120, preco: null, imagens: [] }],
  }),
  emp({
    id: "2",
    nome: "Predio Duas Plantas",
    bairro: "Vila Nova",
    entregaEm: "2027-12-01",
    precoAPartirDe: 180_000,
    dormitorios: [1, 3],
    quintal: true,
    elevadores: 2,
    pontosAr: 2,
    plantas: [
      { id: "2-a", metragem: 30, preco: null, imagens: [] },
      { id: "2-b", metragem: 90, preco: null, imagens: [] },
    ],
  }),
];

const ids = (r: Empreendimento[]) => r.map((e) => e.id).sort();

test("sem filtros nem busca, retorna todos", () => {
  assert.equal(filterEmpreendimentos(fixture, FILTROS_VAZIOS, "").length, 2);
});

test("busca por nome e por bairro", () => {
  assert.deepEqual(ids(filterEmpreendimentos(fixture, FILTROS_VAZIOS, "azul")), ["1"]);
  assert.deepEqual(ids(filterEmpreendimentos(fixture, FILTROS_VAZIOS, "vila nova")), ["2"]);
});

test("filtra por zona", () => {
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, zona: "leste" }, "")), ["1"]);
});

test("filtra por pronto para morar e por ano", () => {
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, entrega: "pronto" }, "")), ["1"]);
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, entrega: 2027 }, "")), ["2"]);
});

test("preco compara o 'a partir de' do empreendimento", () => {
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, precoMax: 200_000 }, "")), ["2"]);
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, precoMin: 300_000 }, "")), ["1"]);
});

test("basta UMA planta caber na faixa de metragem", () => {
  // O predio 2 tem planta de 30 e de 90: a de 90 atende, entao ele entra.
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, metragemMin: 80 }, "")), ["1", "2"]);
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, metragemMax: 40 }, "")), ["2"]);
});

test("basta UMA opcao de dormitorio atender", () => {
  // O predio 2 oferece 1 e 3 dorms: quem quer 3+ deve ver ele.
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, dormitoriosMin: 3 }, "")), ["1", "2"]);
  assert.equal(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, dormitoriosMin: 4 }, "").length, 0);
});

test("caracteristicas: marcado exige ter", () => {
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, suite: true }, "")), ["1"]);
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, varanda: true }, "")), ["1"]);
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, quintal: true }, "")), ["2"]);
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, elevador: true }, "")), ["2"]);
  assert.equal(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, garagemCoberta: true }, "").length, 0);
});

test("elevador: 0 e um sobrado (nao entra), null e 'nao informado' (nao entra)", () => {
  const comSobrado = [
    emp({ id: "sobrado", elevadores: 0 }),
    emp({ id: "predio", elevadores: 2 }),
    emp({ id: "naoinformado", elevadores: null }),
  ];
  assert.deepEqual(
    ids(filterEmpreendimentos(comSobrado, { ...FILTROS_VAZIOS, elevador: true }, "")),
    ["predio"],
  );
});

test("desmarcado nao filtra nada (ninguem procura 'sem varanda')", () => {
  assert.equal(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, varanda: false }, "").length, 2);
});

test("pontos de ar-condicionado: minimo", () => {
  assert.deepEqual(ids(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, pontosArMin: 2 }, "")), ["2"]);
  // O imovel 1 nao informou (null) -- nao pode passar por um minimo.
  assert.equal(filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, pontosArMin: 3 }, "").length, 0);
});

test("filtros combinam (e o impossivel devolve vazio)", () => {
  assert.equal(
    filterEmpreendimentos(fixture, { ...FILTROS_VAZIOS, suite: true, precoMax: 200_000 }, "").length,
    0,
  );
});
