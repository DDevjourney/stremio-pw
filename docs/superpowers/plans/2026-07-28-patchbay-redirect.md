# Patchbay Aesthetic Re-direction — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-direct the Stremio landing page from film-press editorial onto the visual language of signal routing — a colour-coded rack chassis with one continuous signal rail — without changing section order or existing copy.

**Architecture:** The token layer in `src/styles/global.css` is rewritten in place; existing generic token names (`--bg`, `--text`, `--accent`, …) are retained and remapped so every CSS module keeps compiling while sections are converted one at a time. A new `.rail` layout primitive joins `.container` and `.section` as a third shared utility. The signature signal path is drawn with **borders on real grid elements** — no SVG, no measurement, no JS — so it reflows for free.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, CSS Modules. Zero runtime dependencies beyond React; that constraint holds.

**Spec:** `docs/superpowers/specs/2026-07-28-stremio-aesthetic-redirect-design.md`

## Global Constraints

- **Zero new runtime dependencies.** The rail is borders. Nothing here needs a library.
- **No new devDependencies either.** The contrast checker is written against node built-ins, matching `scripts/generate-icons.mjs`.
- **Section order is fixed:** Nav, Hero, ValueProps, HowItWorks, Comparison, Testimonials, FAQ, FinalCTA, Footer.
- **No existing user-facing string is rewritten.** i18n changes are additive only — new keys on `Dictionary`, `en.ts`, `es.ts`, all three together so the compile-error guarantee holds.
- **Every text/surface pair ≥4.5:1** against `--chassis`, `--panel` and `--recess`, including the four signal colours at 12px label sizes. Enforced by `npm run check:contrast` (Task 1).
- **The rail must stay meaningful at 375px.** If junctions cannot be kept legible on mobile, rework the rail — do **not** hide it with `display: none`. This is a build-breaker, not a judgment call.
- **Logo geometry never changes.** Only the plate colours it renders against.
- **Commit at the end of every task.** `Stremio/` is now its own git repo (initial commit `1894485`), and work happens in place on `main` by the user's decision — no worktree. Each task ends at its verification gate **and** a commit, so the per-task review can diff it. Never use `--no-verify`.
- **Dev server:** `preview_start` with `{name: "stremio-landing"}` (port 5173, configured in `.claude/launch.json`). Never launch it via a shell.

---

### Task 1: Contrast gate and the token layer

**Files:**
- Create: `scripts/check-contrast.mjs`
- Modify: `package.json` (add `check:contrast` script)
- Modify: `src/styles/global.css:16-109` (the `:root` and `.on-ink` blocks)
- Modify: `src/App.tsx:27` (`.on-ink` → `.lit`)

**Interfaces:**
- Consumes: nothing.
- Produces: the full token vocabulary every later task uses — `--chassis`, `--panel`, `--recess`, `--silk`, `--engrave`, `--score`, `--sig-catalog`, `--sig-meta`, `--sig-stream`, `--sig-subtitles`, `--dead`; the retained aliases `--bg`, `--text`, `--text-2`, `--text-3`, `--rule`, `--rule-2`, `--rule-3`, `--accent`, `--accent-2`, `--accent-soft`, `--on-accent`, `--surface`, `--surface-hi`; and the `.lit` class. Also produces `npm run check:contrast`, the gate used by Tasks 2–12.

- [ ] **Step 1: Write the failing check**

Create `scripts/check-contrast.mjs`:

```js
/**
 * WCAG contrast gate for the design tokens.
 *
 * Parses the real custom properties out of src/styles/global.css — the source
 * of truth, not a copy — and asserts every text/surface pair clears 4.5:1 in
 * both the default (:root) and lit (.lit) scopes. Zero dependencies, matching
 * scripts/generate-icons.mjs. Run with `npm run check:contrast`.
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const GLOBAL = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'styles',
  'global.css',
)
const THRESHOLD = 4.5

/* ------------------------------------------------------------ colour ---- */

function hex(h) {
  const s = h.replace('#', '')
  const full =
    s.length === 3
      ? s
          .split('')
          .map((c) => c + c)
          .join('')
      : s
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function srgbToLinear(c) {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function luminance([r, g, b]) {
  return (
    0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
  )
}

function ratio(a, b) {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/* ------------------------------------------------------------- parse ---- */

const css = readFileSync(GLOBAL, 'utf8')

/** Pull one `selector { ... }` block out of the stylesheet. */
function block(selector) {
  const start = css.indexOf(selector)
  if (start === -1) throw new Error(`Selector not found in global.css: ${selector}`)
  const open = css.indexOf('{', start)
  const close = css.indexOf('}', open)
  if (open === -1 || close === -1) throw new Error(`Malformed block: ${selector}`)
  return css.slice(open + 1, close)
}

/** Read one opaque hex custom property out of a block. */
function token(body, name, selector) {
  const m = body.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,6})\\s*;`))
  if (!m) {
    throw new Error(`Token --${name} missing or not an opaque hex in ${selector}`)
  }
  return hex(m[1])
}

/* ------------------------------------------------------------- check ---- */

const SURFACES = ['chassis', 'panel', 'recess']
const FOREGROUNDS = [
  'silk',
  'text-2',
  'engrave',
  'sig-catalog',
  'sig-meta',
  'sig-stream',
  'sig-subtitles',
  'dead',
]

let failures = 0
let checks = 0

for (const selector of [':root', '.lit']) {
  const body = block(selector)

  for (const surface of SURFACES) {
    const bg = token(body, surface, selector)

    for (const fg of FOREGROUNDS) {
      const r = ratio(token(body, fg, selector), bg)
      const ok = r >= THRESHOLD
      checks++
      if (!ok) failures++
      console.log(
        `${ok ? 'PASS' : 'FAIL'}  ${selector.padEnd(6)} --${fg} on --${surface}` +
          `  ${r.toFixed(2)}:1`,
      )
    }
  }
}

console.log(`\n${checks - failures}/${checks} pairs clear ${THRESHOLD}:1`)

if (failures > 0) {
  console.error(`\n${failures} pair(s) below ${THRESHOLD}:1 — adjust the tokens.`)
  process.exit(1)
}
```

Add to `package.json` scripts:

```json
"check:contrast": "node scripts/check-contrast.mjs"
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm run check:contrast
```

Expected: FAIL — throws `Token --chassis missing or not an opaque hex in :root`, because `global.css` still holds the paper palette. This confirms the gate reads the real stylesheet rather than passing vacuously.

- [ ] **Step 3: Rewrite the token blocks**

Replace `src/styles/global.css:16-109` (the `:root` block and the `.on-ink` block) with:

```css
:root {
  /* -------- Type -------- */
  /* Squared, technical. The model-name-on-the-chassis voice. */
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  /* Port IDs, signal labels, table values, timecode. A primary voice. */
  --font-label: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace;
  /* Humanist enough not to read as a spec sheet. */
  --font-body: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;

  /*
    Fewer, larger steps than the editorial scale. Space Grotesk is far wider
    than Archivo at wdth 75, so the display cap is tighter: the claim's longest
    unbreakable word still has to clear the rail column.
  */
  --fs-display: clamp(2.75rem, 1rem + 5.4vw, 4.75rem);
  --fs-h2: clamp(2rem, 1.2rem + 3vw, 3.25rem);
  --fs-h3: clamp(1.25rem, 1.1rem + 0.7vw, 1.6rem);
  --fs-lead: clamp(1.0625rem, 1rem + 0.4vw, 1.25rem);
  --fs-body: 1.0625rem;
  --fs-sm: 0.9375rem;
  --fs-xs: 0.8125rem;
  --fs-label: 0.75rem;

  /* -------- Layout -------- */
  --page-max: 1240px;
  --gutter: clamp(1.25rem, 4vw, 3rem);
  --section-y: clamp(4.5rem, 9vw, 8rem);

  /* Width of the rail column at >=1000px, and the gutter spine below it. */
  --rail-w: 132px;
  --rail-line: 2px;

  /* Machined, not printed: a hair of radius on module faces. */
  --radius: 3px;

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease: cubic-bezier(0.4, 0, 0.2, 1);

  /* -------- Chassis -------- */
  /*
    Slate-teal, not black. Rack equipment is powder-coated; the deliberate
    step away from #0a0a0a is what keeps this off the near-black default.
  */
  color-scheme: dark;

  --chassis: #1f2a2e;
  --panel: #2a3639;
  --recess: #171f22;

  --silk: #dfe4e0;
  --engrave: #93a2a1;
  --score: rgba(223, 228, 224, 0.16);

  /*
    Signal colours: one per Stremio add-on resource type. Load-bearing —
    a hue always means the same resource type, in every section.
  */
  --sig-catalog: #eaa945;
  --sig-meta: #63b3e4;
  --sig-stream: #6cc877;
  --sig-subtitles: #d47fc0;

  /* Unpowered: the "no" cells in the crosspoint matrix. */
  --dead: #9c7a75;

  /* -------- Retained aliases -------- */
  /* Kept so every CSS module keeps compiling while sections convert. */
  --bg: var(--chassis);
  --surface: var(--panel);
  --surface-hi: var(--recess);

  --text: var(--silk);
  --text-2: #b9c4c2;
  --text-3: var(--engrave);

  --rule: var(--score);
  --rule-2: rgba(223, 228, 224, 0.34);
  --rule-3: var(--silk);

  --accent: var(--sig-stream);
  --accent-2: var(--sig-catalog);
  --accent-soft: rgba(108, 200, 119, 0.13);
  --on-accent: var(--recess);
}

/*
  Lit panel: where the signal terminates. Redefines the same token names
  rather than adding new ones, so anything nested inverts without knowing
  it has been flipped. Same mechanism the old .on-ink class used.
*/
.lit {
  color-scheme: light;

  --chassis: #dfe4e0;
  --panel: #eceeea;
  --recess: #cfd6d3;

  --silk: #161e21;
  --engrave: #4a5a59;
  --score: rgba(22, 30, 33, 0.2);

  --sig-catalog: #7a4e05;
  --sig-meta: #14567f;
  --sig-stream: #1c6427;
  --sig-subtitles: #8a2472;

  --dead: #6a4a46;

  --bg: var(--chassis);
  --surface: var(--panel);
  --surface-hi: var(--recess);

  --text: var(--silk);
  --text-2: #33403f;
  --text-3: var(--engrave);

  --rule: var(--score);
  --rule-2: rgba(22, 30, 33, 0.4);
  --rule-3: var(--silk);

  --accent: var(--sig-stream);
  --accent-2: var(--sig-catalog);
  --accent-soft: rgba(28, 100, 39, 0.12);
  --on-accent: var(--chassis);

  background: var(--bg);
  color: var(--text);
}
```

Then rename the single usage site. In `src/App.tsx:27`:

```tsx
<div className="lit">
  <FinalCTA />
</div>
```

- [ ] **Step 4: Run the gate to verify it passes**

```bash
npm run check:contrast
```

Expected: PASS, `48/48 pairs clear 4.5:1`.

`--text-2` is in the list because it carries body copy; a contrast gate that
skips running text is not a gate. It must therefore be a literal hex, not a
`var()` alias — see the token block below.

If any pair fails, move the **foreground** token away from its surface until it
clears: in `:root` the surfaces are dark, so a failing foreground gets
**lighter**; in `.lit` the surfaces are light, so it gets **darker**. **Do not
lower `THRESHOLD`, and never drop an entry from `FOREGROUNDS` or `SURFACES` to
make the gate pass.**

- [ ] **Step 5: Verify the build still compiles**

```bash
npm run build
```

Expected: exits 0. The page will look wrong at this stage — modules still carry editorial layout — but nothing should error. Colour is now dark-on-dark-aware via the aliases.

---

### Task 2: Typefaces and document head

**Files:**
- Modify: `index.html:19-51`
- Modify: `src/styles/global.css:181-192` (the `h1–h4` rule)

**Interfaces:**
- Consumes: `--font-display`, `--font-label`, `--font-body` from Task 1.
- Produces: the three families actually loaded; the `h1–h4` base rule with no `font-stretch` and no uppercase transform.

- [ ] **Step 1: Swap the font request and meta**

In `index.html`, replace the two `<meta>` colour lines and the stylesheet `<link>`:

```html
<meta name="theme-color" content="#1f2a2e" />
<meta name="color-scheme" content="dark" />
```

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<!-- Space Grotesk sets panel display copy; IBM Plex Mono carries every label,
     port ID and table value; IBM Plex Sans carries running text. -->
<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 2: Rewrite the heading base rule**

Replace `src/styles/global.css:181-192`:

```css
h1,
h2,
h3,
h4 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.02;
  /*
    Hardware type is wide and silkscreened, not condensed and printed.
    No font-stretch, and no blanket uppercase — case is set per section,
    so panel labels can shout while headings stay sentence case.
  */
  letter-spacing: -0.015em;
  text-wrap: balance;
}
```

- [ ] **Step 3: Retune the surface texture**

Replace the `background-image` on `body::after` (`src/styles/global.css:146-154`) with a fine vertical brush. Keep the `opacity: 0.035` and the fixed/pointer-events/z-index rules exactly as they are — the argument that a flat fill reads as screen-flat is unchanged; only the surface being imitated differs:

```css
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 1.4' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23b)'/%3E%3C/svg%3E");
```

- [ ] **Step 4: Verify in the browser**

Start the dev server with `preview_start` `{name: "stremio-landing"}`. Then:
- `read_console_messages` — expect no errors.
- `read_network_requests` with `urlPattern: "fonts.g"` — expect 200s for all three families, and **no request for Archivo or Source Serif 4**.
- `javascript_tool`: `getComputedStyle(document.querySelector('h1')).fontFamily` — expect the Space Grotesk stack.

- [ ] **Step 5: Judge the display face against a screenshot**

Take a screenshot of the hero. **Decision point named in the spec:** if Space Grotesk reads startup/web3 rather than industrial, swap `--font-display` to `'Archivo'` with `font-stretch: 125%` on `h1–h4`, and restore Archivo to the font request at `wdth,wght@125,600;125,700`. Record which way you went in a comment on the `--font-display` line.

- [ ] **Step 6: Gate**

```bash
npm run build
```

Expected: exits 0.

---

### Task 3: The rail primitive

**Files:**
- Modify: `src/styles/global.css` (append after `.section-head`, replace `.eyebrow` at lines 282-300)

**Interfaces:**
- Consumes: `--rail-w`, `--rail-line`, `--score`, `--silk`, `--engrave`, `--font-label` from Task 1.
- Produces: `.rail` (grid wrapper), `.rail-bus` (the vertical run), `.rail-junction` (a lit stub + channel ID), `.rail-body` (content column). Every section from Task 4 onward wraps its container in `.rail`.

- [ ] **Step 1: Write the rail**

Append to `src/styles/global.css`:

```css
/* ============================================================
   The rail — one continuous signal path down the document.

   Built from borders on real grid elements: no SVG, no measurement,
   no JS. It therefore reflows for free and cannot desynchronise from
   the content the way a measured overlay does.
   ============================================================ */

.rail {
  display: grid;
  grid-template-columns: var(--rail-w) minmax(0, 1fr);
  width: 100%;
  max-width: var(--page-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

/* The vertical run. A left border on an empty column is the whole trick. */
.rail-bus {
  position: relative;
  grid-column: 1;
  border-left: var(--rail-line) solid var(--score);
}

/*
  A junction: the horizontal stub into the content column, plus the channel
  ID. The ID comes from the same document counter the editorial eyebrow used
  — the numbering was always genuinely sequential; here it becomes structure
  instead of a prefix on a label.
*/
.rail-junction {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding-left: 0.75rem;
  font-family: var(--font-label);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--engrave);
  white-space: nowrap;
}

.rail-junction::before {
  counter-increment: section;
  content: 'CH ' counter(section, decimal-leading-zero);
}

/* The stub. Grows to fill whatever the ID leaves, terminating at the content. */
.rail-junction::after {
  content: '';
  flex: 1;
  height: var(--rail-line);
  background: var(--score);
}

.rail-body {
  grid-column: 2;
  min-width: 0;
  padding-left: clamp(1.5rem, 3vw, 2.75rem);
}

/*
  Below 1000px the bus moves to the gutter as a spine. It does NOT disappear:
  the junction markers stay, so the reader still knows where they are in the
  run and how far it goes. A spine carrying its markers is the same
  information at lower resolution — which is what real equipment does when
  it gets smaller.
*/
@media (max-width: 999px) {
  .rail {
    grid-template-columns: 1.75rem minmax(0, 1fr);
    padding-inline: calc(var(--gutter) * 0.6);
  }

  .rail-junction {
    /* ID rotates out of the flow; the lit dot carries the position. */
    gap: 0;
    padding-left: 0;
  }

  .rail-junction::before {
    position: absolute;
    left: 0.55rem;
    top: 0.9rem;
    transform: rotate(90deg);
    transform-origin: left top;
    font-size: 0.625rem;
  }

  .rail-junction::after {
    flex: none;
    width: 0.55rem;
    margin-left: calc(var(--rail-line) * -1);
  }

  .rail-body {
    padding-left: clamp(0.75rem, 3vw, 1.25rem);
  }
}
```

- [ ] **Step 2: Retire the editorial eyebrow prefix**

Replace `src/styles/global.css:282-300`. The counter now lives on `.rail-junction::before`, so the eyebrow keeps its label role and loses its number:

```css
.eyebrow {
  display: block;
  font-family: var(--font-label);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1;
  color: var(--sig-stream);
}
```

- [ ] **Step 3: Prove it on one section**

Convert `ValueProps` markup only far enough to exercise the rail — the module grid comes in Task 6. In `src/components/ValueProps.tsx`, replace the wrapping `<div className="container">` with:

```tsx
<div className="rail">
  <div className="rail-bus">
    <span className="rail-junction" aria-hidden="true" />
  </div>
  <div className="rail-body">
    {/* existing section-head and items, unchanged */}
  </div>
</div>
```

The junction is `aria-hidden` — it is a positional marker, and the section already has an accessible heading.

- [ ] **Step 4: Verify at four widths, both languages**

With the dev server running, use `resize_window` at **375**, **1000**, **1280**, **1920**. At each width:
- `computer` screenshot — the bus is continuous, the junction stub meets the content column, nothing overlaps.
- At 375 specifically: the spine is visible in the gutter and the `CH 02` marker is legible. **If it is not legible, rework the rail — do not hide it.**
- `javascript_tool`: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` — expect `true` at every width.

Then click the language toggle and repeat at 375 and 1280. Spanish copy runs longer; the rail must not collide with it.

- [ ] **Step 5: Gate**

```bash
npm run build && npm run check:contrast
```

Expected: both exit 0.

---

### Task 4: Nav as a rack strip

**Files:**
- Modify: `src/components/Nav.tsx:19-49`
- Modify: `src/components/Nav.module.css`

**Interfaces:**
- Consumes: tokens from Task 1; `Logo` (unchanged, takes `currentColor`).
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Restyle the strip**

The nav keeps its scroll-state logic exactly as written at `src/components/Nav.tsx:11-16`. Only presentation changes. In `Nav.module.css`, the strip gets a scored bottom edge instead of a shadow, and the links become labeled ports:

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--chassis);
  border-bottom: 1px solid var(--score);
  transition: background 0.2s var(--ease);
}

.scrolled {
  background: var(--recess);
}

.link {
  position: relative;
  padding: 0.55rem 0 0.55rem 1rem;
  font-family: var(--font-label);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--engrave);
  transition: color 0.15s var(--ease);
}

/* The port: a jack that lights when its destination is selected. */
.link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 6px;
  height: 6px;
  margin-top: -3px;
  border: 1px solid var(--engrave);
  border-radius: 50%;
  transition:
    background 0.15s var(--ease),
    border-color 0.15s var(--ease);
}

.link:hover,
.link:focus-visible {
  color: var(--silk);
}

.link:hover::before,
.link:focus-visible::before {
  background: var(--sig-stream);
  border-color: var(--sig-stream);
}
```

The language button becomes a two-position selector — a bordered mono lozenge showing the target code:

```css
.langToggle {
  padding: 0.3rem 0.55rem;
  font-family: var(--font-label);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--engrave);
  border: 1px solid var(--score);
  border-radius: var(--radius);
}

.langToggle:hover,
.langToggle:focus-visible {
  color: var(--silk);
  border-color: var(--rule-2);
}
```

Keep `aria-label` and `title` on the button as they are — they carry the only accessible name.

- [ ] **Step 2: Verify**

Screenshot at 1280 and 375. Then `read_page` and confirm the primary nav still exposes four links with their labels, and the language button still reports its `aria-label`. Tab through with `computer` `key: "Tab"` and confirm the focus ring is visible on every control.

- [ ] **Step 3: Gate**

```bash
npm run build
```

---

### Task 5: Hero as the front panel

**Files:**
- Modify: `src/components/Hero.tsx:21-64` (delete `Backdrop`), `:118-188` (panel markup)
- Modify: `src/components/Hero.module.css`
- Modify: `src/data/posters.ts` (remove `heroBackdrop`)
- Modify: `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/es.ts` (additive keys)

**Interfaces:**
- Consumes: `.rail` from Task 3; tokens from Task 1; `posterUrl`, `continueWatching`, `popularNow` from `src/data/posters.ts` (all unchanged).
- Produces: the `hero.ident` and `hero.timecode` dictionary keys.

- [ ] **Step 1: Add the new strings to all three i18n files**

The monitor needs an ident bug and a timecode. In `src/i18n/types.ts`, add to the `hero` block:

```ts
    /** Channel ident shown on the monitor bezel. */
    ident: string
    /** Static timecode on the monitor bezel. Decorative, but localised. */
    timecode: string
```

In `src/i18n/en.ts`, inside `hero`:

```ts
    ident: 'LIVE · ALL SOURCES',
    timecode: '00:00:00:00',
```

In `src/i18n/es.ts`, inside `hero`:

```ts
    ident: 'EN DIRECTO · TODAS LAS FUENTES',
    timecode: '00:00:00:00',
```

- [ ] **Step 2: Delete the poster wall**

Remove the entire `Backdrop` component (`src/components/Hero.tsx:21-64`) and its `<Backdrop />` call at line 124. Remove the now-unused `heroBackdrop` import from the import block at lines 7-13, and delete the `heroBackdrop` export from `src/data/posters.ts` along with its `PosterTile`-shaped entries.

Also remove `.backdrop`, `.rail`, `.tile` and `.backdropScrim` from `Hero.module.css` — and note that the module's local `.rail` class is gone, so it cannot shadow the new global `.rail` primitive.

The `useParallax` import stays: the monitor still uses it at line 119.

- [ ] **Step 3: Rebuild the hero markup**

Replace the `Hero` component body with the rail-wrapped panel. The `PosterRow` component and everything inside it stays exactly as written — that pipeline works:

```tsx
export function Hero() {
  const parallaxRef = useParallax<HTMLDivElement>(0.18)
  const { t } = useContent()

  return (
    <section className={styles.hero} id="top">
      <div className="rail">
        <div className="rail-bus">
          <span className="rail-junction" aria-hidden="true" />
        </div>

        <div className="rail-body">
          <Reveal>
            <p className={styles.badge}>{t.hero.badge}</p>
          </Reveal>

          <Reveal delay={90}>
            {/*
              Engraved panel type: the claim is silkscreened on the chassis.
              The accent word takes the stream colour — the one signal this
              whole page is about delivering.
            */}
            <h1 className={styles.headline}>
              {t.hero.headlineLead}{' '}
              <span className={styles.accentWord}>{t.hero.headlineAccent}</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className={styles.sub}>{t.hero.sub}</p>
          </Reveal>

          <Reveal delay={270}>
            <div className={styles.ctaRow}>
              <CTAButton size="large">{t.hero.ctaPrimary}</CTAButton>
              <CTAButton href="#how-it-works" variant="secondary" size="large">
                {t.hero.ctaSecondary}
              </CTAButton>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <p className={styles.microcopy}>{t.hero.microcopy}</p>
          </Reveal>

          <Reveal>
            <div className={styles.monitor} ref={parallaxRef} aria-hidden="true">
              <div className={styles.bezel}>
                <Logo className={styles.bezelMark} size={15} />
                <span className={styles.ident}>{t.hero.ident}</span>
                <span className={styles.timecode}>{t.hero.timecode}</span>
              </div>

              <div className={styles.screen}>
                <div className={styles.rowLabel}>
                  <span>{t.hero.rowContinue}</span>
                  <span>{t.hero.seeAll}</span>
                </div>
                <PosterRow items={continueWatching} eager />

                <div className={`${styles.rowLabel} ${styles.secondRow}`}>
                  <span>{t.hero.rowPopular}</span>
                  <span>{t.hero.seeAll}</span>
                </div>
                <PosterRow items={popularNow} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Style the monitor**

In `Hero.module.css`, replace `.mockup`, `.chrome`, `.chromeLogo`, `.dot` and `.chromeSearch` with the monitor set. The old `.dot` window-chrome circles go — a rack monitor has no traffic lights:

```css
.headline {
  font-size: var(--fs-display);
  max-width: 18ch;
}

.accentWord {
  color: var(--sig-stream);
}

.monitor {
  margin-top: clamp(3rem, 6vw, 5rem);
  background: var(--recess);
  border: 1px solid var(--score);
  border-radius: var(--radius);
  transform: translateY(calc(var(--parallax, 0px) * -1));
}

/* The bezel: ident left, timecode hard right, mono throughout. */
.bezel {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.9rem;
  border-bottom: 1px solid var(--score);
  font-family: var(--font-label);
  font-size: var(--fs-label);
  letter-spacing: 0.1em;
  color: var(--engrave);
}

.ident {
  color: var(--sig-stream);
}

.timecode {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

.screen {
  padding: clamp(1rem, 2.5vw, 1.75rem);
  background: var(--chassis);
}
```

Keep every existing `.posters`, `.poster`, `.posterArt`, `.posterBadge`, `.posterInfo`, `.posterTitle`, `.posterMeta`, `.progressTrack` and `.progressBar` rule — retint them to the new tokens but do not change their layout, `container-type`, `cqi` sizing or the `max()` floor.

- [ ] **Step 5: Verify the poster pipeline survived**

- `read_network_requests` with `urlPattern: "metahub"` — expect 18 poster requests, all 200. The six backdrop tiles should no longer be requested.
- `read_console_messages` — no errors.
- Screenshot at 1280 and 375.
- Toggle language, screenshot at 1280 — confirm the longer Spanish claim still clears the rail.

- [ ] **Step 6: Gate**

```bash
npm run build
```

Expected: exits 0. TypeScript will catch a missed `heroBackdrop` reference or a missing `ident`/`timecode` key in either dictionary — that is the compile-error guarantee doing its job.

---

### Task 6: ValueProps as four resource modules

**Files:**
- Modify: `src/components/ValueProps.tsx`
- Modify: `src/components/ValueProps.module.css`
- Modify: `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/es.ts`

**Interfaces:**
- Consumes: `.rail` from Task 3 (already applied in Task 3 Step 3); the four `--sig-*` tokens from Task 1.
- Produces: the `value.resources` key and the `resource` field on `value.items` — **Task 8 reuses the same four labels in the crosspoint matrix**, so the names set here are load-bearing.

**Note on count:** `value.items` currently holds **three** entries. The resource taxonomy has **four** types. Do not invent a fourth value proposition to force symmetry — that is exactly the fake structure this re-direction removes. Instead, tag the three existing items with the resource each one is really about and let the grid be a 3-up. The fourth colour still earns its keep in the matrix (Task 8) and the routing diagram (Task 7).

- [ ] **Step 1: Type the resource tag**

In `src/i18n/types.ts`, above `Dictionary`:

```ts
/** The four resource types a Stremio add-on can declare. */
export type ResourceKey = 'catalog' | 'meta' | 'stream' | 'subtitles'
```

Change the `value` block to:

```ts
  value: {
    eyebrow: string
    title: string
    lead: string
    /** Display names for the four add-on resource types. */
    resources: Record<ResourceKey, string>
    items: { title: string; body: string; resource: ResourceKey }[]
  }
```

- [ ] **Step 2: Fill both dictionaries**

In `src/i18n/en.ts`, inside `value`, add `resources` and tag each existing item — **the three `title` and `body` strings are unchanged**:

```ts
    resources: {
      catalog: 'Catalog',
      meta: 'Metadata',
      stream: 'Stream',
      subtitles: 'Subtitles',
    },
```

Then append `resource: 'stream'` to the "Free, forever" item, `resource: 'catalog'` to "A catalog without walls", and `resource: 'meta'` to "Every screen you own".

In `src/i18n/es.ts`, the same tags on the same three items, plus:

```ts
    resources: {
      catalog: 'Catálogo',
      meta: 'Metadatos',
      stream: 'Emisión',
      subtitles: 'Subtítulos',
    },
```

- [ ] **Step 3: Render the modules**

In `ValueProps.tsx`, each item becomes a module with a colour-coded port header. Map the resource key to a CSS custom property so the colour is set once:

```tsx
{t.value.items.map((item, i) => (
  <Reveal key={item.title} delay={i * 90}>
    <article
      className={styles.module}
      style={{ '--sig': `var(--sig-${item.resource})` } as CSSProperties}
    >
      <span className={styles.port}>{t.value.resources[item.resource]}</span>
      <h3 className={styles.moduleTitle}>{item.title}</h3>
      <p className={styles.moduleBody}>{item.body}</p>
    </article>
  </Reveal>
))}
```

Add `import type { CSSProperties } from 'react'` at the top.

- [ ] **Step 4: Style the modules**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
  gap: 1px;
  background: var(--score);
  border: 1px solid var(--score);
}

/*
  Gap of 1px over a scored background draws the seams between modules —
  the panel is milled from one piece, not assembled from cards.
*/
.module {
  padding: clamp(1.5rem, 3vw, 2.25rem);
  background: var(--panel);
  border-top: 2px solid var(--sig);
}

.port {
  display: inline-block;
  margin-bottom: 1.1rem;
  font-family: var(--font-label);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sig);
}

.moduleTitle {
  margin-bottom: 0.7rem;
  font-size: var(--fs-h3);
}

.moduleBody {
  font-size: var(--fs-sm);
  color: var(--text-2);
}
```

- [ ] **Step 5: Verify**

Screenshot at 1280 and 375. Confirm the three modules carry three different signal colours along their top edge and that the port labels translate when the language toggles.

- [ ] **Step 6: Gate**

```bash
npm run build && npm run check:contrast
```

---

### Task 7: HowItWorks as the routing diagram

**Files:**
- Modify: `src/components/HowItWorks.tsx`
- Modify: `src/components/HowItWorks.module.css`

**Interfaces:**
- Consumes: `.rail` from Task 3; `--sig-*` and `--engrave` from Task 1; `t.how.steps` — **four** entries, each with `number`, `title`, `body`, unchanged.
- Produces: nothing later tasks depend on.

This is where the rail is elaborated into a full diagram — the same object, not a second idea, at the one section whose content genuinely is a sequence.

**Step count: there are FOUR steps, not three.** `t.how.steps` holds four entries in both dictionaries, and `how.title` reads "From download to playing in four steps". Any layout built for three will wrap the fourth stage onto its own row, off the cable.

**What the colours mean here.** The four stages are the reader's actions, and the cable's colour at each stage is the resource that has come online by that point:

| # | Step | Marker colour | Why |
|---|---|---|---|
| 01 | Install Stremio | `--engrave` | the client alone; no add-on has been connected yet |
| 02 | Add your add-ons | `--sig-catalog` | catalogs are what an add-on contributes first |
| 03 | Build your library | `--sig-meta` | the library is metadata about what you keep |
| 04 | Press play | `--sig-stream` | the stream resource is what actually plays |

That is a real signal path, not decoration, and it keeps the hue-to-resource mapping the reader learned in Task 6. `--sig-subtitles` deliberately does not appear here — it earns its place in the Task 8 matrix.

- [ ] **Step 1: Wrap in the rail and render the run**

```tsx
<div className="rail">
  <div className="rail-bus">
    <span className="rail-junction" aria-hidden="true" />
  </div>

  <div className="rail-body">
    <Reveal className="section-head">
      <span className="eyebrow">{t.how.eyebrow}</span>
      <h2>{t.how.title}</h2>
      <p className="section-lead">{t.how.lead}</p>
    </Reveal>

    <ol className={styles.run}>
      {t.how.steps.map((step, i) => (
        <Reveal key={step.title} delay={i * 110}>
          <li className={styles.stage}>
            <span className={styles.marker} aria-hidden="true" />
            <span className={styles.stageNo}>{step.number}</span>
            <h3 className={styles.stageTitle}>{step.title}</h3>
            <p className={styles.stageBody}>{step.body}</p>
          </li>
        </Reveal>
      ))}
    </ol>

    <Reveal>
      <aside className={styles.note}>
        <h3 className={styles.noteTitle}>{t.how.noteTitle}</h3>
        <p className={styles.noteBody}>{t.how.noteBody}</p>
      </aside>
    </Reveal>
  </div>
</div>
```

`<ol>` is correct here and was correct before: the steps are ordered, and the diagram is a visual restatement of that order rather than a substitute for it.

- [ ] **Step 2: Draw the cable**

The run is a horizontal cable at ≥760px and a vertical one below. The cable is a border on the list; the markers are dots on each stage:

```css
.run {
  position: relative;
  display: grid;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stage {
  position: relative;
  padding-left: 2rem;
}

/* Vertical cable, mobile-first: a border down the list. */
.run::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 0.6rem;
  bottom: 0.6rem;
  width: var(--rail-line);
  background: linear-gradient(
    to bottom,
    var(--engrave),
    var(--sig-catalog),
    var(--sig-meta),
    var(--sig-stream)
  );
}

.marker {
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 12px;
  height: 12px;
  background: var(--chassis);
  border: 2px solid var(--engrave);
  border-radius: 50%;
}

/*
  One marker per stage, coloured by the resource that has come online by
  that point in the sequence. Four stages, four states — see the table in
  this task's header for why each is what it is.
*/
.stage:nth-child(2) .marker {
  border-color: var(--sig-catalog);
}

.stage:nth-child(3) .marker {
  border-color: var(--sig-meta);
}

.stage:nth-child(4) .marker {
  border-color: var(--sig-stream);
}

.stageNo {
  display: block;
  margin-bottom: 0.5rem;
  font-family: var(--font-label);
  font-size: var(--fs-label);
  letter-spacing: 0.12em;
  color: var(--engrave);
}

.stageTitle {
  margin-bottom: 0.6rem;
  font-size: var(--fs-h3);
}

.stageBody {
  font-size: var(--fs-sm);
  color: var(--text-2);
}

/*
  Two-up first: four stages across a 760px column would crush each to
  ~170px. The cable stays vertical here because a horizontal cable through
  a 2x2 grid would have to jump rows, which is a lie about the signal path.
*/
@media (min-width: 760px) {
  .run {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem clamp(1.5rem, 3vw, 3rem);
  }
}

/* Four-up: only now is there room for one continuous horizontal run. */
@media (min-width: 1080px) {
  .run {
    grid-template-columns: repeat(4, 1fr);
    gap: 0 clamp(1.5rem, 3vw, 3rem);
  }

  .stage {
    padding-left: 0;
    padding-top: 2.25rem;
  }

  /* Cable rotates to horizontal, running through every marker. */
  .run::before {
    left: 0;
    right: 0;
    top: 5px;
    bottom: auto;
    width: auto;
    height: var(--rail-line);
    background: linear-gradient(
      to right,
      var(--engrave),
      var(--sig-catalog),
      var(--sig-meta),
      var(--sig-stream)
    );
  }

  .marker {
    top: 0;
  }
}
```

At the 2-up breakpoint the vertical cable from the mobile layout would run down the left edge of the first column only, which is wrong. Either scope `.run::before` to the mobile and 4-up cases and hide it in the 2-up range, or give each `.stage` its own short connector. Pick one, and say which in your report.

- [ ] **Step 3: Verify the diagram reflows**

Measure at 375, 760, 1080 and 1280. The cable must pass through **all four** markers at the widths where it is drawn, and must not extend past the first or last marker into empty space. If the gradient runs edge-to-edge past the outer markers at ≥1080px, inset `.run::before` by half a column.

Assert, with numbers, that all four `.marker` centres sit on the cable's axis: at ≥1080px every marker's vertical centre must equal the cable's vertical centre within 1px; below that, every marker's horizontal centre must equal the cable's horizontal centre within 1px.

- [ ] **Step 4: Gate**

```bash
npm run build
```

---

### Task 8: Comparison as a crosspoint matrix

**Files:**
- Modify: `src/components/Comparison.tsx:6-20` (icons), `:44-98` (rail wrapper)
- Modify: `src/components/Comparison.module.css`

**Interfaces:**
- Consumes: `.rail` from Task 3; `--sig-stream`, `--dead` from Task 1; `ComparisonRow` from `src/i18n/types.ts` (unchanged).
- Produces: nothing later tasks depend on.

**Accessibility is non-negotiable here.** Keep every one of these exactly as written in the current component: `role="region"`, `tabIndex={0}` and `aria-label` on the scroller; `<caption className="visually-hidden">`; `scope="col"` / `scope="row"`; and the per-cell `<span className="visually-hidden">` spelling out yes/no. A crosspoint button that only communicates through colour and shape is unusable without them.

- [ ] **Step 1: Replace the icons with crosspoint states**

A crosspoint is lit or unlit, not a tick or a dash. Replace `CheckIcon` and `DashIcon` (`src/components/Comparison.tsx:6-20`) with a single component:

```tsx
/**
 * A crosspoint: lit where a source connects to a feature, unlit where it
 * does not. Purely presentational — Cell always spells the state out for
 * assistive tech alongside it.
 */
function Crosspoint({ on }: { on: boolean }) {
  return <span className={on ? styles.lit : styles.unlit} aria-hidden="true" />
}
```

Then in `Cell`, replace the boolean branch:

```tsx
  if (typeof value === 'boolean') {
    return (
      <span className={styles.cellInner}>
        <Crosspoint on={value} />
        <span className="visually-hidden">{value ? t.compare.yes : t.compare.no}</span>
      </span>
    )
  }
```

- [ ] **Step 2: Style the matrix**

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-label);
  font-size: var(--fs-sm);
}

.table th,
.table td {
  padding: 0.85rem 1rem;
  text-align: center;
  border: 1px solid var(--score);
}

.rowLabel {
  text-align: left;
  font-weight: 500;
  color: var(--text-2);
}

.note {
  display: block;
  margin-top: 0.25rem;
  font-size: var(--fs-xs);
  color: var(--engrave);
}

/* The Stremio column is the destination the whole page routes toward. */
.highlight {
  background: var(--accent-soft);
}

.cellInner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Lit crosspoint: a square button, glowing from its own colour. */
.lit {
  width: 13px;
  height: 13px;
  background: var(--sig-stream);
  border-radius: 2px;
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.unlit {
  width: 13px;
  height: 13px;
  border: 1px solid var(--dead);
  border-radius: 2px;
}

.scroller {
  overflow-x: auto;
  background: var(--recess);
  border: 1px solid var(--score);
}

.scroller:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

`.lit` here is a CSS Module class, locally scoped — it cannot collide with the global `.lit` token class from Task 1.

- [ ] **Step 3: Wrap in the rail**

Replace `<div className="container">` with the same `.rail` / `.rail-bus` / `.rail-junction` / `.rail-body` structure used in Tasks 5–7, leaving the scroller, table and captions inside `.rail-body` untouched.

- [ ] **Step 4: Close the page-level horizontal overflow**

**This section owns the page's only remaining horizontal-overflow defect, and it is a hard gate.** Measured at a 375px viewport during Task 4: `document.documentElement.scrollWidth` is 572 against a `clientWidth` of 375. Isolation proved the source — hiding the header leaves 572 unchanged; hiding this section's `.scroller` drops it to exactly 375.

The subtle part: the `.scroller` element itself measures only 335px wide at `left: 20`, so the container is correctly constrained. Something **inside** it is escaping the `overflow-x: auto` clip. Find the escaping descendant rather than masking the symptom.

Do **not** fix this with `overflow: hidden` on `body` or on an ancestor. `body` already carries `overflow-x: hidden` from the original stylesheet, which is precisely why this bug stayed invisible; leaning on it hides content instead of fixing layout.

Acceptance, in **both** languages at **320** and **375** px:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

must be `true`, while the matrix itself still scrolls horizontally inside its own container.

- [ ] **Step 5: Verify accessibility survived**

- `read_page` — confirm the table still exposes its caption, column headers and row headers, and that each boolean cell reports "Yes" or "No" as text.
- `computer` `key: "Tab"` to the scroller — confirm the focus ring appears and arrow keys scroll it.
- Screenshot at 375 (matrix scrolls inside its container) and 1280.
- `javascript_tool`: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` — expect `true` at 375. The matrix must not push the page sideways.

- [ ] **Step 6: Gate**

```bash
npm run build && npm run check:contrast
```

---

### Task 9: Testimonials and FAQ, deliberately flat

**Files:**
- Modify: `src/components/Testimonials.tsx`, `src/components/Testimonials.module.css`
- Modify: `src/components/FAQ.tsx`, `src/components/FAQ.module.css`

**Interfaces:**
- Consumes: `.rail` from Task 3; tokens from Task 1.
- Produces: nothing.

These two sections get **no metaphor**. Silkscreen labels, scored dividers, nothing else. If every section is a control surface, none of them reads as one — these two flat stretches are what make the crosspoint matrix land.

- [ ] **Step 1: Flatten Testimonials**

Wrap in `.rail` as in Task 8 Step 3. Quotes sit on scored dividers with no cards, no avatars-as-discs, no quote marks:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: clamp(1.75rem, 3vw, 2.75rem);
}

.item {
  padding-top: 1.25rem;
  border-top: 1px solid var(--score);
}

.quote {
  margin-bottom: 1.1rem;
  font-size: var(--fs-body);
  color: var(--text);
}

.name {
  display: block;
  font-family: var(--font-label);
  font-size: var(--fs-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--silk);
}

.context {
  display: block;
  margin-top: 0.2rem;
  font-family: var(--font-label);
  font-size: var(--fs-xs);
  color: var(--engrave);
}
```

If the current markup renders `initials` as a circular avatar, drop that element — it is decoration this section no longer wants. Leave the `initials` key in the dictionaries; removing it would mean editing copy, which is out of scope.

- [ ] **Step 2: Flatten FAQ**

Wrap in `.rail`. Keep whatever native `<details>`/`<summary>` or button-based disclosure the component already uses — **do not convert it to toggle switches**, which was cut from the design for being a third control-surface idea:

```css
.item {
  border-bottom: 1px solid var(--score);
}

.question {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1.15rem 0;
  text-align: left;
  font-family: var(--font-body);
  font-size: var(--fs-body);
  font-weight: 500;
  color: var(--silk);
}

.question:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.answer {
  padding-bottom: 1.35rem;
  font-size: var(--fs-sm);
  color: var(--text-2);
  max-width: 62ch;
}
```

- [ ] **Step 3: Verify**

Screenshot both sections at 1280 and 375. Open and close two FAQ items with `computer` clicks, then `read_page` to confirm the expanded state is still exposed (`aria-expanded` or `<details open>`).

- [ ] **Step 4: Gate**

```bash
npm run build
```

---

### Task 10: FinalCTA lit, and the footer plate

**Files:**
- Modify: `src/components/FinalCTA.tsx`, `src/components/FinalCTA.module.css`
- Modify: `src/components/Footer.tsx`, `src/components/Footer.module.css`

**Interfaces:**
- Consumes: the `.lit` class from Task 1 (already applied to the wrapper in `src/App.tsx:27`).
- Produces: nothing.

- [ ] **Step 1: Confirm the lit inversion works before styling**

With the dev server running, `javascript_tool`:

```js
getComputedStyle(document.querySelector('.lit')).backgroundColor
```

Expect the light chassis (`rgb(223, 228, 224)`). If it returns the dark value, the `.lit` block from Task 1 is not applying — fix that before continuing, because everything in this task depends on the inversion.

- [ ] **Step 2: Style the terminal panel**

The signal arrives. This is the one section where the rail terminates rather than passes through, so it gets an arrival marker instead of a junction:

```css
.final {
  padding-block: clamp(5rem, 10vw, 9rem);
  background: var(--chassis);
  color: var(--text);
  border-top: 3px solid var(--sig-stream);
}

.terminus {
  display: block;
  margin-bottom: 1.5rem;
  font-family: var(--font-label);
  font-size: var(--fs-label);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sig-stream);
}

.title {
  font-size: var(--fs-h2);
  max-width: 16ch;
}

.reassurances {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.5rem;
  margin-top: 1.75rem;
  font-family: var(--font-label);
  font-size: var(--fs-xs);
  color: var(--text-2);
}
```

Render `t.finalCta.eyebrow` through `.terminus` rather than the global `.eyebrow` — this section is outside the rail's numbered run, so it must not increment the channel counter.

- [ ] **Step 3: Style the footer as a connector plate**

The footer sits outside `.lit` (it is a sibling of `<main>` in `src/App.tsx:31`), so it renders on the dark chassis.

**Note from Task 1:** `Footer.tsx` used to carry a raw `on-ink` class alongside its module class. Under the old paper palette that inverted the footer to dark against a light page; now that the page is dark by default, the inversion is wrong, so Task 1 removed the class outright rather than renaming it to `lit`. The element is plain `<footer className={styles.footer}>` — do not reintroduce an inversion class here.

```css
.footer {
  padding-block: clamp(2.5rem, 5vw, 4rem);
  background: var(--recess);
  border-top: 1px solid var(--score);
  font-family: var(--font-label);
  font-size: var(--fs-xs);
  color: var(--engrave);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  margin-bottom: 1.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.link:hover,
.link:focus-visible {
  color: var(--silk);
}

.disclaimer {
  max-width: 68ch;
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  line-height: 1.65;
}
```

Keep the `disclaimerStrong` / `disclaimerBody` split and the `{year}` substitution exactly as they are — that is the demo disclaimer and it must stay legible.

- [ ] **Step 4: Verify the page ends correctly**

Screenshot the bottom of the page at 1280 and 375. The transition from dark chassis to lit panel to dark footer plate should read as the signal arriving and the rack ending — not as three unrelated bands.

- [ ] **Step 5: Gate**

```bash
npm run build && npm run check:contrast
```

Both `:root` and `.lit` scopes are checked, so this gate covers the inverted section too.

---

### Task 11: Regenerate the brand plates

**Files:**
- Modify: `scripts/generate-icons.mjs:72-74`
- Modify: `public/favicon.svg:2-3`
- Regenerate: `public/favicon-32.png`, `public/favicon-180.png`, `public/apple-touch-icon.png`, `public/og-image.png`

**Interfaces:**
- Consumes: the palette from Task 1.
- Produces: the shipped icon set.

**Geometry does not change.** A play triangle knocked out of a diamond still works on a chassis. Only the plate colours change. `src/components/Logo.tsx` needs **no** edit — it is one `evenodd` path taking `currentColor`, so it re-inks itself from whatever block it sits in.

- [ ] **Step 1: Repoint the generator constants**

`scripts/generate-icons.mjs:72-74`:

```js
const MARK = hex('#6cc877')
const PAPER = hex('#dfe4e0')
const INK = hex('#1f2a2e')
```

`MARK` takes the stream green — the signal the product exists to deliver. `PAPER` becomes silkscreen (the touch-icon plate, since iOS composites transparency over black) and `INK` becomes the chassis (the OG plate).

- [ ] **Step 2: Match the static SVG**

`public/favicon.svg` hardcodes the same pair:

```html
<path d="M32 2.6 61.4 32 32 61.4 2.6 32 32 2.6Z" fill="#6cc877" />
<path d="M26 21.4 44.6 32 26 42.6V21.4Z" fill="#1f2a2e" />
```

Note the knockout flips: it was paper-on-vermilion and is now chassis-on-green, so the wedge reads as cut through to the panel behind.

- [ ] **Step 3: Regenerate**

```bash
npm run icons
```

Expected: writes four PNGs into `public/` with no errors.

- [ ] **Step 4: Verify the plates**

Read each generated PNG and confirm: `apple-touch-icon.png` shows the green mark on a light silkscreen plate with no transparent wedge; `og-image.png` is 1200×630, green mark on chassis. Then reload the dev server and confirm the browser tab icon updated.

- [ ] **Step 5: Gate**

```bash
npm run build
```

---

### Task 12: Full verification pass

**Files:** none modified — this task is the spec's §9 acceptance run.

**Interfaces:**
- Consumes: everything.
- Produces: a pass/fail report against each of the seven criteria.

- [ ] **Step 1: Build and contrast**

```bash
npm run build && npm run check:contrast
```

Expected: both exit 0, contrast reports `48/48`.

- [ ] **Step 2: The rail at four widths, both languages**

`resize_window` at 375, 1000, 1280, 1920. At each, in **both** languages:
- screenshot;
- `javascript_tool`: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` → `true`;
- junctions aligned to their sections, no collision with the claim, spine legible at 375.

Eight screenshots total. Spanish runs longer than English throughout — that is where collisions show up.

- [ ] **Step 3: Reduced motion**

`resize_window` accepts `colorScheme` but not motion, so force it in the page:

```js
matchMedia('(prefers-reduced-motion: reduce)').matches
```

Then verify against the media query directly by checking that `.reveal` elements have no transition when the query matches. In a browser where you can toggle the OS setting, reload and confirm: all content visible immediately, no parallax offset on the monitor, the hero path rendered already-drawn.

- [ ] **Step 4: The reveal failsafe**

Confirm `useReveal`'s 2s failsafe still fires. In the console:

```js
document.documentElement.classList.contains('reveal-failsafe')
```

Expect `false` on a normally-rendered page. Then confirm the rule still exists in the built CSS — `:root.reveal-failsafe .reveal` must survive, or a prerender pass ships a blank page.

- [ ] **Step 5: Poster pipeline**

Expect exactly **12** poster requests, all 200 — `continueWatching` (6) + `popularNow` (6).

Not 18. The README's "all 18 poster URLs" counted the 12 catalog posters **plus** the 6 `heroBackdrop` tiles, and Task 5 deleted the backdrop. 18 after Task 5 would mean the backdrop is still being fetched.

`read_network_requests` has a blind spot for some cross-origin requests in this environment; prefer:

```js
performance.getEntriesByType('resource').filter(e => e.name.includes('metahub')).length
```

The second poster row is lazy-loaded and will not fire on scroll while the browser pane is not compositing frames. Either display the pane, or force `loading="eager"` at runtime via the DOM to confirm all 12 resolve — do not change the source to do this.

- [ ] **Step 6: Keyboard and console**

Tab the whole page start to finish. Every interactive control shows a visible focus ring: nav links, language button, both hero CTAs, the matrix scroller, every FAQ disclosure, footer links. Then `read_console_messages` — expect zero errors across the full scroll.

- [ ] **Step 7: Report**

Write the result of each of the seven spec §9 criteria as pass or fail with the evidence. **If any criterion fails, say so plainly rather than reporting the pass count** — a partial pass reported as a pass is worse than a clear failure.

---

## Self-Review

**Spec coverage.** §3 taxonomy → Tasks 1, 6, 8. §4.1 colour → Task 1. §4.2 type → Task 2. §4.3 texture → Task 2 Step 3. §5 rail → Task 3, applied in 5–9. §5.2 mobile → Task 3 Step 4, Task 12 Step 2. §5.3 counter → Task 3 Steps 1–2. §6 sections → Tasks 4–10. §7 icons → Task 11; `index.html` → Task 2; i18n → Tasks 5, 6. §8 motion → Task 12 Step 3. §9 verification → Task 12.

**Two gaps found and closed while reviewing:**

1. **The taxonomy has four resource types; `value.items` has three entries.** The plan originally implied a 4-up grid, which would have required inventing a fourth value proposition — the exact fake structure the spec exists to remove. Task 6 now states the count mismatch explicitly and keeps the 3-up.
2. **A naming collision.** Task 8's crosspoint state class and Task 1's token class were both called `.lit`. They do not actually collide — one is CSS Module-scoped, the other global — but a reader would reasonably assume a bug. Task 8 Step 2 now says so in place.

**Spec §8's hero path animation** is specified in the spec but has no dedicated task; it is folded into Task 5's monitor and Task 12 Step 3's reduced-motion check. If it grows beyond a CSS transition on the rail's first junction, split it out rather than expanding Task 5.
