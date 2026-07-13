import { test } from "node:test";
import assert from "node:assert/strict";
import { filterEmpreendimentos, FILTROS_VAZIOS } from "./filterEmpreendimentos.ts";
import type { Empreendimento } from "../types/empreendimento";

const fixture: Empreendimento[] = [
  {
    id: "1",
    nome: "Casa Azul",
    tipo: "casa",
    bairro: "Centro",
    zona: "leste",
    imagem: "",
    galeria: [],
    entrega: "",
    latitude: -23.5,
    longitude: -47.45,
    plantas: [
      {
        id: "1-a",
        metragem: 120,
        comSuite: true,
        dormitorios: 3,
        vagas: 2,
        preco: 500000,
        ambientes: [],
        imagens: [],
      },
    ],
  },
  {
    id: "2",
    nome: "Predio Duas Plantas",
    tipo: "apartamento",
    bairro: "Vila Nova",
    zona: "norte",
    imagem: "",
    galeria: [],
    entrega: "",
    latitude: -23.5,
    longitude: -47.45,
    plantas: [
      {
        id: "2-a",
        metragem: 30,
        comSuite: false,
        dormitorios: 1,
        vagas: 0,
        preco: 180000,
        ambientes: [],
        imagens: [],
      },
      {
        id: "2-b",
        metragem: 90,
        comSuite: true,
        dormitorios: 3,
        vagas: 2,
        preco: 600000,
        ambientes: [],
        imagens: [],
      },
    ],
  },
];

test("sem filtros nem busca, retorna todos", () => {
  const resultado = filterEmpreendimentos(fixture, FILTROS_VAZIOS, "");
  assert.equal(resultado.length, 2);
});

test("busca por nome", () => {
  const resultado = filterEmpreendimentos(fixture, FILTROS_VAZIOS, "azul");
  assert.deepEqual(resultado.map((e) => e.id), ["1"]);
});

test("busca por bairro", () => {
  const resultado = filterEmpreendimentos(fixture, FILTROS_VAZIOS, "vila nova");
  assert.deepEqual(resultado.map((e) => e.id), ["2"]);
});

test("filtra por tipo", () => {
  const resultado = filterEmpreendimentos(
    fixture,
    { ...FILTROS_VAZIOS, tipo: "apartamento" },
    "",
  );
  assert.deepEqual(resultado.map((e) => e.id), ["2"]);
});

test("filtra por zona", () => {
  const resultado = filterEmpreendimentos(
    fixture,
    { ...FILTROS_VAZIOS, zona: "leste" },
    "",
  );
  assert.deepEqual(resultado.map((e) => e.id), ["1"]);
});

test("casa se pelo menos uma planta atende aos filtros numericos", () => {
  const resultado = filterEmpreendimentos(
    fixture,
    { ...FILTROS_VAZIOS, dormitoriosMin: 3, metragemMin: 80 },
    "",
  );
  // "Predio Duas Plantas" so tem a planta 2-b (90m2, 3 dorm) atendendo;
  // a planta 2-a (30m2, 1 dorm) nao atende, mas isso nao exclui o predio.
  assert.deepEqual(resultado.map((e) => e.id).sort(), ["1", "2"]);
});

test("nao casa quando nenhuma planta atende", () => {
  const resultado = filterEmpreendimentos(
    fixture,
    { ...FILTROS_VAZIOS, dormitoriosMin: 5 },
    "",
  );
  assert.equal(resultado.length, 0);
});
