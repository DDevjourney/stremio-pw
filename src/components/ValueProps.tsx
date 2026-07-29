import type { CSSProperties } from 'react'
import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import styles from './ValueProps.module.css'

export function ValueProps() {
  const { t } = useContent()

  return (
    <section className="section" id="features">
      <div className="rail">
        <div className="rail-bus">
          <span className="rail-junction" aria-hidden="true" />
        </div>
        <div className="rail-body">
          <Reveal className="section-head">
            <span className="eyebrow">{t.value.eyebrow}</span>
            <h2>{t.value.title}</h2>
            <p className="section-lead">{t.value.lead}</p>
          </Reveal>

          {/*
            Each value proposition is tagged with the add-on resource type it
            is really about (catalog / meta / stream / subtitles). The port
            header's colour is the same signal used everywhere else that
            resource type appears on the page.
          */}
          <div className={styles.grid}>
            {t.value.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <article
                  className={styles.module}
                  style={{ '--sig': `var(--sig-${item.resource})` } as CSSProperties}
                >
                  <span className={styles.port}>{t.value.resources[item.resource]}</span>
                  <h3 className={styles.moduleTitle}>{item.title}</h3>
                  <p className={styles.moduleBody}>{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
