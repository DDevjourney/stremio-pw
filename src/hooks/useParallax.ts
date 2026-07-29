import { useEffect, useRef } from 'react'

/**
 * Light parallax driven by rAF-throttled scroll.
 *
 * Writes to a CSS custom property (`--parallax`) instead of inline transforms
 * so each consumer decides how much of the offset to apply and along which
 * axis. Only runs while the element is on screen.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.15) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let onScreen = true

    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      // Distance of the element's centre from the viewport centre.
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2
      el.style.setProperty('--parallax', `${(offset * speed).toFixed(2)}px`)
    }

    const onScroll = () => {
      if (frame || !onScreen) return
      frame = requestAnimationFrame(update)
    }

    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen) onScroll()
      },
      { rootMargin: '100px' },
    )
    visibility.observe(el)

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      visibility.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [speed])

  return ref
}
