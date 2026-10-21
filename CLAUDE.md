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

- `app/page.tsx` — home / landing, links into the two sections below. **It must fit in the viewport with no scrolling, footer included**: the root is `min-h-screen-safe` (never a fixed height with `overflow-hidden`, see Mobile), the hero and footer are `shrink-0`, the card grid is the only `flex-1` element, and every type size in it is a `clamp()` so it survives short viewports. Verified down to 320x568. If you add anything here, re-check that it still fits instead of assuming it does; a bad fit degrades into a scroll rather than clipping. The section counts on the cards come from `lib/photos.ts` and `lib/projects.ts`, so they stay true as content is added.
- `app/projects/page.tsx`: the games, one grid. Everything lives in the `PROJECTS: Project[]` array in `lib/projects.ts`; add a game by appending there (with a `screenshot` and a `tint`), not by writing JSX. The web projects were removed on purpose: this page is games only.
- `app/photography/page.tsx` — server component holding the page shell; the interactive gallery + lightbox is isolated in `components/PhotoGallery.tsx` (the only `"use client"` page-level code). **17 photos is not arbitrary**: the first is featured across 2 of the 3 columns, so 17 photos fill exactly 18 cells, i.e. 6 complete rows with no orphan slot. Adding or removing one leaves a gap unless you add or remove three. The photo list is `lib/photos.ts` — add a photo by dropping the file in `public/images/` and appending an entry there (the page reads the same array to show the frame count).

Content lives in `lib/`, not in the page components, so server pages and the client gallery can share it.

### Shared components

Page chrome is factored out — do not re-inline it:

- `PageBackground`: the backdrop of every page. Flat `sand` plus `.dot-grid` (in `globals.css`): a 22px grid of faint offblack dots, masked so it fades out from the top towards the middle of the viewport. Static on purpose: colour and motion live in the content (the game screenshots, the photos), never behind it. `position="fixed"` (default) or `"absolute"` (the home). It replaced the drifting colour blobs and the liquid glass; don't bring either back.
- `SectionHeader` — the solid header card on `/projects` and `/photography` (eyebrow, title, optional intro and right-hand meta). `intro` is a `ReactNode`, so a line break is expressed as real markup (`<br />`) rather than smuggled into a string; it is capped at `max-w-3xl` so the photography intro stays on one line on desktop.
- `ProjectCard`: one uniform `.surface` card per game. The top is a 16:10 **real screenshot** of the game (`public/images/projects/*.webp`, 1280x800, quality 80) on its `tint` while it loads; below it, index, name, arrow and tagline. The screenshots were taken locally from each game's own repo (`antonio10bc-hub/neobrutalist-flip` is Coinfliip, `MagicPoker`, `asciiforest`, `chaoticgolfweb`) with Playwright at 1024x640, DPR 1.25 (ASCII Forest at 1280x800, it needs the wider view), with dev badges, cookie banners and debug buttons hidden. Retake them the same way rather than drawing illustrations: the card must look like the game. The hover is a lift plus a slight zoom of the screenshot. The card's `transform` is reserved for the hover lift, so any layout or entry animation belongs on the wrapper in the page, **not** on the card.
- `BackLink`, `Footer` — `Footer` takes only a `className` for per-page spacing. It carries no year: the copyright line is deliberately just the name.
- `PageTransition` — wraps `{children}` in `app/layout.tsx` and cross-fades routes with a CSS animation (`animate-fade-in`) on a `div` keyed by `usePathname()`. It deliberately does **not** use Framer Motion: `initial={{opacity:0}}` shipped in the server HTML and left every page blank until hydration. `framer-motion` is still in `package.json` but nothing imports it.

### Layering

`app/layout.tsx` renders only the page content (`z-10`). There is no film-grain overlay and no custom cursor — both were removed on purpose; don't reintroduce them.

The lightbox in `PhotoGallery` renders through `createPortal` to `document.body` at `z-50`, outside `PageTransition`'s wrapper. It also locks `document.body.style.overflow` while open and restores the previous value on close.

### Copy

- **Never use a dash as punctuation anywhere on the site**: no em dash, no en dash, no double hyphen. Use a comma, a colon or a full stop instead. This applies to taglines, intros, metadata titles and any new copy. (`--font-inter` and friends are CSS variable names, not copy, and stay as they are.)
- Site copy is in English, including project taglines, even though the repo comments are in Spanish.
- Project taglines and stack tags describe what each site actually is; they were written after visiting the live URLs. Keep them factual rather than decorative.

### Mobile (read before adding blur, glass or hover)

The site looked fine in a narrow desktop window and broke on a real phone. The causes were rendering cost and touch semantics, not layout, so a narrow desktop window will not catch a regression here. Rules:

- **`backdrop-filter` is the most expensive thing on the page.** Only the photo lightbox (its overlay and `.glass-dark` controls) uses it now. Count the layers before adding another.
- **No `filter: blur()` on large elements.** Safari on iOS rasterises it in tiles, which showed up on a real iPhone as a hard horizontal seam across the old background.
- **Section titles use `clamp()`, never a bare `text-5xl md:text-7xl`.** "Photography" at the old fixed 48px was 346px wide inside a 310px card and spilled out of the glass on a phone. Measure the *text* with a Range, not the `h1`'s `scrollWidth`: the heading is a block, so its scrollWidth reports the container width and hides the overflow.
- **The staggered `.reveal` entry is off below `md`.** On a phone it read as the cards loading in one by one.
- **No `mix-blend-mode` anywhere.** It renders unpredictably in Safari on iOS, and having mobile and desktop compute colour differently is exactly how the two diverge. Colour comes from plain opacity, which every browser paints identically.
- **`hoverOnlyWhenSupported` is on** in `tailwind.config.ts`, so `hover:`/`group-hover:` compile inside `@media (hover: hover) and (pointer: fine)`. Without it a tap left cards stuck in their hover state. Never make something reachable *only* through hover: on a phone those rules never fire, which is why nothing on the cards depends on hover to be seen.
- **Viewport height goes through `.min-h-screen-safe`**, never a bare `h-screen`/`100svh`. It is `100vh` with a `100svh` override inside `@supports`. The override must stay in `@supports`: as two plain declarations the build's minifier drops the `100vh` fallback, which strands browsers without `svh` (iOS < 15.4) with no height at all.
- **Never pair a fixed viewport height with `overflow-hidden` on a page root.** If anything fails to fit on a real device the content is clipped with no way to scroll to it. The home uses `min-h-screen-safe` and no clipping, so a bad fit degrades into a scroll.

- **Never put `overflow-x: hidden` on `html`/`body` as an overflow safety net.** It breaks `position: fixed` descendants in Safari on iOS (the fixed background stops covering the page and leaves a seam), and it silently masks real overflow so the measurement below becomes meaningless. Fix overflow where it originates instead.

Verified with CDP under iPhone emulation (touch events, DPR 3, iOS user agent): no horizontal overflow on any route, the home fits with its footer from 1920x1080 down to 320x568, and the lightbox opens, locks the background and closes from real `touchStart`/`touchEnd`.

### Styling

- Theme colors in `tailwind.config.ts`: `bone`, `sand` (page background), `offblack`, `softblack` (secondary text), `lime`, `softgray`. Use the tokens; don't reintroduce hardcoded hex like `bg-[#EAE8E0]`.
- **Card surfaces live in `app/globals.css`**: `.surface` (solid `bone`, hairline border, barely-there shadow) for every card and header, and `.glass-dark` only for the controls floating over the photo lightbox. There is no light glass any more: over a flat background `backdrop-filter` has nothing to blur and only reads as a dirty grey. `.label` and `.chip` cover the uppercase mono microtype.
- **Tailwind only generates opacity modifiers from its scale** (…, 10, 15, 20, 25, …, 90, 95, 100). `bg-offblack/92` or `bg-sand/12` produce no CSS rule at all and fail silently — this has bitten this repo twice.
- **The `lime` token overrides Tailwind's `lime-*` scale.** `lime-300` / `lime-400` do not exist here and render as transparent in gradients; use the brand hex instead (`from-[#D4FF00]/40`).
- Entry animations use the `.reveal` class plus an inline `animationDelay` for stagger. Keep `.reveal` on a wrapper, never on an element that also animates `transform` on hover — the fill-mode would pin the transform and kill the hover.
- `globals.css` neutralises all animation/transition durations under `prefers-reduced-motion`.
- Fonts: `Inter` + `Roboto_Mono` via `next/font/google`, exposed as `--font-inter` / `--font-roboto-mono` and mapped to `font-sans` / `font-mono`.

### Images

Source photos in `public/images/` are capped at 2560px wide, quality 80. Keep new uploads in that range — the originals were 6000px / ~3.5 MB each and bloated the repo.

**`next/image` `quality` is a no-op here.** Next 16 only honors quality values listed in `images.qualities` (default `[75]`); anything else silently falls back to 75. To serve a different quality, add `images: { qualities: [...] }` to `next.config.ts` first.

`next.config.ts` pins `turbopack.root` to this directory — there is a stray `package-lock.json` in the user's home folder that Next would otherwise infer as the workspace root.

### App icon

The mark is a bone "A" in Inter 650 with the lime dot as its full stop, on `offblack`. `app/icon.png` (256, rounded corners, transparent outside) is the favicon; `app/apple-icon.png` (180) and `public/icons/icon-192.png` / `icon-512.png` are full-bleed squares because iOS and Android apply their own mask; `icon-maskable-512.png` shrinks the mark to 78% so it stays inside the 80% safe circle. `app/manifest.ts` and the `appleWebApp` / `viewport.themeColor` exports in `app/layout.tsx` make "Add to Home Screen" show it with the short name "Antonio". They were rendered with Playwright from HTML using the Inter woff2 that `next/font` bundles; regenerate all five together if the mark changes.

### Misc

`gemini.sh` is a local dev helper (not part of the app): it dumps the repo file tree plus any files passed as arguments to the macOS clipboard.
