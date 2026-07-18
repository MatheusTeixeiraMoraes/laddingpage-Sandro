/**
 * Marca d'água no navegador (canvas) — queima a logo do Sandro no centro da
 * imagem ANTES do upload. Mesma formatação das imagens já existentes em
 * /public/imoveis: logo centralizada, ~38% da largura, opacidade baixa.
 *
 * Feito no cliente de propósito: o upload já é direto pro Storage pelo
 * navegador, então não vale montar rota/servidor (nem a dependência `sharp`)
 * só pra isso. É opt-in — só o empreendimento (capa + galeria) usa; plantas,
 * parceiros, prêmios, eventos e fotos de clientes sobem sem marca.
 */

const LOGO_URL = "/marca-dagua.png";
const OPACIDADE = 0.18;
const LARGURA_REL = 0.38;
const LARGURA_MIN = 120;

/** Qualidade por tipo no toBlob (png ignora). Cache da logo entre uploads. */
const QUALIDADE: Record<string, number> = { "image/jpeg": 0.9, "image/webp": 0.9 };
let logoPromise: Promise<ImageBitmap> | null = null;

function carregarLogo(): Promise<ImageBitmap> {
  if (!logoPromise) {
    logoPromise = fetch(LOGO_URL)
      .then((r) => r.blob())
      .then((b) => createImageBitmap(b));
  }
  return logoPromise;
}

export async function aplicarMarcaDagua(arquivo: File): Promise<File> {
  const [foto, logo] = await Promise.all([
    createImageBitmap(arquivo),
    carregarLogo(),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = foto.width;
  canvas.height = foto.height;
  const ctx = canvas.getContext("2d");
  // Sem canvas 2D (navegador muito antigo): sobe sem marca em vez de travar.
  if (!ctx) {
    foto.close();
    return arquivo;
  }

  ctx.drawImage(foto, 0, 0);

  const logoW = Math.max(LARGURA_MIN, Math.round(foto.width * LARGURA_REL));
  const logoH = Math.round((logo.height / logo.width) * logoW);
  ctx.globalAlpha = OPACIDADE;
  ctx.drawImage(
    logo,
    Math.round((foto.width - logoW) / 2),
    Math.round((foto.height - logoH) / 2),
    logoW,
    logoH,
  );
  foto.close();

  // Mantém o tipo do arquivo (jpg/png/webp já validados no uploadImagem).
  const tipo = arquivo.type in QUALIDADE || arquivo.type === "image/png"
    ? arquivo.type
    : "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Falha ao gerar a imagem com marca."))),
      tipo,
      QUALIDADE[tipo],
    );
  });

  return new File([blob], arquivo.name, { type: tipo });
}
