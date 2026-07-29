/**
 * Generates the raster icons (favicon PNG fallback, apple-touch-icon, OG image)
 * from the same vector definition as public/favicon.svg.
 *
 * Written with zero dependencies: the logo is drawn analytically with signed
 * distance fields and supersampled, then encoded as PNG using node's built-in
 * zlib. Run with `npm run icons` after changing the mark.
 */
import zlib from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public')

/* ---------------------------------------------------------------- PNG ---- */

const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePNG(width, height, rgba) {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // colour type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* ---------------------------------------------------------------- SDF ---- */

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
]

// Two inks, no blend: the mark prints stream green with the play knocked out in paper.
const MARK = hex('#6cc877')
const PAPER = hex('#dfe4e0')
const INK = hex('#1f2a2e')

function sdRoundBox(px, py, hx, hy, r) {
  const qx = Math.abs(px) - hx + r
  const qy = Math.abs(py) - hy + r
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
  )
}

function sdSegment(px, py, ax, ay, bx, by) {
  const pax = px - ax
  const pay = py - ay
  const bax = bx - ax
  const bay = by - ay
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay) / (bax * bax + bay * bay)))
  return Math.hypot(pax - bax * h, pay - bay * h)
}

const cross = (ax, ay, bx, by, px, py) => (bx - ax) * (py - ay) - (by - ay) * (px - ax)

function sdTriangle(px, py, v) {
  const d = Math.min(
    sdSegment(px, py, v[0][0], v[0][1], v[1][0], v[1][1]),
    sdSegment(px, py, v[1][0], v[1][1], v[2][0], v[2][1]),
    sdSegment(px, py, v[2][0], v[2][1], v[0][0], v[0][1]),
  )
  const d1 = cross(v[0][0], v[0][1], v[1][0], v[1][1], px, py)
  const d2 = cross(v[1][0], v[1][1], v[2][0], v[2][1], px, py)
  const d3 = cross(v[2][0], v[2][1], v[0][0], v[0][1], px, py)
  const inside = !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0))
  return inside ? -d : d
}

/**
 * Samples the logo at a point. `size` is the diamond's full diagonal.
 * Returns [r, g, b, alpha 0..1].
 */
function sampleLogo(px, py, cx, cy, size) {
  const dx = px - cx
  const dy = py - cy

  // Rotate into the square's own frame (the diamond is a square turned 45deg).
  const c = Math.SQRT1_2
  const lx = dx * c + dy * c
  const ly = -dx * c + dy * c

  const side = size * Math.SQRT1_2
  const half = side / 2
  // Square corners: the mark is a stamp, not a rounded app tile.
  const inDiamond = sdRoundBox(lx, ly, half, half, 0) < 0
  if (!inDiamond) return null

  // Play triangle, proportions matched to favicon.svg
  const tri = [
    [cx - size * 0.094, cy - size * 0.148],
    [cx - size * 0.094, cy + size * 0.148],
    [cx + size * 0.163, cy],
  ]
  if (sdTriangle(px, py, tri) < 0) return [...PAPER, 1]

  return [...MARK, 1]
}

/* -------------------------------------------------------------- render --- */

const SS = 4 // supersampling factor per axis

function render(width, height, { logoSize, background = null }) {
  const buf = Buffer.alloc(width * height * 4)
  const cx = width / 2
  const cy = height / 2

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x + (sx + 0.5) / SS
          const py = y + (sy + 0.5) / SS
          const s = sampleLogo(px, py, cx, cy, logoSize)
          if (s) {
            r += s[0]
            g += s[1]
            b += s[2]
            a += 1
          }
        }
      }

      const n = SS * SS
      const cov = a / n
      const i = (y * width + x) * 4

      const bg = background

      if (cov === 0) {
        if (bg) {
          buf[i] = bg[0]
          buf[i + 1] = bg[1]
          buf[i + 2] = bg[2]
          buf[i + 3] = 255
        }
        continue
      }

      // Average the covered samples, then composite over the background.
      const lr = r / a
      const lg = g / a
      const lb = b / a
      if (bg) {
        buf[i] = bg[0] + (lr - bg[0]) * cov
        buf[i + 1] = bg[1] + (lg - bg[1]) * cov
        buf[i + 2] = bg[2] + (lb - bg[2]) * cov
        buf[i + 3] = 255
      } else {
        buf[i] = lr
        buf[i + 1] = lg
        buf[i + 2] = lb
        buf[i + 3] = Math.round(cov * 255)
      }
    }
  }
  return encodePNG(width, height, buf)
}

/* ---------------------------------------------------------------- run ---- */

const targets = [
  ['favicon-32.png', render(32, 32, { logoSize: 30 })],
  ['favicon-180.png', render(180, 180, { logoSize: 168 })],
  // Opaque plates: iOS composites transparency over black, and a social card
  // has to carry the palette on its own.
  ['apple-touch-icon.png', render(180, 180, { logoSize: 128, background: PAPER })],
  ['og-image.png', render(1200, 630, { logoSize: 240, background: INK })],
]

for (const [name, data] of targets) {
  writeFileSync(resolve(OUT, name), data)
  console.log(`${name.padEnd(22)} ${(data.length / 1024).toFixed(1)} kB`)
}
