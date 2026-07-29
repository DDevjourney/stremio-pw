import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type RevealProps = {
  children: ReactNode
  /** Stagger in ms, handy for grids of cards. */
  delay?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
}

/**
 * Declarative wrapper around useReveal so sections stay readable.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
