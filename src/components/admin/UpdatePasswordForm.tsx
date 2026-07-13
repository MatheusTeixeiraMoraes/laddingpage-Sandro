"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [novaSenha, setNovaSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: novaSenha });

    setCarregando(false);

    if (error) {
      setErro("Não foi possível atualizar a senha. Tente pedir um novo link.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Nova senha
        <input
          type="password"
          value={novaSenha}
          onChange={(event) => setNovaSenha(event.target.value)}
          required
          minLength={6}
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="submit"
        disabled={carregando}
        className="rounded-full bg-brand-pink px-5 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
      >
        {carregando ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
}
