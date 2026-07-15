import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SocialIcons } from "@/components/home/SocialIcons";

const NAVEGACAO = [
  { label: "Início", href: "/" },
  { label: "Imóveis", href: "/#imoveis" },
  { label: "Sobre", href: "/sobre" },
  { label: "Depoimentos", href: "/#depoimentos" },
  { label: "Contato", href: "/contato" },
  { label: "Política de Privacidade", href: "/privacidade" },
];

const WHATSAPP = buildWhatsAppLink(
  "Olá, Sandro! Vi o seu site e gostaria de conversar sobre os imóveis.",
);

export function SiteFooter() {
  return (
    <footer className="bg-brand-navy text-slate-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-marca.png"
              alt=""
              width={400}
              height={322}
              className="h-11 w-auto"
            />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-base font-extrabold tracking-tight text-white">
                SANDRO HIGUTI
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                Consultor Imobiliário
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Atendimento humanizado e transparente para realizar o seu sonho do
            primeiro lar ou do melhor investimento.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-white">Navegação</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAVEGACAO.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="transition-colors hover:text-brand-pink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-white">Contato</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-pink">
                WhatsApp (15) 99250-0314
              </a>
            </li>
            <li>Sorocaba - SP</li>
            <li>CRECI 278922</li>
          </ul>
          <SocialIcons
            className="mt-4"
            iconClassName="bg-white/10 text-slate-200 hover:bg-brand-pink hover:text-white"
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Sandro Higuti Consultor Imobiliário — CRECI 278922
        </div>
      </div>
    </footer>
  );
}
