import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-brand-purple">Você está logado</h1>
      <p className="text-slate-600">
        Painel administrativo em construção — CRUD de empreendimentos entra em breve.
      </p>
      <LogoutButton />
    </div>
  );
}
