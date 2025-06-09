'use client'
// MUI Imports
import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import { useFormStore } from '@/store/useFormStore'
import { mapKeyValueForm } from '@/utils/mapKeyValueForm'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'

interface commentSignProps {
  id: string
  onSave: (comment: string, flowId: any) => Promise<any>
  flowId: any
  title: string
}

const CommentSignDialog = ({ id, onSave, flowId, title }: commentSignProps) => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const { closeDialog } = useDialog()
  const [comment, setComment] = useState('')

  const handleConfirm = async () => {
    if (!comment) {
      toast.error('ต้องกรอกความคิดเห็น', { autoClose: 3000 })
      return
    }
    try {
      const response = await onSave(comment, flowId)
      if (response?.code == 'SUCCESS') {
        toast.success('บันทึกสำเร็จ', { autoClose: 3000 })
        router.push(`/${locale}/user/followTask`)
        closeDialog(id)
      }
    } catch (err) {
      console.error('save failed', err)
      toast.error('บันทึกล้มเหลว', { autoClose: 3000 })
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          rows={5}
          multiline
          fullWidth
          label='ความคิดเห็น'
          placeholder='ระบุความคิดเห็น...'
          value={comment}
          onChange={e => setComment(e.target.value)}
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
            handleConfirm()
          }}
        >
          ยืนยัน
        </Button>
      </Grid>
    </Grid>
  )
}

export default CommentSignDialog
