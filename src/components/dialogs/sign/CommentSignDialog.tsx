'use client'

import Button from '@mui/material/Button'
import { Grid, Typography } from '@mui/material'
import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'
import { useDictionary } from '@/contexts/DictionaryContext'

interface commentSignProps {
  id: string
  onSave: (comment: string, signType: string, signatureBase64?: string, linkId?: number) => Promise<any>
  // comment, signType, undefined, linkId
  linkId: any
  title: string
  signType: string
}

const CommentSignDialog = ({ id, onSave, linkId, title, signType }: commentSignProps) => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const { closeDialog } = useDialog()
  const { dictionary } = useDictionary()
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    // console.log('handleConfirm-linkId', linkId)

    if (!comment) {
      toast.error(dictionary?.commentRequired, { autoClose: 3000 })
      return
    }

    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await onSave(comment, signType, undefined, linkId)
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
          {title}
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

export default CommentSignDialog
