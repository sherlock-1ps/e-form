'use client'

import Button from '@mui/material/Button'
import { Divider, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useDictionary } from '@/contexts/DictionaryContext'

interface signProps {
  id: string
  onSave: (comment: string) => Promise<any>
}

const CertifySignDialog = ({ id, onSave }: signProps) => {
  const { dictionary } = useDictionary()
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const { closeDialog } = useDialog()

  const [comment, setComment] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleConfirm = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await onSave(comment)
      if (response?.code === 'SUCCESS') {
        toast.success(dictionary?.saveSuccessful, { autoClose: 3000 })
        closeDialog(id)
        router.push(`/${locale}/user/allTask`)
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
          ลงนาม (ใบรับรองอิเล็กทรอนิกส์)
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          rows={4}
          multiline
          fullWidth
          label={dictionary?.comment}
          placeholder={dictionary?.typeYourCommentHere}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6'>{dictionary?.authenticate}</Typography>
      </Grid>
      <Grid item xs={6}>
        <CustomTextField select fullWidth defaultValue='' label='เลือกใบรับรองอิเล็กทรอนิกส์'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>978-1-4565-8759-8</MenuItem>
        </CustomTextField>
      </Grid>
      <Grid item xs={6}>
        <CustomTextField
          fullWidth
          label='รหัสผ่าน'
          type={isPasswordShown ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                  <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                </IconButton>
              </InputAdornment>
            )
          }}
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

export default CertifySignDialog
