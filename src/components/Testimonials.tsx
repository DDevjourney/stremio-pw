import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import styles from './Testimonials.module.css'

export function Testimonials() {
  const { t } = useContent()

  return (
    <section className="section" id="testimonials">
      <div className="rail">
        <div className="rail-bus">
          <span className="rail-junction" aria-hidden="true" />
        </div>

        <div className="rail-body">
          <Reveal className="section-head">
            <span className="eyebrow">{t.testimonials.eyebrow}</span>
            <h2>{t.testimonials.title}</h2>
            <p className="section-lead">{t.testimonials.lead}</p>
          </Reveal>

          {/*
            Silkscreen labels and scored dividers only — no cards, no avatar
            discs, no quote marks, no star rating. This section is
            deliberately flat; see the plan for why.
          */}
          <div className={styles.grid}>
            {t.testimonials.items.map((item, i) => (
              <Reveal key={item.name} as="figure" delay={(i % 2) * 90} className={styles.item}>
                <blockquote className={styles.quote}>{item.quote}</blockquote>

                <figcaption>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.context}>{item.context}</span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
