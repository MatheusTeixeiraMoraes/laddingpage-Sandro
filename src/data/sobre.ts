/**
 * Conteúdo da página /sobre.
 *
 * O texto da bio é um RASCUNHO escrito a partir do que já sabemos do Sandro
 * (especialista em MCMV em Sorocaba, atendimento humanizado, CRECI 278922).
 * Ele deve revisar e ajustar — é só editar as strings deste arquivo.
 */

export const BIO_PARAGRAFOS: string[] = [
  "Sou Sandro Higuti, consultor imobiliário em Sorocaba e região, especialista em apartamentos na planta e no programa Minha Casa Minha Vida.",
  "Entrei nesse mercado com uma convicção simples: comprar um imóvel é uma das decisões mais importantes da vida de uma família — e ninguém deveria tomar essa decisão no escuro, com pressa ou com meia informação.",
  "Por isso atendo do jeito que eu gostaria de ser atendido: explico o financiamento em português claro, mostro o que realmente cabe no seu bolso e acompanho cada etapa até a chave estar na sua mão. Sem promessa que não se cumpre.",
  "O que mais me orgulha é o resultado disso: a maior parte dos meus clientes vira amigo. Muitos voltam anos depois — agora para investir, ou para indicar um parente. É isso que me faz levantar todo dia.",
];

export const VALORES: { titulo: string; descricao: string }[] = [
  {
    titulo: "Atendimento humanizado",
    descricao: "Você fala comigo, não com um robô. Do primeiro oi até a entrega das chaves.",
  },
  {
    titulo: "Transparência total",
    descricao: "Custos, prazos e condições explicados antes de você assinar qualquer coisa.",
  },
  {
    titulo: "Especialista em MCMV",
    descricao: "Conheço as regras do programa e o que muda de verdade na sua parcela.",
  },
  {
    titulo: "Acompanhamento completo",
    descricao: "Financiamento, documentação e obra — não te deixo sozinho no meio do caminho.",
  },
];

// Números representativos — o Sandro precisa confirmar (ver PENDENCIAS.md).
export const NUMEROS: { valor: string; label: string }[] = [
  { valor: "+250", label: "Famílias atendidas" },
  { valor: "+150", label: "Sonhos realizados" },
  { valor: "100%", label: "Comprometimento" },
];

/** Fotos reais de clientes (entrega de chaves) em public/clientes/. */
export const FOTOS_CLIENTES: string[] = [
  "/clientes/cliente-1.jpg",
  "/clientes/cliente-2.jpg",
  "/clientes/cliente-3.jpg",
  "/clientes/cliente-4.jpg",
  "/clientes/cliente-5.jpg",
  "/clientes/cliente-6.jpg",
];

// As redes sociais reais vivem em src/components/home/SocialIcons.tsx
// (fonte única usada pelo header, footer e pela página /sobre).
