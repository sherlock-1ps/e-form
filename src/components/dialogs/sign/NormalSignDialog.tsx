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
import { useDictionary } from '@/contexts/DictionaryContext'

interface signProps {
  id: string
  onSave: (comment: string, signType: string) => Promise<any>
  signType: string
}

const NormalSignDialog = ({ id, onSave, signType }: signProps) => {
  const { dictionary } = useDictionary()
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  const { closeDialog } = useDialog()
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await onSave(comment, signType)
      if (response?.code === 'SUCCESS') {
        router.push(`/${locale}/user/dashboard`)
        toast.success(dictionary?.saveSuccessful, { autoClose: 3000 })
        closeDialog(id)
      }
    } catch (err) {
      console.error('save failed', err)
      toast.error(dictionary?.saveFailed, { autoClose: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          ลงนาม
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          rows={5}
          multiline
          fullWidth
          label={dictionary?.comment}
          placeholder={dictionary?.typeYourCommentHere}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} className='flex items-center justify-end gap-2'>
        <Button variant='contained' color='secondary' onClick={() => closeDialog(id)} disabled={isSubmitting}>
          {dictionary?.cancel}
        </Button>
        <Button variant='contained' onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? dictionary?.saving : dictionary?.confirm}
        </Button>
      </Grid>
    </Grid>
  )
}

export default NormalSignDialog
