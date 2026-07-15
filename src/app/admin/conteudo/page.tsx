import Link from "next/link";
import { getConteudo, texto, lista } from "@/lib/conteudo";
import { EditorFotos, type FotoEditavel } from "@/components/admin/EditorFotos";
import { EditorTextos, type CampoTexto } from "@/components/admin/EditorTextos";
import {
  NUMEROS,
  SOBRE_TITULO_1,
  SOBRE_TITULO_2,
  SOBRE_INTRO,
  SOBRE_FRASE,
  BIO_PARAGRAFOS,
  BIO_REALIZACOES,
  BIO_PROPOSITO,
  BIO_FRASE_FINAL,
  VALORES,
  DESTAQUES,
} from "@/data/sobre";
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

  const valoresPadrao = VALORES.map((v) => `${v.emoji} | ${v.titulo}`);

  const camposSobreTopo: CampoTexto[] = [
    { chave: "sobre_titulo_1", label: "Topo — título (parte 1)", tipo: "texto", valor: texto(conteudo, "sobre_titulo_1", SOBRE_TITULO_1) },
    { chave: "sobre_titulo_2", label: "Topo — seu nome (em rosa)", tipo: "texto", valor: texto(conteudo, "sobre_titulo_2", SOBRE_TITULO_2) },
    { chave: "sobre_intro", label: "Topo — apresentação curta", tipo: "area", valor: texto(conteudo, "sobre_intro", SOBRE_INTRO) },
    { chave: "sobre_frase", label: "Topo — frase à mão (em rosa)", tipo: "texto", valor: texto(conteudo, "sobre_frase", SOBRE_FRASE) },
  ];

  const camposSobreHistoria: CampoTexto[] = [
    { chave: "bio_paragrafos", label: "Sua história", ajuda: "Um parágrafo por linha. Não aperte Enter no meio de um parágrafo.", tipo: "lista", linhas: 12, valor: lista(conteudo, "bio_paragrafos", BIO_PARAGRAFOS).join("\n") },
    { chave: "bio_realizacoes", label: "O que mais me realiza", ajuda: "Uma frase por linha.", tipo: "lista", valor: lista(conteudo, "bio_realizacoes", BIO_REALIZACOES).join("\n") },
    { chave: "bio_proposito", label: "Meu propósito", tipo: "area", valor: texto(conteudo, "bio_proposito", BIO_PROPOSITO) },
    { chave: "bio_frase_final", label: "Frase de fechamento", ajuda: "Uma linha por vez.", tipo: "lista", valor: lista(conteudo, "bio_frase_final", BIO_FRASE_FINAL).join("\n") },
    { chave: "valores", label: "Meus valores", ajuda: "Um por linha, formato: emoji | nome. Ex.: ❤️ | Empatia", tipo: "lista", linhas: 7, valor: lista(conteudo, "valores", valoresPadrao).join("\n") },
    { chave: "destaques", label: "Conquistas (“Alguns números”)", ajuda: "Uma por linha.", tipo: "lista", linhas: 6, valor: lista(conteudo, "destaques", DESTAQUES).join("\n") },
  ];

  const camposContato: CampoTexto[] = [
    { chave: "contato_email", label: "E-mail", ajuda: "Deixe em branco para não mostrar o cartão de e-mail.", tipo: "texto", valor: texto(conteudo, "contato_email", "") },
    { chave: "contato_endereco", label: "Endereço", ajuda: "Rua, número, bairro, cidade. Em branco = sem endereço nem mapa.", tipo: "texto", valor: texto(conteudo, "contato_endereco", "") },
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

      <section className="mt-10">
        <h2 className="font-heading text-lg font-bold text-brand-navy">
          Textos da página Sobre
        </h2>
        <p className="mb-4 mt-1 text-xs text-slate-400">
          Sua página de apresentação (o “Sobre” do menu).
        </p>
        <div className="flex flex-col gap-6">
          <EditorTextos titulo="Topo da página" campos={camposSobreTopo} />
          <EditorTextos titulo="Sua história e valores" campos={camposSobreHistoria} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-lg font-bold text-brand-navy">
          Página de contato
        </h2>
        <p className="mb-4 mt-1 text-xs text-slate-400">
          E-mail e endereço da página “Contato”. Cada um só aparece no site
          depois de preenchido aqui.
        </p>
        <EditorTextos titulo="Contato" campos={camposContato} />
      </section>
    </div>
  );
}
