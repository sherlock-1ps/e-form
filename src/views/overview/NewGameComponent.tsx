'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { useColorScheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

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
    trend: '4K',
    status: 'verified',
    cardType: 'Pocket Game Soft',
    cardNumber: 'Lucky Neko',
    imgName: 'visa',
    date: `17 Mar ${new Date().getFullYear()}`
  },
  {
    trend: '4K',
    status: 'rejected',
    cardType: 'Pocket Game Soft',
    cardNumber: 'Lucky Neko',
    imgName: 'mastercard',
    date: `12 Feb ${new Date().getFullYear()}`
  },
  {
    trend: '4K',
    cardType: 'Pocket Game Soft',
    status: 'verified',
    cardNumber: 'Lucky Neko',
    imgName: 'american-express',
    date: `28 Feb ${new Date().getFullYear()}`
  },
  {
    trend: '4K',
    status: 'verified',
    cardType: 'Pocket Game Soft',
    cardNumber: 'Lucky Neko',
    imgName: 'visa',
    date: `08 Jan ${new Date().getFullYear()}`
  },
  {
    trend: '4K',
    status: 'rejected',
    cardType: 'Pocket Game Soft',
    cardNumber: 'Lucky Neko',
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

const NewGameComponent = () => {
  return (
    <Card className='h-full'>
      <CardHeader
        title='New Game This Week'
        action={
          <div className='flex gap-1'>
            <IconButton size='small'>
              <i className={'tabler-chevron-left'} />
            </IconButton>
            <IconButton size='small'>
              <i className={'tabler-chevron-right'} />
            </IconButton>
          </div>
        }
      />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className=' border-t'>
              {/* <th className='leading-6 plb-4 pis-6 pli-2'>Game</th>
              <th className='leading-6 plb-4 pli-2'>Turnover</th>
              <th className='leading-6 plb-4 pie-6 pli-2 text-right'>User</th> */}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className='border-0'>
                <td className='pis-6 pli-2 plb-3'>
                  <div className='flex items-center gap-4'>
                    <Avatar variant='rounded' className='w-[38px] h-[54px] '>
                      <img
                        alt={row.imgName}
                        src={`/images/overview/gameOverview1.png`}
                        className='object-contain w-full h-full'
                      />
                    </Avatar>
                    <div className='flex flex-col'>
                      <Typography variant='h6' className=' text-primary'>
                        {row.cardNumber}
                      </Typography>
                      <Typography variant='body2'>{row.cardType}</Typography>
                      <Typography variant='body2' color='text.disabled'>
                        slot
                      </Typography>
                    </div>
                  </div>
                </td>
                {/* <td className='pli-2 plb-3'>
                  <div className='flex flex-col'>
                    <Typography color='text.primary'>1.8M</Typography>

                  </div>
                </td> */}
                {/* <td className='pli-2 plb-3'>
                  <Chip
                    variant='tonal'
                    size='small'
                    label={statusObj[row.status].text}
                    color={statusObj[row.status].color}
                  />
                </td> */}
                {/* <td className='pli-2 plb-3 pie-6 text-right'>
                  <Typography color='text.primary'>{row.trend}</Typography>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default NewGameComponent
