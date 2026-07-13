import { test } from "node:test";
import assert from "node:assert/strict";
import type { Empreendimento } from "../types/empreendimento.ts";
import {
  faixasDePreco,
  faixasDeMetragem,
  anosDeEntrega,
  temProntoParaMorar,
  maxDormitorios,
} from "./faixas.ts";

function emp(
  id: string,
  entregaEm: string | null,
  plantas: { preco: number; metragem: number; dormitorios?: number }[],
): Empreendimento {
  return {
    id,
    nome: id,
    tipo: "apartamento",
    bairro: "",
    zona: "norte",
    imagem: "",
    galeria: [],
    entregaEm,
    latitude: 0,
    longitude: 0,
    plantas: plantas.map((p, i) => ({
      id: `${id}-${i}`,
      metragem: p.metragem,
      comSuite: false,
      dormitorios: p.dormitorios ?? 2,
      vagas: 1,
      preco: p.preco,
      ambientes: [],
      imagens: [],
    })),
  };
}

// Espelha o estoque real de hoje: precos de 219k a 312k, metragens de 44 a 52.
const ESTOQUE = [
  emp("a", null, [{ preco: 219_000, metragem: 44 }]),
  emp("b", "2026-12-01", [{ preco: 289_000, metragem: 48 }]),
  emp("c", "2028-04-01", [{ preco: 312_000, metragem: 52, dormitorios: 3 }]),
];

test("faixas de preco saem do estoque, de 50 em 50 mil", () => {
  const { min, max } = faixasDePreco(ESTOQUE);
  assert.deepEqual(min, [200_000, 250_000, 300_000]);
  assert.deepEqual(max, [250_000, 300_000, 350_000]);
});

test("faixas de metragem saem do estoque, de 5 em 5", () => {
  const { min, max } = faixasDeMetragem(ESTOQUE);
  assert.deepEqual(min, [40, 45, 50]);
  assert.deepEqual(max, [45, 50, 55]);
});

test("as faixas crescem sozinhas quando entra um imovel mais caro", () => {
  const comLuxo = [...ESTOQUE, emp("d", null, [{ preco: 800_000, metragem: 120 }])];
  assert.equal(faixasDePreco(comLuxo).max.at(-1), 800_000);
  assert.equal(faixasDeMetragem(comLuxo).max.at(-1), 120);
});

test("so oferece anos que tem imovel, em ordem", () => {
  assert.deepEqual(anosDeEntrega(ESTOQUE), [2026, 2028]);
});

test("sabe se existe pronto para morar", () => {
  assert.equal(temProntoParaMorar(ESTOQUE), true);
  assert.equal(temProntoParaMorar([ESTOQUE[1]]), false);
});

test("nao oferece mais dormitorios do que existe", () => {
  assert.equal(maxDormitorios(ESTOQUE), 3);
});

test("estoque vazio nao quebra", () => {
  assert.deepEqual(faixasDePreco([]), { min: [], max: [] });
  assert.deepEqual(anosDeEntrega([]), []);
  assert.equal(maxDormitorios([]), 0);
});
