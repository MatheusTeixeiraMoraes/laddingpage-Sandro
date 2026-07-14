import { test } from "node:test";
import assert from "node:assert/strict";
import type { Empreendimento } from "../types/empreendimento.ts";
import {
  faixasDePreco,
  faixasDeMetragem,
  anosDeEntrega,
  temProntoParaMorar,
  maxDormitorios,
  maxPontosAr,
} from "./faixas.ts";

function emp(
  id: string,
  entregaEm: string | null,
  precoAPartirDe: number,
  metragens: number[],
  dormitorios: number[] = [2],
  pontosAr: number | null = null,
): Empreendimento {
  return {
    id,
    nome: id,
    tipo: "apartamento",
    bairro: { id: "b", nome: "Centro", sobre: "" },
    zona: "norte",
    imagem: "",
    galeria: [],
    entregaEm,
    precoAPartirDe,
    dormitorios,
    suite: false,
    varanda: false,
    quintal: false,
    garagemCoberta: false,
    vagaDupla: false,
    pontosAr,
    descricao: "",
    construtora: "",
    torres: null,
    andares: "",
    aptosPorAndar: null,
    elevadores: null,
    entregaComPiso: "",
    documentacao: "",
    endereco: "",
    destaque: false,
    latitude: 0,
    longitude: 0,
    plantas: metragens.map((m, i) => ({
      id: `${id}-${i}`,
      metragem: m,
      preco: null,
      imagens: [],
    })),
  };
}

// Espelha o estoque real: precos de 219k a 312k, metragens de 44 a 52.
const ESTOQUE = [
  emp("a", null, 219_000, [44]),
  emp("b", "2026-12-01", 289_000, [48], [2, 3]),
  emp("c", "2028-04-01", 312_000, [52], [3], 2),
];

test("faixas de preco saem do 'a partir de' do empreendimento, de 50 em 50 mil", () => {
  const { min, max } = faixasDePreco(ESTOQUE);
  assert.deepEqual(min, [200_000, 250_000, 300_000]);
  assert.deepEqual(max, [250_000, 300_000, 350_000]);
});

test("faixas de metragem saem das plantas, de 5 em 5", () => {
  const { min, max } = faixasDeMetragem(ESTOQUE);
  assert.deepEqual(min, [40, 45, 50]);
  assert.deepEqual(max, [45, 50, 55]);
});

test("as faixas crescem sozinhas quando entra um imovel mais caro", () => {
  const comLuxo = [...ESTOQUE, emp("d", null, 800_000, [120])];
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

test("pontos de ar: ignora quem nao informou", () => {
  assert.equal(maxPontosAr(ESTOQUE), 2);
  assert.equal(maxPontosAr([ESTOQUE[0]]), 0);
});

test("estoque vazio nao quebra", () => {
  assert.deepEqual(faixasDePreco([]), { min: [], max: [] });
  assert.deepEqual(anosDeEntrega([]), []);
  assert.equal(maxDormitorios([]), 0);
  assert.equal(maxPontosAr([]), 0);
});
