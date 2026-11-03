import Link from "next/link";
import { InkArrow } from "@/components/Ink";

/** "← volver" a mano: la flecha retrocede un poco al pasar el ratón. */
export default function BackLink({ label, className = "" }: { label: string; className?: string }) {
  return (
    <Link href="/" className={`group inline-flex w-fit items-center gap-2 text-ink ${className}`}>
      <InkArrow
        seed="back"
        direction="left"
        className="h-4 w-10 transition-transform duration-500 ease-spring group-hover:-translate-x-1.5 md:h-5 md:w-12"
      />
      <span className="hand text-base font-semibold md:text-lg">{label}</span>
    </Link>
  );
}
