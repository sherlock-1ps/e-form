// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { useCreateNewVersionFormQueryOption, useGetFormQueryOption } from '@/queryOptions/form/formQueryOptions'
import { toast } from 'react-toastify'

interface EditVersionProps {
  id: string
  onClick: () => void
  onCreateNewVersion: any
  data: any
}

const EditVersionFormDialog = ({ id, onClick, data, onCreateNewVersion }: EditVersionProps) => {
  const { closeDialog } = useDialog()
  const [time, setTime] = useState<Date | null | undefined>(null)
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [version, setVersion] = useState<Date | null | undefined>(data?.version[0]?.version)

  const { mutateAsync: getForm, isPending: pendingGetForm } = useGetFormQueryOption()

  const { mutateAsync: createNewVersion } = useCreateNewVersionFormQueryOption()

  console.log('data', data)

  const handleGetForm = async (id: number) => {
    const request = {
      id: id
    }

    try {
      const response = await getForm(request)
      if (response?.code == 'SUCCESS') {
        console.log('response', response)
      }
    } catch (error) {
      toast.error('เรียกฟอร์มล้มเหลว!', { autoClose: 3000 })
    }
  }

  const handleCreateNewVersion = async (id: number) => {
    try {
      const resultForm = await handleGetForm(id)
      // if (resultForm?.code == 'SUCCESS') {
      // }

      const request = {
        name: '',
        versions: [
          {
            version: '',
            form_details: [{ detail: { data: '' } }]
          }
        ]
      }

      // const response = await createNewVersion(request)
      // if (response?.code == 'SUCCESS') {
      //   console.log('response', response)
      //   toast.success('สร้างเวอร์ชั่นใหม่สำเร็จ!', { autoClose: 3000 })
      // }
    } catch (error) {
      toast.error('สร้างเวอร์ชั่นใหม่ล้มเหลว!', { autoClose: 3000 })
    }
  }

  const handleClick = () => {
    try {
      // const resultForm = await handleGetForm(id)
      // if (resultForm?.code == 'SUCCESS') {
      // }

      const request = {
        name: '',
        versions: [
          {
            version: '',
            form_details: [{ detail: { data: '' } }]
          }
        ]
      }

      closeDialog(id), onClick()

      // const response = await createNewVersion(request)
      // if (response?.code == 'SUCCESS') {
      //   console.log('response', response)
      //   toast.success('สร้างเวอร์ชั่นใหม่สำเร็จ!', { autoClose: 3000 })
      // }
    } catch (error) {
      toast.error('สร้างเวอร์ชั่นใหม่ล้มเหลว!', { autoClose: 3000 })
    }
  }

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
          customInput={<CustomTextField label='กำหนดวันเริ่มใช้งาน' fullWidth />}
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
        <Button variant='contained' onClick={handleClick}>
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default EditVersionFormDialog
