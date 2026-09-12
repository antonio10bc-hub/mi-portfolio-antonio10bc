const LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/antonio10bc/" },
];

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`flex flex-col gap-2 border-t border-offblack/10 pt-4
                  md:flex-row md:items-center md:justify-between ${className}`}
    >
      <span className="label normal-case tracking-[0.08em]">
        &copy; Antonio Asis Bastos de Cordoba
      </span>

      <div className="flex items-center gap-5">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="label transition-colors duration-300 hover:text-offblack"
          >
            {link.label}
          </a>
        ))}
        <span aria-hidden className="hidden h-3 w-px bg-offblack/15 md:block" />
        <span className="label">Madrid, ES</span>
      </div>
    </footer>
  );
}
