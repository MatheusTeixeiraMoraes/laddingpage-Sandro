/**
 * Helpers de YouTube. O Sandro cola o link do video no painel; guardamos so o
 * ID (11 caracteres) e montamos embed/miniatura a partir dele -- sem API key,
 * do mesmo jeito que o mapa embutido da pagina de contato.
 */

const ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extrai o ID do video de qualquer formato de link do YouTube (ou do proprio
 * ID). Aceita youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /shorts/ID,
 * /live/ID, com ou sem parametros extras, e com ou sem "https://". Devolve
 * null quando nao encontra um ID valido.
 */
export function extrairYoutubeId(entrada: string): string | null {
  const texto = entrada.trim();
  if (texto === "") return null;

  // Ja e um ID puro (11 chars do alfabeto do YouTube).
  if (ID.test(texto)) return texto;

  // Aceita link colado sem esquema (ex.: "youtu.be/xxxx").
  const comEsquema = /^https?:\/\//i.test(texto) ? texto : `https://${texto}`;

  let url: URL;
  try {
    url = new URL(comEsquema);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ID.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v && ID.test(v)) return v;

    const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
  }

  return null;
}

/** URL de embed (dominio sem cookies) para o iframe do player. */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/** Miniatura do video (480x360, sempre existe). */
export function youtubeThumbUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
