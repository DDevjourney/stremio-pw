import type { ReactNode } from 'react'
import styles from './CTAButton.module.css'

export const DOWNLOAD_URL = 'https://www.stremio.com/downloads'

type CTAButtonProps = {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'secondary'
  size?: 'default' | 'large'
  /** Renders the download glyph. Off for secondary/in-page links. */
  withIcon?: boolean
  className?: string
}

function DownloadIcon() {
  return (
    <svg
      className={styles.icon}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  )
}

export function CTAButton({
  children,
  href = DOWNLOAD_URL,
  variant = 'primary',
  size = 'default',
  withIcon = variant === 'primary',
  className = '',
}: CTAButtonProps) {
  const isExternal = href.startsWith('http')

  const classes = [
    styles.button,
    variant === 'secondary' && styles.secondary,
    size === 'large' && styles.large,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={classes}
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {withIcon && <DownloadIcon />}
    </a>
  )
}
