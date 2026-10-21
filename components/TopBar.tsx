import Link from "next/link";

type Slot = { label: string; href?: string };

/**
 * Fila superior de tres titulares repartidos (izquierda, centro, derecha), como
 * "design. / wow-marathon. / graphics." en la referencia. El punto final va en
 * el texto de cada titular.
 */
export default function TopBar({ left, center, right }: { left: Slot; center: Slot; right: Slot }) {
  const slot = ({ label, href }: Slot, align: string) => {
    const className = `display text-[clamp(1.125rem,3vw,2.25rem)] ${align}`;
    return href ? (
      <Link href={href} className={`${className} transition-opacity duration-300 hover:opacity-60`}>
        {label}
      </Link>
    ) : (
      <span className={className}>{label}</span>
    );
  };

  return (
    <header className="grid shrink-0 grid-cols-3 items-baseline gap-3 text-ink">
      {slot(left, "justify-self-start")}
      {slot(center, "justify-self-center text-center")}
      {slot(right, "justify-self-end text-right")}
    </header>
  );
}
