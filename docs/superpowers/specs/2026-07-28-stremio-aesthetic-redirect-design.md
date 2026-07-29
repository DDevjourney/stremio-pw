# Stremio landing page — aesthetic re-direction: "the patchbay"

**Date:** 2026-07-28
**Status:** approved, ready for planning
**Scope:** design tokens + section layout. Section order and all existing copy stay.

---

## 1. Why

The page currently reads as film-press editorial: warm paper `#f2ece1`, black ink,
one vermilion, 1px rules, condensed uppercase display, a text serif for running
copy. It is carefully executed, but it is a costume borrowed from magazines *about*
film rather than from the product, and cream paper + high-contrast display + a
terracotta accent is the single most common look generated design converges on.

Stremio is not a streaming service. It is a client with no content of its own.
Everything arrives through add-ons — each one a JSON manifest at a URL answering
four kinds of request. The user assembles their own catalog. The honest identity is
**an open routing layer with a poster wall on top**.

This spec re-directs the page onto that identity: the visual language of signal
routing — patchbays, video switchers, the labeled and colour-coded surface of rack
equipment.

## 2. What is not changing

- Section order: Nav, Hero, ValueProps, HowItWorks, Comparison, Testimonials, FAQ,
  FinalCTA, Footer.
- All existing user-facing copy in `src/i18n/en.ts` and `src/i18n/es.ts`. New keys
  are added (§7); no existing string is rewritten.
- Zero runtime dependencies beyond React.
- The reveal / parallax hooks and the reveal failsafe.
- The logo mark geometry. A play triangle knocked out of a diamond still works on a
  chassis; only the plate colours it is rendered against change (§7).
- The `Dictionary` type discipline: a missing translation stays a compile error.

## 3. The premise, made honest

The Stremio add-on protocol has a real taxonomy. Every add-on declares which
resources it serves: **catalog**, **meta**, **stream**, **subtitles**. Four types,
genuinely distinct, genuinely how the product works.

That taxonomy is the colour system. **Colour is never decorative on this page.** A
hue always denotes a resource type and denotes the same one in every section it
appears in. This is what earns the equipment reference: labeled, colour-coded panels
are colour-coded because the colours are load-bearing.

## 4. Tokens

### 4.1 Colour

The chassis is a desaturated slate-teal, not black. Rack equipment is powder-coated,
not piano-black, and the deliberate step away from `#0a0a0a` is what keeps this out
of the near-black-plus-one-accent default.

| Token | Value | Role |
|---|---|---|
| `--chassis` | `#1f2a2e` | rack panel — the page ground |
| `--panel` | `#2a3639` | raised module face |
| `--recess` | `#171f22` | cut-outs, insets, the table well |
| `--silk` | `#dfe4e0` | silkscreen white, green-shifted |
| `--engrave` | `#8b9a99` | secondary engraved text |
| `--score` | `rgba(223,228,224,0.16)` | scored panel lines |

Signal colours, one per resource type, consistent document-wide:

| Token | Value | Resource type |
|---|---|---|
| `--sig-catalog` | `#e8a33d` | amber |
| `--sig-meta` | `#4aa3d9` | blue |
| `--sig-stream` | `#5fbf6a` | green |
| `--sig-subtitles` | `#c96bb4` | magenta |

Plus `--dead: #7a5c58` for the unpowered state — the "no" cells in the comparison
matrix.

These are targets. Every text/surface pair must be verified ≥4.5:1 against **both**
`--chassis` and `--panel`, including the four signal colours at label sizes. Values
are to be darkened or lightened to clear the bar, exactly as the current palette's
tertiary grey and red were.

**Token naming:** the existing generic names (`--bg`, `--text`, `--text-2`,
`--text-3`, `--rule`, `--accent`, `--on-accent`) are retained and remapped onto the
new palette so the CSS modules keep compiling through the transition. The names above
are added alongside them.

**The lit state.** Where the signal terminates — FinalCTA — the panel goes lit: the
same token names redefined on a `.lit` class. This is the mechanism `.on-ink` already
uses at `src/styles/global.css:87`; the technique is kept and the values replaced.
`.on-ink` is renamed to `.lit`, and `App.tsx` updated at its single usage site.

### 4.2 Type

The real departure is that **there is no condensed display face.** The current voice
is condensed uppercase at `wdth 75`; going condensed again would be the same page in
new colours. Hardware type is wide, squared and silkscreened.

| Role | Family | Use |
|---|---|---|
| Panel / display | **Space Grotesk** | squared terminals, technical without being sci-fi — the model-name-on-the-chassis voice |
| Labels & data | **IBM Plex Mono** | port IDs, signal labels, table values, timecode — a primary voice, not a code accent |
| Running text | **IBM Plex Sans** | humanist enough not to read as a spec sheet; shares its skeleton with the mono |

The serif is gone entirely. `font-stretch: 75%` is removed from the `h1–h4` rule.
The display scale runs at fewer, larger steps than the current one, and the
`--fs-display` cap tied to the word "EVERYTHING" is recomputed for the new face —
Space Grotesk is far wider than Archivo at `wdth 75`, so the cap will be tighter.

**Named risk:** Space Grotesk has its own cluster (startup / web3). If it reads that
way in build, the display role swaps to **Archivo at `wdth 125`** — the family is
already loaded and the axis flips from the current 75. This is a decision to make
against a screenshot, not in advance.

### 4.3 Surface texture

The paper-tooth overlay at `src/styles/global.css:146` is kept as a mechanism and
retuned to a fine brushed-panel texture at similarly low opacity. The original
argument holds unchanged: a flat fill reads as screen-flat. Only the surface being
imitated changes.

## 5. The signature: the rail

One continuous signal path runs the full length of the document. **It is the only
bold element on the page**; everything else stays quiet.

### 5.1 Mechanism

Built from **borders on real elements, not SVG**. No path measurement, no JS, no
`getBoundingClientRect`. A dedicated grid column holds a vertical bus; each section
reaches it with a short horizontal stub at a known row. It therefore reflows for free
and cannot desynchronise from the content the way a measured overlay does.

A shared `.rail` layout primitive is added to `global.css` alongside `.container`
and `.section`.

```
≥1000px                                    <1000px

 CH ├──────┐                                │
 01 │      │  EVERYTHING YOU                ├─ 01
    │      │  WATCH. ONE APP.               │
    │      │                                │  EVERYTHING YOU
    │      │  ┌────────────────┐            │  WATCH. ONE APP.
    │      └──┤  monitor       │            │
    │         │                │            ├─ 02
 CH ├──────┐  └────────────────┘            │
 02 │      │                                │  ...
    │      │  ▮ catalog   ▮ meta            │
    │      │  ▮ stream    ▮ subtitles       │
    ▼      │                                ▼
```

### 5.2 Mobile is the design, not the fallback

Below 1000px the bus does not vanish. It moves to the gutter as a 2px spine with a
lit junction at each section. The reader still knows where they are in the run and
how far it goes.

This is the explicit answer to the known failure mode of this direction: a diagram
that degrades into meaningless decoration at small sizes. A spine that keeps its
junction markers carries the same information at lower resolution, which is what
real equipment does when it gets smaller. **If an implementation cannot keep the
junctions meaningful on mobile, the rail is wrong and must be reworked — not hidden
with `display: none`.**

### 5.3 What the rail replaces

The `.eyebrow` CSS counter at `src/styles/global.css:293` is kept as a mechanism —
the numbering is genuinely sequential — but renders as a channel ID on the rail
(`CH 03`) instead of a leading `03·` on an inline label. The counter moves out of the
text and becomes structure.

### 5.4 What the rail is honest about

It is a spine with junctions, **not** a claim that all nine sections are stages in a
signal path. Forcing Testimonials into a routing metaphor would be exactly the fake
structure this re-direction exists to remove. Only two sections get true routing
semantics, because only two actually route.

## 6. Section treatments

| Section | Treatment |
|---|---|
| **Nav** | Chassis top edge as a rack strip. Mark left, nav links as labeled ports, language switch as a two-position selector. Sticky, scored bottom edge rather than a shadow. |
| **Hero** | Front panel. Claim flush left in engraved panel type. The existing browser mockup survives, re-skinned as a rack **monitor**: bezel, ident bug, corner timecode. The poster rows inside it are unchanged — that pipeline works and the artwork is the product's face. **The blurred right-margin poster wall is removed**; it belongs to the print direction and its compositional job is now done by the rail. |
| **ValueProps** | Four modules, one per resource type, each carrying its signal colour and each stubbed into the bus. This is where the colour system is taught, so it must read clearly before the matrix relies on it. |
| **HowItWorks** | The rail elaborated into a full routing diagram: one cable running through all **four** stages — client, catalog, meta, stream — with each marker taking the colour of the resource online by that point. Not a second idea competing with the rail; the same object at the one section whose content genuinely is a sequence. (`how.steps` holds four entries and the section title says "four steps"; an earlier draft of this spec said three, which was simply wrong about the content.) |
| **Comparison** | A **crosspoint matrix**. Video switchers have literal crosspoint panels: rows against columns, a lit button where a source connects to a destination. A feature-comparison table is that shape. Keeps its existing horizontal scroll container, `role="region"`, `tabIndex`, caption and per-cell visually-hidden yes/no labels. |
| **Testimonials** | Deliberately flat. Silkscreen labels, scored dividers, nothing else. |
| **FAQ** | Deliberately flat. Same. |
| **FinalCTA** | The signal terminates; the panel goes `.lit`. |
| **Footer** | Back of the rack: connector plate, mono legalese, the existing demo disclaimer. |

**Restraint.** Two designed elements were cut before this spec: a hero jack-field
module with poster art in the jack holes (it competed with the monitor for the same
job) and FAQ toggle switches (a third control-surface idea on a page that should
have one). If a further accessory needs removing during build, these are the
precedent — cut, don't accumulate.

## 7. Consequences beyond CSS

- **The icons must be regenerated.** `scripts/generate-icons.mjs` hardcodes
  `MARK #b83019`, `PAPER #f2ece1`, `INK #14110e` at lines 72–74; renders
  `apple-touch-icon.png` on `PAPER` and `og-image.png` on `INK`. All three constants
  change and `npm run icons` re-runs. `public/favicon.svg` hardcodes the same two
  colours (`#b83019` on the diamond, `#f2ece1` on the knockout at lines 2–3) and
  must be updated to match. `src/components/Logo.tsx` needs **no** change: it is one
  `evenodd` path taking `currentColor`, so it re-inks itself from whatever block it
  sits in. Geometry stays identical across all three, per the README's
  three-places rule.
- **`index.html`** — `theme-color`, `color-scheme` light → dark, and the Google Fonts
  request rewritten for Space Grotesk + IBM Plex Mono + IBM Plex Sans (dropping
  Archivo and Source Serif 4, unless the Archivo fallback in §4.2 is taken).
- **i18n gains keys, additively.** Port labels, resource-type names, the monitor's
  ident and timecode. New keys on `Dictionary`, `en.ts`, `es.ts`. No existing string
  changes. The compile-error guarantee means nothing can ship half-translated.
- **No new runtime dependencies.** The rail is borders.

## 8. Motion

The existing `useReveal` / `useParallax` system is unchanged. One addition: on load,
the hero's path draws once, left to right, and the destination indicator lights. That
is the entire orchestration — a single moment rather than effects scattered down the
page.

Under `prefers-reduced-motion: reduce` the path renders already-drawn and already-lit.

## 9. Verification

The same bar the current README sets, **re-run rather than inherited**:

1. `tsc` type-check and `vite build` clean.
2. Every text/surface pair ≥4.5:1 against both `--chassis` and `--panel`, including
   the four signal colours at 12px label sizes.
3. No horizontal page scroll at any width; the comparison matrix scrolls inside its
   own container only.

   Measure this as `window.scrollX` staying `0` after an attempted horizontal
   scroll, plus `document.body.offsetWidth === documentElement.clientWidth`.
   **Not** via `documentElement.scrollWidth`: that reports the unclipped extent of
   the 680px comparison table inside its `overflow-x: auto` scroller, reading ~572
   at a 375px viewport while the page itself does not scroll at all. Confirmed by
   lifting `body { overflow-x: hidden }` and re-testing — nothing hides behind it.
4. The rail checked at 375 / 1000 / 1280 / 1920 in both languages — junctions aligned
   to their sections, no collision between the claim and the rail, spine meaningful
   at 375.
5. `prefers-reduced-motion` path exercised.
6. The reveal failsafe still fires (no element revealed 2s after mount → all content
   forced visible).
7. All 18 poster URLs still resolving against Cinemeta.

## 10. Out of scope

- Section order changes, or adding/removing sections.
- Rewriting existing copy.
- A light/dark toggle. The page stays single-mode, for the same reason the current one
  does: a reversible palette pushes every token toward neutral grey. Here the single
  mode is a lit chassis rather than ink on paper.
- Any change to the Cinemeta poster pipeline or `src/data/posters.ts` beyond removing
  the `heroBackdrop` tiles consumed by the deleted poster wall.
