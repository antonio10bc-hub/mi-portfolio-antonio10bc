# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — run ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next` core-web-vitals + typescript)

There is no test suite configured in this repo.

## Architecture

Personal portfolio site (Antonio Asis Bastos de Cordoba), built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 3. Three static routes, no API routes, no data fetching — all content is hardcoded.

- `app/page.tsx` — home, the archive index: the halftone tree as the central specimen with the name, its leader line and the two section panels laid over it. **It must fit in the viewport with no scrolling, footer included**: the root is `min-h-screen-safe` (never a fixed height with `overflow-hidden`, see Mobile). On `md+` the stage is a 12-column grid with rows `auto / minmax(0,1fr) / auto`; it must not be three equal `1fr` rows, because the tallest row then sets the height of all three and the page overflows. Below `md` it is a column where the tree is the only `flex-1` element and shrinks to make room. Type sizes are `clamp()` with a `vh` term (`min(13vw,15vh)`) so short laptop screens fit too. Verified at 1920x1080, 1440x900, 1366x768, 1280x720, 1024x768, 768x1024, 430x932, 390x844, 375x667 and 320x568. If you add anything here, re-check that it still fits instead of assuming it does. The counts on the panels come from `lib/photos.ts` and `lib/projects.ts`.
- `app/projects/page.tsx`: the games, one grid of project files. Everything lives in the `PROJECTS: Project[]` array in `lib/projects.ts`; add a game by appending there (with a `screenshot` and a `tint`), not by writing JSX. The web projects were removed on purpose: this page is games only.
- `app/photography/page.tsx` — server component holding the page shell. **Every photo carries the paper viewfinder brackets** (four corners, like a camera focusing), with a hard 1px ink shadow so they stay visible over pale skies; the `FR-xx` tag sits beside the top-left corner, aligned with its arm, never on top of it; the interactive gallery + lightbox is isolated in `components/PhotoGallery.tsx` (the only `"use client"` page-level code). **17 photos is not arbitrary**: the first is featured across 2 of the 3 columns, so 17 photos fill exactly 18 cells, i.e. 6 complete rows with no orphan slot. Adding or removing one leaves a gap unless you add or remove three. The photo list is `lib/photos.ts` — add a photo by dropping the file in `public/images/` and appending an entry there (the page reads the same array to show the frame count).

Content lives in `lib/`, not in the page components, so server pages and the client gallery can share it.

### Art direction

The site follows the **"Specimen File"** art direction in `docs/art-direction/ART_DIRECTION.md` (the prompt plus its translation to this site; the reference poster is next to it). Read it before any visual change. In short: a lab specimen sheet printed on paper. Strictly monochrome interface (white paper, grey panels, ink, graphite), condensed lowercase headlines ending in a full stop, monospace code and data text, halftone specimens, viewfinder brackets, barcodes and data bars. **Colour only ever comes from content** (the photos and the game screenshots, always shown in full colour). No accent colour, no border radius, no soft shadows, no blur, no gradients, no glass.

### Shared components

Page chrome is factored out — do not re-inline it:

- `Footer`: the bottom row. `@antonio10bc` (the Instagram link) on the left, `madrid, es.` on the right, two kinked rules between them on `md+`, and the copyright as a mono label below. It carries no year, on purpose.
- `SectionHeader`: the file header on `/projects` and `/photography`: eyebrow, the giant title (it appends the full stop), the file `code`, `meta`, `intro` (a `ReactNode`, so line breaks are real `<br />`) and an `aside` on the right (a halftone specimen or a data block).
- `ProjectCard`: one project file per game: project code, the **real screenshot** of the game (`public/images/projects/*.webp`, 1280x800, quality 80) on its `tint` inside a grey panel with viewfinder brackets, the name as a headline, an ink rule, the tagline as data text, a "Play" action and a barcode. The screenshots were taken locally from each game's own repo (`antonio10bc-hub/neobrutalist-flip` is Coinfliip, `MagicPoker`, `asciiforest`, `chaoticgolfweb`) with Playwright at 1024x640, DPR 1.25 (ASCII Forest at 1280x800, it needs the wider view), with dev badges, cookie banners and debug buttons hidden. Retake them the same way rather than drawing illustrations: the card must look like the game. The card's own `transform` is never animated; entry animations belong on the wrapper in the page.
- `Hud`: the graphic vocabulary of the reference as small decorative components (`Brackets`, `CornerMark`, `Dots`, `Barcode`, `DataBars`, `Diamonds`, `XStack`, `PixelGlyph`, `Slashes`, `Leader`, `Arrow`). All are `aria-hidden` and paint in `currentColor`. `Barcode` and `DataBars` are derived from a text `seed` with a deterministic hash, never `Math.random()`, so the server and client HTML match. Decoration is hidden below `md`.
- `BackLink`: square ink button.
- `PageTransition` — wraps `{children}` in `app/layout.tsx` and cross-fades routes with a CSS animation (`animate-fade-in`) on a `div` keyed by `usePathname()`. It deliberately does **not** use Framer Motion: `initial={{opacity:0}}` shipped in the server HTML and left every page blank until hydration. `framer-motion` is still in `package.json` but nothing imports it.

### Halftone specimens

`public/images/dither/tree.png` ("Solitude", photo 9, the home) and `peak.png` ("Snow Peak", photo 13, the photography header) are the site's own photos printed as halftone: cropped, greyscale, levels pushed until the background goes white, edges dissolved with a radial gradient composited with `lighten`, reduced to a quarter, `-ordered-dither h4x4a`, scaled back up 400% with `-filter point`, and white made transparent. **Render them with `unoptimized`**: `next/image` resamples with smoothing and would blur the dots.

### Layering

`app/layout.tsx` renders only the page content (`z-10`). There is no film-grain overlay, no custom cursor and no top row of three headlines — all removed on purpose; don't reintroduce them.

The lightbox in `PhotoGallery` renders through `createPortal` to `document.body` at `z-50`, outside `PageTransition`'s wrapper. It also locks `document.body.style.overflow` while open and restores the previous value on close.

### Copy

- **Never use a dash as punctuation anywhere on the site**: no em dash, no en dash, no double hyphen. Use a comma, a colon or a full stop instead. This applies to taglines, intros, metadata titles and any new copy. (`--font-inter` and friends are CSS variable names, not copy, and stay as they are.)
- Site copy is in English, including project taglines, even though the repo comments are in Spanish.
- Project taglines and stack tags describe what each site actually is; they were written after visiting the live URLs. Keep them factual rather than decorative.

### Mobile (read before adding blur or hover)

The site looked fine in a narrow desktop window and broke on a real phone. The causes were rendering cost and touch semantics, not layout, so a narrow desktop window will not catch a regression here. Rules:

- **No `backdrop-filter`.** It was the most expensive thing on the page; the art direction no longer uses glass, and the lightbox overlay is solid `ink/95`.
- **No `filter: blur()` on large elements.** Safari on iOS rasterises it in tiles, which showed up on a real iPhone as a hard horizontal seam across an old background.
- **Section titles use `clamp()`, never a bare `text-5xl md:text-7xl`.** "Photography" at the old fixed 48px was 346px wide inside a 310px card and spilled out of its card on a phone. Measure the *text* with a Range, not the `h1`'s `scrollWidth`: the heading is a block, so its scrollWidth reports the container width and hides the overflow.
- **The staggered `.reveal` entry is off below `md`.** On a phone it read as the cards loading in one by one.
- **No `mix-blend-mode` anywhere.** It renders unpredictably in Safari on iOS, and having mobile and desktop compute colour differently is exactly how the two diverge. Colour comes from plain opacity, which every browser paints identically.
- **`hoverOnlyWhenSupported` is on** in `tailwind.config.ts`, so `hover:`/`group-hover:` compile inside `@media (hover: hover) and (pointer: fine)`. Without it a tap left cards stuck in their hover state. Never make something reachable *only* through hover: on a phone those rules never fire, which is why nothing on the cards depends on hover to be seen.
- **Viewport height goes through `.min-h-screen-safe`**, never a bare `h-screen`/`100svh`. It is `100vh` with a `100svh` override inside `@supports`. The override must stay in `@supports`: as two plain declarations the build's minifier drops the `100vh` fallback, which strands browsers without `svh` (iOS < 15.4) with no height at all.
- **Never pair a fixed viewport height with `overflow-hidden` on a page root.** If anything fails to fit on a real device the content is clipped with no way to scroll to it. The home uses `min-h-screen-safe` and no clipping, so a bad fit degrades into a scroll.

- **Never put `overflow-x: hidden` on `html`/`body` as an overflow safety net.** It breaks `position: fixed` descendants in Safari on iOS (the fixed background stops covering the page and leaves a seam), and it silently masks real overflow so the measurement below becomes meaningless. Fix overflow where it originates instead.

Verified with CDP under iPhone emulation (touch events, DPR 3, iOS user agent): no horizontal overflow on any route, the home fits with its footer from 1920x1080 down to 320x568, and the lightbox opens, locks the background and closes from real `touchStart`/`touchEnd`.

### Styling

- Theme colours in `tailwind.config.ts`: `paper` (page), `panel` (grey panels), `ink` (text, rules, dots), `graphite` (dark action panel), `mute` (secondary text, only on `paper`: 5.5:1 there, under 4.5:1 on `panel`). Use the tokens, never hardcoded hex.
- Type classes in `app/globals.css`: `.display` (Archivo at `wdth` 62, weight 800, lowercase, tight; the width goes through `font-variation-settings`, not `font-stretch`), `.code` (bold uppercase mono identifiers), `.label` (mono microtype) and `.datatext` (small justified mono; the uneven justification spacing is intended, it is in the reference).
- **Tailwind only generates opacity modifiers from its scale** (…, 10, 15, 20, 25, …, 90, 95, 100). `bg-ink/92` produces no CSS rule at all and fails silently — this has bitten this repo twice.
- Entry animations use the `.reveal` class plus an inline `animationDelay` for stagger. Keep `.reveal` on a wrapper, never on an element that also animates `transform` on hover — the fill-mode would pin the transform and kill the hover.
- `globals.css` neutralises all animation/transition durations under `prefers-reduced-motion`.
- Fonts: `Archivo` (with the `wdth` axis) + `JetBrains_Mono` via `next/font/google`, exposed as `--font-archivo` / `--font-jetbrains-mono` and mapped to `font-sans` / `font-mono`. Two families, never more.

### Images

Source photos in `public/images/` are capped at 2560px wide, quality 80. Keep new uploads in that range — the originals were 6000px / ~3.5 MB each and bloated the repo.

**`next/image` `quality` is a no-op here.** Next 16 only honors quality values listed in `images.qualities` (default `[75]`); anything else silently falls back to 75. To serve a different quality, add `images: { qualities: [...] }` to `next.config.ts` first.

`next.config.ts` pins `turbopack.root` to this directory — there is a stray `package-lock.json` in the user's home folder that Next would otherwise infer as the workspace root.

### App icon

The mark is the home specimen on its own: "Solitude" (photo 9), the umbrella pine, printed as halftone in `ink` on white paper. No letter: a version with the canopy crowning an "A" was tried and rejected. To make it read as a tree at icon size the tree is isolated more aggressively than in `tree.png`: a 1100px square crop of the photo, greyscale, levels 8% to 62%, and a mask that keeps everything above the canopy line plus a hand-drawn trunk polygon (so the ground and the bushes either side of the trunk disappear), then trimmed and centred with a 12% margin. **Each size is dithered natively** (`h4x4a`) at a cell count that divides it evenly, so every dot is a whole number of pixels: `icon-512.png` and `icon.png` (256) at 128 cells, `icon-192.png` at 96, `apple-icon.png` (180) at 90, and `icon-maskable-512.png` at 100 cells drawn into 400px so it stays inside the 80% safe circle. `app/favicon.ico` (16 + 32) is dithered directly at 1 cell per pixel with `o2x2`: a little pixel tree, which is all that survives at tab size. `app/manifest.ts` and the `appleWebApp` / `viewport.themeColor` exports in `app/layout.tsx` make "Add to Home Screen" show it with the short name "Antonio". Regenerate all six files together if the mark changes.

### Misc

`gemini.sh` is a local dev helper (not part of the app): it dumps the repo file tree plus any files passed as arguments to the macOS clipboard.
