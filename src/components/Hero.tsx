import type { CSSProperties } from 'react'
import { CTAButton } from './CTAButton'
import { Logo } from './Logo'
import { useParallax } from '../hooks/useParallax'
import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import {
  continueWatching,
  heroBackdrop,
  popularNow,
  posterUrl,
  type PosterItem,
} from '../data/posters'
import styles from './Hero.module.css'

/**
 * Scattered, blurred poster wall behind the headline. Purely decorative:
 * hidden from assistive tech and loaded at low priority so it never competes
 * with the catalog mockup for bandwidth.
 */
function Backdrop() {
  const ref = useParallax<HTMLDivElement>(0.5)

  /*
    One rail, hard against the right margin. The headline block sits left, so
    the wall stacks down the opposite edge and bleeds off the page — the
    asymmetry is the composition, not decoration laid evenly around a centre.
  */
  return (
    <div className={styles.backdrop} ref={ref} aria-hidden="true">
      <div className={styles.rail}>
        {heroBackdrop.map((tile) => (
          <span
            key={tile.imdb}
            className={styles.tile}
            style={
              {
                '--tile-top': tile.top,
                '--tile-inset': tile.inset,
                '--tile-width': tile.width,
                '--tile-rotate': tile.rotate,
                '--tile-blur': tile.blur,
                '--tile-opacity': tile.opacity,
                '--tile-depth': tile.depth,
              } as CSSProperties
            }
          >
            <img
              src={posterUrl(tile.imdb)}
              alt=""
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </span>
        ))}
      </div>
      <span className={styles.backdropScrim} />
    </div>
  )
}

function PosterRow({ items, eager }: { items: PosterItem[]; eager?: boolean }) {
  const { t } = useContent()

  return (
    <div className={styles.posters}>
      {items.map((item) => (
        <article
          key={item.imdb}
          className={styles.poster}
          style={{ '--poster-art': item.art } as CSSProperties}
        >
          {/*
            Artwork sits over the gradient, so a slow or failed request
            degrades to the designed fallback instead of an empty box.
          */}
          <img
            className={styles.posterArt}
            src={posterUrl(item.imdb)}
            alt=""
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            // Cached images can finish before React attaches onLoad, so check
            // `complete` on the ref as well.
            ref={(el) => {
              if (el?.complete && el.naturalWidth > 0) el.classList.add(styles.loaded)
            }}
            onLoad={(e) => e.currentTarget.classList.add(styles.loaded)}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />

          {item.badge && <span className={styles.posterBadge}>{item.badge}</span>}

          <div className={styles.posterInfo}>
            <span className={styles.posterTitle}>{item.title}</span>
            <span className={styles.posterMeta}>
              {item.year} · {t.genres[item.genre]}
            </span>
          </div>

          {item.progress !== undefined && (
            <span className={styles.progressTrack}>
              <span className={styles.progressBar} style={{ width: `${item.progress}%` }} />
            </span>
          )}
        </article>
      ))}
    </div>
  )
}

export function Hero() {
  const parallaxRef = useParallax<HTMLDivElement>(0.28)
  const { t } = useContent()

  return (
    <section className={styles.hero} id="top">
      <Backdrop />

      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className={styles.badge}>{t.hero.badge}</p>
        </Reveal>

        <Reveal delay={90}>
          {/*
            The accent word drops out of the condensed display face into the
            body serif, in red italic — the emphasis a printed headline would
            use, where a second colour costs a second pass on the press.
          */}
          <h1 className={styles.headline}>
            {t.hero.headlineLead}{' '}
            <span className={styles.accentWord}>{t.hero.headlineAccent}</span>
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p className={styles.sub}>{t.hero.sub}</p>
        </Reveal>

        <Reveal delay={270}>
          <div className={styles.ctaRow}>
            <CTAButton size="large">{t.hero.ctaPrimary}</CTAButton>
            <CTAButton href="#how-it-works" variant="secondary" size="large">
              {t.hero.ctaSecondary}
            </CTAButton>
          </div>
        </Reveal>

        <Reveal delay={340}>
          <p className={styles.microcopy}>{t.hero.microcopy}</p>
        </Reveal>
      </div>

      <div className={`container ${styles.stage}`}>
        <Reveal>
          <div className={styles.mockup} ref={parallaxRef} aria-hidden="true">
            <div className={styles.chrome}>
              <Logo className={styles.chromeLogo} size={17} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.chromeSearch}>{t.hero.search}</span>
            </div>

            <div className={styles.board}>
              <div className={styles.rowLabel}>
                <span>{t.hero.rowContinue}</span>
                <span>{t.hero.seeAll}</span>
              </div>
              <PosterRow items={continueWatching} eager />

              <div className={`${styles.rowLabel} ${styles.secondRow}`}>
                <span>{t.hero.rowPopular}</span>
                <span>{t.hero.seeAll}</span>
              </div>
              <PosterRow items={popularNow} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
