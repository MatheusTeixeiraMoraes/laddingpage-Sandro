import { test } from "node:test";
import assert from "node:assert/strict";
import {
  texto,
  lista,
  parseValores,
  resolverValores,
} from "./conteudoTexto.ts";

const PADRAO_VALORES = [
  { emoji: "❤️", titulo: "Empatia" },
  { emoji: "🎯", titulo: "Comprometimento" },
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

test("parseValores: separa emoji e nome pelo '|'", () => {
  assert.deepEqual(parseValores(["❤️ | Empatia"]), [{ emoji: "❤️", titulo: "Empatia" }]);
});

test("parseValores: linha sem '|' vira nome sem emoji", () => {
  assert.deepEqual(parseValores(["Empatia"]), [{ emoji: "", titulo: "Empatia" }]);
});

test("parseValores: descarta linha sem nome (só emoji ou vazia)", () => {
  assert.deepEqual(parseValores(["🎯 |", "  ", "🏠 | Especialista"]), [
    { emoji: "🏠", titulo: "Especialista" },
  ]);
});

test("resolverValores: usa os editados quando válidos, senão o padrão", () => {
  assert.deepEqual(resolverValores({ valores: ["🔥 | Foco"] }, "valores", PADRAO_VALORES), [
    { emoji: "🔥", titulo: "Foco" },
  ]);
  assert.deepEqual(resolverValores({}, "valores", PADRAO_VALORES), PADRAO_VALORES);
  // só emoji sem nome -> parse zera -> cai no padrão
  assert.deepEqual(resolverValores({ valores: ["🎯 |"] }, "valores", PADRAO_VALORES), PADRAO_VALORES);
});
