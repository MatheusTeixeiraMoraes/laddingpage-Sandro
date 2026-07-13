import { test } from "node:test";
import assert from "node:assert/strict";
import { isUuid } from "./uuid.ts";

test("aceita o UUID de um empreendimento real", () => {
  assert.equal(isUuid("a0000000-0000-0000-0000-000000000001"), true);
});

test("aceita UUID em maiusculas", () => {
  assert.equal(isUuid("A0000000-0000-0000-0000-00000000000F"), true);
});

test("recusa lixo vindo da URL (viraria 500 no Postgres)", () => {
  for (const lixo of ["sou-viver", "", "123", "a0000000-0000-0000-0000-00000000000", "'; drop table empreendimentos;--"]) {
    assert.equal(isUuid(lixo), false, `deveria recusar: ${lixo}`);
  }
});
