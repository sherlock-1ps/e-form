'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { useColorScheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Types Imports
import type { ThemeColor, SystemMode } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

type DataType = {
  date: string
  trend: string
  imgName: string
  cardType: string
  cardNumber: string
  status: 'verified' | 'rejected' | 'pending' | 'on-hold'
}

type StatusObj = Record<
  DataType['status'],
  {
    text: string
    color: ThemeColor
  }
>

// Vars
const data: DataType[] = [
  {
    trend: '+1,678 บาท',
    status: 'verified',
    cardType: 'lonpao',
    cardNumber: 'XPB777',
    imgName: 'visa',
    date: `17 Mar ${new Date().getFullYear()}`
  },
  {
    trend: '-839 บาท',
    status: 'rejected',
    cardType: 'L55',
    cardNumber: 'XPB888',
    imgName: 'mastercard',
    date: `12 Feb ${new Date().getFullYear()}`
  },
  {
    trend: '+435 บาท',
    cardType: 'paymaxplus',
    status: 'verified',
    cardNumber: 'XPB999',
    imgName: 'american-express',
    date: `28 Feb ${new Date().getFullYear()}`
  },
  {
    trend: '+2,345 บาท',
    status: 'verified',
    cardType: 'moodeng168',
    cardNumber: 'XPB123',
    imgName: 'visa',
    date: `08 Jan ${new Date().getFullYear()}`
  },
  {
    trend: '+1,758 บาท',
    status: 'rejected',
    cardType: 'spinix',
    cardNumber: 'XPB555',
    imgName: 'visa',
    date: `19 Oct ${new Date().getFullYear()}`
  }
]

const statusObj: StatusObj = {
  rejected: { text: 'Rejected', color: 'error' },
  pending: { text: 'Pending', color: 'secondary' },
  'on-hold': { text: 'On hold', color: 'warning' },
  verified: { text: 'Verified', color: 'success' }
}

const LastTransaction = ({ serverMode }: { serverMode: SystemMode }) => {
  // Hooks
  const { mode } = useColorScheme()

  // Vars
  const _mode = (mode === 'system' ? serverMode : mode) || serverMode

  return (
    <Card>
      <CardHeader
        title='รายการ bet สูงสุด'
        action={<OptionMenu options={['Show all entries', 'Refresh', 'Download']} />}
      />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className='border-be'>
              <th className='leading-6 plb-4 pis-6 pli-2'>username</th>
              <th className='leading-6 plb-4 pli-2'>Date</th>
              <th className='leading-6 plb-4 pli-2'>สถานะ</th>
              <th className='leading-6 plb-4 pie-6 pli-2 text-right'>กำไร/ขาดทุน</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className='border-0'>
                <td className='pis-6 pli-2 plb-3'>
                  <div className='flex items-center gap-4'>
                    <Avatar
                      variant='rounded'
                      className={classnames('is-[50px] bs-[30px]', {
                        'bg-white': _mode === 'dark',
                        'bg-actionHover': _mode === 'light'
                      })}
                    >
                      {/* <img width={30} alt={row.imgName} src={`/images/logos/${row.imgName}.png`} /> */}
                      <img width={30} alt={row.imgName} src={`/images/setting-website/provider/provider8.png`} />
                    </Avatar>
                    <div className='flex flex-col'>
                      <Typography color='text.primary'>{row.cardNumber}</Typography>
                      <Typography variant='body2' color='text.disabled'>
                        {row.cardType}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className='pli-2 plb-3'>
                  <div className='flex flex-col'>
                    <Typography color='text.primary'>สำเร็จ</Typography>
                    <Typography variant='body2' color='text.disabled'>
                      {row.date}
                    </Typography>
                  </div>
                </td>
                <td className='pli-2 plb-3'>
                  <Chip
                    variant='tonal'
                    size='small'
                    label={statusObj[row.status].text}
                    color={statusObj[row.status].color}
                  />
                </td>
                <td className='pli-2 plb-3 pie-6 text-right'>
                  <Typography color='text.primary'>{row.trend}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default LastTransaction
