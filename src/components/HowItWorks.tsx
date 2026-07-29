import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import styles from './HowItWorks.module.css'

export function HowItWorks() {
  const { t } = useContent()

  return (
    <section className={`section ${styles.section}`} id="how-it-works">
      <div className="rail">
        <div className="rail-bus">
          <span className="rail-junction" aria-hidden="true" />
        </div>

        <div className="rail-body">
          <Reveal className="section-head">
            <span className="eyebrow">{t.how.eyebrow}</span>
            <h2>{t.how.title}</h2>
            <p className="section-lead">{t.how.lead}</p>
          </Reveal>

          {/*
            Four stages, four markers. The marker colour at each stage is the
            resource that has come online by that point: engrave (client only)
            -> catalog -> meta -> stream. Same hue-to-resource mapping as the
            rest of the page; --sig-subtitles is deliberately absent here.
          */}
          <ol className={styles.run}>
            {t.how.steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 110} className={styles.stage}>
                <span className={styles.marker} aria-hidden="true" />
                <span className={styles.stageNo}>{step.number}</span>
                <h3 className={styles.stageTitle}>{step.title}</h3>
                <p className={styles.stageBody}>{step.body}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <aside className={styles.note}>
              <h3 className={styles.noteTitle}>{t.how.noteTitle}</h3>
              <p className={styles.noteBody}>{t.how.noteBody}</p>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
