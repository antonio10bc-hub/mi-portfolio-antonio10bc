export type Photo = {
  id: number;
  src: string;
  /** Texto alternativo en inglés y en español */
  alt: string;
  altEs: string;
  title: string;
};

/** Añadir una foto: dejar el archivo en public/images/ y sumar una entrada aquí. */
export const PHOTOS: Photo[] = [
  { id: 1, src: "/images/foto3.jpg", alt: "City at night", altEs: "Ciudad de noche", title: "City Nights" },
  { id: 4, src: "/images/foto4.jpg", alt: "Urban river", altEs: "Río urbano", title: "Urban River" },
  { id: 7, src: "/images/foto7.jpg", alt: "Lake and mountains", altEs: "Lago y montañas", title: "Lake Mirror" },
  { id: 8, src: "/images/foto8.jpg", alt: "Rocky peaks", altEs: "Picos rocosos", title: "Rocky Peaks" },
  { id: 9, src: "/images/foto9.jpg", alt: "Lone tree", altEs: "Árbol solitario", title: "Solitude" },
  { id: 10, src: "/images/foto10.jpg", alt: "Medieval town", altEs: "Pueblo medieval", title: "Old Town" },
  { id: 11, src: "/images/foto11.jpg", alt: "Cliff", altEs: "Acantilado", title: "Cliffside" },
  { id: 12, src: "/images/foto12.jpg", alt: "Open mountain", altEs: "Montaña abierta", title: "Highlands" },
  { id: 13, src: "/images/foto13.jpg", alt: "Snow, black and white", altEs: "Nieve B&N", title: "Snow Peak" },
  { id: 14, src: "/images/foto14.jpg", alt: "Fog", altEs: "Niebla", title: "Misty Mood" },
  { id: 15, src: "/images/foto15.jpg", alt: "Green hill", altEs: "Colina verde", title: "Green Hill" },
  { id: 16, src: "/images/foto16.jpg", alt: "Storm", altEs: "Tormenta", title: "Storm Horizon" },
  { id: 17, src: "/images/foto17.jpg", alt: "Sun rays", altEs: "Rayos de sol", title: "Sun Rays" },
  { id: 18, src: "/images/foto18.jpg", alt: "Valley", altEs: "Valle", title: "The Valley" },
  { id: 19, src: "/images/foto19.jpg", alt: "Dark karst", altEs: "Karst oscuro", title: "Dark Karst" },
  { id: 20, src: "/images/foto20.jpg", alt: "Lines", altEs: "Líneas", title: "Abstract Lines" },
  { id: 21, src: "/images/foto21.jpg", alt: "Earth", altEs: "Tierra", title: "Earth Texture" },
];
