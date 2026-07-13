import type { Empreendimento } from "../types/empreendimento";
import { anoDeEntrega } from "./entrega.ts";

const PASSO_PRECO = 50_000;
const PASSO_METRAGEM = 5;

/**
 * As opções dos seletores saem do estoque real, não de uma lista fixa. Uma
 * lista fixa começando em R$ 100 mil daria três opções que devolvem os mesmos
 * imóveis (o mais barato é 219 mil) — e quebraria no dia em que entrar um
 * imóvel de 800 mil.
 */
function faixa(valores: number[], passo: number): { min: number[]; max: number[] } {
  if (valores.length === 0) return { min: [], max: [] };

  const menor = Math.floor(Math.min(...valores) / passo) * passo;
  const maior = Math.ceil(Math.max(...valores) / passo) * passo;

  const opcoes: number[] = [];
  for (let v = menor; v <= maior; v += passo) opcoes.push(v);

  // O maior "a partir de" e o menor "até" não filtram nada sozinhos: todo
  // imóvel custa mais que o piso e menos que o teto.
  return { min: opcoes.slice(0, -1), max: opcoes.slice(1) };
}

export function faixasDePreco(empreendimentos: Empreendimento[]) {
  const precos = empreendimentos.map((e) => e.precoAPartirDe);
  return faixa(precos, PASSO_PRECO);
}

export function faixasDeMetragem(empreendimentos: Empreendimento[]) {
  const metragens = empreendimentos.flatMap((e) => e.plantas.map((p) => p.metragem));
  return faixa(metragens, PASSO_METRAGEM);
}

/** Anos que têm ao menos um imóvel, em ordem. "Pronto" não é ano. */
export function anosDeEntrega(empreendimentos: Empreendimento[]): number[] {
  const anos = empreendimentos
    .map((e) => anoDeEntrega(e.entregaEm))
    .filter((ano): ano is number => ano !== null);

  return [...new Set(anos)].sort((a, b) => a - b);
}

/** Existe algum imóvel pronto para morar? Se não, a opção nem aparece. */
export function temProntoParaMorar(empreendimentos: Empreendimento[]): boolean {
  return empreendimentos.some((e) => e.entregaEm === null);
}

/** Maior número de dormitórios do estoque, para não oferecer "4+" sem imóvel. */
export function maxDormitorios(empreendimentos: Empreendimento[]): number {
  const dorms = empreendimentos.flatMap((e) => e.dormitorios);
  return dorms.length === 0 ? 0 : Math.max(...dorms);
}

/** Maior número de pontos de ar-condicionado informado no estoque. */
export function maxPontosAr(empreendimentos: Empreendimento[]): number {
  const pontos = empreendimentos
    .map((e) => e.pontosAr)
    .filter((p): p is number => p !== null);

  return pontos.length === 0 ? 0 : Math.max(...pontos);
}
