import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SocialIcons } from "@/components/home/SocialIcons";
import { MenuMobile } from "@/components/home/MenuMobile";

const NAV = [
  { label: "Início", href: "/" },
  { label: "Imóveis", href: "/#imoveis" },
  { label: "Sobre", href: "/sobre" },
  { label: "Depoimentos", href: "/#depoimentos" },
  { label: "Contato", href: "/contato" },
];

const WHATSAPP = buildWhatsAppLink(
  "Olá, Sandro! Vi o seu site e gostaria de conversar sobre os imóveis.",
);

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
        {/* O logo original e quadrado (marca em cima, nome embaixo). Espremido
            na altura do header, o nome virava um borrao. Aqui a marca e imagem e
            o nome e TEXTO -- nitido em qualquer tela. */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Sandro Higuti — início"
        >
          <Image
            src="/logo-marca.png"
            alt=""
            width={400}
            height={322}
            className="h-9 w-auto sm:h-10"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-sm font-extrabold tracking-tight text-brand-navy sm:text-base">
              SANDRO HIGUTI
            </span>
            {/* No celular nao cabe: header ganharia rolagem lateral. */}
            <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:block">
              Consultor Imobiliário
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className="transition-colors hover:text-brand-pink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <SocialIcons
            className="hidden md:flex"
            iconClassName="text-slate-500 hover:bg-brand-blush hover:text-brand-pink"
          />
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com o Sandro no WhatsApp"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-pink px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-600 sm:px-4 sm:py-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12 2a10 10 0 0 0-8.6 15.1L2 22l4.99-1.31A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.96.78.79-2.88-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
            </svg>
            {/* No celular so o icone: o nome do Sandro ao lado ja ocupa a linha. */}
            <span className="hidden sm:inline">Fale comigo</span>
          </a>

          <MenuMobile itens={NAV} />
        </div>
      </div>
    </header>
  );
}
