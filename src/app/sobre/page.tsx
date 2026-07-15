import Image from "next/image";
import Link from "next/link";
import { Depoimentos } from "@/components/Depoimentos";
import { SocialIcons } from "@/components/home/SocialIcons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getFotosClientes } from "@/lib/fotosClientes";
import { getConteudo, texto, lista, resolverValores } from "@/lib/conteudo";
import {
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

export const dynamic = "force-dynamic";

const WHATSAPP = buildWhatsAppLink(
  "Olá, Sandro! Li a sua história no site e gostaria de conversar.",
);

export const metadata = {
  title: "Sobre o Sandro Higuti | Consultor Imobiliário em Sorocaba",
  description:
    "A história do Sandro Higuti: atendimento humanizado, especialista em Minha Casa Minha Vida em Sorocaba. CRECI 278922.",
};

export default async function SobrePage() {
  const [fotos, conteudo] = await Promise.all([
    getFotosClientes(),
    getConteudo(),
  ]);
  const fotoSobre = texto(conteudo, "foto_sobre", "/sobre/sandro-sentado.jpg");

  const sobreTitulo1 = texto(conteudo, "sobre_titulo_1", SOBRE_TITULO_1);
  const sobreTitulo2 = texto(conteudo, "sobre_titulo_2", SOBRE_TITULO_2);
  const sobreIntro = texto(conteudo, "sobre_intro", SOBRE_INTRO);
  const sobreFrase = texto(conteudo, "sobre_frase", SOBRE_FRASE);
  const bioParagrafos = lista(conteudo, "bio_paragrafos", BIO_PARAGRAFOS);
  const bioRealizacoes = lista(conteudo, "bio_realizacoes", BIO_REALIZACOES);
  const bioProposito = texto(conteudo, "bio_proposito", BIO_PROPOSITO);
  const bioFraseFinal = lista(conteudo, "bio_frase_final", BIO_FRASE_FINAL);
  const valores = resolverValores(conteudo, "valores", VALORES);
  const destaques = lista(conteudo, "destaques", DESTAQUES);

  return (
    <div>
      {/* Apresentação */}
      <section className="bg-gradient-to-b from-brand-blush/40 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-8 pb-14 lg:grid-cols-2 lg:pt-12 lg:pb-20">
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
              Sobre mim
            </p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
              {sobreTitulo1} <span className="text-brand-pink">{sobreTitulo2}</span>
            </h1>
            <p className="mt-3 max-w-md text-lg text-slate-600">{sobreIntro}</p>
            <p className="mt-5 font-script text-3xl text-brand-pink sm:text-4xl">
              {sobreFrase}
            </p>

            <div className="mt-6">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-brand-pink px-9 py-4 text-lg font-semibold text-white shadow-md transition-colors hover:bg-pink-600"
              >
                Falar com o Sandro
              </a>
              <div className="mt-5">
                <SocialIcons iconClassName="border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-brand-pink hover:text-brand-pink" />
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -right-4 -top-4 h-40 w-40 rounded-[40%] bg-brand-pink/20 blur-2xl" aria-hidden />
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={fotoSobre}
                alt="Sandro Higuti, consultor imobiliário"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* História + destaques ao lado */}
      <section className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_340px]">
          <article className="max-w-2xl">
            <div className="flex flex-col gap-4 text-slate-600">
              {bioParagrafos.map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
            </div>

            <ul className="mt-6 flex flex-col gap-3 rounded-2xl bg-brand-blush/50 p-6">
              {bioRealizacoes.map((linha, i) => (
                <li key={i} className="flex gap-3 text-brand-navy">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" aria-hidden />
                  <span>{linha}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-slate-600">{bioProposito}</p>

            <blockquote className="mt-8 border-l-4 border-brand-pink pl-5">
              {bioFraseFinal.map((linha, i) => (
                <p
                  key={i}
                  className="font-heading text-xl font-bold text-brand-navy sm:text-2xl"
                >
                  {linha}
                </p>
              ))}
            </blockquote>
          </article>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-brand-navy">
                Meus valores
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {valores.map((valor, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-lg leading-none" aria-hidden>
                      {valor.emoji}
                    </span>
                    <span className="font-medium">{valor.titulo}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-brand-navy p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-white">
                Alguns números
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {destaques.map((destaque, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-pink/20 text-brand-pink">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3 w-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                      </svg>
                    </span>
                    {destaque}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Clientes que viraram amigos */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
              Histórias que inspiram
            </p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              Clientes que se tornam <span className="text-brand-pink">amigos</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Momentos de entrega de chave que viraram amizade de verdade.
            </p>
          </div>

          {fotos.length > 0 && (
            <>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {fotos.slice(0, 6).map((foto, i) => (
                  <div key={foto.id} className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm">
                    <Image
                      src={foto.url}
                      alt={
                        foto.legenda ||
                        `Cliente do Sandro Higuti na entrega das chaves ${i + 1}`
                      }
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              {fotos.length > 6 && (
                <div className="mt-8 text-center">
                  <Link
                    href="/galeria"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink"
                  >
                    Ver as {fotos.length} fotos na galeria
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              )}
            </>
          )}

          <div className="mt-14 empty:mt-0">
            <Depoimentos />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Vamos encontrar o seu?
          </h2>
          <p className="mt-2 text-slate-600">
            Me conta o que você procura — eu te mostro o que faz sentido para a sua realidade.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-md transition-colors hover:bg-pink-600"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
            </svg>
            Falar no WhatsApp
          </a>
          <p className="mt-4 text-xs text-slate-400">
            Sandro Higuti · Consultor Imobiliário · CRECI 278922 · Sorocaba - SP
          </p>
        </div>
      </section>
    </div>
  );
}
