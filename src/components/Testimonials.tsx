import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import styles from './Testimonials.module.css'

function Stars({ label }: { label: string }) {
  return (
    <div className={styles.stars} aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m12 2.5 2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.3 6.1 20.4l1.2-6.5L2.5 9.3l6.6-.9Z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
  const { t } = useContent()

  return (
    <section className={`section ${styles.section}`} id="testimonials">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t.testimonials.eyebrow}</span>
          <h2>{t.testimonials.title}</h2>
          <p className="section-lead">{t.testimonials.lead}</p>
        </Reveal>

        {/*
          Pull quotes, not review cards. The first one runs the full measure
          and the rest fall into a ruled grid under it; the rating sits down
          in the credit line where a printed page would put it, instead of
          heading each entry with a row of stars.
        */}
        <div className={styles.grid}>
          {t.testimonials.items.map((item, i) => (
            <Reveal
              key={item.name}
              as="figure"
              delay={(i % 2) * 90}
              className={`${styles.card} ${i === 0 ? styles.featured : ''}`}
            >
              <blockquote className={styles.quote}>{item.quote}</blockquote>

              <figcaption className={styles.person}>
                <span className={styles.initials} aria-hidden="true">
                  {item.initials}
                </span>
                <span className={styles.who}>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.context}>{item.context}</span>
                </span>
                <Stars label={t.testimonials.rating} />
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
