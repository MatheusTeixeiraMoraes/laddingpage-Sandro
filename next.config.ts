import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O site antigo (plataforma anterior) tinha imoveis em /imovel/<id>/<slug>.
  // Essas URLs ainda aparecem no Google e hoje dariam 404. Redirecionamos
  // (301) pra listagem de imoveis: o clique cai numa pagina util e o Google
  // vai trocando os links antigos pelos atuais.
  async redirects() {
    return [
      {
        source: "/imovel/:path*",
        destination: "/#imoveis",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "snxcuwbtxffkongtrxsb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Miniaturas dos videos do YouTube (pagina /relatos).
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
