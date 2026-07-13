"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** Menu de navegação do celular (o nav do desktop some abaixo de lg). */
export function MenuMobile({
  itens,
}: {
  itens: { label: string; href: string }[];
}) {
  // Cada link fecha o menu no onClick — não precisa de effect de rota.
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={aberto}
        className="flex h-10 w-10 items-center justify-center rounded-full text-brand-navy transition-colors hover:bg-brand-blush"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
          {aberto ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {aberto && (
        <>
          <div
            className="fixed inset-0 top-[68px] z-30 bg-brand-navy/30"
            onClick={() => setAberto(false)}
            aria-hidden
          />
          <nav className="absolute inset-x-0 top-full z-40 border-b border-slate-100 bg-white shadow-lg">
            <ul className="mx-auto flex max-w-6xl flex-col px-6 py-2">
              {itens.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setAberto(false)}
                    className="block border-b border-slate-50 py-3.5 font-medium text-brand-navy transition-colors hover:text-brand-pink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
