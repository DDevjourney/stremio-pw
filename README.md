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

Check every palette pair against WCAG 4.5:1 (run this after touching any token):

```bash
npm run check:contrast
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
  styles/global.css  Design tokens, reset, shared utilities, the rail
public/           favicon.svg + generated PNGs and OG image
scripts/          generate-icons.mjs (dependency-free PNG renderer)
                  check-contrast.mjs (WCAG gate over the real tokens)
```

## Branding

The play mark is defined once as vector geometry and used in three places that
must stay in sync: `public/favicon.svg`, `src/components/Logo.tsx` (nav, hero
monitor bezel, footer) and `scripts/generate-icons.mjs`.

It is a two-value stamp: a square-cornered diamond with the play triangle knocked
out of it. In the page the mark is a single path with `fill-rule: evenodd` taking
`currentColor`, so it takes the colour of whatever panel it is mounted on; in the
icons the knockout is filled with `--silk` (`#dfe4e0`) instead, since a
transparent wedge is unreliable against unknown tab and plate backgrounds. The
mark itself is `--sig-stream` (`#6cc877`) and the plate is the chassis
(`#1f2a2e`) — the same three values the page uses, not a separate icon palette.

`Logo` takes an optional `decorative` prop. It drops `role="img"` and
`aria-label` for `aria-hidden="true"`, and is set at the nav and footer brand
links, where the mark sits inside an `<a>` that already contains the word
"Stremio" — without it a screen reader announces the name twice.

`npm run icons` renders the raster variants — `favicon-32.png`,
`favicon-180.png`, `apple-touch-icon.png` (on a light plate, since iOS composites
transparency over black) and `og-image.png` at 1200×630 on the chassis. The
script has no dependencies: it draws the mark with signed distance fields,
supersamples 4× per axis for antialiasing, and encodes PNG directly using node's
built-in `zlib`.

**Before deploying:** `og:image` and `twitter:image` in `index.html` are
root-relative. Most social scrapers require an absolute URL, so prefix them with
the deployed origin.

## Design notes

**The system: a patchbay.** The page is built as a piece of rack equipment — a
powder-coated slate-teal chassis (`#1f2a2e`), recessed panels, silkscreened mono
labels, and four signal colours patched across it. Five constraints hold it
together, and everything else follows from them:

- structure is drawn with 1px rules, never with shadows or drop-glows;
- corners are square (`--radius: 3px`, used only where a raw edge would look like
  a bug);
- **colour is a taxonomy, never decoration.** Stremio's add-on protocol has a
  real one — `catalog`, `meta`, `stream`, `subtitles` — and the four signal hues
  map onto it one-to-one. A hue means the same resource type in every section:
  amber is always catalog, blue always meta, green always stream. Anything not
  signalling a resource type uses chassis, panel, silk or engrave. This is why
  section eyebrows are `--engrave` and not a signal colour, and why pressing a
  button does not flash one;
- gradients are not a texture. Exactly three exist, each because it encodes
  something: the routing cable in *How it works* (which fades through the
  resources in the order they come online), the poster legibility scrim, and the
  poster fallback art in `src/data/posters.ts`;
- type is squared and technical. Display is Space Grotesk at full width — no
  `font-stretch`, the face has no width axis. Running text is IBM Plex Sans, and
  every label, port ID, table value and timecode is IBM Plex Mono, which is a
  primary voice here rather than an accent.

Green does double duty on purpose: `--sig-stream` is the `stream` resource *and*
the page's interactive accent, because streaming is the last thing to come online
in the routing sequence and the thing the whole page argues for. A separate UI
accent would have been a fifth colour with no referent.

Dark-first, not dark-mode. The chassis is the ground everything is mounted to, and
there is no light variant of it. One block reverses — the closing call to action —
via a `.lit` class that redefines the same token names, so anything nested inside
inverts without knowing it has been flipped. It reads as a lit panel where the
signal terminates. The footer is deliberately *not* wrapped in it: it stays on the
chassis as the back of the rack.

**The rail.** The signature element is one continuous signal path running the full
length of the numbered sections, from the top of the hero to the bottom of the
FAQ. It is drawn entirely with borders on real grid elements — no SVG, no canvas,
no measurement, no JS — so it reflows for free and cannot desynchronise from the
content the way an overlay does. `.rail` is a two-column grid; `.rail-bus` is an
empty first column with a left border, and `.rail-junction` is an absolutely
positioned stub plus the channel ID, numbered by the same CSS counter that runs
down the document.

Because `.rail-bus` is a grid item it can only stretch to its grid row, so
section rhythm must live *inside* the rail or the run breaks into stubs.
`--rail-pad-top` / `--rail-pad-bottom` are consumed by `.rail-body`, and
`.section:has(.rail)` zeroes the padding on the section box; the hero overrides
the pair with its own two clamps. If you add vertical padding to a rail-bearing
section box, you will punch a hole in the rail — put it on `.rail-body`.

Below 1000px the bus moves into the gutter as a narrow spine and the channel IDs
rotate, but it never disappears: a spine still carrying its markers is the same
information at lower resolution, which is what real equipment does when it gets
smaller.

`--sig-subtitles` is defined and contrast-cleared but rendered nowhere. That is
deliberate: it is the fourth declared resource type, and inventing a section so
the colour has somewhere to go would make the taxonomy decorative. It stays
declared so the set is complete and the hue is already decided.

The shared `.section-head` sets the title in the left column with the lead hanging
in the right one — the asymmetry replaces the centred eyebrow/title/lead stack.

**Scroll animation.** `useReveal` attaches a one-shot `IntersectionObserver` per
element and toggles an `.is-visible` class; the transition lives in CSS. The
`<Reveal>` wrapper adds a `delay` prop for staggering grids, and an `as` prop so
it can render a real `<li>` where the markup requires one. `useParallax` writes a
`--parallax` custom property from an rAF-throttled scroll listener, letting each
consumer decide how much offset to apply — currently just the hero monitor.

**Reveal failsafe.** Because every section starts at `opacity: 0`, a browser context
where `IntersectionObserver` never delivers (page rendered while hidden, prerender
passes, some embedded webviews) would show a blank page. If no element has revealed
2s after mount, `useReveal` sets `.reveal-failsafe` on `<html>`, which forces all
content visible. Content is never permanently hidden.

**Motion preferences.** `prefers-reduced-motion: reduce` short-circuits the reveal to
visible, disables parallax, and neutralises transitions globally.

**Hero imagery.** The hero's catalog mockup is a monitor bay, not a browser window:
a bezel with a channel ident and timecode over a recessed screen. Poster artwork is
hotlinked from `images.metahub.space`, the CDN behind **Cinemeta** — Stremio's own
public, key-less metadata add-on, addressed by IMDb id (`src/data/posters.ts`, 12
titles across two rows). Nothing is redistributed from this repo and no API key is
needed. Every card keeps a gradient fallback underneath, so a slow or unreachable
CDN degrades to a designed cover rather than an empty box; the `<img>` fades in on
load and removes itself on error.

Cards set `container-type: inline-size` so their typography scales in `cqi` units
with the card, with a `max()` floor to stay legible at the 3-column mobile layout.
The "Continue watching" row carries progress bars. The whole monitor is
`aria-hidden` — it is a picture of an interface, not one.

**Display scale is capped by the longest word, not by the box.** A large display
face overflows its measure as a single unbreakable unit, so `--fs-display` is
bounded to keep the claim's longest word inside the column the rail leaves free.

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

Type-checks and builds clean.

**Contrast is a gate, not a claim.** `npm run check:contrast` parses the real
custom properties out of `src/styles/global.css` — the source of truth, not a copy
— and asserts every foreground against every surface in both the default and
`.lit` scopes. That is 3 surfaces × 8 foregrounds × 2 scopes = 48 pairs, and all
48 clear 4.5:1. The tightest are `--sig-subtitles` on `--panel` at 4.51:1 in the
dark scope and `--sig-catalog` on `--recess` at 4.87:1 in the lit one; the widest
is `--silk` on `--panel` at 14.48:1. The gate has no dependencies and runs in
about 50ms, so it is cheap enough to run on every token change — which is the
point, because several signal hues were darkened or lightened to clear the bar.

Measured in-browser with DOM geometry assertions:

- **Rail continuity** at 1280px and 375px. Consecutive `.rail-bus` segments meet
  within 1px (the residue is *How it works*' own 1px `border-block`, which is real
  structure), across 6 bus segments and 6 junctions. Coverage of
  `document.scrollHeight` is 84.5% at 1280 and 86.7% at 375; the remainder is the
  nav strip, the closing call to action and the footer, all of which sit outside
  the numbered run on purpose. At 375 the junction marker is at `left: 14px` with
  its rotated 10px channel ID on-screen.
- **No horizontal page scroll.** After `window.scrollTo(500, y)`, `window.scrollX`
  is 0 and `document.body.offsetWidth` equals `documentElement.clientWidth` at both
  widths. Note that `documentElement.scrollWidth` is *not* a page-scroll signal on
  this page — it reports the unclipped extent of the 680px comparison table inside
  its own `overflow-x: auto` scroller.
- **Comparison overflow affordance.** The table's 680px floor exceeds the rail
  body's content width until about 765px viewport, so the "scroll to compare" hint
  is hidden at `min-width: 800px` rather than at the neighbouring 760px
  breakpoint. Confirmed at 762px (677px of room, 680px of table, hint shown).
- **Language switch.** Clicking ES flips `<html lang>`, `document.title`, the
  headline and the section eyebrows; EN restores them.
- **Poster URLs.** All 12 Cinemeta images load (`naturalWidth > 0`), all from
  `images.metahub.space`.

**Not measured.** The browser pane used for this work never composited, so nothing
was checked by eye and two things were never exercised for real:

- focus rings from an actual keyboard walk. `:focus-visible` is styled globally
  and the interactive elements are native `<button>`/`<a>`, but the tab order was
  not driven by hand;
- OS-level `prefers-reduced-motion`. The media query is written and covers the
  reveal, the parallax and all transitions, but it was never toggled at the system
  level to confirm the page behaves as intended end to end.
