"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { InkFrame } from "@/components/InkBox";
import { useSpell } from "@/components/SpellProvider";

export type Work = {
  kind: "photo" | "game";
  src: string;
  title: string;
  href: string;
  /** Las capturas de juegos ya son WebP de 1280px: se sirven tal cual. */
  unoptimized?: boolean;
};

/** Cada cuánto cambia la obra que flota. */
const EVERY = 4500;

/**
 * La obra que flota en el centro de la home, sostenida por la varita del mago:
 * una sola, grande, que va pasando por fotos y juegos. Cada cambio vuelve a
 * dibujar su marco a mano. Se para al pasar el ratón (o con el foco), durante el
 * minijuego y con movimiento reducido. Pulsarla lleva a su sección. Es también el
 * blanco de los hechizos sueltos (`targetRef`).
 */
export default function FloatingWork({
  works,
  labels,
  sizes,
}: {
  works: Work[];
  labels: { photo: string; game: string };
  sizes: string;
}) {
  const { active, targetRef } = useSpell();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (active || paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((n) => (n + 1) % works.length), EVERY);
    return () => window.clearInterval(id);
  }, [active, paused, works.length]);

  const work = works[index];
  const next = works[(index + 1) % works.length];

  return (
    <figure className="flex h-full w-full flex-col">
      <Link
        ref={targetRef}
        href={work.href}
        data-track="floating_work_clicked"
        data-track-kind={work.kind}
        data-track-title={work.title}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative block min-h-0 flex-1 animate-float"
      >
        {/* La clave hace que cada obra entre con su fundido y su marco recién dibujado. */}
        <span key={index} className="absolute inset-0 animate-fade-in">
          <span className="absolute inset-0 overflow-hidden bg-smudge">
            <Image src={work.src} alt={work.title} fill sizes={sizes} unoptimized={work.unoptimized} priority={index === 0} className="object-cover" />
          </span>
          <InkFrame seed={`float-${index}`} draw outset={8} width={2.8} />
        </span>
        {/* La siguiente, ya pedida y escondida: el cambio no deja un hueco gris. */}
        <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0">
          <Image src={next.src} alt="" fill sizes={sizes} unoptimized={next.unoptimized} className="object-cover" />
        </span>
      </Link>
      <figcaption key={`c-${index}`} className="mt-3 flex shrink-0 animate-fade-in items-baseline justify-center gap-2">
        <span className="hand-display text-[clamp(1.25rem,2vw,1.6rem)]">{work.title.toLowerCase()}</span>
        <span className="note">({work.kind === "photo" ? labels.photo : labels.game})</span>
      </figcaption>
    </figure>
  );
}
