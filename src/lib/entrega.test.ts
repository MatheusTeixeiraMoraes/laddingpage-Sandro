import { test } from "node:test";
import assert from "node:assert/strict";
import { formatarEntrega, anoDeEntrega, PRONTO_PARA_MORAR } from "./entrega.ts";

test("formata a data como Mes/Ano", () => {
  assert.equal(formatarEntrega("2026-12-01"), "Dez/2026");
  assert.equal(formatarEntrega("2028-04-01"), "Abr/2028");
  assert.equal(formatarEntrega("2026-01-01"), "Jan/2026");
});

test("data nula e pronto para morar", () => {
  assert.equal(formatarEntrega(null), PRONTO_PARA_MORAR);
});

test("nao volta um mes por causa do fuso (UTC-3)", () => {
  // new Date("2026-12-01") seria 30/11 em Sorocaba. Tem que continuar Dez.
  assert.equal(formatarEntrega("2026-12-01"), "Dez/2026");
  assert.equal(formatarEntrega("2027-01-01"), "Jan/2027");
});

test("extrai o ano para o filtro", () => {
  assert.equal(anoDeEntrega("2027-12-01"), 2027);
  assert.equal(anoDeEntrega(null), null);
});
