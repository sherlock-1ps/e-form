import 'dayjs/locale/th'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

dayjs.extend(buddhistEra)

export default class newAdapter extends AdapterDayjs {
  constructor({ locale, formats }: { locale?: string; formats?: any }) {
    super({ locale, formats })
  }

  formatByString = (date: any, format: string): string => {
    const newFormat = format.replace(/\bYYYY\b/g, 'BBBB')

    return this.dayjs(date).format(newFormat)
  }
}
