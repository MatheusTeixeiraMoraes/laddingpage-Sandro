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
 * FALTA 1 avaliação (ver PENDENCIAS.md): a de Gabriel Catto, que não estava
 * visível. Não entra pela metade — ou o texto inteiro, ou nada.
 */
export const depoimentos: Depoimento[] = [
  {
    id: "mariele-santos",
    autor: "Mariele Santos",
    nota: 5,
    quando: "2026-05",
    texto:
      "Queria deixar um feedback sobre o Sandro, que nos ajudou na compra do nosso apartamento. Ele foi simplesmente incrível do começo ao fim: super atencioso, paciente e sempre disposto a explicar tudo com calma, o que fez toda diferença nesse processo tão importante.\nAlém de ser um ótimo profissional, ele tem um jeito leve e acolhedor que faz você se sentir à vontade é aquele tipo de pessoa que você já vira amigo logo de cara",
  },
  {
    id: "daiane-mariano",
    autor: "Daiane Mariano",
    nota: 5,
    quando: "2026-05",
    texto:
      "O Sandro faz jus ao slogan dele: “Amigos Clientes”, levando a sério o sonho das pessoas.\nO diferencial dele é a transparência e a humanidade no atendimento. Você sente que ele realmente se importa em encontrar o melhor caminho, e não apenas em fechar uma venda. E sei o quanto ele se dedica para que cada pessoa se sinta segura e acolhida, para investir nesse sonho.\nEntão, para quem busca um atendimento humano e de confiança, o conceito “Amigos Clientes” resume perfeitamente a experiência com ele!",
  },
  {
    id: "guilherme-augusto",
    autor: "Guilherme Augusto",
    nota: 5,
    quando: "2026-05",
    texto:
      "Sandro é mais que um corretor, um consultor imobiliário de fato. Pode confiar que ele vai ajudar e tirar todas as dúvidas de forma clara para que o tão sonhado imóvel próprio seja realizado. Excelente profissional!",
  },
  {
    id: "mariana-oliveira",
    autor: "Mariana Oliveira",
    nota: 5,
    quando: "2026-05",
    texto:
      "Excelente! Atencioso deste o primeiro atendimento, até finalizar todo o processo, e mesmo depois de tudo certo, ainda continua dando suporte, respondendo alguma dúvida. O melhor!!!",
  },
  {
    id: "ariane-petrovisk",
    autor: "Ariane Petrovisk",
    nota: 5,
    quando: "2026-05",
    texto:
      "O Consultor Sandro, se tornou nosso amigo. Sempre nos ajudando em tudo. Sensacional.",
  },
  {
    id: "gustavo-bibiano",
    autor: "Gustavo Bibiano Guedes Dos Santos",
    nota: 5,
    quando: "2026-05",
    texto: "Um ótimo corretor e que se torna no fim até um amigo",
  },
  {
    id: "vinicius-gomes",
    autor: "Vinícius Gomes",
    nota: 5,
    quando: "2026-05",
    texto: "Atendimento sensacional, muito educado e disposto a ajudar sempre",
  },
];
