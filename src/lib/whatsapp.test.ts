import { test } from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppLink } from "./whatsapp.ts";

test("gera link wa.me com o numero correto", () => {
  const link = buildWhatsAppLink("oi");
  assert.equal(link, "https://wa.me/5515992500314?text=oi");
});

test("codifica espacos, virgula e acentos na mensagem", () => {
  const link = buildWhatsAppLink("Olá, tudo bem?");
  assert.equal(
    link,
    "https://wa.me/5515992500314?text=Ol%C3%A1%2C%20tudo%20bem%3F",
  );
});
