// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Grid, IconButton, InputAdornment, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'

interface settingSignDialogProps {
  id: string
  onClick: () => void
}

const SettingSignDialog = ({ id, onClick }: settingSignDialogProps) => {
  const { closeDialog } = useDialog()

  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>ตั้งค่าผู้ลงนาม</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body2'>ระบุผู้ที่สามารถลงนามในจุดลงนามนี้</Typography>
      </Grid>
      <Grid item xs={12} className='mt-4'>
        <CustomTextField
          fullWidth
          value={''}
          label='หน่วยงาน'
          placeholder='พิมพ์เพื่อเริ่มเลือก...'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton onClick={() => {}}>
                  <i className='tabler-search' />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={12} className='mt-4'>
        <CustomTextField
          fullWidth
          value={''}
          label='ตำแหน่ง'
          placeholder='พิมพ์เพื่อเริ่มเลือก...'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton onClick={() => {}}>
                  <i className='tabler-search' />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={12} className='mt-4'>
        <CustomTextField
          fullWidth
          value={''}
          label='บุคคล​ (ชื่อ, username)'
          placeholder='พิมพ์เพื่อเริ่มเลือก...'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton onClick={() => {}}>
                  <i className='tabler-search' />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item xs={12} className='flex items-center  justify-end gap-2'>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => {
            closeDialog(id)
          }}
        >
          ยกเลิก
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            closeDialog(id), onClick()
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default SettingSignDialog
