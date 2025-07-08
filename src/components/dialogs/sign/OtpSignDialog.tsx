'use client'

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Grid, Typography } from '@mui/material'

import { useDialog } from '@/hooks/useDialog'
import CustomTextField from '@/@core/components/mui/TextField'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'
import { useDictionary } from '@/contexts/DictionaryContext'

interface signProps {
  id: string
  onSave: (comment: string, signType: string) => Promise<any>
  signType: string
}

const OtpSignDialog = ({ id, onSave, signType }: signProps) => {
  const { dictionary } = useDictionary()
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const { closeDialog } = useDialog()
  const [comment, setComment] = useState('')
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [isCanResend, setIsCanResend] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`)
      prev?.focus()
    }
  }

  const handleConfirm = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await onSave(comment, signType)
      if (response?.code === 'SUCCESS') {
        toast.success(dictionary?.saveSuccessful, { autoClose: 3000 })
        closeDialog(id)
        router.push(`/${locale}/user/allTask`)
      }
    } catch (err) {
      console.error(dictionary?.saveFailed, err)
      toast.error(dictionary?.saveFailed, { autoClose: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h5' className='text-center'>
          ลงนามโดย OTP
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
        <Typography variant='h6'>{dictionary?.authenticateByOtp} </Typography>
      </Grid>

      <Grid item xs={12} className='flex gap-2 justify-center'>
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={value}
            onChange={e => handleOtpChange(index, e.target.value)}
            onKeyDown={e => handleOtpKeyDown(index, e)}
            className='w-12 h-12 border text-center text-xl rounded focus:outline-primary'
          />
        ))}
      </Grid>

      <Grid item xs={12}>
        {isCanResend ? (
          <Typography className='text-center'>
            ไม่ได้รับ OTP
            <Button type='button' className='text-primary'>
              ส่งอีกครั้ง
            </Button>
          </Typography>
        ) : (
          <Typography className='text-center'>ส่งอีกครั้งใน {countdown} วินาที</Typography>
        )}
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

export default OtpSignDialog
