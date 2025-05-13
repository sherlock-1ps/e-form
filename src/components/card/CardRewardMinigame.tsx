// MUI imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Types Imports
import type { CardStatsSquareProps } from '@/types/pages/widgetTypes'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import MenuOptions from '../options/MenuOptions'

const CardRewardMinigame = (data: any) => {
  return (
    <Card>
      <CardContent className='flex flex-col  gap-2'>
        <div className='flex gap-2 items-center flex-1'>
          <img src={`/images/setting-website/minigame/${data.data.icon}.png`} alt='icon_minigame' width={60} />
          <div className='flex flex-1 flex-col gap-3 '>
            <div className='flex items-center justify-between '>
              <Typography variant='h5'>{data.data.title}</Typography>
              <MenuOptions
                options={[
                  {
                    text: 'Edit Reward'
                  },

                  {
                    text: 'Delete'
                  }
                ]}
              />
            </div>
            <Typography className='text-sm'>{data.data.content}</Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardRewardMinigame
