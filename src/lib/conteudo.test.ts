import { test } from "node:test";
import assert from "node:assert/strict";
import { texto, lista, parseNumeros, resolverNumeros } from "./conteudoTexto.ts";

const PADRAO_NUMEROS = [
  { valor: "+100", label: "Famílias atendidas" },
  { valor: "+100", label: "Sonhos realizados" },
];

test("texto: usa o valor editado quando existe", () => {
  assert.equal(texto({ a: "editado" }, "a", "padrão"), "editado");
});

test("texto: cai no padrão quando falta ou está vazio", () => {
  assert.equal(texto({}, "a", "padrão"), "padrão");
  assert.equal(texto({ a: "" }, "a", "padrão"), "padrão");
  assert.equal(texto({ a: "   " }, "a", "padrão"), "padrão");
  assert.equal(texto({ a: 123 }, "a", "padrão"), "padrão"); // tipo errado no banco
});

test("lista: usa a editada quando tem itens, senão o padrão", () => {
  assert.deepEqual(lista({ a: ["x", "y"] }, "a", ["p"]), ["x", "y"]);
  assert.deepEqual(lista({ a: [] }, "a", ["p"]), ["p"]);
  assert.deepEqual(lista({}, "a", ["p"]), ["p"]);
});

test("parseNumeros: separa valor e label pelo primeiro '|'", () => {
  assert.deepEqual(parseNumeros(["+100 | Famílias atendidas"]), [
    { valor: "+100", label: "Famílias atendidas" },
  ]);
});

test("parseNumeros: linha sem '|' vira só o valor", () => {
  assert.deepEqual(parseNumeros(["+100"]), [{ valor: "+100", label: "" }]);
});

test("parseNumeros: descarta linha vazia e apara espaços", () => {
  assert.deepEqual(parseNumeros(["  ", "R$ 2 mi | em vendas"]), [
    { valor: "R$ 2 mi", label: "em vendas" },
  ]);
});

test("parseNumeros: label com '|' extra mantém o resto", () => {
  assert.deepEqual(parseNumeros(["a | b | c"]), [{ valor: "a", label: "b | c" }]);
});

test("resolverNumeros: usa os editados quando válidos", () => {
  assert.deepEqual(resolverNumeros({ numeros: ["+50 | Anos"] }, "numeros", PADRAO_NUMEROS), [
    { valor: "+50", label: "Anos" },
  ]);
});

test("resolverNumeros: chave ausente cai no padrão", () => {
  assert.deepEqual(resolverNumeros({}, "numeros", PADRAO_NUMEROS), PADRAO_NUMEROS);
});

test("resolverNumeros: lixo que zera no parse cai no padrão (não some a seção)", () => {
  // Regressão da revisão: um "|" solto sobrevive ao editor mas o parse descarta.
  // Antes: numeros=[] e a seção renderizava vazia. Agora volta ao padrão.
  assert.deepEqual(resolverNumeros({ numeros: ["|"] }, "numeros", PADRAO_NUMEROS), PADRAO_NUMEROS);
  assert.deepEqual(resolverNumeros({ numeros: ["  |  ", "|"] }, "numeros", PADRAO_NUMEROS), PADRAO_NUMEROS);
});
