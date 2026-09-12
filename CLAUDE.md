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

- `app/page.tsx` — home / landing, links into the two sections below. **It must fit in the viewport with no scrolling, footer included**: the root is `h-[100svh] overflow-hidden`, the hero and footer are `shrink-0`, the card grid is the only `flex-1` element, and every type size in it is a `clamp()` so it survives short viewports. Verified down to 320x568. If you add anything here, re-check that it still fits instead of assuming it does — `overflow-hidden` means overflow is silently clipped, not scrollable. The section counts on the cards come from `lib/photos.ts` and `lib/projects.ts`, so they stay true as content is added.
- `app/projects/page.tsx` — external project links, split into labelled groups (Games, then Webs). Everything lives in `lib/projects.ts`: the `PROJECTS: Project[]` array, the `CATEGORY_GROUPS` array (which decides both the groups and their order on the page) and `CATEGORY_LABEL` (the per-card display text). Add a project by appending to `PROJECTS` with a `category`, not by writing JSX; the page groups, numbers and renders it. Card numbering runs continuously across the whole page rather than restarting per group, and empty groups are dropped automatically.
- `app/photography/page.tsx` — server component holding the page shell; the interactive gallery + lightbox is isolated in `components/PhotoGallery.tsx` (the only `"use client"` page-level code). **17 photos is not arbitrary**: the first is featured across 2 of the 3 columns, so 17 photos fill exactly 18 cells, i.e. 6 complete rows with no orphan slot. Adding or removing one leaves a gap unless you add or remove three. The photo list is `lib/photos.ts` — add a photo by dropping the file in `public/images/` and appending an entry there (the page reads the same array to show the frame count).

Content lives in `lib/`, not in the page components, so server pages and the client gallery can share it.

### Shared components

Page chrome is factored out — do not re-inline it:

- `AnimatedBackground` — the blurred "blob" gradient background. `variant="full"` (6 blobs) or `"minimal"` (3); `position="fixed"` (default) or `"absolute"`. Blob classes are full literal strings in arrays so Tailwind's scanner can find them — never build these class names by concatenating fragments.
- `SectionHeader` — the glass header card on `/projects` and `/photography` (eyebrow, title, optional intro and right-hand meta). `intro` is a `ReactNode`, so a line break is expressed as real markup (`<br />`) rather than smuggled into a string; it is capped at `max-w-3xl` so the photography intro stays on one line on desktop.
- `ProjectCard` — one uniform card per project; there is no featured/large variant and no tech tags. It shows only index, arrow, category, name and tagline, so it stays short. **The hover is the colour**: two blurred accent blobs sit in the card at low opacity and surge on `group-hover`. They are capped below full opacity on purpose, because the card's own text sits over them and has to stay readable. The card's `transform` is reserved for the hover lift, so any layout or entry animation belongs on the wrapper in the page, **not** on the card.
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

- **`backdrop-filter` is the most expensive thing on the page.** One per card is fine; one per list item is not. The photo index badges each had `backdrop-blur-md`, which put **19** backdrop layers on `/photography`; they now use a solid tint and the page is down to 2. Count the layers before adding another.
- **Blur radii are halved below `md`** (`blur-[70px] md:blur-[110px]`), and the decorative blobs marked `soloEscritorio` are `hidden md:block`. Keep that split when adding blobs.
- **No `mix-blend-mode` anywhere.** Combined with the `backdrop-filter` cards it renders unpredictably in Safari on iOS, and having mobile and desktop compute colour differently is exactly how the two diverge. Colour comes from plain opacity, which every browser paints identically.
- **`hoverOnlyWhenSupported` is on** in `tailwind.config.ts`, so `hover:`/`group-hover:` compile inside `@media (hover: hover) and (pointer: fine)`. Without it a tap left cards stuck in their hover state. Never make something reachable *only* through hover: on a phone those rules never fire, which is why the project cards show their accent at rest.
- **Viewport height goes through `.min-h-screen-safe`**, never a bare `h-screen`/`100svh`. It is `100vh` with a `100svh` override inside `@supports`. The override must stay in `@supports`: as two plain declarations the build's minifier drops the `100vh` fallback, which strands browsers without `svh` (iOS < 15.4) with no height at all.
- **Never pair a fixed viewport height with `overflow-hidden` on a page root.** If anything fails to fit on a real device the content is clipped with no way to scroll to it. The home uses `min-h-screen-safe` and no clipping, so a bad fit degrades into a scroll.

Verified with CDP under iPhone emulation (touch events, DPR 3, iOS user agent): no horizontal overflow on any route, the home fits with its footer from 1920x1080 down to 320x568, and the lightbox opens, locks the background and closes from real `touchStart`/`touchEnd`.

### Styling

- Theme colors in `tailwind.config.ts`: `bone`, `sand` (page background), `offblack`, `softblack` (secondary text), `lime`, `softgray`. Use the tokens; don't reintroduce hardcoded hex like `bg-[#EAE8E0]`.
- **Liquid glass lives in `app/globals.css`**, not in utility soup: `.glass`, `.glass-strong` and `.glass-dark` (low white tint + `backdrop-filter` + an inset top light edge). `.label` and `.chip` cover the uppercase mono microtype. Reuse them instead of re-deriving a glass recipe per card.
- **Tailwind only generates opacity modifiers from its scale** (…, 10, 15, 20, 25, …, 90, 95, 100). `bg-offblack/92` or `bg-sand/12` produce no CSS rule at all and fail silently — this has bitten this repo twice.
- **The `lime` token overrides Tailwind's `lime-*` scale.** `lime-300` / `lime-400` do not exist here and render as transparent in gradients; use the brand hex instead (`from-[#D4FF00]/40`).
- Entry animations use the `.reveal` class plus an inline `animationDelay` for stagger. Keep `.reveal` on a wrapper, never on an element that also animates `transform` on hover — the fill-mode would pin the transform and kill the hover.
- The `blob` keyframes are paired with `motion-reduce:animate-none` in `AnimatedBackground`, and `globals.css` neutralises all animation/transition durations under `prefers-reduced-motion`.
- Fonts: `Inter` + `Roboto_Mono` via `next/font/google`, exposed as `--font-inter` / `--font-roboto-mono` and mapped to `font-sans` / `font-mono`.

### Images

Source photos in `public/images/` are capped at 2560px wide, quality 80. Keep new uploads in that range — the originals were 6000px / ~3.5 MB each and bloated the repo.

**`next/image` `quality` is a no-op here.** Next 16 only honors quality values listed in `images.qualities` (default `[75]`); anything else silently falls back to 75. To serve a different quality, add `images: { qualities: [...] }` to `next.config.ts` first.

`next.config.ts` pins `turbopack.root` to this directory — there is a stray `package-lock.json` in the user's home folder that Next would otherwise infer as the workspace root.

### Misc

`gemini.sh` is a local dev helper (not part of the app): it dumps the repo file tree plus any files passed as arguments to the macOS clipboard.
