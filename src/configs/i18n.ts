export const i18n = {
  defaultLocale: 'th',
  locales: ['th', 'en', 'fr', 'ar'],
  langDirection: {
    th: 'ltr',
    en: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
