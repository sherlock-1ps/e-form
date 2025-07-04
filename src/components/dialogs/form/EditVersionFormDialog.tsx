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
import { useFormStore } from '@/store/useFormStore'
import { useParams, useRouter } from 'next/navigation'
import { useDictionary } from '@/contexts/DictionaryContext'

interface EditVersionProps {
  id: string
  onClick: () => void
  data: any
}

const EditVersionFormDialog = ({ id, onClick, data }: EditVersionProps) => {
  const { dictionary } = useDictionary()
  const router = useRouter()
  const { lang: locale } = useParams()
  const { closeDialog } = useDialog()
  const setFullForm = useFormStore(state => state.setFullForm)
  const [time, setTime] = useState<Date | null | undefined>(null)
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [version, setVersion] = useState<string>('')

  const { mutateAsync: getForm, isPending: pendingGetForm } = useGetFormQueryOption()

  const handleGetForm = async (id: number) => {
    const request = {
      id: id
    }

    try {
      const response = await getForm(request)
      if (response?.code == 'SUCCESS') {
      }

      return response
    } catch (error) {
      toast.error('เรียกฟอร์มล้มเหลว!', { autoClose: 3000 })
    }
  }

  const handleClick = async () => {
    if (!date || !time || !version) {
      toast.error('กรุณาเลือกวันและเวลาให้ครบถ้วน', { autoClose: 3000 })

      return
    }
    try {
      const resultForm = await handleGetForm(data?.version[0]?.id)

      if (resultForm?.code == 'SUCCESS') {
        const layoutValue =
          resultForm?.result?.data?.FormDetails[0]?.detail?.layout === 'horizontal' ? 'horizontal' : 'vertical'
        const formFromApi = {
          isContinue: true,
          formId: data?.id,
          versionId: data?.version[0]?.id,
          name: data?.name,
          version: data?.version[0]?.version,
          newVersion: version,
          layout: layoutValue as 'vertical' | 'horizontal',
          form_details: resultForm?.result?.data?.FormDetails[0]?.detail?.data,
          // form_data_id: response?.result?.data?.form_data_detail?.id
        }

        setFullForm(formFromApi)
        router.push(`/${locale}/admin/form`)
        closeDialog(id)
        // const combinedDate = new Date(
        //   date.getFullYear(),
        //   date.getMonth(),
        //   date.getDate(),
        //   time.getHours(),
        //   time.getMinutes()
        // )
        // const publicDateISO = combinedDate.toISOString()
        // const request = {
        //   id: data?.id,
        //   public_date: publicDateISO,
        //   versions: [
        //     {
        //       version: version,
        //       form_details: [{ detail: resultForm?.result?.data?.FormDetails[0]?.detail }]
        //     }
        //   ]
        // }

        // const response = await createNewVersion({ request })
        // if (response?.code == 'SUCCESS') {
        //   toast.success('สร้างเวอร์ชั่นใหม่สำเร็จ!', { autoClose: 3000 })
        //   closeDialog(id)
        // }
      }
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
        <CustomTextField
          fullWidth
          label='กำหนดเวอร์ชั่น'
          placeholder={`ตัวเลขเท่านั้น ปัจจุบัน ${data?.version[0]?.version}`}
          value={version}
          onChange={e => setVersion(e.target.value)}
        />
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
          {dictionary?.cancel}
        </Button>
        <Button variant='contained' onClick={handleClick} disabled={pendingGetForm}>
          {dictionary?.confirm}
        </Button>
      </Grid>
    </Grid>
  )
}

export default EditVersionFormDialog
