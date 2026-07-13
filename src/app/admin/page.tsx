import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-brand-navy">Você está logado</h1>
      <p className="text-slate-600">
        Painel administrativo em construção — CRUD de empreendimentos entra em breve.
      </p>
      <Link
        href="/admin/atualizar-senha"
        className="text-sm font-medium text-brand-pink hover:underline"
      >
        Trocar senha
      </Link>
      <LogoutButton />
    </div>
  );
}
