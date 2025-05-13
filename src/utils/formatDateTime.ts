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
