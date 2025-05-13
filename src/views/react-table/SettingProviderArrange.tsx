'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { useColorScheme , alpha, useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Types Imports
import { CardContent, FormControlLabel, Switch } from '@mui/material'

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
  status: 'online' | 'offline'
  total: string
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
    status: 'online',
    cardType: 'lonpao',
    cardNumber: 'SA GAMING CASINO',
    imgName: 'provider1',
    date: `17 Mar ${new Date().getFullYear()}`,
    total: '$1.05m'
  },
  {
    trend: '-839 บาท',
    status: 'online',
    cardType: 'L55',
    cardNumber: 'WM CASINO',
    imgName: 'provider2',
    date: `12 Feb ${new Date().getFullYear()}`,
    total: '$999k'
  },
  {
    trend: '+435 บาท',
    cardType: 'paymaxplus',
    status: 'online',
    cardNumber: 'DREAM GAMING CASINO',
    imgName: 'provider3',
    date: `28 Feb ${new Date().getFullYear()}`,
    total: '$980k'
  },
  {
    trend: '+2,345 บาท',
    status: 'offline',
    cardType: 'moodeng168',
    cardNumber: 'SEXY GAMING CASINO',
    imgName: 'provider4',
    date: `08 Jan ${new Date().getFullYear()}`,
    total: '$845k'
  },
  {
    trend: '+1,758 บาท',
    status: 'online',
    cardType: 'spinix',
    cardNumber: 'King Maker',
    imgName: 'provider5',
    date: `19 Oct ${new Date().getFullYear()}`,
    total: '$799k'
  },
  {
    trend: '+2,345 บาท',
    status: 'online',
    cardType: 'moodeng168',
    cardNumber: 'EBET',
    imgName: 'provider6',
    date: `08 Jan ${new Date().getFullYear()}`,
    total: '$667k'
  },
  {
    trend: '+2,345 บาท',
    status: 'offline',
    cardType: 'moodeng168',
    cardNumber: 'Pragmatic Casino',
    imgName: 'provider7',
    date: `08 Jan ${new Date().getFullYear()}`,
    total: '$555k'
  },
  {
    trend: '+2,345 บาท',
    status: 'offline',
    cardType: 'moodeng168',
    cardNumber: 'Evolution',
    imgName: 'provider4',
    date: `08 Jan ${new Date().getFullYear()}`,
    total: '$245k'
  }
]

const statusObj: StatusObj = {
  offline: { text: 'Offline', color: 'secondary' },
  online: { text: 'Online', color: 'success' }
}

const SettingProviderArrange = () => {
  const theme = useTheme()

  
return (
    <Card>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead className='uppercase border-0 bg-primary text-white'>
              <tr className='border-be '></tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className={`border-b `}>
                  <td className=' px-2 '>
                    <Typography
                      className='text-center  p-2 rounded-lg text-white'
                      style={{ backgroundColor: alpha(theme.palette.primary.main, 0.75) }}
                    >
                      {index + 1}
                    </Typography>
                  </td>
                  <td className=' px-3'>
                    <div className='flex items-center gap-4 '>
                      <img width={30} alt={row.imgName} src={`/images/setting-website/provider/${row.imgName}.png`} />
                      <div className='flex flex-col'>
                        <Typography color='text.primary'>{row.cardNumber}</Typography>
                      </div>
                    </div>
                  </td>

                  <td className='pli-2 plb-3 pie-6 text-right'>
                    <Typography variant='body2' color='text.disabled'>
                      Total
                    </Typography>
                    <Typography color='text.primary'>{row.total}</Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default SettingProviderArrange
