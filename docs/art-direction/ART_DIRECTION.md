# Dirección de arte: "Specimen File"

Referencia: [`reference.jpg`](./reference.jpg) (póster *Project #0653*, @ctmak).

Este documento tiene dos partes. La primera es el **prompt de dirección de arte**: un texto autocontenido que se puede pegar en cualquier herramienta (un modelo de imagen, un generador de UI, un diseñador humano) para obtener piezas coherentes con la referencia. La segunda es la **ampliación a la web**: cómo se traduce ese lenguaje a este portfolio, con tokens, componentes y reglas concretas. El código implementa la parte 2.

---

## 1. Prompt de dirección de arte

```text
ROL
Actúa como director de arte. Vas a diseñar dentro de un lenguaje visual llamado
"Specimen File": la estética de una ficha técnica de laboratorio, un expediente
de catalogación o la pantalla de un instrumento de medida, impresa en papel.

CONCEPTO
Cada pieza es un expediente que documenta un espécimen. El espécimen (una
imagen) ocupa el centro y está tramado en puntos, como una impresión en
semitono de baja resolución. A su alrededor, una capa de interfaz técnica lo
mide, lo etiqueta y lo clasifica: marcos de visor, líneas de referencia,
códigos, tablas de datos, códigos de barras. La interfaz es fría y precisa;
el espécimen es orgánico. El contraste entre ambos es la pieza.

PALETA (estrictamente monocroma)
- Papel:     #FFFFFF  fondo, siempre plano. Sin degradados, sin texturas.
- Panel:     #DEDEDC  bloques grises que enmarcan o tapan parcialmente.
- Tinta:     #201E20  texto, líneas, puntos. Casi negro, nunca #000.
- Grafito:   #48444A  paneles oscuros de aviso o de acción, con texto en papel.
- Gris medio:#6B676E  texto secundario.
No hay color de acento. El único color permitido es el que trae el propio
contenido fotográfico cuando se muestra a sangre, nunca en la interfaz.

TIPOGRAFÍA (tres voces, nunca más)
1. Titular: grotesca muy condensada, peso negro (800 a 900), en minúsculas,
   interletrado negativo y SIEMPRE terminada en punto: "design." "graphics."
   Se usa para palabras sueltas, muy grandes, como etiquetas de esquina.
2. Código: monoespaciada en mayúsculas y negrita para identificadores:
   "PROJECT #0653", "X-ORCH-26", "#201E20".
3. Datos: la misma monoespaciada, en cuerpo pequeño (9 a 12 px), justificada,
   para descripciones y textos de expediente. Se acepta el espaciado irregular
   de la justificación: forma parte del carácter.

IMAGEN
- El espécimen se trama en semitono (puntos en rejilla ordenada, tamaño de
  punto visible, 2 a 4 px), en tinta sobre transparente. El fondo de la foto
  se elimina y los bordes se disuelven: la densidad de puntos cae hacia fuera.
- El espécimen puede desbordar sus marcos y cruzar paneles: la interfaz se
  monta encima, no lo encierra.

ELEMENTOS GRÁFICOS (vocabulario cerrado)
- Marcos de visor: cuatro esquinas en L, sin lados, alrededor de lo que se mide.
- Esquinas de página: L gruesas (6 a 8 px) en esquinas opuestas del formato.
- Líneas de referencia: trazo de 2 px con punto relleno en cada extremo y un
  quiebro a 45°, que conecta un texto con un punto del espécimen.
- Tres puntos "● ● ●" como cabecera de panel o separador.
- Bordes discontinuos para paneles secundarios.
- Código de barras, tabla de barras de datos, "////", columna de "×", rombos
  agrupados, glifos pixelados de 3x3: como textura de datos, nunca protagonistas.
- Corchetes de línea con quiebro en la base de la página, como regla de pie.

COMPOSICIÓN
- Formato con márgenes amplios y una fila superior de tres titulares
  repartidos (izquierda, centro, derecha) y una fila inferior equivalente.
- Rejilla de 12 columnas, asimétrica: el espécimen en el centro, bloques de
  texto y paneles anclados a los laterales y superpuestos al espécimen.
- Esquinas siempre rectas. Ningún radio, ninguna sombra difusa, ningún blur.
- Mucho blanco. Densidad en los bordes, aire en el centro.

TONO
Técnico, catalogador, ligeramente ficticio (códigos, números de expediente),
pero nunca recargado: cada elemento decorativo parece tener una función.

EVITAR
Color de acento, degradados, glassmorphism, sombras suaves, esquinas
redondeadas, ilustración vectorial, iconos genéricos, emojis, tipografías
humanistas o redondeadas, más de tres familias tipográficas.
```

---

## 2. Ampliación: el portfolio como expediente

El portfolio es un archivo de dos colecciones (fotografía y juegos). Cada página es un expediente; cada foto y cada juego, un espécimen catalogado.

### Qué se conserva

Todo el contenido: el nombre, "Photography & Creative Game Design.", las dos secciones con sus descripciones y recuentos, las 17 fotos con sus títulos, los 4 juegos con su nombre, su tagline, su enlace y **su captura real**, el pie (copyright, Instagram, Madrid). Las capturas y las fotos se muestran **a todo color**: son el contenido, y la regla de la paleta es que la interfaz es monocroma, no el contenido.

### Tokens

| token | valor | uso |
|---|---|---|
| `paper` | `#FFFFFF` | fondo de todas las páginas |
| `panel` | `#DEDEDC` | paneles grises, marco de las capturas |
| `ink` | `#201E20` | texto, líneas, bordes, puntos |
| `graphite` | `#48444A` | panel de acción oscuro |
| `mute` | `#6B676E` | texto secundario (contraste 5.4:1 sobre papel) |

Tipografía: **Archivo** variable con el eje `wdth` a 62 y peso 800 para los titulares (`.display`), **JetBrains Mono** para código y datos (`font-mono`). Nada más.

### Especímenes tramados

Dos fotos del propio archivo, tramadas con ImageMagick (semitono `h4x4a`, recortadas, fondo eliminado por niveles y bordes disueltos con un degradado radial), en `public/images/dither/`:

- `tree.png`: *Solitude* (foto 9). Espécimen de la home.
- `peak.png`: *Snow Peak* (foto 13). Espécimen de la cabecera de Fotografía.

Se sirven con `unoptimized`: la optimización de `next/image` reescala con suavizado y emborronaría los puntos.

### Páginas

- **Home (índice del archivo).** Fila superior de tres titulares. En el centro el árbol tramado; superpuestos, el nombre con línea de referencia hacia el árbol, el panel gris con marco de visor que lleva a Fotografía y el panel grafito que lleva a Proyectos. Fila inferior de pie. Cabe en una pantalla sin scroll, como antes.
- **Proyectos.** Cabecera de expediente (titular gigante, código, intro, tabla de datos y código de barras). Cada juego es una ficha: código de proyecto, captura dentro de un panel gris con marco de visor, nombre como titular, regla de tinta, tagline en monoespaciada y acción.
- **Fotografía.** Cabecera de expediente con el pico tramado. Rejilla de fotos de esquinas rectas con código de fotograma (`FR-01`) en una pestaña de tinta. El visor a pantalla completa es tinta sólida, sin blur.

### Reglas de implementación

- Ningún `border-radius` en la interfaz (salvo los puntos, que son círculos).
- Ningún `backdrop-filter`, `filter: blur()`, sombra difusa ni degradado de color.
- La decoración (códigos de barras, tablas, rombos, ×) se oculta por debajo de `md`: en un móvil no hay margen que llenar y solo añade ruido.
- Los titulares en `clamp()`, como siempre: el condensado ayuda, pero no exime.
