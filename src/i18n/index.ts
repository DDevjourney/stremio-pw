import { en } from './en'
import { es } from './es'
import type { Dictionary } from './types'

export type Language = 'en' | 'es'

export const dictionaries: Record<Language, Dictionary> = { en, es }

export type { Dictionary } from './types'
