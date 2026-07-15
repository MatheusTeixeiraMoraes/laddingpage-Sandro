import { test } from "node:test";
import assert from "node:assert/strict";
import { extrairYoutubeId, youtubeEmbedUrl, youtubeThumbUrl } from "./youtube.ts";

const ID = "dQw4w9WgXcQ";

test("extrairYoutubeId: link padrao watch?v=", () => {
  assert.equal(extrairYoutubeId(`https://www.youtube.com/watch?v=${ID}`), ID);
});

test("extrairYoutubeId: link curto youtu.be", () => {
  assert.equal(extrairYoutubeId(`https://youtu.be/${ID}`), ID);
});

test("extrairYoutubeId: ignora parametros extras (t, list)", () => {
  assert.equal(extrairYoutubeId(`https://www.youtube.com/watch?v=${ID}&list=abc&t=30s`), ID);
  assert.equal(extrairYoutubeId(`https://youtu.be/${ID}?t=30`), ID);
});

test("extrairYoutubeId: embed, shorts, live", () => {
  assert.equal(extrairYoutubeId(`https://www.youtube.com/embed/${ID}`), ID);
  assert.equal(extrairYoutubeId(`https://www.youtube.com/shorts/${ID}`), ID);
  assert.equal(extrairYoutubeId(`https://www.youtube.com/live/${ID}`), ID);
});

test("extrairYoutubeId: aceita link sem https e com m.", () => {
  assert.equal(extrairYoutubeId(`youtu.be/${ID}`), ID);
  assert.equal(extrairYoutubeId(`https://m.youtube.com/watch?v=${ID}`), ID);
});

test("extrairYoutubeId: ID puro passa direto", () => {
  assert.equal(extrairYoutubeId(ID), ID);
});

test("extrairYoutubeId: entrada invalida vira null", () => {
  assert.equal(extrairYoutubeId(""), null);
  assert.equal(extrairYoutubeId("   "), null);
  assert.equal(extrairYoutubeId("https://vimeo.com/12345"), null);
  assert.equal(extrairYoutubeId("nao e um link"), null);
  assert.equal(extrairYoutubeId("https://www.youtube.com/watch?v=curto"), null);
});

test("youtubeEmbedUrl / youtubeThumbUrl montam a URL a partir do ID", () => {
  assert.equal(youtubeEmbedUrl(ID), `https://www.youtube-nocookie.com/embed/${ID}`);
  assert.equal(youtubeThumbUrl(ID), `https://i.ytimg.com/vi/${ID}/hqdefault.jpg`);
});
