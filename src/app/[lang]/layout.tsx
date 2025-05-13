// Next Imports
import { headers } from 'next/headers'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import NextTopLoader from 'nextjs-toploader'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { DictionaryProvider } from '@/contexts/DictionaryContext'
import { getDictionary } from '@/utils/getDictionary'

export const metadata = {
  title: 'E-Form',
  description: 'E-Form Sarabun',
  icons: {
    icon: '../favicon.ico'
  }
}

const RootLayout = async ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  // Vars
  const headersList = headers()
  const { lang } = params

  // Validate lang
  if (!i18n.locales.includes(lang)) {
    return
  }

  const direction = i18n.langDirection[lang]
  const dictionary = await getDictionary(lang)

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction}>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <NextTopLoader />
          <DictionaryProvider dictionary={dictionary} locale={params.lang}>
            {children}
          </DictionaryProvider>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
