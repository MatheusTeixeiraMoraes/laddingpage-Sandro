"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onOpenFilters: () => void;
};

export function SearchBar({ value, onChange, onOpenFilters }: SearchBarProps) {
  return (
    <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nome ou bairro..."
        className="flex-1 border-none bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
      />
      <button
        type="button"
        onClick={onOpenFilters}
        aria-label="Abrir filtros"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-white transition-colors hover:bg-purple-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 9h12M10 15h4" />
        </svg>
      </button>
    </div>
  );
}
