import { test } from "node:test";
import assert from "node:assert/strict";
import { tempoRelativo } from "./tempoRelativo.ts";

const HOJE = new Date("2026-07-13T12:00:00");

test("meses", () => {
  assert.equal(tempoRelativo("2026-05", HOJE), "há 2 meses");
  assert.equal(tempoRelativo("2026-06", HOJE), "há 1 mês");
  assert.equal(tempoRelativo("2026-07", HOJE), "este mês");
});

test("vira ano quando passa de 12 meses", () => {
  assert.equal(tempoRelativo("2025-07", HOJE), "há 1 ano");
  assert.equal(tempoRelativo("2025-08", HOJE), "há 11 meses");
  assert.equal(tempoRelativo("2024-01", HOJE), "há 2 anos");
});

test("o rotulo envelhece junto com a avaliacao (nao congela)", () => {
  const avaliacao = "2026-05";
  assert.equal(tempoRelativo(avaliacao, new Date("2026-07-13")), "há 2 meses");
  // um ano depois, a MESMA avaliacao nao pode continuar dizendo "2 meses"
  assert.equal(tempoRelativo(avaliacao, new Date("2027-07-13")), "há 1 ano");
});
