/**
 * Conteúdo da página /sobre — texto escrito pelo próprio Sandro.
 * Para editar, basta trocar as strings deste arquivo.
 */

/** Corpo da bio, até a virada "o que mais me realiza não são os números". */
export const BIO_PARAGRAFOS: string[] = [
  "Nasci em Londrina (PR), mas cheguei a Sorocaba ainda com dois anos de idade. Cresci aqui, construí minha história aqui e, por isso, posso dizer com orgulho que sou sorocabano de coração.",
  "Sou filho de mãe nordestina e pai japonês, e acredito que grande parte da pessoa que me tornei nasceu dessa combinação de culturas. Da minha mãe herdei a acolhida, a simplicidade e a empatia características do povo nordestino. Do meu pai aprendi que honestidade, disciplina e respeito não são diferenciais, mas valores inegociáveis.",
  "Esses princípios sempre nortearam minha vida e hoje também definem a forma como conduzo meu trabalho.",
  "Sou formado em Publicidade e Propaganda e, em 2022, encontrei no mercado imobiliário uma profissão que uniu duas grandes paixões: comunicar pessoas e transformar vidas.",
  "Desde o primeiro atendimento percebi que vender um imóvel vai muito além de apresentar plantas, valores ou condições de financiamento. Trata-se de compreender histórias, sonhos, medos e expectativas. Afinal, para muitas famílias, a compra do primeiro imóvel representa uma das decisões mais importantes de suas vidas.",
  "Ao longo dessa jornada, tive a alegria de conquistar reconhecimento no mercado, alcançar posições de destaque em rankings de vendas e receber premiações pelo meu desempenho profissional. Sou profundamente grato por cada uma dessas conquistas.",
  "Mas, sinceramente, o que mais me realiza não são os números.",
];

/** As quatro linhas curtas "É ..." — destacadas em bloco. */
export const BIO_REALIZACOES: string[] = [
  "É receber uma mensagem meses depois dizendo que a família está feliz no novo lar.",
  "É participar da entrega das chaves.",
  "É ver clientes se transformarem em amigos.",
  "É saber que fiz parte de um capítulo tão importante da história de alguém.",
];

/** Fechamento da bio, depois do bloco de realizações. */
export const BIO_PROPOSITO =
  "Hoje, meu propósito continua sendo o mesmo do primeiro dia: oferecer um atendimento transparente, humano e responsável, ajudando cada cliente a tomar decisões com segurança e tranquilidade.";

export const BIO_FRASE_FINAL = [
  "Porque acredito que imóveis são importantes.",
  "Mas pessoas sempre serão mais.",
];

export const VALORES: { emoji: string; titulo: string }[] = [
  { emoji: "❤️", titulo: "Empatia" },
  { emoji: "🤝", titulo: "Transparência" },
  { emoji: "🛡️", titulo: "Honestidade" },
  { emoji: "🎯", titulo: "Comprometimento" },
  { emoji: "📚", titulo: "Atualização constante" },
  { emoji: "🏠", titulo: "Especialista em apartamentos na planta" },
];

/** "Alguns números" — conquistas e alcance, ao lado da bio. */
export const DESTAQUES: string[] = [
  "+100 famílias atendidas",
  "Especialista em Minha Casa Minha Vida",
  "Entrevistado pela TV TEM",
  "Melhor Corretor de Imóveis de 2025 (Pesquisa Real Data)",
  "Atendimento em Sorocaba e Região",
];

/** Faixa de números (home e /sobre usam a mesma lista). */
export const NUMEROS: { valor: string; label: string }[] = [
  { valor: "+100", label: "Famílias atendidas" },
  { valor: "+100", label: "Sonhos realizados" },
];

/** Fotos reais de clientes (entrega de chaves) em public/clientes/. */
export const FOTOS_CLIENTES: string[] = Array.from(
  { length: 11 },
  (_, i) => `/clientes/cliente-${i + 1}.jpg`,
);

// As redes sociais reais vivem em src/components/home/SocialIcons.tsx
// (fonte única usada pelo header, footer e pela página /sobre).
