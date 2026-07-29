# Stremio — Landing Page (Portfolio Demo)

A conversion-focused, long-form landing page promoting Stremio, built as a front-end
design exercise. **Not an official Stremio site** and not affiliated with Stremio,
Netflix or Disney+.

## Stack

- **React 19 + TypeScript**, built with **Vite 6**
- **CSS Modules** per component, plus one global token layer (`src/styles/global.css`)
- **Zero runtime dependencies** beyond React — animations use native
  `IntersectionObserver` and `requestAnimationFrame`

## Running it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Regenerate the raster icons after editing the mark:

```bash
npm run icons
```

## Structure

```
src/
  components/     One component + one CSS module per section
  hooks/          useReveal (scroll fade-in), useParallax
  i18n/           Typed en/es dictionaries + LanguageProvider
  data/posters.ts Hero catalog: IMDb ids, gradients, progress
  styles/global.css  Design tokens, reset, shared utilities
public/           favicon.svg + generated PNGs and OG image
scripts/          generate-icons.mjs (dependency-free PNG renderer)
```

## Branding

The play mark is defined once as vector geometry and used in three places that
must stay in sync: `public/favicon.svg`, `src/components/Logo.tsx` (nav, hero
mockup, footer) and `scripts/generate-icons.mjs`.

It is a two-ink stamp: a square-cornered diamond with the play triangle knocked
out of it. In the page the mark is a single path with `fill-rule: evenodd` taking
`currentColor`, so it reverses with whatever block it sits in; in the icons the
knockout is filled with paper instead, since a transparent wedge is unreliable
against unknown tab and plate backgrounds.

`npm run icons` renders the raster variants — `favicon-32.png`,
`favicon-180.png`, `apple-touch-icon.png` (on a paper plate, since iOS composites
transparency over black) and `og-image.png` at 1200×630 on ink. The script has no
dependencies: it draws the mark with signed distance fields, supersamples 4× per
axis for antialiasing, and encodes PNG directly using node's built-in `zlib`.

**Before deploying:** `og:image` and `twitter:image` in `index.html` are
root-relative. Most social scrapers require an absolute URL, so prefix them with
the deployed origin.

## Design notes

**The system: printed matter.** The page is set as a piece of film-press
editorial — warm paper (`#f2ece1`), black ink, one vermilion, and rules instead of
cards. Four constraints hold it together, and everything else follows from them:

- structure is drawn with 1px rules, never with shadows or tinted panels;
- corners are square (`--radius: 2px`, used only where a raw edge would look
  like a bug);
- colour is ink, paper and red — nothing is a gradient;
- display type is condensed uppercase (Archivo at `wdth 75`), running text is a
  serif (Source Serif 4). Labels are the same grotesque at normal width,
  uppercase and tracked.

Deliberately single-mode. A reversible light/dark palette pushes every token
towards neutral grey, which is precisely what makes a page look unauthored; this
one only works as ink on paper. Where the page needs to reverse — the closing
call to action and the footer — a single `.on-ink` class redefines the same
tokens, so anything nested inside inverts without knowing it has been flipped.

Sections are numbered by a CSS counter on `.eyebrow`, so they read as parts of one
printed piece rather than as interchangeable blocks, and the shared `.section-head`
sets the title in the left column with the lead hanging in the right one — the
asymmetry replaces the centred eyebrow/title/lead stack.

**Scroll animation.** `useReveal` attaches a one-shot `IntersectionObserver` per
element and toggles an `.is-visible` class; the transition lives in CSS. The
`<Reveal>` wrapper adds a `delay` prop for staggering grids. `useParallax` writes a
`--parallax` custom property from an rAF-throttled scroll listener, letting each
consumer decide how much offset to apply — currently just the hero mockup.

**Reveal failsafe.** Because every section starts at `opacity: 0`, a browser context
where `IntersectionObserver` never delivers (page rendered while hidden, prerender
passes, some embedded webviews) would show a blank page. If no element has revealed
2s after mount, `useReveal` sets `.reveal-failsafe` on `<html>`, which forces all
content visible. Content is never permanently hidden.

**Motion preferences.** `prefers-reduced-motion: reduce` short-circuits the reveal to
visible, disables parallax, and neutralises transitions globally.

**Hero imagery.** Poster artwork is hotlinked from `images.metahub.space`, the CDN
behind **Cinemeta** — Stremio's own public, key-less metadata add-on, addressed by
IMDb id (`src/data/posters.ts`). Nothing is redistributed from this repo and no API
key is needed. Every card keeps a gradient fallback underneath, so a slow or
unreachable CDN degrades to a designed cover rather than an empty box; the `<img>`
fades in on load and removes itself on error.

Cards set `container-type: inline-size` so their typography scales in `cqi` units
with the card, with a `max()` floor to stay legible at the 3-column mobile layout.
The "Continue watching" row carries progress bars.

**Hero backdrop.** A poster wall stacks down the right margin behind the claim,
using six titles that deliberately don't appear in the catalog below. Each tile is
lightly rotated, blurred 2–3.5px and drifts at its own `depth` against the shared
parallax offset. Tiles are greyscaled and composited with `mix-blend-mode: multiply`,
so the paper tone comes *through* the artwork instead of the artwork sitting on
top of it — that is what makes them read as printed rather than pasted.

The composition is asymmetric on purpose: the claim is set flush left and the wall
occupies the opposite margin. One rail, not two.

Three layout constraints, each of which was a real collision before it was fixed:

- **The rail is anchored to the text measure, not the viewport.** The backdrop is
  capped at `--page-max` and centred, so the gap between the claim and the first
  poster stays constant as the window widens instead of collapsing.
- **The whole claim block is capped at 54% of the column** once the rail appears
  (≥1000px), rather than each element being capped separately. That is what keeps
  the clearance identical in English and Spanish, whose copy runs longer.
- **The display scale is capped by the longest word, not by the box.** Condensed
  caps overflow their measure as a single unbreakable unit — "EVERYTHING" at 144px
  is 769px wide — so `--fs-display` is bounded to keep that word inside the free
  column.

Tile tops are percentages of the backdrop while tile heights come from viewport
*width*, so on a short, wide window the lowest tiles used to fall past the scrim
and hang below the wall at full strength. `top` is therefore clamped with `min()`
against the tile's own height plus its halo.

Below 1000px the rail would sit on top of the headline, so the whole layer is
`display: none` — which also means those six images are never fetched on phones.

> Cover art remains the property of its respective rights holders. It is fine for a
> demo that credits its source, but do not treat this as a licence to redistribute
> the images.

## Languages

English and Spanish, switched by the language button in the header (English default).

Every string lives in `src/i18n/en.ts` and `src/i18n/es.ts`, both typed against the
`Dictionary` shape in `src/i18n/types.ts` — a missing translation is a compile
error, not a blank spot on the page. `LanguageProvider` holds the active language
and mirrors it onto `<html lang>` and `document.title`; components read it with
`useContent()`, so nothing is prop-drilled.

Poster titles, years and badges are language-independent (proper nouns and codes);
only `genre` is translated, through the `genres` map in each dictionary. Prices in
the comparison table stay in USD in both languages, with the note saying so —
inventing regional pricing would have made the table inaccurate.

## Verified

Type-checks and builds clean. Exercised in-browser: language switch (markup lang,
title and every section), the reveal failsafe, and all 18 poster URLs resolving
against Cinemeta.

Hero backdrop collision-tested at 1000 / 1280 / 1920px in both languages by
measuring actual glyph rectangles (`Range.getClientRects`) for every element of the
claim against each tile's box — clearance is 96–154px throughout, and no tile falls
past the bottom of the wall at any window height. No horizontal page scroll; the
comparison table scrolls inside its own container.

Contrast is held above 4.5:1 for every text/stock pair in the palette, including
the 12px uppercase labels: ink on paper 16:1, secondary 7.4:1, tertiary 5.3:1 on
paper and 4.7:1 on the darker band, vermilion 5.1:1 and 4.6:1. Both the tertiary
grey and the red were darkened from their first values to clear that bar.
