import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import styles from './HowItWorks.module.css'

export function HowItWorks() {
  const { t } = useContent()

  return (
    <section className={`section ${styles.section}`} id="how-it-works">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t.how.eyebrow}</span>
          <h2>{t.how.title}</h2>
          <p className="section-lead">{t.how.lead}</p>
        </Reveal>

        <div className={styles.steps}>
          {t.how.steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 120} className={styles.step}>
              <span className={styles.marker}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </Reveal>
          ))}
        </div>

        {/* Set as a footnote to the sequence, marked by a rule rather than an icon. */}
        <Reveal className={styles.footnote}>
          <strong>{t.how.noteTitle}</strong> {t.how.noteBody}
        </Reveal>
      </div>
    </section>
  )
}
