import { test } from "node:test";
import assert from "node:assert/strict";
import type { Empreendimento } from "../types/empreendimento.ts";
import type { Lead } from "../types/lead.ts";
import {
  contarCliques,
  contarLeadsPorEmpreendimento,
  montarRanking,
} from "./ranking.ts";

function emp(id: string, nome: string, destaque = false): Empreendimento {
  return {
    id, nome, tipo: "apartamento",
    bairro: { id: "b", nome: "Centro", sobre: "" }, zona: "norte",
    imagem: "", galeria: [], entregaEm: null, precoAPartirDe: 0,
    dormitorios: [], suite: 0, varanda: false, quintal: false,
    garagemCoberta: false, vagaDupla: false, pontosAr: null,
    descricao: "", construtora: "", torres: null, andares: "",
    aptosPorAndar: null, elevadores: null, entregaComPiso: "", documentacao: "",
    endereco: "", destaque, latitude: 0, longitude: 0, plantas: [],
  };
}

function lead(interesse: string): Lead {
  return { id: "l", nome: "x", telefone: "1", interesse, atendido: false, criadoEm: "" };
}

test("contarCliques soma as linhas por imovel", () => {
  const c = contarCliques([
    { empreendimento_id: "a" },
    { empreendimento_id: "a" },
    { empreendimento_id: "b" },
  ]);
  assert.equal(c.get("a"), 2);
  assert.equal(c.get("b"), 1);
  assert.equal(c.get("c"), undefined);
});

test("leads casam pelo nome exato e pela variante com planta", () => {
  const empreendimentos = [emp("a", "Vila Verde"), emp("b", "Alto do Sol")];
  const leads = [
    lead("Vila Verde"),
    lead("Vila Verde — planta de 44 m²"),
    lead("Alto do Sol"),
    lead("Apartamento na planta"), // lead da home: nao casa com ninguem
  ];
  const c = contarLeadsPorEmpreendimento(empreendimentos, leads);
  assert.equal(c.get("a"), 2);
  assert.equal(c.get("b"), 1);
});

test("nome que e prefixo de outro nao conta a mais", () => {
  // "Vila Verde" NAO pode herdar o lead de "Vila Verde Sorocaba".
  const empreendimentos = [emp("a", "Vila Verde"), emp("b", "Vila Verde Sorocaba")];
  const leads = [lead("Vila Verde Sorocaba — planta de 50 m²")];
  const c = contarLeadsPorEmpreendimento(empreendimentos, leads);
  assert.equal(c.get("a"), 0);
  assert.equal(c.get("b"), 1);
});

test("ranking ordena por cliques, depois leads, depois nome", () => {
  const empreendimentos = [
    emp("a", "Aurora"),
    emp("b", "Bela Vista"),
    emp("c", "Central"),
  ];
  const cliques = new Map([["a", 5], ["b", 5]]); // c = 0
  const leads = new Map([["a", 1], ["b", 3]]);
  const ranking = montarRanking(empreendimentos, cliques, leads);
  // b e a empatam em cliques (5); b tem mais leads -> vem antes. c fica por ultimo.
  assert.deepEqual(ranking.map((r) => r.id), ["b", "a", "c"]);
});

test("imovel sem clique nem lead entra com zero", () => {
  const ranking = montarRanking([emp("a", "Aurora", true)], new Map(), new Map());
  assert.equal(ranking[0].cliques, 0);
  assert.equal(ranking[0].leads, 0);
  assert.equal(ranking[0].destaque, true);
  assert.equal(ranking[0].bairro, "Centro");
});
