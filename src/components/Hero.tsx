import type { CSSProperties } from 'react'
import { CTAButton } from './CTAButton'
import { Logo } from './Logo'
import { useParallax } from '../hooks/useParallax'
import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import { continueWatching, popularNow, posterUrl, type PosterItem } from '../data/posters'
import styles from './Hero.module.css'

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
  const parallaxRef = useParallax<HTMLDivElement>(0.18)
  const { t } = useContent()

  return (
    <section className={styles.hero} id="top">
      <div className="rail">
        <div className="rail-bus">
          <span className="rail-junction" aria-hidden="true" />
        </div>

        <div className="rail-body">
          <Reveal>
            <p className={styles.badge}>{t.hero.badge}</p>
          </Reveal>

          <Reveal delay={90}>
            {/*
              Engraved panel type: the claim is silkscreened on the chassis.
              The accent word takes the stream colour — the one signal this
              whole page is about delivering.
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

          <Reveal>
            <div className={styles.monitor} ref={parallaxRef} aria-hidden="true">
              <div className={styles.bezel}>
                <Logo className={styles.bezelMark} size={15} />
                <span className={styles.ident}>{t.hero.ident}</span>
                <span className={styles.timecode}>{t.hero.timecode}</span>
              </div>

              <div className={styles.screen}>
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
      </div>
    </section>
  )
}
