import { test } from "node:test";
import assert from "node:assert/strict";
import { filterImoveis, FILTROS_VAZIOS } from "./filterImoveis.ts";
import type { Imovel } from "../types/imovel";

const fixture: Imovel[] = [
  {
    id: "1",
    nome: "Casa Azul",
    tipo: "casa",
    dormitorios: 3,
    vagas: 2,
    metragem: 120,
    preco: 500000,
    bairro: "Centro",
    imagemUrl: "",
  },
  {
    id: "2",
    nome: "Apartamento Rosa",
    tipo: "apartamento",
    dormitorios: 1,
    vagas: 0,
    metragem: 30,
    preco: 180000,
    bairro: "Vila Nova",
    imagemUrl: "",
  },
];

test("sem filtros nem busca, retorna todos", () => {
  const resultado = filterImoveis(fixture, FILTROS_VAZIOS, "");
  assert.equal(resultado.length, 2);
});

test("busca por nome (case-insensitive)", () => {
  const resultado = filterImoveis(fixture, FILTROS_VAZIOS, "azul");
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("busca por bairro", () => {
  const resultado = filterImoveis(fixture, FILTROS_VAZIOS, "vila nova");
  assert.deepEqual(resultado.map((i) => i.id), ["2"]);
});

test("filtra por tipo", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, tipo: "casa" },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("filtra por dormitorios minimo", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, dormitoriosMin: 2 },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("filtra por vagas minimo", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, vagasMin: 1 },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("filtra por faixa de metragem", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, metragemMin: 100, metragemMax: 150 },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["1"]);
});

test("filtra por faixa de preco", () => {
  const resultado = filterImoveis(
    fixture,
    { ...FILTROS_VAZIOS, precoMin: 0, precoMax: 200000 },
    "",
  );
  assert.deepEqual(resultado.map((i) => i.id), ["2"]);
});
