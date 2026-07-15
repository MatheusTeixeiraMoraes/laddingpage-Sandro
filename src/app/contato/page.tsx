import type { Metadata } from "next";
import Link from "next/link";
import { getConteudo, texto } from "@/lib/conteudo";
import { SocialIcons } from "@/components/home/SocialIcons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const WHATSAPP_EXIBICAO = "(15) 99250-0314";
const WHATSAPP_TEL = "+5515992500314";
const CRECI = "CRECI 278922";

const WHATSAPP = buildWhatsAppLink(
  "Olá, Sandro! Vi o seu site e gostaria de conversar sobre imóveis.",
);

export const metadata: Metadata = {
  title: "Contato | Sandro Higuti Consultor Imobiliário",
  description:
    "Fale com o Sandro Higuti — WhatsApp, e-mail e redes sociais. Consultor imobiliário em Sorocaba, CRECI 278922.",
};

/** Um cartão de contato. Vira link quando tem href; senão, só informação. */
function Cartao({
  icone,
  titulo,
  valor,
  href,
}: {
  icone: React.ReactNode;
  titulo: string;
  valor: string;
  href?: string;
}) {
  const interno = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blush text-brand-pink">
        {icone}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {titulo}
        </p>
        <p className="mt-0.5 truncate font-heading font-bold text-brand-navy">
          {valor}
        </p>
      </div>
    </>
  );

  const classe =
    "flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm";

  if (!href) return <div className={classe}>{interno}</div>;

  const externo = href.startsWith("http");
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${classe} transition-colors hover:border-brand-pink/40 hover:bg-brand-blush/20`}
    >
      {interno}
    </a>
  );
}

export default async function ContatoPage() {
  const conteudo = await getConteudo();
  const email = texto(conteudo, "contato_email", "");
  const endereco = texto(conteudo, "contato_endereco", "");

  const mapaEmbed = endereco
    ? `https://www.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`
    : "";
  const mapaLink = endereco
    ? `https://www.google.com/maps?q=${encodeURIComponent(endereco)}`
    : "";

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-blush/40 to-white">
        <div className="mx-auto max-w-4xl px-6 pt-12 pb-10 text-center sm:pt-16">
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand-pink">
            Contato
          </p>
          <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Vamos <span className="text-brand-pink">conversar?</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            Estou por aqui para tirar suas dúvidas e ajudar você a encontrar o
            imóvel certo. Escolha o canal que preferir.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 sm:pb-20">
        {/* WhatsApp em destaque */}
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-brand-pink p-6 text-white shadow-md transition-colors hover:bg-pink-600 sm:p-8"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-white/80">
                Resposta mais rápida
              </p>
              <p className="font-heading text-xl font-extrabold sm:text-2xl">
                Chamar no WhatsApp
              </p>
            </div>
          </div>
          <span className="font-heading text-lg font-bold">{WHATSAPP_EXIBICAO}</span>
        </a>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {email && (
            <Cartao
              titulo="E-mail"
              valor={email}
              href={`mailto:${email}`}
              icone={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4V6ZM4 7l8 6 8-6" />
                </svg>
              }
            />
          )}

          <Cartao
            titulo="Telefone"
            valor={WHATSAPP_EXIBICAO}
            href={`tel:${WHATSAPP_TEL}`}
            icone={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5c0 8.28 6.72 15 15 15v-3.5l-4-1.5-1.5 2a11 11 0 0 1-6.5-6.5l2-1.5L7 5H4Z" />
              </svg>
            }
          />

          <Cartao
            titulo="Registro"
            valor={CRECI}
            icone={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v14H4V5ZM8 9h4M8 13h8M8 16h5" />
              </svg>
            }
          />

          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blush text-brand-pink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.5 2.5 3.5 5.8 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.8-3.5-9s1-6.5 3.5-9Z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Redes sociais
              </p>
              <SocialIcons
                className="mt-1"
                iconClassName="border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-brand-pink hover:text-brand-pink"
              />
            </div>
          </div>
        </div>

        {endereco && (
          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
            <iframe
              src={mapaEmbed}
              title="Mapa do endereço do Sandro Higuti"
              className="h-64 w-full border-0 sm:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blush text-brand-pink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11ZM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Endereço
                  </p>
                  <p className="mt-0.5 font-heading font-bold text-brand-navy">{endereco}</p>
                </div>
              </div>
              <a
                href={mapaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink"
              >
                Abrir no Google Maps
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5M19 5l-7 7M10 5H5v14h14v-5" />
                </svg>
              </a>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-slate-600">
          Prefere deixar seus dados para eu entrar em contato?{" "}
          <Link href="/#contato" className="font-semibold text-brand-pink hover:underline">
            Preencha o formulário
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
