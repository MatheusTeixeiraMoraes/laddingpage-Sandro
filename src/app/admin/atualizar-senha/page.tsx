import { UpdatePasswordForm } from "@/components/admin/UpdatePasswordForm";

export default function AtualizarSenhaPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-6 py-24">
      <h1 className="text-2xl font-bold text-brand-purple">Definir nova senha</h1>
      <UpdatePasswordForm />
    </div>
  );
}
