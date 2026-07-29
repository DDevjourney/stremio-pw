import { CTAButton } from './CTAButton'
import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import styles from './FinalCTA.module.css'

function Tick() {
  return (
    <svg className={styles.tick} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  )
}

export function FinalCTA() {
  const { t } = useContent()

  return (
    <section className={`section ${styles.section}`} id="download">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <span className="eyebrow">{t.finalCta.eyebrow}</span>
        </Reveal>

        <Reveal delay={80}>
          <h2 className={styles.title}>{t.finalCta.title}</h2>
        </Reveal>

        <Reveal delay={160}>
          <p className={styles.sub}>{t.finalCta.sub}</p>
        </Reveal>

        <Reveal delay={240}>
          <div className={styles.ctaRow}>
            <CTAButton size="large">{t.finalCta.cta}</CTAButton>
          </div>
        </Reveal>

        <Reveal delay={310}>
          <div className={styles.reassure}>
            {t.finalCta.reassurances.map((item) => (
              <span key={item} className={styles.reassureItem}>
                <Tick />
                {item}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={380} className={styles.platforms}>
          {t.finalCta.platforms.map((platform) => (
            <span key={platform} className={styles.platform}>
              {platform}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
