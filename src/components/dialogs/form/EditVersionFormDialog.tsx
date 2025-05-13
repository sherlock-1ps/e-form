// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

interface EditVersionProps {
  id: string
  onClick: () => void
}

const EditVersionFormDialog = ({ id, onClick }: EditVersionProps) => {
  const { closeDialog } = useDialog()
  const [time, setTime] = useState<Date | null | undefined>(null)
  const [date, setDate] = useState<Date | null | undefined>(null)

  return (
    <Grid container className='flex flex-col' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>เวอร์ชั่นใหม่</Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomTextField fullWidth label='กำหนดเวอร์ชั่น' placeholder='ตัวเลขเท่านั้น' type='number' />
      </Grid>
      <Grid item xs={12}>
        <AppReactDatepicker
          selected={date}
          id='basic-input'
          dateFormat='dd/MM/yyyy'
          onChange={(date: Date | null) => setDate(date)}
          placeholderText='ว/ ด/ ป'
          customInput={<CustomTextField label='Basic' fullWidth />}
        />
      </Grid>
      <Grid item xs={12}>
        <AppReactDatepicker
          showTimeSelect
          selected={time}
          timeIntervals={15}
          showTimeSelectOnly
          timeFormat='HH:mm'
          dateFormat='HH:mm'
          id='time-only-picker'
          onChange={(date: Date | null) => setTime(date)}
          placeholderText='ชั่วโมง : นาที'
          customInput={<CustomTextField label='กำหนดเวลาเริ่มใช้งาน' fullWidth />}
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

export default EditVersionFormDialog
