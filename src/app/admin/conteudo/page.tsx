import Link from "next/link";
import { getConteudo, texto } from "@/lib/conteudo";
import { EditorFotos, type FotoEditavel } from "@/components/admin/EditorFotos";

export const dynamic = "force-dynamic";

export default async function ConteudoPage() {
  const conteudo = await getConteudo();

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
    </div>
  );
}
