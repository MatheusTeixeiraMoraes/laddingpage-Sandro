import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-6 py-24">
      <h1 className="font-heading text-2xl font-bold text-brand-navy">Painel administrativo</h1>
      <LoginForm />
    </div>
  );
}
