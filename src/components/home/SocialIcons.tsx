type SocialIconsProps = {
  className?: string;
  iconClassName?: string;
};

/**
 * Redes sociais reais do Sandro (fonte única — header, footer e /sobre usam
 * esta lista). URLs sem os parâmetros de rastreamento dos apps.
 */
const REDES = [
  {
    nome: "Instagram",
    href: "https://www.instagram.com/sandrohiguti_cons_imob",
    path: "M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38Zm6.9-11.4a1.58 1.58 0 1 1-1.58-1.57 1.58 1.58 0 0 1 1.58 1.57Z",
  },
  {
    nome: "Facebook",
    href: "https://www.facebook.com/share/1CY2SxY7KG/",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z",
  },
  {
    nome: "TikTok",
    href: "https://www.tiktok.com/@sandro_higuti",
    path: "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.7a5.67 5.67 0 0 0-.77-.05A5.68 5.68 0 1 0 15.54 15V8.99a7.34 7.34 0 0 0 4.28 1.37V7.27a4.28 4.28 0 0 1-3.22-1.45Z",
  },
];

export function SocialIcons({ className = "", iconClassName = "" }: SocialIconsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {REDES.map((rede) => (
        <a
          key={rede.nome}
          href={rede.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${rede.nome} do Sandro Higuti`}
          title={rede.nome}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${iconClassName}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d={rede.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}
