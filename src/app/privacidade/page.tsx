import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Política de Privacidade | Sandro Higuti Consultor Imobiliário",
  description:
    "Como o site do Sandro Higuti trata os dados pessoais de quem preenche o formulário de contato.",
};

const ATUALIZADO_EM = "13 de julho de 2026";

const WHATSAPP_LGPD = buildWhatsAppLink(
  "Olá, Sandro! Gostaria de tratar dos meus dados pessoais (LGPD).",
);

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-heading text-xl font-bold text-brand-navy">{titulo}</h2>
      <div className="mt-3 flex flex-col gap-3 text-slate-600">{children}</div>
    </section>
  );
}

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <Link
        href="/"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-pink"
      >
        ← Voltar ao site
      </Link>

      <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Atualizada em {ATUALIZADO_EM}.
      </p>

      <p className="mt-6 text-slate-600">
        Esta política explica, em linguagem direta, quais dados este site coleta,
        para que servem e o que você pode exigir a respeito deles. Ela vale para
        o site laddingpage-sandro.vercel.app.
      </p>

      <Secao titulo="Quem é o responsável pelos seus dados">
        <p>
          <strong className="text-brand-navy">Sandro Higuti</strong>, consultor
          imobiliário, CRECI 278922 — R. Justiniano de Souza, 145, Vila Angélica,
          Sorocaba - SP.
        </p>
        <p>
          Ele é o <em>controlador</em> dos dados: é quem decide o que é coletado e
          para quê, e é com ele que você fala para exercer qualquer direito
          descrito aqui.
        </p>
      </Secao>

      <Secao titulo="O que coletamos — e só isso">
        <p>
          Quando você preenche o formulário de contato e marca a caixa de
          autorização, guardamos:
        </p>
        <ul className="ml-5 flex list-disc flex-col gap-1">
          <li>seu <strong className="text-brand-navy">nome</strong>;</li>
          <li>seu <strong className="text-brand-navy">telefone (WhatsApp)</strong>;</li>
          <li>o <strong className="text-brand-navy">tipo de imóvel</strong> que você marcou como interesse;</li>
          <li>a data e a hora do envio, e o registro de que você autorizou.</li>
        </ul>
        <p>
          <strong className="text-brand-navy">Se você não preencher o formulário,
          nada é guardado.</strong> Navegar pelo site, olhar imóveis, usar os
          filtros ou clicar no botão do WhatsApp não cria nenhum registro seu
          conosco.
        </p>
        <p>
          Este site <strong className="text-brand-navy">não usa Google Analytics,
          pixel do Facebook, nem qualquer ferramenta de rastreamento ou
          publicidade</strong>. Não há cookie de rastreio: os únicos cookies são
          os da sessão de login do painel administrativo, usado apenas pelo
          Sandro.
        </p>
      </Secao>

      <Secao titulo="Para que usamos">
        <p>
          Exclusivamente para o Sandro entrar em contato com você sobre imóveis —
          que é o motivo pelo qual você preencheu o formulário.
        </p>
        <p>
          <strong className="text-brand-navy">Não vendemos, não alugamos e não
          cedemos seus dados</strong> para terceiros fazerem marketing. Você não
          vai receber ligação de outra empresa porque preencheu este formulário.
        </p>
        <p>
          A base legal é o seu <strong className="text-brand-navy">consentimento</strong>{" "}
          (art. 7º, I, da Lei 13.709/2018 — LGPD), dado quando você marcou a caixa
          de autorização. Sem essa marcação, o envio nem é aceito.
        </p>
      </Secao>

      <Secao titulo="Onde os dados ficam">
        <p>
          Os dados são guardados no <strong className="text-brand-navy">Supabase</strong>{" "}
          (banco de dados em nuvem) e o site é hospedado na{" "}
          <strong className="text-brand-navy">Vercel</strong>. As duas empresas
          atuam como operadoras: processam os dados por conta do Sandro, sob
          contrato, e não os usam para finalidade própria.
        </p>
        <p>
          As páginas de imóvel exibem um mapa do{" "}
          <strong className="text-brand-navy">Google Maps</strong>. Ao carregar o
          mapa, o Google pode coletar dados técnicos (como seu endereço IP),
          conforme a política de privacidade dele. Isso acontece só nas páginas
          que têm mapa.
        </p>
      </Secao>

      <Secao titulo="Por quanto tempo guardamos">
        <p>
          Enquanto durar o atendimento e, no máximo, por{" "}
          <strong className="text-brand-navy">24 meses</strong> após o último
          contato — salvo se houver obrigação legal de guardar por mais tempo.
          Depois disso, o registro é apagado.
        </p>
        <p>
          Você pode pedir a exclusão antes disso, a qualquer momento, sem
          justificar.
        </p>
      </Secao>

      <Secao titulo="Seus direitos">
        <p>A LGPD garante que você pode, a qualquer momento:</p>
        <ul className="ml-5 flex list-disc flex-col gap-1">
          <li>saber se guardamos algum dado seu, e quais;</li>
          <li>pedir uma cópia deles;</li>
          <li>corrigir dado errado ou desatualizado;</li>
          <li>
            <strong className="text-brand-navy">pedir a exclusão</strong> dos seus
            dados;
          </li>
          <li>
            <strong className="text-brand-navy">revogar a autorização</strong> que
            você deu — é tão fácil quanto foi dá-la, e não precisa explicar o
            motivo.
          </li>
        </ul>
        <p>
          Pedidos são atendidos em até <strong className="text-brand-navy">15 dias</strong>.
          Revogar a autorização faz o Sandro parar de te contatar e apagar o seu
          registro.
        </p>
      </Secao>

      <Secao titulo="Como exercer esses direitos">
        <p>
          Fale direto com o Sandro pelo WhatsApp{" "}
          <a
            href={WHATSAPP_LGPD}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-pink hover:underline"
          >
            (15) 99250-0314
          </a>
          . Basta dizer o que você quer (ver, corrigir ou apagar seus dados) — não
          precisa de formulário nem de justificativa.
        </p>
      </Secao>

      <Secao titulo="Mudanças nesta política">
        <p>
          Se algo mudar no que o site coleta ou faz com os dados, esta página é
          atualizada e a data no topo muda junto.
        </p>
      </Secao>
    </div>
  );
}
