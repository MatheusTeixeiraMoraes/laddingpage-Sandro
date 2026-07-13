import type { Depoimento } from "@/types/depoimento";

/**
 * Avaliações REAIS do perfil do Sandro no Google (Sandro Higuti Consultor
 * Imobiliário — 5,0 · 8 avaliações), transcritas literalmente.
 *
 * Regra: só entra o que o cliente escreveu. Nada de inventar, nada de "melhorar"
 * o texto dele. Até 13/07/2026 o site publicava quatro depoimentos que eu havia
 * inventado — pessoas que não existem — e isso saiu do ar.
 *
 * O texto está como o cliente escreveu, inclusive os erros de digitação: é a
 * palavra dele, não a nossa.
 *
 * FALTAM 3 avaliações (ver PENDENCIAS.md): as de Mariele Santos e Daiane Mariano
 * aparecem cortadas no Google ("... Mais") e a de Gabriel Catto não estava
 * visível. Não entram pela metade — ou o texto inteiro, ou nada.
 */
export const depoimentos: Depoimento[] = [
  {
    id: "guilherme-augusto",
    autor: "Guilherme Augusto",
    nota: 5,
    texto:
      "Sandro é mais que um corretor, um consultor imobiliário de fato. Pode confiar que ele vai ajudar e tirar todas as dúvidas de forma clara para que o tão sonhado imóvel próprio seja realizado. Excelente profissional!",
  },
  {
    id: "mariana-oliveira",
    autor: "Mariana Oliveira",
    nota: 5,
    texto:
      "Excelente! Atencioso deste o primeiro atendimento, até finalizar todo o processo, e mesmo depois de tudo certo, ainda continua dando suporte, respondendo alguma dúvida. O melhor!!!",
  },
  {
    id: "ariane-petrovisk",
    autor: "Ariane Petrovisk",
    nota: 5,
    texto:
      "O Consultor Sandro, se tornou nosso amigo. Sempre nos ajudando em tudo. Sensacional.",
  },
  {
    id: "gustavo-bibiano",
    autor: "Gustavo Bibiano Guedes Dos Santos",
    nota: 5,
    texto: "Um ótimo corretor e que se torna no fim até um amigo",
  },
  {
    id: "vinicius-gomes",
    autor: "Vinícius Gomes",
    nota: 5,
    texto: "Atendimento sensacional, muito educado e disposto a ajudar sempre",
  },
];
