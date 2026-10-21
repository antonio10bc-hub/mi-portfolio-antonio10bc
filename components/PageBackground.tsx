/*
 * Fondo de todas las páginas: arena lisa con una retícula de puntos muy tenue
 * que se desvanece hacia abajo (.dot-grid en globals.css). Estático a propósito:
 * el color y el movimiento están en el contenido, no detrás.
 */
export default function PageBackground({
  position = "fixed",
}: {
  position?: "fixed" | "absolute";
}) {
  return (
    <div
      aria-hidden
      className={`${position === "fixed" ? "fixed" : "absolute"} inset-0 z-0 pointer-events-none bg-sand`}
    >
      <div className="dot-grid absolute inset-0" />
    </div>
  );
}
