// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import {
  useCreateNewVersionFormQueryOption,
  useGetFlowQueryOption,
  useGetFormQueryOption
} from '@/queryOptions/form/formQueryOptions'
import { toast } from 'react-toastify'
import { useFormStore } from '@/store/useFormStore'
import { useParams, useRouter } from 'next/navigation'
import { useFlowStore } from '@/store/useFlowStore'
import { useDictionary } from '@/contexts/DictionaryContext'

interface EditVersionProps {
  id: string
  onClick: () => void
  data: any
}

const EditVersionFlowDialog = ({ id, onClick, data }: EditVersionProps) => {
  const { dictionary } = useDictionary()

  const router = useRouter()
  const { lang: locale } = useParams()
  const { closeDialog } = useDialog()
  const setFullFlow = useFlowStore(state => state.setFullFlow)
  const [startDatetime, setStartDatetime] = useState<Date | null | undefined>(null)
  const [endDatetime, setEndDatetime] = useState<Date | null | undefined>(null)
  const [version, setVersion] = useState<string>('')

  const { mutateAsync: getFlow, isPending: pendingGetFlow } = useGetFlowQueryOption()

  const handleGetFlow = async (id: number) => {
    try {
      const response = await getFlow(id)
      if (response?.code == 'SUCCESS') {
      }

      return response
    } catch (error) {
      toast.error('เรียกฟอร์มล้มเหลว!', { autoClose: 3000 })
    }
  }

  const formatToUTC = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z')

  const handleClick = async () => {
    if (!startDatetime || !endDatetime || !version) {
      toast.error('กรุณาเลือกวันและเวลาให้ครบถ้วน', { autoClose: 3000 })

      return
    }
    try {
      const response = await handleGetFlow(data?.version[0]?.id)

      if (response?.code == 'SUCCESS') {
        const resultFlowApi = {
          isContinue: true,
          flowId: data?.id,
          versionId: data?.version[0]?.id,
          name: data?.name,
          version: response?.result?.data?.flow_version?.version,
          newVersion: version,
          publicDate: formatToUTC(startDatetime),
          endDate: formatToUTC(endDatetime),
          flow: {
            ...response?.result?.data?.flow
          }
        }

        setFullFlow(resultFlowApi)
        router.push(`/${locale}/admin/workflow`)

        closeDialog(id)
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
          autoFocus
          variant='contained'
          color='secondary'
          onClick={() => {
            closeDialog(id)
          }}
        >
          {dictionary?.cancel}
        </Button>
        <Button
          variant='contained'
          onClick={handleClick}
          disabled={pendingGetFlow || !version || !startDatetime || !endDatetime}
        >
          {dictionary?.confirm}
        </Button>
      </Grid>
    </Grid>
  )
}

export default EditVersionFlowDialog
