import type { GenreKey } from '../data/posters'

export type ComparisonRow = {
  label: string
  /** Shown under the row label as clarifying fine print. */
  note?: string
  stremio: string | boolean
  netflix: string | boolean
  disney: string | boolean
}

/** The four resource types a Stremio add-on can declare. */
export type ResourceKey = 'catalog' | 'meta' | 'stream' | 'subtitles'

/**
 * Every user-facing string on the page. Both dictionaries are typed against
 * this, so a missing translation is a compile error rather than a blank spot.
 */
export type Dictionary = {
  /** Value for <html lang>. */
  htmlLang: string
  documentTitle: string

  nav: {
    links: { href: string; label: string }[]
    cta: string
    /** Accessible name for the language button. */
    switchLanguage: string
    /** Code shown on the button — the language it switches TO. */
    otherLanguageCode: string
  }

  hero: {
    badge: string
    headlineLead: string
    headlineAccent: string
    sub: string
    ctaPrimary: string
    ctaSecondary: string
    microcopy: string
    search: string
    rowContinue: string
    rowPopular: string
    seeAll: string
    /** Channel ident shown on the monitor bezel. */
    ident: string
    /** Static timecode on the monitor bezel. Decorative, but localised. */
    timecode: string
  }

  genres: Record<GenreKey, string>

  value: {
    eyebrow: string
    title: string
    lead: string
    /** Display names for the four add-on resource types. */
    resources: Record<ResourceKey, string>
    items: { title: string; body: string; resource: ResourceKey }[]
  }

  how: {
    eyebrow: string
    title: string
    lead: string
    steps: { number: string; title: string; body: string }[]
    noteTitle: string
    noteBody: string
  }

  compare: {
    eyebrow: string
    title: string
    lead: string
    feature: string
    freePill: string
    rows: ComparisonRow[]
    tableCaption: string
    scrollHint: string
    caption: string
    yes: string
    no: string
  }

  testimonials: {
    eyebrow: string
    title: string
    lead: string
    rating: string
    items: { quote: string; name: string; context: string; initials: string }[]
  }

  faq: {
    eyebrow: string
    title: string
    lead: string
    supportPre: string
    supportLink: string
    supportPost: string
    items: { question: string; answer: string }[]
  }

  finalCta: {
    eyebrow: string
    title: string
    sub: string
    cta: string
    reassurances: string[]
    platforms: string[]
  }

  footer: {
    links: { href: string; label: string; external?: boolean }[]
    disclaimerStrong: string
    disclaimerBody: string
    /** Label for the external download link in the footer nav. */
    downloadLabel: string
    /** `{year}` is replaced at render time. */
    copyright: string
  }
}
