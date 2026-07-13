import { getEmpreendimentos } from "@/lib/empreendimentos";
import { Hero } from "@/components/home/Hero";
import { BuscaImoveis } from "@/components/home/BuscaImoveis";
import { ClientesAmigos } from "@/components/home/ClientesAmigos";
import { SobreMim } from "@/components/home/SobreMim";
import { LancamentosDestaque } from "@/components/home/LancamentosDestaque";
import { FaixaContato } from "@/components/home/FaixaContato";

export const dynamic = "force-dynamic";

export default async function Home() {
  const empreendimentos = await getEmpreendimentos();

  return (
    <>
      <Hero />
      <BuscaImoveis empreendimentos={empreendimentos} />
      <SobreMim />
      <ClientesAmigos />
      <LancamentosDestaque empreendimentos={empreendimentos.slice(0, 4)} />
      <FaixaContato />
    </>
  );
}
