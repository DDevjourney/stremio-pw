# Known issues and follow-ups

Recorded 2026-07-29, after the "patchbay" aesthetic re-direction
(`docs/superpowers/plans/2026-07-28-patchbay-redirect.md`).

---

## 1. FAQ answers never expand — real bug, pre-existing

**Status:** open. Not caused by the re-direction; the rules involved are unchanged
from the repository's first commit and no task in the plan touched them.

**Symptom.** Clicking a question flips `aria-expanded` to `true` and applies
`.open` correctly, but the answer never appears. The panel stays at zero height.

**Evidence gathered (all measured live, at 375px and 1280px):**

- `.open` genuinely applies — the item's class list gains `_open_*`.
- The rule `._open_* ._panel_* { grid-template-rows: 1fr }` exists in the served
  CSS and matches the element.
- The panel's computed `grid-template-rows` stays `0px` in the open state.
- Forcing `panel.style.gridTemplateRows = '1fr'` inline **does not** grow it.
- `.panelInner` reports `height: 0` but `scrollHeight: 166` — the content is
  present and being clipped to nothing.
- The answer `<p>` itself has a real height of ~165.6px.

**Ruled out:**

- *Environment artifact.* An isolated `0fr → 1fr` accordion built on the same
  page in the same browser resolves correctly (27.19px). The mechanism works
  here; it is this markup that fails.
- *Reduced motion.* Reproduces with `prefers-reduced-motion: reduce` false.
- *`inert`.* `FAQ.tsx` passes `inert={!isOpen}`, which **is** toggled correctly
  with the open state, so `inert` is not suppressing the panel.
- *`min-height: auto` on the grid item.* `.panelInner` already carries
  `overflow: hidden`, which gives an automatic minimum size of 0 — that is
  precisely why the closed state collapses correctly.

**Where to look next.** The fact that an inline `1fr` also fails points away from
the cascade and toward the row having no free space to distribute. Investigate how
the `fr` track resolves against this particular ancestor chain, rather than
hunting for an overriding rule.

**Do not** bundle this into a styling change. It is a functional bug and deserves
its own fix and its own verification.

---

## 2. Two things were never verified by eye

The browser pane never composited frames during the entire re-direction, so
`computer` screenshots were unavailable throughout. Every check was DOM- and
geometry-based. Two criteria are therefore honestly **NOT MEASURED**:

- **Real-keyboard focus rings.** The global `:focus-visible` rule is present and
  no component overrides it with `outline: none`, so the structure is sound — but
  `:focus-visible` does not trigger on programmatic `.focus()`, and synthetic key
  dispatch did not move focus in this environment. Nobody has watched a Tab key
  walk the page.
- **OS-level reduced-motion behaviour.** The `prefers-reduced-motion: reduce`
  block was verified to exist and to neutralise transitions and the reveal, but
  the OS setting could not be toggled to observe it actually applying.

Both are worth ten minutes in a real browser.

---

## 3. Fragile spot introduced by the rail-continuity fix

`global.css` uses `.section:has(.rail) { padding-block: 0 }`, moving the vertical
padding onto `.rail-body` so the rail's grid row spans the full section box and
consecutive bus segments meet.

A future CSS module that puts `padding-block` back on a rail-bearing section box
will win on specificity and silently reopen the gaps — the exact defect this
fixed, where the rail rendered as six disconnected stubs covering 66% of the
document instead of one continuous path.

If you change section spacing, re-measure that consecutive `.rail-bus` segments
still meet:

```js
[...document.querySelectorAll('.rail-bus')]
  .map(b => b.getBoundingClientRect())
  .map((r, i, a) => i ? Math.round(r.top - a[i - 1].bottom) : null)
```

Every gap must be 0–1px. The two 1px residues are HowItWorks' own `border-block`,
not holes.

---

## 4. Deliberately unused, do not "tidy" away

- **`--sig-subtitles`** is the fourth declared add-on resource type. It is defined,
  translated, and contrast-cleared, but no section's content maps to it, so it
  renders nowhere. Documented at its definition. Deleting it would break the
  four-type taxonomy the colour system rests on.
- **`t.testimonials.initials`** is retained though nothing reads it. The initials
  disc it fed was decoration that carried no information the name does not.
  Removing the key would mean editing copy.
