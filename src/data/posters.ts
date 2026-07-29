/**
 * Catalog mockup shown in the hero.
 *
 * Artwork comes from Cinemeta / metahub — the same public, key-less metadata
 * service the Stremio app itself uses, addressed by IMDb id. Images are
 * hotlinked rather than redistributed, and every card falls back to its
 * gradient if the CDN is unreachable.
 *
 * Language-independent on purpose: titles are proper nouns and badges are
 * codes. Only `genre` is translated, via the `genres` map in each dictionary.
 */

export type GenreKey =
  | 'crime'
  | 'scifi'
  | 'drama'
  | 'animation'
  | 'scifiHorror'
  | 'action'
  | 'thriller'

export type PosterItem = {
  /** IMDb id — the key metahub addresses posters by. */
  imdb: string
  title: string
  year: string
  genre: GenreKey
  /** Fallback cover, shown while loading or if the image fails. */
  art: string
  badge?: string
  /** Percentage watched, for the "Continue watching" row. */
  progress?: number
}

export const posterUrl = (imdb: string) =>
  `https://images.metahub.space/poster/medium/${imdb}/img`

/**
 * Decorative poster wall stacked down the right margin of the hero.
 *
 * Deliberately different titles from the catalog mockup below, so the two
 * layers don't read as a repeat. Positions are percentages of the backdrop
 * box; `depth` scales the shared parallax offset so tiles drift at different
 * rates. Everything here is presentational — the layer is aria-hidden.
 */
export type BackdropTile = {
  imdb: string
  /** Vertical position within the backdrop. */
  top: string
  /**
   * Gap between the tile and the text column, measured from the rail's inner
   * edge. Must clear the tile's blur halo, which spills roughly 1.5x the blur
   * radius past the box — so this tracks `blur`.
   */
  inset: string
  /** Fluid width; tiles extend outward and may bleed off the screen edge. */
  width: string
  rotate: string
  blur: string
  opacity: number
  depth: number
}

/*
 * Tiles live in a single rail covering the margin to the right of the
 * headline block (see `--rail` in Hero.module.css), anchored to the rail's
 * INNER edge — the text boundary — so they hug the claim at every width and
 * grow outward, bleeding off the screen edge rather than inward.
 *
 * `inset` is therefore the only thing standing between a tile and the text,
 * which is why it scales with each tile's blur radius. Tiles print in
 * greyscale multiply, so they read as ink on the stock rather than as
 * artwork sitting on top of it.
 */
const LARGE = 'clamp(130px, 15vw, 230px)'
const MEDIUM = 'clamp(105px, 11.5vw, 175px)'
const SMALL = 'clamp(88px, 9.5vw, 145px)'

export const heroBackdrop: BackdropTile[] = [
  { imdb: 'tt0468569', top: '1%', inset: '58px', width: LARGE, rotate: '2.5deg', blur: '3px', opacity: 0.5, depth: 0.18 },
  { imdb: 'tt1392190', top: '17%', inset: '178px', width: SMALL, rotate: '-3deg', blur: '2px', opacity: 0.42, depth: 0.38 },
  { imdb: 'tt1375666', top: '33%', inset: '56px', width: MEDIUM, rotate: '-2deg', blur: '2.5px', opacity: 0.46, depth: 0.3 },
  { imdb: 'tt0944947', top: '54%', inset: '156px', width: LARGE, rotate: '1.5deg', blur: '3.5px', opacity: 0.4, depth: 0.12 },
  { imdb: 'tt14452776', top: '72%', inset: '62px', width: SMALL, rotate: '3deg', blur: '2px', opacity: 0.44, depth: 0.24 },
  { imdb: 'tt0068646', top: '86%', inset: '190px', width: MEDIUM, rotate: '-2.5deg', blur: '3px', opacity: 0.36, depth: 0.2 },
]

export const continueWatching: PosterItem[] = [
  {
    imdb: 'tt0903747',
    title: 'Breaking Bad',
    year: '2008',
    genre: 'crime',
    art: 'linear-gradient(165deg, #1c3f36 0%, #4d7c4a 45%, #d9a441 100%)',
    badge: 'S5 · E14',
    progress: 62,
  },
  {
    imdb: 'tt15239678',
    title: 'Dune: Part Two',
    year: '2024',
    genre: 'scifi',
    art: 'linear-gradient(165deg, #3b1f0b 0%, #b45309 55%, #fbbf24 100%)',
    badge: '4K',
    progress: 28,
  },
  {
    imdb: 'tt0816692',
    title: 'Interstellar',
    year: '2014',
    genre: 'scifi',
    art: 'linear-gradient(165deg, #05070f 0%, #1e3a5f 50%, #94a3b8 100%)',
    badge: '4K',
    progress: 81,
  },
  {
    imdb: 'tt3581920',
    title: 'The Last of Us',
    year: '2023',
    genre: 'drama',
    art: 'linear-gradient(165deg, #14261a 0%, #3f6212 55%, #a3a380 100%)',
    badge: 'S1 · E6',
    progress: 45,
  },
  {
    imdb: 'tt11126994',
    title: 'Arcane',
    year: '2021',
    genre: 'animation',
    art: 'linear-gradient(165deg, #2e1065 0%, #7e22ce 45%, #22d3ee 100%)',
    badge: 'S2 · E3',
    progress: 17,
  },
  {
    imdb: 'tt1856101',
    title: 'Blade Runner 2049',
    year: '2017',
    genre: 'scifi',
    art: 'linear-gradient(165deg, #4a1d0a 0%, #ea580c 50%, #fcd34d 100%)',
    badge: '4K',
    progress: 90,
  },
]

export const popularNow: PosterItem[] = [
  {
    imdb: 'tt4574334',
    title: 'Stranger Things',
    year: '2016',
    genre: 'scifiHorror',
    art: 'linear-gradient(165deg, #0a0a0a 0%, #7f1d1d 55%, #ef4444 100%)',
    badge: 'HDR',
  },
  {
    imdb: 'tt15398776',
    title: 'Oppenheimer',
    year: '2023',
    genre: 'drama',
    art: 'linear-gradient(165deg, #1c1917 0%, #78350f 50%, #f59e0b 100%)',
    badge: '4K',
  },
  {
    imdb: 'tt11280740',
    title: 'Severance',
    year: '2022',
    genre: 'thriller',
    art: 'linear-gradient(165deg, #0f172a 0%, #1e40af 50%, #bae6fd 100%)',
    badge: 'S2',
  },
  {
    imdb: 'tt0133093',
    title: 'The Matrix',
    year: '1999',
    genre: 'action',
    art: 'linear-gradient(165deg, #020604 0%, #14532d 50%, #4ade80 100%)',
    badge: '4K',
  },
  {
    imdb: 'tt7366338',
    title: 'Chernobyl',
    year: '2019',
    genre: 'drama',
    art: 'linear-gradient(165deg, #111827 0%, #3f4a3a 55%, #9ca3af 100%)',
    badge: 'HDR',
  },
  {
    imdb: 'tt7660850',
    title: 'Succession',
    year: '2018',
    genre: 'drama',
    art: 'linear-gradient(165deg, #0c1424 0%, #1e3a5f 50%, #ca8a04 100%)',
    badge: 'S4',
  },
]
