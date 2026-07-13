import { test } from "node:test";
import assert from "node:assert/strict";
import type { Empreendimento } from "../types/empreendimento.ts";
import { faixaDeMetragem, listaDeDormitorios } from "./resumo.ts";

function comPlantas(metragens: number[]): Empreendimento {
  return {
    id: "x", nome: "x", tipo: "apartamento",
    bairro: { id: "b", nome: "Centro", sobre: "" }, zona: "norte",
    imagem: "", galeria: [], entregaEm: null, precoAPartirDe: 0,
    dormitorios: [], suite: false, varanda: false, quintal: false,
    garagemCoberta: false, vagaDupla: false, pontosAr: null,
    descricao: "", construtora: "", torres: null, andares: "",
    aptosPorAndar: null, elevadores: null, entregaComPiso: "", documentacao: "",
    endereco: "",
    latitude: 0, longitude: 0,
    plantas: metragens.map((m, i) => ({ id: String(i), metragem: m, preco: null, imagens: [] })),
  };
}

test("uma planta so mostra o tamanho", () => {
  assert.equal(faixaDeMetragem(comPlantas([45])), "45 m²");
});

test("varias plantas mostram a faixa", () => {
  assert.equal(faixaDeMetragem(comPlantas([48, 44, 52])), "44–52 m²");
});

test("empreendimento sem planta nao quebra", () => {
  assert.equal(faixaDeMetragem(comPlantas([])), "—");
  assert.equal(listaDeDormitorios([]), "—");
});

test("lista de dormitorios como o Sandro escreve", () => {
  assert.equal(listaDeDormitorios([2]), "2");
  assert.equal(listaDeDormitorios([2, 3]), "2 e 3");
  assert.equal(listaDeDormitorios([3, 1, 2]), "1, 2 e 3");
});
