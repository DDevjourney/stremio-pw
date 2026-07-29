type LogoProps = {
  size?: number
  className?: string
  /**
   * Set where the wordmark already names the thing — the nav and footer
   * brand links both render `<Logo /> Stremio` inside one `<a>`, so a
   * labelled mark makes a screen reader announce "Stremio Stremio, link".
   * Hides the mark from the accessibility tree instead of naming it twice.
   */
  decorative?: boolean
}

/**
 * The Stremio play mark, set as a single-ink stamp: a square turned 45deg
 * with the play triangle knocked out of it. Takes `currentColor`, so it
 * takes the colour of whatever panel it is mounted on.
 */
export function Logo({ size = 30, className, decorative = false }: LogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': 'Stremio' })}
      fill="currentColor"
    >
      {/*
        The mark and the knockout are one path: `evenodd` punches the
        triangle straight through the diamond, so the panel behind shows
        through instead of a second colour being laid on top.
      */}
      <path
        fillRule="evenodd"
        d="M32 2.6 61.4 32 32 61.4 2.6 32 32 2.6ZM26 21.4 44.6 32 26 42.6V21.4Z"
      />
    </svg>
  )
}
