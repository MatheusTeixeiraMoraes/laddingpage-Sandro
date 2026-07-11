"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        E-mail
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Senha
        <input
          type="password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          required
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="submit"
        disabled={carregando}
        className="rounded-full bg-brand-purple px-5 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
      >
        {carregando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
