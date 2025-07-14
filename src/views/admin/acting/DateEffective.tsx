// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { toast } from 'react-toastify'

import { useDictionary } from '@/contexts/DictionaryContext'

const DateEffective = ({ startDatetime, setStartDatetime, endDatetime, setEndDatetime }): JSX.Element => {
  // const [startDatetime, setStartDatetime] = useState<Date | null | undefined>(null)
  // const [endDatetime, setEndDatetime] = useState<Date | null | undefined>(null)

  const { dictionary } = useDictionary()

  return (
    <Grid container className='flex flex-col' spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5'>กำหนดวันใช้งาน</Typography>
      </Grid>

      <Grid item xs={12} m={2}>
        <AppReactDatepicker
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          selected={startDatetime}
          id='date-time-picker'
          dateFormat='dd/MM/yyyy h:mm aa'
          onChange={(date: Date | null) => setStartDatetime(date)}
          customInput={<CustomTextField label='วันที่เริ่มใช้งาน' fullWidth />}
        />
      </Grid>

      <Grid item xs={12} m={2}>
        <AppReactDatepicker
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          selected={endDatetime}
          id='date-time-picker'
          dateFormat='dd/MM/yyyy h:mm aa'
          onChange={(date: Date | null) => setEndDatetime(date)}
          customInput={<CustomTextField label='วันที่สิ้นสุด' fullWidth />}
        />
      </Grid>
    </Grid>
  )
}

export default DateEffective
