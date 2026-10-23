import Link from "next/link";
import { Arrow } from "@/components/Hud";

export default function BackLink({ label, className = "" }: { label: string; className?: string }) {
  return (
    <Link
      href="/"
      className={`group code inline-flex w-fit items-center gap-2 border-2 border-ink px-3 py-1.5 text-[11px] text-ink
                  transition-colors duration-300 hover:bg-ink hover:text-paper ${className}`}
    >
      <Arrow direction="left" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}
