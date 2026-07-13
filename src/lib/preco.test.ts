import { test } from "node:test";
import assert from "node:assert/strict";
import { formatarPrecoCurto } from "./preco.ts";

test("formata milhares", () => {
  assert.equal(formatarPrecoCurto(289000), "R$ 289 mil");
  assert.equal(formatarPrecoCurto(245000), "R$ 245 mil");
});

test("arredonda para o milhar mais proximo", () => {
  assert.equal(formatarPrecoCurto(289500), "R$ 290 mil");
});

test("formata milhao no singular", () => {
  assert.equal(formatarPrecoCurto(1_000_000), "R$ 1 milhão");
});

test("formata milhoes com decimais", () => {
  assert.equal(formatarPrecoCurto(1_250_000), "R$ 1,25 milhões");
});
