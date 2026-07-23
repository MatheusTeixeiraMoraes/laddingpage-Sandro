/**
 * Prepara a imagem no navegador ANTES de subir pro Storage:
 *   1. redimensiona (lado maior no máximo MAX_LADO);
 *   2. queima a marca d'água do Sandro no centro, se for imóvel;
 *   3. salva em JPEG.
 *
 * Por que redimensionar importa: o site serve as imagens DIRETO do Storage
 * (o otimizador da Vercel saiu de cena — a cota dele estourou e derrubou todas
 * as imagens com 402). Sem isso, um PNG de 3 MB chega com 3 MB no celular do
 * cliente. Com isso, vira ~150 KB.
 *
 * Feito no cliente porque o upload já vai do navegador direto pro Storage —
 * não precisa de servidor nem da dependência `sharp`.
 */

const LOGO_URL = "/marca-dagua.png";
const OPACIDADE = 0.18;
const LARGURA_REL = 0.38;
const LARGURA_MIN = 120;
/** Lado maior da imagem final. Acima disso não muda nada no que o site mostra. */
const MAX_LADO = 1920;
const QUALIDADE = 0.82;

let logoPromise: Promise<ImageBitmap> | null = null;

function carregarLogo(): Promise<ImageBitmap> {
  if (!logoPromise) {
    logoPromise = fetch(LOGO_URL)
      .then((r) => r.blob())
      .then((b) => createImageBitmap(b));
  }
  return logoPromise;
}

export async function prepararImagem(
  arquivo: File,
  opts?: { marca?: boolean },
): Promise<File> {
  const foto = await createImageBitmap(arquivo);

  // Math.min(1, ...) para nunca AUMENTAR uma imagem que já é pequena.
  const escala = Math.min(1, MAX_LADO / Math.max(foto.width, foto.height));
  const largura = Math.round(foto.width * escala);
  const altura = Math.round(foto.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  // Navegador sem canvas 2D: sobe como veio em vez de travar o upload.
  if (!ctx) {
    foto.close();
    return arquivo;
  }

  // JPEG não tem transparência: sem esse fundo branco, um PNG transparente
  // (logo de parceiro, por exemplo) viraria preto.
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, largura, altura);
  ctx.drawImage(foto, 0, 0, largura, altura);
  foto.close();

  if (opts?.marca) {
    const logo = await carregarLogo();
    const logoW = Math.max(LARGURA_MIN, Math.round(largura * LARGURA_REL));
    const logoH = Math.round((logo.height / logo.width) * logoW);
    ctx.globalAlpha = OPACIDADE;
    ctx.drawImage(
      logo,
      Math.round((largura - logoW) / 2),
      Math.round((altura - logoH) / 2),
      logoW,
      logoH,
    );
    ctx.globalAlpha = 1;
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Não foi possível processar a imagem."))),
      "image/jpeg",
      QUALIDADE,
    );
  });

  return new File([blob], `${arquivo.name.replace(/\.[^.]+$/, "")}.jpg`, {
    type: "image/jpeg",
  });
}
