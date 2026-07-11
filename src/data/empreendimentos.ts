import type { Empreendimento } from "@/types/empreendimento";

export const empreendimentos: Empreendimento[] = [
  {
    id: "1",
    nome: "Residencial Jardim das Flores",
    tipo: "apartamento",
    bairro: "Vila Prado",
    plantas: [
      {
        id: "1-sem-suite",
        metragem: 44,
        comSuite: false,
        dormitorios: 2,
        vagas: 1,
        preco: 280000,
        fotos: ["Sala", "Quarto", "Planta baixa"],
      },
      {
        id: "1-com-suite",
        metragem: 44,
        comSuite: true,
        dormitorios: 2,
        vagas: 1,
        preco: 320000,
        fotos: ["Sala", "Suíte", "Planta baixa"],
      },
    ],
  },
  {
    id: "2",
    nome: "Edifício Bela Vista",
    tipo: "apartamento",
    bairro: "Centro",
    plantas: [
      {
        id: "2-65",
        metragem: 65,
        comSuite: false,
        dormitorios: 2,
        vagas: 1,
        preco: 420000,
        fotos: ["Sala", "Cozinha", "Planta baixa"],
      },
      {
        id: "2-85",
        metragem: 85,
        comSuite: true,
        dormitorios: 3,
        vagas: 2,
        preco: 520000,
        fotos: ["Sala", "Suíte", "Varanda", "Planta baixa"],
      },
    ],
  },
  {
    id: "3",
    nome: "Casa Recanto Verde",
    tipo: "casa",
    bairro: "Chácara Elisa",
    plantas: [
      {
        id: "3-unica",
        metragem: 180,
        comSuite: true,
        dormitorios: 4,
        vagas: 3,
        preco: 890000,
        fotos: ["Fachada", "Sala", "Suíte", "Quintal"],
      },
    ],
  },
  {
    id: "4",
    nome: "Studio Central",
    tipo: "apartamento",
    bairro: "Centro",
    plantas: [
      {
        id: "4-unica",
        metragem: 32,
        comSuite: false,
        dormitorios: 1,
        vagas: 0,
        preco: 210000,
        fotos: ["Ambiente integrado", "Planta baixa"],
      },
    ],
  },
  {
    id: "5",
    nome: "Sala Comercial Prime Office",
    tipo: "comercial",
    bairro: "Vila Prado",
    plantas: [
      {
        id: "5-unica",
        metragem: 45,
        comSuite: false,
        dormitorios: 0,
        vagas: 1,
        preco: 280000,
        fotos: ["Sala principal", "Recepção", "Planta baixa"],
      },
    ],
  },
];
