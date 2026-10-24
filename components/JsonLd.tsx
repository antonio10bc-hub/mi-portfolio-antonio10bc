/** Datos estructurados para buscadores (schema.org en JSON-LD). No pinta nada. */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // `<` escapado: el JSON no puede cerrar la etiqueta script aunque un texto lo contenga.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
