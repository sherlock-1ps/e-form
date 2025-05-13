// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

interface DateUseProps {
  id: string
  onClick: () => void
}

const DateUseFormDialog = ({ id, onClick }: DateUseProps) => {
  const { closeDialog } = useDialog()
  const [time, setTime] = useState<Date | null | undefined>(null)
  const [dateTime, setDateTime] = useState<Date | null | undefined>(null)

  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>กำหนดวันใช้งาน</Typography>
      </Grid>

      <Grid item xs={12}>
        <AppReactDatepicker
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          selected={dateTime}
          id='date-time-picker'
          dateFormat='dd/MM/yyyy h:mm aa'
          onChange={(date: Date | null) => setDateTime(date)}
          customInput={<CustomTextField label='วันที่ใช้งาน' fullWidth />}
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

export default DateUseFormDialog
