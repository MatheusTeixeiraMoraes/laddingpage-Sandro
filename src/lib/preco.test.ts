import { test } from "node:test";
import assert from "node:assert/strict";
import { formatarPrecoAPartirDe } from "./preco.ts";

test("formata milhares", () => {
  assert.equal(formatarPrecoAPartirDe(289000), "A partir de R$ 289 mil");
  assert.equal(formatarPrecoAPartirDe(245000), "A partir de R$ 245 mil");
});

test("arredonda para o milhar mais proximo", () => {
  assert.equal(formatarPrecoAPartirDe(289500), "A partir de R$ 290 mil");
});

test("formata milhao no singular", () => {
  assert.equal(formatarPrecoAPartirDe(1_000_000), "A partir de R$ 1 milhão");
});

test("formata milhoes com decimais", () => {
  assert.equal(formatarPrecoAPartirDe(1_250_000), "A partir de R$ 1,25 milhões");
});
