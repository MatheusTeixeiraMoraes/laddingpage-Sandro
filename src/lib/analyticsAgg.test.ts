import { test } from "node:test";
import assert from "node:assert/strict";
import { resumoLeads, leadsPorDia, leadsPorInteresse, diaBRTde } from "./analyticsAgg.ts";
import type { Lead } from "@/types/lead";

function lead(over: Partial<Lead>): Lead {
  return { id: "x", nome: "N", telefone: "1", interesse: "", atendido: false, criadoEm: "2026-07-01T12:00:00Z", ...over };
}

test("resumoLeads: conta total, mes (30d), a atender e cliques", () => {
  const agora = new Date("2026-07-15T12:00:00Z");
  const leads = [
    lead({ criadoEm: "2026-07-14T12:00:00Z", atendido: false }), // dentro do mes, a atender
    lead({ criadoEm: "2026-07-10T12:00:00Z", atendido: true }), // dentro do mes, atendido
    lead({ criadoEm: "2026-05-01T12:00:00Z", atendido: false }), // fora do mes
  ];
  const r = resumoLeads(leads, 7, agora);
  assert.equal(r.totalLeads, 3);
  assert.equal(r.leadsMes, 2);
  assert.equal(r.aAtender, 2);
  assert.equal(r.totalCliques, 7);
});

test("leadsPorDia: janela com zeros preenchidos, do antigo pro novo", () => {
  const agora = new Date("2026-07-15T12:00:00Z");
  const barras = leadsPorDia([lead({ criadoEm: "2026-07-15T12:00:00Z" })], agora, 3);
  assert.equal(barras.length, 3);
  assert.deepEqual(barras.map((b) => b.dia), ["2026-07-13", "2026-07-14", "2026-07-15"]);
  assert.deepEqual(barras.map((b) => b.qtd), [0, 0, 1]);
});

test("leadsPorDia: agrupa no dia BRT (lead das 23h BRT nao vaza pro dia seguinte)", () => {
  // 2026-07-15T02:00Z = 2026-07-14T23:00 BRT -> conta no dia 14
  const agora = new Date("2026-07-16T12:00:00Z");
  const barras = leadsPorDia([lead({ criadoEm: "2026-07-15T02:00:00Z" })], agora, 3);
  const dia14 = barras.find((b) => b.dia === "2026-07-14");
  assert.equal(dia14?.qtd, 1);
});

test("diaBRTde: converte o created_at UTC pro dia em BRT (lead das 23h30)", () => {
  // 2026-07-16T02:30Z = 2026-07-15 23:30 BRT -> dia 15, nao 16
  assert.equal(diaBRTde("2026-07-16T02:30:00Z"), "2026-07-15");
});

test("leadsPorInteresse: agrupa e ordena desc; vazio vira rotulo", () => {
  const r = leadsPorInteresse([
    lead({ interesse: "Apartamento na planta" }),
    lead({ interesse: "Apartamento na planta" }),
    lead({ interesse: "" }),
  ]);
  assert.deepEqual(r, [
    { rotulo: "Apartamento na planta", qtd: 2 },
    { rotulo: "(não informado)", qtd: 1 },
  ]);
});
