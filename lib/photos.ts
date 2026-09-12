export type Photo = {
  id: number;
  src: string;
  alt: string;
  title: string;
};

/** Añadir una foto: dejar el archivo en public/images/ y sumar una entrada aquí. */
export const PHOTOS: Photo[] = [
  { id: 1, src: "/images/foto3.jpg", alt: "Ciudad de noche", title: "City Nights" },
  { id: 4, src: "/images/foto4.jpg", alt: "Río urbano", title: "Urban River" },
  { id: 7, src: "/images/foto7.jpg", alt: "Lago y montañas", title: "Lake Mirror" },
  { id: 8, src: "/images/foto8.jpg", alt: "Picos rocosos", title: "Rocky Peaks" },
  { id: 9, src: "/images/foto9.jpg", alt: "Árbol solitario", title: "Solitude" },
  { id: 10, src: "/images/foto10.jpg", alt: "Pueblo medieval", title: "Old Town" },
  { id: 11, src: "/images/foto11.jpg", alt: "Acantilado", title: "Cliffside" },
  { id: 12, src: "/images/foto12.jpg", alt: "Montaña abierta", title: "Highlands" },
  { id: 13, src: "/images/foto13.jpg", alt: "Nieve B&N", title: "Snow Peak" },
  { id: 14, src: "/images/foto14.jpg", alt: "Niebla", title: "Misty Mood" },
  { id: 15, src: "/images/foto15.jpg", alt: "Colina verde", title: "Green Hill" },
  { id: 16, src: "/images/foto16.jpg", alt: "Tormenta", title: "Storm Horizon" },
  { id: 17, src: "/images/foto17.jpg", alt: "Rayos de sol", title: "Sun Rays" },
  { id: 18, src: "/images/foto18.jpg", alt: "Valle", title: "The Valley" },
  { id: 19, src: "/images/foto19.jpg", alt: "Karst oscuro", title: "Dark Karst" },
  { id: 20, src: "/images/foto20.jpg", alt: "Lineas", title: "Abstract Lines" },
  { id: 21, src: "/images/foto21.jpg", alt: "Tierra", title: "Earth Texture" },
];
