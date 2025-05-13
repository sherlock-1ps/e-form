// MUI Imports
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const FaqFooter = () => {
  return (
    <>
      <div className='flex justify-center items-center flex-col text-center gap-2 plb-6'>
        <Chip label='Question' color='primary' variant='tonal' size='small' />
        <Typography variant='h4'>หากมีคำถามเพิ่มเติม ?</Typography>
        <Typography>สามารถติดต่อ support เพื่อสอบถามข้อมูลได้ตลอด 24 ชั่วโมง</Typography>
      </div>
      <Grid container spacing={6} className='mbs-6'>
        <Grid item xs={12} md={6}>
          <div className='flex justify-center items-center flex-col gap-4 p-6 rounded bg-actionHover'>
            <CustomAvatar variant='rounded' color='primary' skin='light' size={46}>
              <i className='tabler-brand-telegram text-[26px]' />
            </CustomAvatar>

            <div className='flex items-center flex-col gap-1'>
              <Typography variant='h5'>Telegram: @oneplaybetno1</Typography>
              <Typography>พวกเรายินดีช่วยเหลือทุกเวลา</Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className='flex justify-center items-center flex-col gap-4 p-6 rounded bg-actionHover'>
            <CustomAvatar variant='rounded' color='primary' skin='light' size={46}>
              <i className='tabler-mail text-[26px]' />
            </CustomAvatar>
            <div className='flex items-center flex-col gap-1'>
              <Typography variant='h5'>E-mail: oneplaybetno1@oneplay.com</Typography>
              <Typography>ให้บริการตอบคำถาม 24 ชั่วโมง</Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default FaqFooter
