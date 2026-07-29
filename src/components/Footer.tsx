import { DOWNLOAD_URL } from './CTAButton'
import { Logo } from './Logo'
import { useContent } from '../i18n/LanguageContext'
import styles from './Footer.module.css'

export function Footer() {
  const { t } = useContent()

  const links = [
    ...t.footer.links,
    { href: DOWNLOAD_URL, label: t.footer.downloadLabel, external: true },
  ]

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <a className={styles.brand} href="#top">
            <Logo className={styles.mark} size={28} decorative />
            Stremio
          </a>

          <nav className={styles.links} aria-label="Footer">
            {links.map((link) => (
              <a
                key={link.label}
                className={styles.link}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p className={styles.disclaimer}>
          <strong>{t.footer.disclaimerStrong}</strong>
          {t.footer.disclaimerBody}
          <a href="https://www.stremio.com" target="_blank" rel="noopener noreferrer">
            stremio.com
          </a>
          .
        </p>

        <p className={styles.copyright}>
          {t.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
        </p>
      </div>
    </footer>
  )
}
