import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCoordenadas } from "./coordenadas.ts";

test("extrai do link com @lat,lng,zoom", () => {
  const r = parseCoordenadas(
    "https://www.google.com/maps/place/Sorocaba/@-23.4936,-47.4451,15z/data=!3m1",
  );
  assert.deepEqual(r, { latitude: -23.4936, longitude: -47.4451 });
});

test("extrai do link com ?q=lat,lng", () => {
  const r = parseCoordenadas("https://www.google.com/maps?q=-23.5015,-47.4526");
  assert.deepEqual(r, { latitude: -23.5015, longitude: -47.4526 });
});

test("aceita par cru com espaco", () => {
  const r = parseCoordenadas("-23.463, -47.412");
  assert.deepEqual(r, { latitude: -23.463, longitude: -47.412 });
});

test("retorna null quando nao reconhece", () => {
  assert.equal(parseCoordenadas("https://exemplo.com/sem-coordenada"), null);
  assert.equal(parseCoordenadas(""), null);
});

test("rejeita coordenadas fora do intervalo valido", () => {
  assert.equal(parseCoordenadas("-200.5, 500.5"), null);
});
