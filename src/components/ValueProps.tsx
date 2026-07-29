import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import styles from './ValueProps.module.css'

export function ValueProps() {
  const { t } = useContent()

  return (
    <section className="section" id="features">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{t.value.eyebrow}</span>
          <h2>{t.value.title}</h2>
          <p className="section-lead">{t.value.lead}</p>
        </Reveal>

        {/*
          Ruled columns rather than cards: the vertical hairlines do the
          separating, and each entry is numbered like a point in a printed
          argument. No boxes, no icons — the type carries it.
        */}
        <div className={styles.grid}>
          {t.value.items.map((prop, i) => (
            <Reveal key={prop.title} delay={i * 90} className={styles.item}>
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.itemTitle}>{prop.title}</h3>
              <p className={styles.itemBody}>{prop.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
