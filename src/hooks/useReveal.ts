import { useEffect, useRef } from 'react'

type RevealOptions = {
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number
  /** Shrinks the viewport from the bottom so the reveal fires slightly early. */
  rootMargin?: string
  /** Re-hide the element when it scrolls back out of view. */
  once?: boolean
}

/**
 * Attaches a one-shot fade/slide reveal to an element.
 * Pairs with the `.reveal` / `.is-visible` classes in global.css.
 *
 * Deliberately observer-based rather than scroll-listener based: no work
 * happens on the main thread between intersections.
 */
/**
 * Failsafe: every section on this page is wrapped in `.reveal`, which starts at
 * opacity 0. If IntersectionObserver never delivers — a page rendered while the
 * tab is hidden, a prerender pass, an exotic embedded webview — the whole page
 * would stay invisible. So if nothing at all has revealed shortly after mount,
 * we hand control to CSS that forces everything visible.
 */
let anyRevealed = false
let failsafeArmed = false

function armFailsafe() {
  if (failsafeArmed) return
  failsafeArmed = true
  window.setTimeout(() => {
    if (!anyRevealed) {
      document.documentElement.classList.add('reveal-failsafe')
    }
  }, 2000)
}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced-motion by showing content immediately.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    armFailsafe()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            anyRevealed = true
            entry.target.classList.add('is-visible')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('is-visible')
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return ref
}
