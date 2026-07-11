export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-slate-600">
        <p>Sandro Higuti Consultor Imobiliário</p>
        <p className="mt-1">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
