import { test } from "node:test";
import assert from "node:assert/strict";
import type { Empreendimento } from "../types/empreendimento.ts";
import { empreendimentosEmDestaque } from "./destaques.ts";

function emp(id: string, destaque: boolean): Empreendimento {
  return {
    id, nome: id, tipo: "apartamento", bairro: { id: "b", nome: "x", sobre: "" },
    zona: "norte", imagem: "", galeria: [], entregaEm: null, precoAPartirDe: 0,
    dormitorios: [], suite: 0, varanda: false, quintal: false,
    garagemCoberta: false, vagaDupla: false, pontosAr: null, descricao: "",
    construtora: "", torres: null, andares: "", aptosPorAndar: null,
    elevadores: null, entregaComPiso: "", documentacao: "", endereco: "",
    destaque, latitude: 0, longitude: 0, plantas: [],
  };
}

test("sem nenhum marcado, usa os 4 primeiros (mais recentes, ja vem ordenado do banco)", () => {
  const lista = ["a", "b", "c", "d", "e"].map((id) => emp(id, false));
  assert.deepEqual(
    empreendimentosEmDestaque(lista).map((e) => e.id),
    ["a", "b", "c", "d"],
  );
});

test("marcados entram primeiro, o resto completa ate 4", () => {
  const lista = [emp("a", false), emp("b", true), emp("c", false), emp("d", false), emp("e", false)];
  assert.deepEqual(
    empreendimentosEmDestaque(lista).map((e) => e.id),
    ["b", "a", "c", "d"],
  );
});

test("4 ou mais marcados: so os marcados aparecem, sem completar", () => {
  const lista = [emp("a", true), emp("b", true), emp("c", true), emp("d", true), emp("e", true), emp("f", false)];
  assert.deepEqual(
    empreendimentosEmDestaque(lista).map((e) => e.id),
    ["a", "b", "c", "d"],
  );
});

test("estoque com menos de 4 nao quebra", () => {
  const lista = [emp("a", false), emp("b", true)];
  assert.deepEqual(
    empreendimentosEmDestaque(lista).map((e) => e.id),
    ["b", "a"],
  );
});

test("estoque vazio nao quebra", () => {
  assert.deepEqual(empreendimentosEmDestaque([]), []);
});
