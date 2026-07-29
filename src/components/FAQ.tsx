import { useEffect, useState } from 'react'
import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import styles from './FAQ.module.css'

function Chevron() {
  return (
    <svg
      className={styles.chevron}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function FAQ() {
  const { t, lang } = useContent()
  // Single-open accordion; first item starts expanded so the pattern is obvious.
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Answers change length between languages, so reset to a known state.
  useEffect(() => setOpenIndex(0), [lang])

  return (
    <section className="section" id="faq">
      <div className={`container ${styles.layout}`}>
        <Reveal className={styles.header}>
          <span className="eyebrow">{t.faq.eyebrow}</span>
          <h2 className={styles.title}>{t.faq.title}</h2>
          <p className={`section-lead ${styles.lead}`}>{t.faq.lead}</p>
          <p className={styles.support}>
            {t.faq.supportPre}
            <a href="https://www.stremio.com" target="_blank" rel="noopener noreferrer">
              {t.faq.supportLink}
            </a>
            {t.faq.supportPost}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className={styles.list}>
            {t.faq.items.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <div key={faq.question} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
                  <h3>
                    <button
                      className={styles.trigger}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                    >
                      {faq.question}
                      <Chevron />
                    </button>
                  </h3>
                  <div
                    className={styles.panel}
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    inert={!isOpen}
                  >
                    <div className={styles.panelInner}>
                      <p className={styles.answer}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
