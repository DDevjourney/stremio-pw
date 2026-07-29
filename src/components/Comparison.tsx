import { Reveal } from './Reveal'
import { useContent } from '../i18n/LanguageContext'
import type { ComparisonRow } from '../i18n/types'
import styles from './Comparison.module.css'

/**
 * A crosspoint: lit where a source connects to a feature, unlit where it
 * does not. Purely presentational — Cell always spells the state out for
 * assistive tech alongside it.
 */
function Crosspoint({ on }: { on: boolean }) {
  return <span className={on ? styles.lit : styles.unlit} aria-hidden="true" />
}

/**
 * Booleans render as a crosspoint; strings render as text. The accessible
 * label is always spelled out so screen readers don't hit a bare glyph.
 */
function Cell({ value }: { value: ComparisonRow['stremio'] }) {
  const { t } = useContent()

  if (typeof value === 'boolean') {
    return (
      <span className={styles.cellInner}>
        <Crosspoint on={value} />
        <span className="visually-hidden">{value ? t.compare.yes : t.compare.no}</span>
      </span>
    )
  }
  return <span className={styles.value}>{value}</span>
}

export function Comparison() {
  const { t } = useContent()

  return (
    <section className="section" id="compare">
      <div className="rail">
        <div className="rail-bus">
          <span className="rail-junction" aria-hidden="true" />
        </div>

        <div className="rail-body">
          <Reveal className="section-head">
            <span className="eyebrow">{t.compare.eyebrow}</span>
            <h2>{t.compare.title}</h2>
            <p className="section-lead">{t.compare.lead}</p>
          </Reveal>

          <Reveal>
            <div className={styles.scroller} tabIndex={0} role="region" aria-label={t.compare.title}>
              <table className={styles.table}>
                <caption className="visually-hidden">{t.compare.tableCaption}</caption>
                <thead>
                  <tr className={styles.headRow}>
                    <th scope="col" className={styles.featureCol}>
                      {t.compare.feature}
                    </th>
                    <th scope="col" className={styles.highlight}>
                      <span className={styles.brandHead}>
                        Stremio <span className={styles.pill}>{t.compare.freePill}</span>
                      </span>
                    </th>
                    <th scope="col">Netflix</th>
                    <th scope="col">Disney+</th>
                  </tr>
                </thead>
                <tbody>
                  {t.compare.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className={styles.rowLabel}>
                        {row.label}
                        {row.note && <span className={styles.note}>{row.note}</span>}
                      </th>
                      <td className={styles.highlight}>
                        <Cell value={row.stremio} />
                      </td>
                      <td>
                        <Cell value={row.netflix} />
                      </td>
                      <td>
                        <Cell value={row.disney} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal>
            <span className={styles.hint}>{t.compare.scrollHint}</span>
            <p className={styles.caption}>{t.compare.caption}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
