"use client";

import type { Zona } from "@/types/empreendimento";

const OPCOES: { value: Zona | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "norte", label: "Norte" },
  { value: "sul", label: "Sul" },
  { value: "leste", label: "Leste" },
  { value: "oeste", label: "Oeste" },
  { value: "central", label: "Central" },
  { value: "votorantim", label: "Votorantim" },
];

type RegiaoTabsProps = {
  value: Zona | "todas";
  onChange: (value: Zona | "todas") => void;
};

export function RegiaoTabs({ value, onChange }: RegiaoTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPCOES.map((opcao) => (
        <button
          key={opcao.value}
          type="button"
          onClick={() => onChange(opcao.value)}
          className={
            opcao.value === value
              ? "inline-flex items-center gap-1.5 rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white"
              : "inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-pink hover:text-brand-pink"
          }
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {opcao.label}
        </button>
      ))}
    </div>
  );
}
