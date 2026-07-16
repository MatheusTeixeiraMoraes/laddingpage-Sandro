import type { Metadata } from "next";
import { Poppins, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/home/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SchemaOrg } from "@/components/SchemaOrg";
import { SITE_URL, NEGOCIO } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Aponta para o dominio real (nao o da Vercel): resolve os og:image/URLs
  // relativos e diz ao Google/WhatsApp qual e o endereco oficial do site.
  metadataBase: new URL(SITE_URL),
  title: "Sandro Higuti | Consultor Imobiliário em Sorocaba",
  description:
    "Consultor imobiliário em Sorocaba. Apartamentos na planta, Minha Casa Minha Vida e atendimento humano do começo ao fim. CRECI 278922.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: NEGOCIO.nome,
    title: "Sandro Higuti | Consultor Imobiliário em Sorocaba",
    description:
      "Apartamentos na planta, Minha Casa Minha Vida e atendimento humano em Sorocaba. CRECI 278922.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Sandro Higuti — Consultor Imobiliário em Sorocaba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandro Higuti | Consultor Imobiliário em Sorocaba",
    description:
      "Apartamentos na planta, Minha Casa Minha Vida e atendimento humano em Sorocaba. CRECI 278922.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SchemaOrg />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
