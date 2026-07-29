type LogoProps = {
  size?: number
  className?: string
}

/**
 * The Stremio play mark, set as a single-ink stamp: a square turned 45deg
 * with the play triangle knocked out of it. Takes `currentColor`, so it
 * reverses along with whatever block it sits in.
 */
export function Logo({ size = 30, className }: LogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Stremio"
      fill="currentColor"
    >
      {/*
        The mark and the knockout are one path: `evenodd` punches the
        triangle straight through the diamond, so the paper shows through
        instead of a second colour being printed on top.
      */}
      <path
        fillRule="evenodd"
        d="M32 2.6 61.4 32 32 61.4 2.6 32 32 2.6ZM26 21.4 44.6 32 26 42.6V21.4Z"
      />
    </svg>
  )
}
