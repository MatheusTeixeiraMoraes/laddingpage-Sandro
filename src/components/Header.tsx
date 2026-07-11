import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-100 bg-brand-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-brand-purple">
          Sandro Higuti{" "}
          <span className="font-medium text-slate-700">
            Consultor Imobiliário
          </span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-brand-purple">
            Início
          </Link>
          <Link href="/sobre" className="hover:text-brand-purple">
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}
