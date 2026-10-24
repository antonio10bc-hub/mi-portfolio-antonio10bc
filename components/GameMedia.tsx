"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/*
 * La captura del juego y, encima, su vídeo en bucle (sin sonido). La captura es el
 * primer fotograma y el respaldo: el vídeo no se descarga hasta que la ficha está en
 * pantalla, se pausa al salir de ella y aparece con un fundido cuando ya se reproduce,
 * así nunca hay un hueco negro. Con movimiento reducido o ahorro de datos no se carga.
 * Dos versiones: WebM (VP9) primero, que reproducen Chrome, Firefox y Android aunque
 * no traigan H.264, y MP4 (H.264) para Safari; el navegador toma la primera que puede.
 */
export default function GameMedia({
  screenshot,
  video,
  alt,
  priority,
}: {
  screenshot: string;
  video?: string;
  alt: string;
  priority: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Las fuentes llevan la dirección en data-src hasta que la ficha se ve.
          if (!el.dataset.loaded) {
            el.querySelectorAll("source").forEach((s) => s.setAttribute("src", s.dataset.src!));
            el.dataset.loaded = "1";
            el.load();
          }
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video]);

  return (
    <>
      <Image
        src={screenshot}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        className="object-cover"
      />
      {video && (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          preload="none"
          onPlaying={(e) => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500"
        >
          <source data-src={`${video}.webm`} type="video/webm" />
          <source data-src={`${video}.mp4`} type="video/mp4" />
        </video>
      )}
    </>
  );
}
