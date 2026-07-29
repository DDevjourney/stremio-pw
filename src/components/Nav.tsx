import { useEffect, useState } from 'react'
import { CTAButton } from './CTAButton'
import { Logo } from './Logo'
import { useContent } from '../i18n/LanguageContext'
import styles from './Nav.module.css'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { t, toggleLang } = useContent()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.brand} href="#top">
          <Logo className={styles.mark} size={22} />
          Stremio
        </a>

        <nav className={styles.links} aria-label="Primary">
          {t.nav.links.map((link) => (
            <a key={link.href} className={styles.link} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.langToggle}
            onClick={toggleLang}
            aria-label={t.nav.switchLanguage}
            title={t.nav.switchLanguage}
          >
            {t.nav.otherLanguageCode}
          </button>

          <CTAButton className={styles.navCta} withIcon={false}>
            {t.nav.cta}
          </CTAButton>
        </div>
      </div>
    </header>
  )
}
