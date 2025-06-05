// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { toast } from 'react-toastify'
import { useUpdateDateFlowQueryOption } from '@/queryOptions/form/formQueryOptions'

interface DateUseProps {
  id: string
  data: any
}

const DateUseFlowDialog = ({ id, data }: DateUseProps) => {
  const { closeDialog } = useDialog()
  const [startDatetime, setStartDatetime] = useState<Date | null | undefined>(null)
  const [endDatetime, setEndDatetime] = useState<Date | null | undefined>(null)
  const { mutateAsync } = useUpdateDateFlowQueryOption()

  const formatToUTC = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z')
  const handleSubmit = async () => {
    try {
      const request = {
        id: data?.id,
        versions: [
          {
            id: data?.version?.[0]?.id,
            public_date: startDatetime ? formatToUTC(startDatetime) : '',
            end_date: endDatetime ? formatToUTC(endDatetime) : ''
          }
        ]
      }
      const response = await mutateAsync({ request })
      if (response?.code == 'SUCCESS') {
        toast.success('อัพเดทสำเร็จ', { autoClose: 3000 })
        closeDialog(id)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('อัพเดทล้มเหลว', { autoClose: 3000 })
    }
  }

  return (
    <Grid container className='flex flex-col' spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5'>กำหนดวันใช้งาน</Typography>
      </Grid>

      <Grid item xs={12}>
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

      <Grid item xs={12}>
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
          disabled={!startDatetime || !endDatetime}
          onClick={() => {
            handleSubmit()
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default DateUseFlowDialog
