import { useParams } from "next/navigation"

export function FormatShowDate(isoString: string): string {
  const { lang } = useParams()
  const locale = lang === 'th' ? 'th-TH' : 'en-EN'

  const date = new Date(isoString)

  const day = date.getDate()
  const month = date.toLocaleString(locale, { month: 'long' })
  const year = date.getFullYear()
  const time = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  if (locale === 'en-EN' || locale.startsWith('en')) {
    return `${day} ${month}, ${year}, ${time}`
  }

  // Fallback for other locales (e.g., Thai)
  const datePart = date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `${datePart}, ${time}`
}
