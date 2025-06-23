function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatToLocalStartOfDay(date: Date): string {
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())

  const offsetMinutes = -date.getTimezoneOffset()
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60)
  const offsetMins = Math.abs(offsetMinutes) % 60
  const offsetSign = offsetMinutes >= 0 ? '+' : '-'

  const offset = `${offsetSign}${pad(offsetHours)}:${pad(offsetMins)}`

  return `${year}-${month}-${day}T00:00:00${offset}`
}

export function formatToLocalEndOfDay(date: Date): string {
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())

  const offsetMinutes = -date.getTimezoneOffset()
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60)
  const offsetMins = Math.abs(offsetMinutes) % 60
  const offsetSign = offsetMinutes >= 0 ? '+' : '-'

  const offset = `${offsetSign}${pad(offsetHours)}:${pad(offsetMins)}`

  return `${year}-${month}-${day}T23:59:59${offset}`
}

export function formatThaiDate(isoString: any, isTime = true, format: 'short' | 'full' = 'full') {
  if (!isoString) return '-'

  const date = new Date(isoString)

  const thMonthsShort = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.'
  ]

  const thMonthsFull = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ]

  const months = format === 'full' ? thMonthsFull : thMonthsShort

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear() + 543 // Buddhist year
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  if (isTime) return `${day} ${month} ${year} ${hour}:${minute}`
  else return `${day} ${month} ${year}`
}
