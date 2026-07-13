function EscudoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.9 7.5 10 4.3-1.1 7.5-5.4 7.5-10v-6L12 2.5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.8 12 2.2 2.2 4.2-4.4" />
    </svg>
  );
}

export function AvisoValores() {
  return (
    <section className="bg-white pb-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center gap-5 rounded-2xl border border-brand-pink/30 bg-brand-navy px-6 py-6 sm:px-8">
          <span className="hidden shrink-0 text-brand-pink sm:block" aria-hidden>
            <EscudoIcon />
          </span>
          <p className="text-sm leading-relaxed text-slate-300">
            Os valores e condições comerciais apresentados neste site são
            meramente informativos e referem-se às unidades disponíveis no
            momento da atualização. Os preços, disponibilidade e condições de
            pagamento podem ser alterados pela construtora sem aviso prévio.
            Consulte sempre as condições vigentes no momento da negociação.
          </p>
        </div>
      </div>
    </section>
  );
}
