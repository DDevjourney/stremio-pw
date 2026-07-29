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
