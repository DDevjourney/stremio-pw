import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dictionaries, type Language } from './index'
import type { Dictionary } from './types'

type LanguageValue = {
  lang: Language
  toggleLang: () => void
  /** Dictionary for the active language. */
  t: Dictionary
}

const LanguageContext = createContext<LanguageValue | null>(null)

/**
 * Holds the active language in React state (English by default) and mirrors it
 * onto <html lang> and the document title, which live outside the React tree.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en')
  const t = dictionaries[lang]

  useEffect(() => {
    document.documentElement.lang = t.htmlLang
    document.title = t.documentTitle
  }, [t])

  const toggleLang = useCallback(() => {
    setLang((current) => (current === 'en' ? 'es' : 'en'))
  }, [])

  const value = useMemo<LanguageValue>(() => ({ lang, toggleLang, t }), [lang, toggleLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useContent() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useContent must be used inside a LanguageProvider')
  return ctx
}
