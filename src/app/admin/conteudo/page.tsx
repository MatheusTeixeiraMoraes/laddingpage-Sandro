import Link from "next/link";
import { getConteudo, texto, lista } from "@/lib/conteudo";
import { EditorFotos, type FotoEditavel } from "@/components/admin/EditorFotos";
import { EditorTextos, type CampoTexto } from "@/components/admin/EditorTextos";
import { NUMEROS } from "@/data/sobre";
import {
  HERO_TITULO_1,
  HERO_TITULO_2,
  HERO_SUBTITULO,
  HERO_BADGES,
  HERO_FRASE,
  SOBREMIM_TITULO_1,
  SOBREMIM_TITULO_2,
  SOBREMIM_TEXTO,
  SOBREMIM_PILLS,
} from "@/data/home";

export const dynamic = "force-dynamic";

export default async function ConteudoPage() {
  const conteudo = await getConteudo();

  const numerosPadrao = NUMEROS.map((n) => `${n.valor} | ${n.label}`);

  const camposHome: CampoTexto[] = [
    { chave: "hero_titulo_1", label: "Topo — título, linha 1", tipo: "texto", valor: texto(conteudo, "hero_titulo_1", HERO_TITULO_1) },
    { chave: "hero_titulo_2", label: "Topo — título, linha 2 (em rosa)", tipo: "texto", valor: texto(conteudo, "hero_titulo_2", HERO_TITULO_2) },
    { chave: "hero_subtitulo", label: "Topo — descrição", tipo: "area", valor: texto(conteudo, "hero_subtitulo", HERO_SUBTITULO) },
    { chave: "hero_badges", label: "Topo — selos", ajuda: "Um por linha.", tipo: "lista", valor: lista(conteudo, "hero_badges", HERO_BADGES).join("\n") },
    { chave: "hero_frase", label: "Topo — frase à mão (em rosa)", tipo: "texto", valor: texto(conteudo, "hero_frase", HERO_FRASE) },
    { chave: "sobremim_titulo_1", label: "Sobre mim — título (parte 1)", tipo: "texto", valor: texto(conteudo, "sobremim_titulo_1", SOBREMIM_TITULO_1) },
    { chave: "sobremim_titulo_2", label: "Sobre mim — título, seu nome (em rosa)", tipo: "texto", valor: texto(conteudo, "sobremim_titulo_2", SOBREMIM_TITULO_2) },
    { chave: "sobremim_texto", label: "Sobre mim — parágrafo", tipo: "area", valor: texto(conteudo, "sobremim_texto", SOBREMIM_TEXTO) },
    { chave: "sobremim_pills", label: "Sobre mim — selos", ajuda: "Um por linha.", tipo: "lista", valor: lista(conteudo, "sobremim_pills", SOBREMIM_PILLS).join("\n") },
    { chave: "numeros", label: "Números (home e página Sobre)", ajuda: "Um por linha, no formato: valor | descrição. Ex.: +100 | Famílias atendidas", tipo: "lista", valor: lista(conteudo, "numeros", numerosPadrao).join("\n") },
  ];

  const fotos: FotoEditavel[] = [
    {
      chave: "foto_hero",
      label: "Foto do topo (home)",
      descricao: "A primeira foto grande que aparece no site.",
      url: texto(conteudo, "foto_hero", "/sandro-recorte.png"),
    },
    {
      chave: "foto_sobremim",
      label: "Foto “Sobre mim” (home)",
      descricao: "Na seção de apresentação, no meio da home.",
      url: texto(conteudo, "foto_sobremim", "/sandro-sobre.jpg"),
    },
    {
      chave: "foto_contato",
      label: "Foto do contato (home)",
      descricao: "Ao lado do formulário “Fale comigo”.",
      url: texto(conteudo, "foto_contato", "/sandro-contato.png"),
    },
    {
      chave: "foto_sobre",
      label: "Foto da página Sobre",
      descricao: "No topo da página “Sobre”.",
      url: texto(conteudo, "foto_sobre", "/sobre/sandro-sentado.jpg"),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao painel
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-extrabold text-brand-navy">
        Conteúdo do site
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Troque suas fotos você mesmo. As mudanças aparecem no site na hora.
      </p>

      <section className="mt-6">
        <h2 className="font-heading text-lg font-bold text-brand-navy">
          Suas fotos
        </h2>
        <p className="mb-4 mt-1 text-xs text-slate-400">
          JPG, PNG ou WEBP, até 5 MB. Dica: use fotos na vertical (mais altas do
          que largas), que é o formato que o site espera.
        </p>
        <EditorFotos fotos={fotos} />
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-lg font-bold text-brand-navy">
          Textos da home
        </h2>
        <p className="mb-4 mt-1 text-xs text-slate-400">
          O que aparece na página inicial. As mudanças vão pro site na hora.
        </p>
        <EditorTextos titulo="Página inicial" campos={camposHome} />
      </section>
    </div>
  );
}
