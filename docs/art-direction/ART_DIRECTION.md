# Dirección de arte: "Cuaderno de tinta"

Referencia: un dibujo ajeno de un mago a tinta negra sobre blanco, de trazo grueso, ingenuo y algo tembloroso: sombrero cónico con manchas, nariz larga, barba, túnica ancha con cruces "+" y manchas de tinta, pies planos y varita. No se guarda en el repositorio porque no es nuestro; el mago del sitio es un dibujo propio en ese estilo.

Este documento tiene dos partes. La primera es el **prompt de dirección de arte**: un texto autocontenido que se puede pegar en cualquier herramienta (un modelo de imagen, un generador de UI, un diseñador humano) para obtener piezas coherentes con la referencia. La segunda es la **ampliación a la web**: cómo se traduce ese lenguaje a este portfolio, con tokens, componentes y reglas concretas. El código implementa la parte 2.

La identidad anterior ("Specimen File": ficha de laboratorio, semitono, códigos de barras) está en el historial de git.

---

## 1. Prompt de dirección de arte

```text
ROL
Actúa como director de arte. Vas a diseñar dentro de un lenguaje visual llamado
"Cuaderno de tinta": las páginas de la libreta de un mago que hace fotos y
juegos, dibujadas a rotulador negro sobre papel blanco.

CONCEPTO
Todo parece hecho a mano y con prisa, pero con cariño. El trazo es grueso,
ingenuo y algo tembloroso, como el de un dibujo infantil o un fanzine
fotocopiado: líneas que se pasan de las esquinas, círculos que no cierran donde
empiezan, manchas de tinta que se acumulan en los bordes. Nada es perfecto y
nada es descuidado. El humor es amable, nunca chistoso.

PALETA (estrictamente monocroma)
- Papel: #FFFFFF  fondo, siempre plano. Sin texturas, sin degradados.
- Tinta: #141214  trazos, texto, manchas.
- Lápiz: #5F5A60  notas al margen y texto secundario.
No hay color de acento. El único color permitido es el del contenido (una foto,
una captura de un juego), y va siempre a todo color.

TIPOGRAFÍA (una sola familia, a mano)
Una letra de rotulador redondeada e irregular (Shantell Sans), en dos voces:
1. Rótulo: negrita máxima, en minúsculas, con rebote (cada letra un poco por
   encima o por debajo de la línea). Palabras sueltas y muy grandes.
2. Texto: el mismo trazo, peso normal, informal, para frases y notas.
Las notas al margen van pequeñas, en lápiz y ligeramente giradas.

PERSONAJE
Un mago pequeño: sombrero cónico con la punta vencida y manchas, nariz larga,
barba en mechones, túnica ancha con cruces "+" y manchas de tinta en el bajo,
pies planos, varita. Siempre en el mismo trazo que el resto. Es el anfitrión,
no el protagonista: aparece en la portada y cuando algo sale mal.

ELEMENTOS GRÁFICOS (vocabulario cerrado)
- Cruz "+": la estrella de la túnica, como viñeta, adorno y chispa de varita.
- Marco a mano: cuatro trazos que se combean y se pasan de las esquinas.
- Círculo a mano: algo más de una vuelta alrededor de una palabra.
- Subrayado: una ida ondulada y una vuelta más corta.
- Flecha a mano, a veces con un rizo.
- Mancha de tinta: un círculo deforme y macizo, para números.
- Garabatos de objetos (cámara, mando) en el mismo trazo.

MOVIMIENTO
Los trazos se dibujan solos: al llegar a la página, al hacer scroll, al pasar
el ratón. Lo que se mueve lo hace con un rebote corto, como un trazo que se
pasa un poco y vuelve. Nada parpadea ni gira sin motivo.

COMPOSICIÓN
Mucho blanco. Elementos ligeramente torcidos, como pegados a mano en la libreta.
Las fotos van enmarcadas a mano con su pie escrito debajo.

EVITAR
Color de acento, degradados, sombras, blur, cristal, esquinas perfectas,
iconos vectoriales genéricos, tipografías geométricas, emojis, más de una
familia tipográfica.
```

---

## 2. Ampliación: el portfolio como cuaderno

El portfolio es la libreta de un mago con dos hechizos: la fotografía y los juegos. La portada es el mago lanzando chispas hacia ellos.

### Qué se conserva

Todo el contenido: el nombre, "Photography & Creative Game Design.", las dos secciones con sus recuentos, las 17 fotos con sus títulos, los juegos con su nombre, su descripción, su captura y su vídeo, el pie (copyright, idioma, Madrid). Las fotos y las capturas van **a todo color**: la regla monocroma es para la interfaz, no para el contenido.

### Tokens

| token | valor | uso |
|---|---|---|
| `paper` | `#FFFFFF` | fondo de todas las páginas y del visor de fotos |
| `ink` | `#141214` | texto, trazos, manchas |
| `mute` | `#5F5A60` | notas y texto secundario (6:1 sobre papel) |
| `smudge` | `#F1EFEC` | hueco de una foto mientras carga, nada más |

Tipografía: **Shantell Sans** variable, con sus ejes `INFM` (informalidad) y `BNCE` (rebote). `.hand-display` (800, INFM 100, BNCE 55, minúsculas) para rótulos; al pasar el ratón el rebote se invierte y las letras bailan. `.hand` para texto, `.note` para notas al margen.

### Trazos que se dibujan

Cada trazo lleva `pathLength="1"` y se "dibuja" animando su desplazamiento de guion de 1 a 0. Tres momentos: al cargar (el mago, los subrayados, los garabatos), con el scroll (los marcos de fotos y juegos, solo en escritorio) y al pasar el ratón (el círculo alrededor de un enlace). Sin animación, todo está ya dibujado.

### Páginas

- **Portada.** Una escena, con la composición de una página de juego infantil: barra mínima arriba (secciones, "antonio" pequeño, idioma), en el centro una frase a mano en mayúsculas ("antonio hace fotos / y pequeños juegos") sobre una sola obra que flota y va pasando por fotos y juegos, sostenida por la varita del mago (el "sello", con sus dos gatos), y abajo el nombre en letra tranquila, píldoras dibujadas a mano y las siete marcas de hechizo. Cabe en una pantalla sin scroll.
- **Juegos.** Cabecera de cuaderno (nota, título rotulado y subrayado, intro, índice y el garabato de un mando). Cada juego es una entrada: su número en una mancha de tinta, la captura torcida en un marco a mano, el nombre rotulado, la descripción y "jugar". Al final, "fin" con la letra pequeña común a todos los juegos.
- **Fotografía.** Cabecera con el garabato de una cámara y la ficha del visor. Cada foto, torcida en su marco, con el título escrito debajo. El visor a pantalla completa es papel, con flechas a mano.
- **404.** El mago, sin chispas y con interrogaciones sobre el sombrero: "poof!".

### Reglas de implementación

- Ningún `backdrop-filter`, `filter: blur()`, sombra ni degradado. El único filtro es el de tinta del mago: una ondulación (`feTurbulence` + `feDisplacementMap`) que solo desplaza el borde, sin desenfoque, sobre un dibujo pequeño.
- Las formas "a mano" salen de una semilla de texto, nunca de `Math.random()`: el servidor y el cliente pintan lo mismo y cada marco tiene siempre el mismo temblor.
- La decoración extra (cruces sueltas, garabatos de cabecera, índices) se oculta por debajo de `md`.
- Los rótulos en `clamp()`, siempre: la letra a mano es ancha.
