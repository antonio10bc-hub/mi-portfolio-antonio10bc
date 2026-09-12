import Link from "next/link";

export default function BackLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex w-fit items-center gap-2.5 rounded-full border border-offblack/10 bg-white/40
                  px-4 py-2 font-mono text-[10px] md:text-[11px] uppercase tracking-label text-softblack
                  backdrop-blur-md transition-colors duration-300 ease-smooth
                  hover:border-offblack/25 hover:text-offblack ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3 transition-transform duration-300 ease-smooth group-hover:-translate-x-1"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      Back
    </Link>
  );
}
